import { Module } from '@nestjs/common';
import { ModelsModule } from './models/models.module.js';
import { OrganisationsModule } from './organisations/organisations.module.js';
import { PrismaModule } from './prisma/prisma.module.js';

@Module({
  imports: [PrismaModule, ModelsModule, OrganisationsModule],
})
export class AppModule {}
