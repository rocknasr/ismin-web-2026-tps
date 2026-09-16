import { Module } from '@nestjs/common';
import { ModelsController } from './models.controller.js';
import { ModelsLoaderService } from './models-loader.service.js';
import { ModelsService } from './models.service.js';

/**
 * The module: the box that declares what goes together.
 */
@Module({
  controllers: [ModelsController],
  providers: [ModelsService, ModelsLoaderService],
  exports: [],
})
export class ModelsModule {}
