import type { Model, Task } from "./model.js";

/**
 * TP1 solution.
 *
 * Storage choice: a `Map` keyed by `id` rather than an array.
 *  - `getModel` becomes a direct lookup instead of a scan;
 *  - "replace an existing model" is free: `set` overwrites the key.
 * An array works too, but forces you to handle duplicates by hand in
 * `addModel` and to scan in `getModel`.
 */
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

  /**
   * Returns a *copy*: callers can sort or filter the result without
   * corrupting the catalogue. This is the point of bonus exercise 2.
   */
  getAllModels(): Model[] {
    return Array.from(this.models.values());
  }

  getTotalNumberOfModels(): number {
    return this.models.size;
  }

  getModelsByTask(task: Task): Model[] {
    return this.getAllModels().filter((model) => model.task === task);
  }

  /** TP2: removes a model. Returns true if it existed. */
  removeModel(id: string): boolean {
    return this.models.delete(id);
  }

  // ─── Warm-up extras ───────────────────────────────────────────────────

  /** A single reduce: the accumulator starts at 0 and adds each downloads. */
  getTotalDownloads(): number {
    return this.getAllModels().reduce((total, model) => total + model.downloads, 0);
  }

  /** One chain, no intermediate variable: the filter is already a method. */
  getModelNamesByTask(task: Task): string[] {
    return this.getModelsByTask(task).map((model) => model.name);
  }

  /** A Set keeps each value once; Array.from turns it back into an array. */
  getOrganisations(): string[] {
    return Array.from(new Set(this.getAllModels().map((model) => model.org)));
  }
}
