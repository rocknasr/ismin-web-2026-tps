import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { API_URL, ApiError, fetchModel, fetchModels } from './api';
import { MOCK_MODELS } from './models.mock';

/**
 * Given. Step 4. No API is running during the tests: `fetch` is
 * replaced by a fake that answers what each test decides.
 */
const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  fetchMock.mockReset();
});

/** The n-th request made to fetch, whatever form the code gave it: a URL and options, or a Request. */
function sentRequest(call = 0): Request {
  const [input, init] = fetchMock.mock.calls[call];
  return new Request(input, init);
}

/** The error a promise rejects with. */
async function rejection(promise: Promise<unknown>): Promise<unknown> {
  return promise.then(
    () => undefined,
    (error: unknown) => error,
  );
}

/** An error the way NestJS sends them. */
function nestError(status: number, message: string | string[]): Response {
  return Response.json({ statusCode: status, message }, { status });
}

const mistral = MOCK_MODELS.find((model) => model.id === 'mistral-7b-instruct-v0-3')!;

describe('fetchModels, from TP7', () => {
  it('asks GET /models and returns the list', async () => {
    fetchMock.mockResolvedValue(Response.json(MOCK_MODELS));

    await expect(fetchModels()).resolves.toEqual(MOCK_MODELS);
    expect(sentRequest().url).toBe(`${API_URL}/models`);
  });

  it('asks the server to filter when a task is given', async () => {
    fetchMock.mockResolvedValue(Response.json([]));

    await fetchModels('translation');
    expect(sentRequest().url).toBe(`${API_URL}/models?task=translation`);
  });

  it('throws an ApiError when the API answers with an error', async () => {
    fetchMock.mockResolvedValue(new Response('Internal Server Error', { status: 500 }));

    const error = await rejection(fetchModels());
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 500 });
  });
});

describe('fetchModel (step 4)', () => {
  it('asks GET /models/<id> and returns the model', async () => {
    fetchMock.mockResolvedValue(Response.json(mistral));

    await expect(fetchModel(mistral.id)).resolves.toEqual(mistral);
    expect(sentRequest().url).toBe(`${API_URL}/models/${mistral.id}`);
  });

  it('throws an ApiError whose status is 404 for an unknown id', async () => {
    fetchMock.mockResolvedValue(nestError(404, 'Model nope not found'));

    const error = await rejection(fetchModel('nope'));
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 404 });
  });
});
