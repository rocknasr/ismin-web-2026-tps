import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';

/**
 * TP2 solution: the entry point.
 *
 * `whitelist` strips fields not declared in the DTO; `forbidNonWhitelisted`
 * goes further and rejects the request outright, so a client cannot sneak
 * an unexpected property into the body.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // TODO (TP7, step 7): let the frontend call this API. Its origin is in WEB_ORIGIN.
  // app.enableCors();

  // Swagger UI on /docs, the OpenAPI document on /docs-json.
  // `persistAuthorization` keeps the token pasted in "Authorize" across reloads.
  const config = new DocumentBuilder()
    .setTitle('Model catalogue API')
    .setDescription('Get a token with POST /auth/login, then paste it in "Authorize".')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, config), {
    swaggerOptions: { persistAuthorization: true },
  });

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
