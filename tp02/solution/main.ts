import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
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

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
