import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module.js';
import { ModelsModule } from './models/models.module.js';
import { OrganisationsModule } from './organisations/organisations.module.js';
import { PlaygroundController } from './playground/playground.controller.js';
import { PrismaModule } from './prisma/prisma.module.js';

@Module({
  imports: [PrismaModule, OrganisationsModule, ModelsModule, AuthModule],
  controllers: [PlaygroundController],
})
export class AppModule {}
