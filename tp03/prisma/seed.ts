/**
 * Populates the database from `data/models.json`.
 *
 *   npm run db:seed
 *
 * 👉 STEP 6: this script works as-is once step 2 is done.
 *    After step 5 (the Organisation relation) you will need to adapt it:
 *    create the organisations before the models.
 */
import { readFile } from 'node:fs/promises';
import 'dotenv/config';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../src/generated/prisma/client.js';

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL ?? 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

interface ModelSeed {
  id: string;
  name: string;
  org: string;
  task: string;
  parameters: number;
  downloads: number;
}

async function main(): Promise<void> {
  // Path relative to the project root: npm scripts run from there.
  const raw = await readFile('data/models.json', 'utf8');
  const models = JSON.parse(raw) as ModelSeed[];

  for (const model of models) {
    await prisma.model.upsert({
      where: { id: model.id },
      create: model,
      update: model,
    });
  }

  console.log(`✅ ${models.length} models inserted`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
