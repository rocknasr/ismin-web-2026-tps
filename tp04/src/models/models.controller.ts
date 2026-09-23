import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateModelDto } from './dto/create-model.dto.js';
import { UpdateModelDto } from './dto/update-model.dto.js';
import { ModelAlreadyExists, UnknownOrganisation, type Model, type Task } from './model.js';
import { ModelsService } from './models.service.js';

/**
 * Given: the TP3 solution, with a PATCH route and two more translations.
 * The service raises domain errors; this is where they become status codes.
 *
 * Nothing is protected yet: that is the TP.
 */
@Controller('models')
export class ModelsController {
  constructor(private readonly modelsService: ModelsService) {}

  @Get()
  findAll(@Query('org') org?: string, @Query('task') task?: Task): Promise<Model[]> {
    return this.modelsService.findAll({ org, task });
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Model> {
    const model = await this.modelsService.findOne(id);

    if (!model) {
      throw new NotFoundException(`Model ${id} not found`);
    }
    return model;
  }

  @Post()
  async create(@Body() dto: CreateModelDto): Promise<Model> {
    try {
      return await this.modelsService.create(dto);
    } catch (error) {
      if (error instanceof UnknownOrganisation) throw new UnprocessableEntityException(error.message);
      if (error instanceof ModelAlreadyExists) throw new ConflictException(error.message);
      throw error;
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateModelDto): Promise<Model> {
    const model = await this.modelsService.update(id, dto);

    if (!model) {
      throw new NotFoundException(`Model ${id} not found`);
    }
    return model;
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string): Promise<void> {
    if (!(await this.modelsService.remove(id))) {
      throw new NotFoundException(`Model ${id} not found`);
    }
  }
}
