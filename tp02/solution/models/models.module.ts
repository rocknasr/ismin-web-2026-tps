import { Module } from '@nestjs/common';
import { ModelsController } from './models.controller.js';
import { ModelsService } from './models.service.js';

/**
 * TP2 solution: the module.
 *
 * A controller missing from `controllers` answers 404 to everything without
 * a single error message; a controller declared without its service fails
 * at startup with "Nest can't resolve dependencies". Check here first.
 */
@Module({
  controllers: [ModelsController],
  providers: [ModelsService],
  exports: [ModelsService],
})
export class ModelsModule {}
