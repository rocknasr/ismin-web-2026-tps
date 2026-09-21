import {
  ConflictException,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { OrganisationsService } from './organisations.service.js';

@Controller('organisations')
export class OrganisationsController {
  constructor(private readonly organisationsService: OrganisationsService) {}

  @Delete(':slug')
  @HttpCode(204)
  async remove(@Param('slug') slug: string): Promise<void> {
    const result = await this.organisationsService.remove(slug);

    if (result === 'not-found') {
      throw new NotFoundException(`Organisation ${slug} not found`);
    }
    if (result === 'in-use') {
      throw new ConflictException(
        `Organisation ${slug} still owns models: delete them first`,
      );
    }
  }
}
