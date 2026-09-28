import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { MOCK_MODELS } from './models.mock';

/**
 * Given. Steps 6 to 9, and step 11: red during the first part, that's expected.
 * `fetch` is replaced by a fake, the models come "from the API".
 *
 * App is rendered inside a QueryClientProvider, as main.tsx does from step 10
 * on. Until then, the provider is simply unused. `retry: false`: a failed
 * request is not retried, the error shows at once.
 */
const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  fetchMock.mockReset();
});

function renderApp() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <App />
    </QueryClientProvider>,
  );
}

function calledUrls(): string[] {
  return fetchMock.mock.calls.map(([input]) => (input instanceof Request ? input.url : String(input)));
}

describe('App', () => {
  it('shows the models that the API sends, not the mock ones', async () => {
    const fromTheApi = [MOCK_MODELS[0], MOCK_MODELS[1]];
    fetchMock.mockResolvedValue(Response.json(fromTheApi));
    renderApp();

    expect(await screen.findByRole('heading', { name: fromTheApi[0].name })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(calledUrls()[0]).toMatch(/\/models$/);
  });

  it('shows a loading state while the API has not answered', async () => {
    fetchMock.mockReturnValue(new Promise(() => {})); // never answers
    renderApp();

    expect(screen.getByRole('status')).toHaveTextContent(/chargement/i);
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('shows an error when the API cannot be reached', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));
    renderApp();

    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('shows an error when the API answers 500', async () => {
    fetchMock.mockResolvedValue(new Response('Internal Server Error', { status: 500 }));
    renderApp();

    expect(await screen.findByRole('alert')).toBeInTheDocument();
  });

  it('asks the server again, with ?task=, when a filter is clicked', async () => {
    fetchMock.mockImplementation(async () => Response.json(MOCK_MODELS));
    renderApp();
    await screen.findAllByRole('listitem');

    await userEvent.click(screen.getByRole('button', { name: 'Traduction' }));

    await waitFor(() => expect(calledUrls().at(-1)).toMatch(/\/models\?task=translation$/));
    expect(screen.getByRole('button', { name: 'Traduction' })).toHaveAttribute('aria-pressed', 'true');
  });
});
