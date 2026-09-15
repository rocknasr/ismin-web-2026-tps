import {
  Body,
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
import type { Model, Task } from './model.js';
import { ModelsService } from './models.service.js';


@Controller('models')
export class ModelsController {
  constructor(private readonly modelsService: ModelsService) {}

  @Get()
  findAll(
    @Query('org') org?: string,
    @Query('task') task?: Task,
  ): Model[] {
    return this.modelsService.findAll(org, task);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Model {
    const model = this.modelsService.findOne(id);
    if (!model) {
      throw new NotFoundException();
    }
    return model;
  }

  @Post()
  create(@Body() model: CreateModelDto): Model {
    return this.modelsService.create(model);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string): void {
    const removed = this.modelsService.remove(id);
    if (!removed) {
      throw new NotFoundException();
    }
  }
}
