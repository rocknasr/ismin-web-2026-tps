import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Model, Task } from './model.js';

/**
 * The service, to be moved from memory to the database.
 *
 * The public contract does not change, but everything becomes
 * **asynchronous**: every Prisma call goes over the network and returns
 * a promise.
 *
 * 👉 STEP 4: replace each `throw` with a Prisma call.
 *
 * ⚠️ Three differences from yesterday's Map:
 *
 *    - `findUnique` returns `null`, not `undefined`
 *
 *    - `delete` throws when the row does not exist
 *      (look at `deleteMany`, or catch the error)
 *
 *    - SQLite has no union types: as far as the database is concerned,
 *      `task` is any string. So the compiler will refuse to treat a
 *      database row as a `Model`. Same lesson as session 1: what comes
 *      from outside is not guaranteed. Narrow the type at the boundary:
 *      a small private `toModel(row)` helper does the job nicely.
 */
@Injectable()
export class ModelsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(model: Model): Promise<Model> {
    throw new Error('create is not implemented yet');
  }

  async findAll(filters: { org?: string; task?: Task } = {}): Promise<Model[]> {
    throw new Error('findAll is not implemented yet');
  }

  async findOne(id: string): Promise<Model | null> {
    throw new Error('findOne is not implemented yet');
  }

  /** Returns `true` if the model existed, `false` otherwise. */
  async remove(id: string): Promise<boolean> {
    throw new Error('remove is not implemented yet');
  }

  /** Given: used by the tests to start from an empty database. */
  async clear(): Promise<void> {
    await this.prisma.model.deleteMany();
  }
}
