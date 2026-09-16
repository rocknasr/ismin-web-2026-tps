import { Injectable, OnModuleInit } from '@nestjs/common';
import { Model, Task } from './model.js';
import { ModelZoo } from './model-zoo.js';
import { ModelsLoaderService } from './models-loader.service.js';

/** Yours to write. The tests call `clear()` and `create()` directly. */
@Injectable()
export class ModelsService implements OnModuleInit {
  private readonly modelZoo = new ModelZoo();

  constructor(private readonly modelsLoader: ModelsLoaderService) {}

  /** Nest awaits this hook, so the catalogue is full before the first request. */
  async onModuleInit(): Promise<void> {
    const models = await this.modelsLoader.load();
    for (const model of models) {
      this.modelZoo.addModel(model);
    }
  }

  clear(): void {
    this.modelZoo.clear();
  }

  create(model: Model): Model {
    this.modelZoo.addModel(model);
    return model;
  }

  findAll(org?: string, task?: Task): Model[] {
    let models = this.modelZoo.getAllModels();
    if (org) {
      models = models.filter((model) => model.org === org);
    }
    if (task) {
      models = models.filter((model) => model.task === task);
    }
    return models;
  }

  findOne(id: string): Model | undefined {
    return this.modelZoo.getModel(id);
  }

  remove(id: string): boolean {
    return this.modelZoo.removeModel(id);
  }
}
