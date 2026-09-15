import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';
import { ModelsService } from '../src/models/models.service.js';

/**
 * These tests are the assignment: they describe the expected behaviour of
 * your API. Do not modify them: make them pass.
 *
 *   npm run test:watch
 *
 * Work top to bottom: each `describe` block maps to one step of the README.
 */

const mistral = {
  id: 'mistral-7b-instruct-v0-3',
  name: 'Mistral-7B-Instruct-v0.3',
  org: 'mistralai',
  task: 'text-generation',
  parameters: 7.2,
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

describe('/models API', () => {
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

  beforeEach(() => {
    service.clear();
  });

  // ─── Step 2 ────────────────────────────────────────────────────────────
  describe('GET /models', () => {
    it('returns an empty array when the catalogue is empty', async () => {
      await request(app.getHttpServer())
        .get('/models')
        .expect(200)
        .expect([]);
    });

    it('returns every model in the catalogue', async () => {
      service.create(mistral as never);
      service.create(whisper as never);

      const response = await request(app.getHttpServer())
        .get('/models')
        .expect(200);

      expect(response.body).toHaveLength(2);
    });
  });

  // ─── Step 3 ────────────────────────────────────────────────────────────
  describe('GET /models/:id', () => {
    beforeEach(() => {
      service.create(mistral as never);
    });

    it('returns the requested model', async () => {
      const response = await request(app.getHttpServer())
        .get(`/models/${mistral.id}`)
        .expect(200);

      expect(response.body).toEqual(mistral);
    });

    it('returns 404 for an unknown model', async () => {
      await request(app.getHttpServer())
        .get('/models/llama-4')
        .expect(404);
    });
  });

  // ─── Step 4 ────────────────────────────────────────────────────────────
  describe('POST /models', () => {
    it('creates a model and returns 201', async () => {
      const response = await request(app.getHttpServer())
        .post('/models')
        .send(mistral)
        .expect(201);

      expect(response.body).toEqual(mistral);
      expect(service.findAll()).toHaveLength(1);
    });
  });

  describe('DELETE /models/:id', () => {
    it('removes the model and returns 204', async () => {
      service.create(mistral as never);

      await request(app.getHttpServer())
        .delete(`/models/${mistral.id}`)
        .expect(204);

      expect(service.findAll()).toHaveLength(0);
    });

    it('returns 404 for an unknown model', async () => {
      await request(app.getHttpServer())
        .delete('/models/llama-4')
        .expect(404);
    });
  });

  // ─── Step 5 ────────────────────────────────────────────────────────────
  describe('input validation', () => {
    it('rejects an identifier that is not a slug', async () => {
      await request(app.getHttpServer())
        .post('/models')
        .send({ ...mistral, id: 'Mistral 7B!' })
        .expect(400);
    });

    it('rejects an empty name', async () => {
      await request(app.getHttpServer())
        .post('/models')
        .send({ ...mistral, name: '' })
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

    it('rejects an undeclared field', async () => {
      await request(app.getHttpServer())
        .post('/models')
        .send({ ...mistral, isAdmin: true })
        .expect(400);
    });
  });

  // ─── Step 6 ────────────────────────────────────────────────────────────
  describe('filters', () => {
    beforeEach(() => {
      service.create(mistral as never);
      service.create(whisper as never);
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

    it('returns an empty array when nothing matches', async () => {
      await request(app.getHttpServer())
        .get('/models?org=acme-corp')
        .expect(200)
        .expect([]);
    });
  });
});
