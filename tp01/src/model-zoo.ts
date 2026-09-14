import  { Model, Task } from "./model.js";

export class ModelZoo {
  private readonly models = new Map<string, Model>();

  addModel(model: Model): void {
    this.models.set(model.id, model);
  }

  getModel(id: string): Model | undefined {
    return this.models.get(id);
  }

  getModelsOf(org: string): Model[] {
    return this.getAllModels().filter((model) => model.org === org);
  }

  getAllModels(): Model[] {
    return [...this.models.values()];
  }

  getTotalNumberOfModels(): number {
    return this.models.size;
  }

  getModelsByTask(task: Task): Model[] {
    return this.getAllModels().filter((model) => model.task === task);
  }
}
