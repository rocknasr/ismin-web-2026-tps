import type { Model, NewModel, Task } from './model';

/** Where the API runs, read from `.env`. The fallback is the port of `npm run start:dev`. */
export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

/**
 * Given. An answer of the API that is not ok: a 4xx or a 5xx. `status` says
 * which one, and the pages decide what to show from it. `details` holds what
 * the API explained, one sentence per invalid field for a 400.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly details: string[];

  constructor(status: number, message: string, details: string[] = []) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

/**
 * Given. Does nothing when the answer is ok, throws an ApiError otherwise.
 *
 * NestJS explains its errors in the body, `{ statusCode, message, error }`:
 * `message` is a sentence, or a list of sentences for a 400.
 */
export async function throwIfNotOk(res: Response): Promise<void> {
  if (res.ok) return;

  const body: unknown = await res.json().catch(() => undefined);
  const message = body && typeof body === 'object' && 'message' in body ? body.message : undefined;
  const details = Array.isArray(message) ? message.map(String) : typeof message === 'string' ? [message] : [];
  throw new ApiError(res.status, `L'API a répondu ${res.status}`, details);
}

/** Given, from TP7. GET /models, filtered on the server when a task is given. */
export async function fetchModels(task?: Task): Promise<Model[]> {
  const url = task ? `${API_URL}/models?task=${task}` : `${API_URL}/models`;
  const res = await fetch(url);
  await throwIfNotOk(res);
  // A promise made to the compiler, not a check: the API is trusted to send models.
  return (await res.json()) as Model[];
}

/** Given, from TP8. GET /models/:id. An unknown id: an ApiError whose `status` is 404. */
export async function fetchModel(id: string): Promise<Model> {
  const res = await fetch(`${API_URL}/models/${id}`);
  await throwIfNotOk(res);
  return (await res.json()) as Model;
}

/**
 * TODO step 2. POST /auth/login, with `{ username, password }` as a JSON body,
 * and returns the `access_token` of the answer. A wrong password: 401.
 *
 * A JSON body needs its header, `'Content-Type': 'application/json'`:
 * without it, NestJS does not read the body.
 */
export async function login(username: string, password: string): Promise<string> {
  throw new Error(`TODO step 2: POST /auth/login with ${JSON.stringify({ username, password })}`);
}

/**
 * TODO step 6. POST /models, with the model as a JSON body and the token in
 * the header `Authorization: Bearer <token>`. Returns the model the API
 * created. The errors: 400 invalid body, 401 no valid token, 409 id already
 * taken, 422 unknown organisation.
 */
export async function createModel(model: NewModel, token: string): Promise<Model> {
  throw new Error(`TODO step 6: POST /models with ${JSON.stringify(model)}, as ${token.slice(0, 12)}…`);
}
