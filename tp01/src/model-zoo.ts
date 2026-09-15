import { Model, Task } from "./model.js";
import { Catalogue } from "./catalogue.js";

export class ModelZoo extends Catalogue<Model> {
  addModel(model: Model): void {
    this.addItem(model);
  }

  getModel(id: string): Model | undefined {
    return this.getItem(id);
  }

  getModelsOf(org: string): Model[] {
    return this.getAllModels().filter((model) => model.org === org);
  }

  getAllModels(): Model[] {
    return this.getAllItems();
  }

  getTotalNumberOfModels(): number {
    return this.getTotalNumberOfItems();
  }

  getModelsByTask(task: Task): Model[] {
    return this.getAllModels().filter((model) => model.task === task);
  }

  getTotalDownloads(): number {
    return this.getAllModels().reduce((total, model) => total + model.downloads, 0);
  }

  getModelNamesByTask(task: Task): string[] {
    return this.getAllModels()
      .filter((model) => model.task === task)
      .map((model) => model.name);
  }

  getOrganisations(): string[] {
    return [...new Set(this.getAllModels().map((model) => model.org))];
  }

  groupByTask(): Record<Task, Model[]> {
    return this.getAllModels().reduce((groups, model) => {
      (groups[model.task] ??= []).push(model);
      return groups;
    }, {} as Record<Task, Model[]>);
  }
}

export function huggingFaceUrl(model: Model): `https://huggingface.co/${string}` {
  return `https://huggingface.co/${model.org}/${model.id}`;
}
