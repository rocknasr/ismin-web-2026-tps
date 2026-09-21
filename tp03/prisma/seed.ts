/**
 * Populates the database from `data/models.json`.
 *
 *   npm run db:seed
 *
 * Organisations are inserted first, one per distinct slug found in the
 * data, then models are linked to them by that slug. Order matters: the
 * foreign key on Model.orgId is required.
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

  // A model cannot point to an organisation that does not exist yet:
  // create every organisation first, one row per distinct slug.
  const orgSlugs = [...new Set(models.map((model) => model.org))];
  for (const slug of orgSlugs) {
    await prisma.organisation.upsert({
      where: { slug },
      create: { slug, name: slug },
      update: {},
    });
  }

  for (const model of models) {
    await prisma.model.upsert({
      where: { id: model.id },
      create: {
        id: model.id,
        name: model.name,
        task: model.task,
        parameters: model.parameters,
        downloads: model.downloads,
        organisation: { connect: { slug: model.org } },
      },
      update: {
        name: model.name,
        task: model.task,
        parameters: model.parameters,
        downloads: model.downloads,
        organisation: { connect: { slug: model.org } },
      },
    });
  }

  console.log(`✅ ${orgSlugs.length} organisations, ${models.length} models inserted`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
