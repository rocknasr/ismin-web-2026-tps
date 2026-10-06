import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module.js';
import { HealthController } from './health/health.controller.js';
import { ModelsModule } from './models/models.module.js';
import { OrganisationsModule } from './organisations/organisations.module.js';
import { PrismaModule } from './prisma/prisma.module.js';

@Module({
  imports: [PrismaModule, OrganisationsModule, ModelsModule, AuthModule],
  // GET /health: the web app asks it whether the API is up, to show its loading page.
  controllers: [HealthController],
})
export class AppModule {}
