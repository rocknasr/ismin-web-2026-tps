import type { Model, Task } from './model';

/** Where the API runs, read from `.env`. The fallback is the port of `npm run start:dev`. */
export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

/**
 * GET /models, filtered on the server when a task is given.
 *
 * fetch only rejects when the network fails. A 404 or a 500 is a response
 * like any other: `res.ok` is the only way to tell.
 */
export async function fetchModels(task?: Task): Promise<Model[]> {
  const url = task ? `${API_URL}/models?task=${task}` : `${API_URL}/models`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`L'API a répondu ${res.status}`);
  }
  // A promise made to the compiler, not a check: the API is trusted to send models.
  return (await res.json()) as Model[];
}
