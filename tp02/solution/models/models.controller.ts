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

/**
 * TP2 solution: the controller.
 *
 * It only translates: read the request, call the service, pick the status
 * code. No business decision here.
 */
@Controller('models')
export class ModelsController {
  constructor(private readonly modelsService: ModelsService) {}

  @Get()
  findAll(@Query('org') org?: string, @Query('task') task?: Task): Model[] {
    return this.modelsService.findAll({ org, task });
  }

  @Get(':id')
  findOne(@Param('id') id: string): Model {
    const model = this.modelsService.findOne(id);

    if (!model) {
      throw new NotFoundException(`Model ${id} not found`);
    }
    return model;
  }

  @Post()
  create(@Body() dto: CreateModelDto): Model {
    return this.modelsService.create(dto as Model);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string): void {
    if (!this.modelsService.remove(id)) {
      throw new NotFoundException(`Model ${id} not found`);
    }
  }
}
