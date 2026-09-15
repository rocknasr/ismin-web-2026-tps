import { Module } from '@nestjs/common';
import { ModelsController } from './models.controller.js';
import { ModelsService } from './models.service.js';

/**
 * The module: the box that declares what goes together.
 */
@Module({
  controllers: [ModelsController],
  providers: [ModelsService],
  exports: [],
})
export class ModelsModule {}
