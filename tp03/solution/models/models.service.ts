import { Injectable } from '@nestjs/common';
import type { Model as ModelRow, Organisation } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { Model, ModelAlreadyExists, Task } from './model.js';

/** A row of the Model table with its organisation loaded (`include`). */
type ModelWithOrg = ModelRow & { org: Organisation };

/**
 * TP3 solution: the service, backed by the database, relation included.
 * Only the simplest Prisma calls: findUnique, findMany, create, delete.
 *
 * 1. `toModel`: the boundary between the database and the domain. SQLite has
 *    no union types, `task` is any string; a nullable column comes back as
 *    `null` where the domain says `undefined`; and the organisation is a row
 *    where the API promises a slug. Everything is narrowed here, once.
 *
 * 2. `include: { org: true }` on every read: one query for the models, one
 *    for the organisations. Without it, the natural loop over the models to
 *    fetch each organisation is the N+1 of step 7.
 *
 * 3. `create` refuses a duplicate: the service checks first and throws a
 *    domain error. It knows nothing about HTTP; the controller turns that
 *    error into a 409.
 *
 * 4. Filtering is a `where` clause, nested for the relation: the database
 *    does the work, with an index. This is why that code belonged here.
 *
 * 5. `delete` throws when nothing matches, so `remove` looks first.
 */
@Injectable()
export class ModelsService {
  constructor(private readonly prisma: PrismaService) {}

  private toModel(row: ModelWithOrg): Model {
    return {
      id: row.id,
      name: row.name,
      org: row.org.slug,
      task: row.task as Task,
      parameters: row.parameters,
      downloads: row.downloads,
      license: row.license ?? undefined,
    };
  }

  async create(model: Model): Promise<Model> {
    const existing = await this.prisma.model.findUnique({ where: { id: model.id } });
    if (existing) throw new ModelAlreadyExists(model.id);

    const { org: slug, ...fields } = model;
    const org =
      (await this.prisma.organisation.findUnique({ where: { slug } })) ??
      (await this.prisma.organisation.create({ data: { slug, name: slug } }));

    const row = await this.prisma.model.create({
      data: { ...fields, orgId: org.id },
      include: { org: true },
    });
    return this.toModel(row);
  }

  async findAll(filters: { org?: string; task?: Task } = {}): Promise<Model[]> {
    const rows = await this.prisma.model.findMany({
      where: {
        ...(filters.org ? { org: { slug: filters.org } } : {}),
        ...(filters.task ? { task: filters.task } : {}),
      },
      include: { org: true },
      orderBy: { downloads: 'desc' },
    });
    return rows.map((row) => this.toModel(row));
  }

  async findOne(id: string): Promise<Model | null> {
    const row = await this.prisma.model.findUnique({
      where: { id },
      include: { org: true },
    });
    return row ? this.toModel(row) : null;
  }

  async remove(id: string): Promise<boolean> {
    const row = await this.prisma.model.findUnique({ where: { id } });
    if (!row) return false;

    await this.prisma.model.delete({ where: { id } });
    return true;
  }

  /** Used by the tests: models first, they point at organisations. */
  async clear(): Promise<void> {
    await this.prisma.model.deleteMany();
    await this.prisma.organisation.deleteMany();
  }
}
