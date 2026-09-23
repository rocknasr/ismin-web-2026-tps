import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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

  // app.enableCors(); // TODO: origin to define for the frontend

  // TODO: enable once the DTOs are annotated
  // const config = new DocumentBuilder()
  //   .setTitle('Model catalogue API')
  //   .setVersion('1.0')
  //   .addBearerAuth()
  //   .build();
  // SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, config));

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
