import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CreateModelDto } from './dto/create-model.dto.js';
import { ModelAlreadyExists, type Model, type Task } from './model.js';
import { ModelsService } from './models.service.js';

/**
 * Given, and this is the thing to notice: compared to TP2, this file has
 * barely moved. Only `async`/`await` appeared, because the service now
 * talks to the network.
 *
 * Routes, status codes, validation: unchanged. That is the payoff of
 * separating controller from service.
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
      return await this.modelsService.create(dto as Model);
    } catch (error) {
      if (error instanceof ModelAlreadyExists) throw new ConflictException(error.message);
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string): Promise<void> {
    if (!(await this.modelsService.remove(id))) {
      throw new NotFoundException(`Model ${id} not found`);
    }
  }
}
