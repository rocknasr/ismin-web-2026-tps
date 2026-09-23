import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';

/**
 * The tests of the login and of the protected route: card 8, then step 5 of
 * the README. The application is started for you; the four tests are yours.
 */
describe('/auth API', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it.todo('POST /auth/login returns a token for alice / secret');
  it.todo('POST /auth/login answers 401 for a wrong password');
  it.todo('GET /auth/whoami answers 401 without a token');
  it.todo('GET /auth/whoami returns the payload with a token');

  // supertest is imported so that the first test is one line away.
  void request;
});
