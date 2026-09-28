import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { API_URL, fetchModels } from './api';
import { MOCK_MODELS } from './models.mock';

/**
 * Given. Step 5. No API is running during the tests: `fetch` is replaced by a
 * fake that answers what each test decides.
 */
const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  fetchMock.mockReset();
});

/** The URL of the n-th call to fetch, whatever form the code gave it: string, URL or Request. */
function calledUrl(call = 0): string {
  const [input] = fetchMock.mock.calls[call];
  return input instanceof Request ? input.url : String(input);
}

describe('fetchModels', () => {
  it('asks GET /models and returns the list', async () => {
    fetchMock.mockResolvedValue(Response.json(MOCK_MODELS));

    await expect(fetchModels()).resolves.toEqual(MOCK_MODELS);
    expect(calledUrl()).toBe(`${API_URL}/models`);
  });

  it('asks the server to filter when a task is given', async () => {
    fetchMock.mockResolvedValue(Response.json([]));

    await fetchModels('translation');
    expect(calledUrl()).toBe(`${API_URL}/models?task=translation`);
  });

  it('throws when the API answers with an error: fetch alone does not', async () => {
    fetchMock.mockResolvedValue(new Response('Internal Server Error', { status: 500 }));

    await expect(fetchModels()).rejects.toThrow();
  });
});
