/**
 * TP3 solution: the seed, after step 5: organisations first, then models,
 * because a model cannot point at an organisation that does not exist yet.
 *
 *   npm run db:seed
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
  const raw = await readFile('data/models.json', 'utf8');
  const models = JSON.parse(raw) as ModelSeed[];

  const slugs = Array.from(new Set(models.map((model) => model.org)));
  for (const slug of slugs) {
    await prisma.organisation.upsert({
      where: { slug },
      create: { slug, name: slug },
      update: {},
    });
  }

  for (const { org, ...model } of models) {
    const data = { ...model, org: { connect: { slug: org } } };
    await prisma.model.upsert({ where: { id: model.id }, create: data, update: data });
  }

  console.log(`✅ ${slugs.length} organisations, ${models.length} models`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
