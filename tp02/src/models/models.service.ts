import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { readFile as readFileWithCallback } from 'node:fs';
import { readFile as readFileAsPromise } from 'node:fs/promises';
import { join } from 'node:path';
import { Model, Task } from './model.js';
import { ModelZoo } from './model-zoo.js';

const MODELS_FILE = join(process.cwd(), 'data', 'models.json');

const HUGGING_FACE_URL =
  'https://huggingface.co/api/models?limit=50&sort=downloads';

/**
 * Hugging Face names the tasks differently: its `pipeline_tag` has dozens of
 * values, four of which map onto our `Task`. Anything else is not part of this
 * catalogue. Typing the values as `Task` makes a typo a compile error.
 */
const PIPELINE_TAGS: Record<string, Task> = {
  'text-generation': 'text-generation',
  translation: 'translation',
  'image-classification': 'image-classification',
  'automatic-speech-recognition': 'speech-to-text',
};

/** The subset of the Hugging Face payload we actually read. */
interface HuggingFaceModel {
  /** "mistralai/Mistral-7B-Instruct-v0.3": the org and the name in one string. */
  id: string;
  pipeline_tag?: string;
  downloads?: number;
  /** Carries entries such as "license:apache-2.0". */
  tags?: string[];
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Returns `undefined` for a model whose task is outside our four. */
function toModel(raw: HuggingFaceModel): Model | undefined {
  const task = PIPELINE_TAGS[raw.pipeline_tag ?? ''];
  const [org, name] = raw.id.split('/');
  if (!task || !name) {
    return undefined;
  }

  return {
    id: slugify(raw.id),
    name,
    org,
    task,
    // The list endpoint does not expose the parameter count: 0 means unknown.
    parameters: 0,
    downloads: raw.downloads ?? 0,
    license: raw.tags
      ?.find((tag) => tag.startsWith('license:'))
      ?.slice('license:'.length),
  };
}

/** Yours to write. The tests call `clear()` and `create()` directly. */
@Injectable()
export class ModelsService implements OnModuleInit {
  private readonly logger = new Logger(ModelsService.name);
  private readonly modelZoo = new ModelZoo();

  /**
   * Extra B: the API is the source of truth, the local file is the fallback.
   * Nest awaits this hook, so the catalogue is full before the first request.
   */
  async onModuleInit(): Promise<void> {
    const fromApi = await this.fetchFromHuggingFace();
    const models = fromApi ?? (await this.readFromFile());

    this.logger.log(
      `Loaded ${models.length} models from ${fromApi ? 'the Hugging Face API' : 'data/models.json'}`,
    );
    for (const model of models) {
      this.modelZoo.addModel(model);
    }
  }

  clear(): void {
    this.modelZoo.clear();
  }

  create(model: Model): Model {
    this.modelZoo.addModel(model);
    return model;
  }

  findAll(org?: string, task?: Task): Model[] {
    let models = this.modelZoo.getAllModels();
    if (org) {
      models = models.filter((model) => model.org === org);
    }
    if (task) {
      models = models.filter((model) => model.task === task);
    }
    return models;
  }

  findOne(id: string): Model | undefined {
    return this.modelZoo.getModel(id);
  }

  remove(id: string): boolean {
    return this.modelZoo.removeModel(id);
  }

  // ─── Extra A: the same read, three ways ─────────────────────────────────

  /**
   * Reads the catalogue three times, once per form below. The zoo is a `Map`
   * keyed by `id`, so the three passes converge on the same models: only the
   * shape of the code changes.
   */
  private async readFromFile(): Promise<Model[]> {
    await this.readWithCallback();
    await this.readWithPromise();
    return this.readWithAsyncAwait();
  }

  /**
   * Form 1, the historical Node API: a callback receiving `(error, data)`.
   * It is wrapped in a `Promise` so `onModuleInit` can await it — left alone,
   * a callback finishes whenever it wants, possibly after the app booted.
   */
  private readWithCallback(): Promise<Model[]> {
    return new Promise((resolve, reject) => {
      readFileWithCallback(MODELS_FILE, 'utf8', (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(JSON.parse(data) as Model[]);
        }
      });
    });
  }

  /** Form 2, the same call from `node:fs/promises`, chained with `.then()`. */
  private readWithPromise(): Promise<Model[]> {
    return readFileAsPromise(MODELS_FILE, 'utf8').then(
      (data) => JSON.parse(data) as Model[],
    );
  }

  /** Form 3, the same promise, awaited: the flat version of form 2. */
  private async readWithAsyncAwait(): Promise<Model[]> {
    const data = await readFileAsPromise(MODELS_FILE, 'utf8');
    return JSON.parse(data) as Model[];
  }

  // ─── Extra B: real data ─────────────────────────────────────────────────

  /** Returns `undefined` when the API is unreachable, so the caller falls back. */
  private async fetchFromHuggingFace(): Promise<Model[] | undefined> {
    try {
      const response = await fetch(HUGGING_FACE_URL, {
        signal: AbortSignal.timeout(5_000),
      });
      if (!response.ok) {
        this.logger.warn(`Hugging Face answered ${response.status}`);
        return undefined;
      }

      const payload = (await response.json()) as HuggingFaceModel[];
      return payload
        .map(toModel)
        .filter((model): model is Model => model !== undefined);
    } catch (error) {
      this.logger.warn(`Hugging Face unreachable: ${(error as Error).message}`);
      return undefined;
    }
  }
}
