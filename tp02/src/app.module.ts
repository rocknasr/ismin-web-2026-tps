import { Module } from '@nestjs/common';
import { ModelsModule } from './models/models.module.js';

@Module({
  imports: [ModelsModule],
})
export class AppModule {}
