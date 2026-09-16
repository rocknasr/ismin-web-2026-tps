import { Injectable } from '@nestjs/common';
import { Model, Task } from './model.js';
import { ModelZoo } from './model-zoo.js';

/**
 * TP2 solution: the service.
 *
 * It wraps the TP1 ModelZoo and adds nothing HTTP-related. Key point:
 * filtering lives HERE, not in the controller. Tomorrow, when we move to a
 * database, only this class will change: ModelZoo goes, Prisma comes, and
 * the controller does not notice.
 */
@Injectable()
export class ModelsService {
  private zoo = new ModelZoo();

  create(model: Model): Model {
    this.zoo.addModel(model);
    return model;
  }

  findAll(filters: { org?: string; task?: Task } = {}): Model[] {
    // ModelZoo filters by one criterion at a time; combining is our job.
    let results = filters.org
      ? this.zoo.getModelsOf(filters.org)
      : this.zoo.getAllModels();

    if (filters.task) {
      results = results.filter((model) => model.task === filters.task);
    }
    return results;
  }

  findOne(id: string): Model | undefined {
    return this.zoo.getModel(id);
  }

  remove(id: string): boolean {
    return this.zoo.removeModel(id);
  }

  clear(): void {
    this.zoo = new ModelZoo();
  }
}
