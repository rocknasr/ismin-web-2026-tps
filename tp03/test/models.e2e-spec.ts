import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';
import { ModelsService } from '../src/models/models.service.js';

/**
 * These are the very same tests as TP2, on purpose.
 *
 * The API behaviour must not change: only the storage does. If they go green
 * again, your migration to the database succeeded without regression. That is
 * exactly what a test suite is for.
 *
 * Two extra tests at the end of the file check persistence itself.
 */

const mistral = {
  id: 'mistral-7b-instruct-v0-3',
  name: 'Mistral-7B-Instruct-v0.3',
  org: 'mistralai',
  task: 'text-generation',
  parameters: 7.25,
  downloads: 1_420_000,
};

const whisper = {
  id: 'whisper-large-v3',
  name: 'whisper-large-v3',
  org: 'openai',
  task: 'speech-to-text',
  parameters: 1.55,
  downloads: 4_100_000,
};

describe('/models API (persisted)', () => {
  let app: INestApplication;
  let service: ModelsService;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();

    service = app.get(ModelsService);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await service.clear();
  });

  describe('GET /models', () => {
    it('returns an empty array when the database is empty', async () => {
      await request(app.getHttpServer()).get('/models').expect(200).expect([]);
    });

    it('returns every model', async () => {
      await service.create(mistral as never);
      await service.create(whisper as never);

      const response = await request(app.getHttpServer())
        .get('/models')
        .expect(200);

      expect(response.body).toHaveLength(2);
    });
  });

  describe('GET /models/:id', () => {
    beforeEach(async () => {
      await service.create(mistral as never);
    });

    it('returns the requested model', async () => {
      const response = await request(app.getHttpServer())
        .get(`/models/${mistral.id}`)
        .expect(200);

      expect(response.body).toMatchObject({ id: mistral.id, name: mistral.name });
    });

    it('returns 404 for an unknown model', async () => {
      await request(app.getHttpServer())
        .get('/models/llama-4')
        .expect(404);
    });
  });

  describe('POST /models', () => {
    it('creates a model and returns 201', async () => {
      const response = await request(app.getHttpServer())
        .post('/models')
        .send(mistral)
        .expect(201);

      expect(response.body).toMatchObject({ id: mistral.id });
      expect(await service.findAll()).toHaveLength(1);
    });
  });

  describe('DELETE /models/:id', () => {
    it('removes the model and returns 204', async () => {
      await service.create(mistral as never);

      await request(app.getHttpServer())
        .delete(`/models/${mistral.id}`)
        .expect(204);

      expect(await service.findAll()).toHaveLength(0);
    });

    it('returns 404 for an unknown model', async () => {
      await request(app.getHttpServer())
        .delete('/models/llama-4')
        .expect(404);
    });
  });

  describe('input validation', () => {
    it("rejects an identifier that is not a slug", async () => {
      await request(app.getHttpServer())
        .post('/models')
        .send({ ...mistral, id: 'Mistral 7B!' })
        .expect(400);
    });

    it('rejects a negative parameter count', async () => {
      await request(app.getHttpServer())
        .post('/models')
        .send({ ...mistral, parameters: -1 })
        .expect(400);
    });

    it('rejects an unknown task', async () => {
      await request(app.getHttpServer())
        .post('/models')
        .send({ ...mistral, task: 'time-travel' })
        .expect(400);
    });
  });

  describe('filters', () => {
    beforeEach(async () => {
      await service.create(mistral as never);
      await service.create(whisper as never);
    });

    it('filters by organisation', async () => {
      const response = await request(app.getHttpServer())
        .get('/models?org=openai')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].id).toBe(whisper.id);
    });

    it('filters by task', async () => {
      const response = await request(app.getHttpServer())
        .get('/models?task=text-generation')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].id).toBe(mistral.id);
    });
  });

  // ─── What TP2 could not test ───────────────────────────────────────────
  describe('persistence', () => {
    it('keeps data beyond the request that created it', async () => {
      await request(app.getHttpServer())
        .post('/models')
        .send(mistral)
        .expect(201);

      // Another request, another cycle: the data is still there
      const response = await request(app.getHttpServer())
        .get(`/models/${mistral.id}`)
        .expect(200);

      expect(response.body.id).toBe(mistral.id);
    });

    it('replaces an existing model instead of duplicating it', async () => {
      await service.create(mistral as never);
      await service.create({ ...mistral, downloads: 9_999_999 } as never);

      const all = await service.findAll();
      expect(all).toHaveLength(1);
      expect(all[0].downloads).toBe(9_999_999);
    });
  });
});
