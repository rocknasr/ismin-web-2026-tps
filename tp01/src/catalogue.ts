export class Catalogue<T extends { id: string }> {
  private readonly items = new Map<string, T>();

  addItem(item: T): void {
    this.items.set(item.id, Object.freeze({ ...item }));
  }

  getItem(id: string): T | undefined {
    return this.items.get(id);
  }

  getAllItems(): T[] {
    return [...this.items.values()];
  }

  getTotalNumberOfItems(): number {
    return this.items.size;
  }
}
