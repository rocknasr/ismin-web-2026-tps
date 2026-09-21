import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';
import { ModelsService } from '../src/models/models.service.js';
import { PrismaService } from '../src/prisma/prisma.service.js';

/**
 * DELETE /organisations/:slug — beyond the TP steps.
 *
 * Organisations are created implicitly, by creating a model that names one,
 * so these tests go through ModelsService to set the scene.
 */

const mistral = {
  id: 'mistral-7b-instruct-v0-3',
  name: 'Mistral-7B-Instruct-v0.3',
  org: 'mistralai',
  task: 'text-generation',
  parameters: 7.25,
  downloads: 1_420_000,
};

describe('/organisations API', () => {
  let app: INestApplication;
  let models: ModelsService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    models = app.get(ModelsService);
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await models.clear();
    await prisma.organisation.deleteMany();
  });

  it('deletes an organisation that owns no model', async () => {
    await models.create(mistral as never);
    await models.remove(mistral.id); // the organisation outlives its model

    await request(app.getHttpServer())
      .delete('/organisations/mistralai')
      .expect(204);

    expect(await prisma.organisation.findMany()).toHaveLength(0);
  });

  it('returns 404 for an unknown organisation', async () => {
    await request(app.getHttpServer())
      .delete('/organisations/deepmind')
      .expect(404);
  });

  it('refuses with 409 when the organisation still owns models', async () => {
    await models.create(mistral as never);

    await request(app.getHttpServer())
      .delete('/organisations/mistralai')
      .expect(409);

    // Nothing was deleted, on either side of the relation
    expect(await prisma.organisation.findMany()).toHaveLength(1);
    expect(await models.findAll()).toHaveLength(1);
  });

  it('accepts the deletion once the last model is gone', async () => {
    await models.create(mistral as never);

    await request(app.getHttpServer())
      .delete('/organisations/mistralai')
      .expect(409);

    await request(app.getHttpServer())
      .delete(`/models/${mistral.id}`)
      .expect(204);

    await request(app.getHttpServer())
      .delete('/organisations/mistralai')
      .expect(204);
  });
});
