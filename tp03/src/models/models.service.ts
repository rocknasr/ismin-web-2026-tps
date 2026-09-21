import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import type {
  Model as ModelRow,
  Organisation,
} from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { Model, Task, TASKS } from './model.js';

/** A row joined with its organisation: what `toModel` needs to rebuild a `Model`. */
type ModelRowWithOrg = ModelRow & { organisation: Organisation };

/**
 * The service, backed by the database.
 *
 * The public contract does not change, but everything is **asynchronous**:
 * every Prisma call goes over the network and returns a promise.
 *
 * Since step 5, `org` is no longer a column: it is the slug of a related
 * `Organisation`. The API still speaks in slugs, so the translation happens
 * here and nowhere else.
 */
@Injectable()
export class ModelsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(model: Model): Promise<Model> {
    const data = {
      name: model.name,
      task: model.task,
      parameters: model.parameters,
      downloads: model.downloads,
      license: model.license ?? null,
      // The organisation may not exist yet: create it on the fly rather
      // than failing on the foreign key.
      organisation: {
        connectOrCreate: {
          where: { slug: model.org },
          create: { slug: model.org, name: model.org },
        },
      },
    };

    try {
      const row = await this.prisma.model.create({
        data: { id: model.id, ...data },
        include: { organisation: true },
      });

      return this.toModel(row);
    } catch (error) {
      // P2002: unique constraint violation. Here, that can only be the
      // `id` primary key, so a duplicate id is a client error, not a
      // server one.
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(`Model ${model.id} already exists`);
      }
      throw error;
    }
  }

  async findAll(filters: { org?: string; task?: Task } = {}): Promise<Model[]> {
    const rows = await this.prisma.model.findMany({
      where: {
        // Filtering on a relation: reach through it rather than joining by hand.
        ...(filters.org ? { organisation: { slug: filters.org } } : {}),
        ...(filters.task ? { task: filters.task } : {}),
      },
      // One join instead of one query per model: see step 7.
      include: { organisation: true },
    });

    return rows.map((row) => this.toModel(row));
  }

  async findOne(id: string): Promise<Model | null> {
    // findUnique returns null, not undefined, when nothing matches.
    const row = await this.prisma.model.findUnique({
      where: { id },
      include: { organisation: true },
    });

    return row ? this.toModel(row) : null;
  }

  /** Returns `true` if the model existed, `false` otherwise. */
  async remove(id: string): Promise<boolean> {
    // delete throws when the row is absent; deleteMany just counts.
    const { count } = await this.prisma.model.deleteMany({ where: { id } });

    return count > 0;
  }

  /** Given: used by the tests to start from an empty database. */
  async clear(): Promise<void> {
    await this.prisma.model.deleteMany();
  }

  /**
   * The boundary. SQLite has no union types: as far as the database is
   * concerned `task` is any string, so a row is not a `Model` until we
   * have checked it. Same lesson as session 1.
   *
   * This is also where the relation is flattened back into the `org` string
   * the API promises.
   */
  private toModel(row: ModelRowWithOrg): Model {
    if (!TASKS.includes(row.task as Task)) {
      throw new Error(`Unknown task "${row.task}" stored for model ${row.id}`);
    }

    return {
      id: row.id,
      name: row.name,
      org: row.organisation.slug,
      task: row.task as Task,
      parameters: row.parameters,
      downloads: row.downloads,
      ...(row.license !== null ? { license: row.license } : {}),
    };
  }
}
