import { Body, ConflictException, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard.js';
import { CreateOrganisationDto } from './dto/create-organisation.dto.js';
import { Organisation, OrganisationAlreadyExists } from './organisation.js';
import { OrganisationsService } from './organisations.service.js';

/**
 * Given.
 *   GET  /organisations   public
 *   POST /organisations   with a token: 201, or 409 if the slug is taken
 *
 * The guard on POST is the pattern of step 2: read it, then apply it.
 */
@Controller('organisations')
export class OrganisationsController {
  constructor(private readonly organisationsService: OrganisationsService) {}

  @Get()
  findAll(): Promise<Organisation[]> {
    return this.organisationsService.findAll();
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() dto: CreateOrganisationDto): Promise<Organisation> {
    try {
      return await this.organisationsService.create(dto);
    } catch (error) {
      if (error instanceof OrganisationAlreadyExists) throw new ConflictException(error.message);
      throw error;
    }
  }
}
