import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { fetchModels } from '../api';
import { fakeApi } from '../test-utils';
import { ApiGate } from './ApiGate';

function renderGate() {
  return render(
    <QueryClientProvider client={new QueryClient()}>
      <ApiGate>
        <p>L'application</p>
      </ApiGate>
    </QueryClientProvider>,
  );
}

function stopTheApi() {
  vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new TypeError('Failed to fetch'))));
}

describe('ApiGate', () => {
  it('shows "Chargement…", not an error, before the first check', () => {
    fakeApi({ 'GET /health': () => Response.json({ status: 'ok' }) });

    renderGate();

    expect(screen.getByText('Chargement…')).toBeInTheDocument();
    expect(screen.queryByText('System error')).not.toBeInTheDocument();
  });

  it('shows the error page, and not the app, while the API does not answer', async () => {
    stopTheApi();

    renderGate();

    expect(await screen.findByText('System error')).toBeInTheDocument();
    expect(screen.getByText('We will be back in a few minutes.')).toBeInTheDocument();
    expect(screen.queryByText("L'application")).not.toBeInTheDocument();
  });

  it('shows the error page while the API answers an error', async () => {
    fakeApi({ 'GET /health': () => Response.json({}, { status: 503 }) });

    renderGate();

    expect(await screen.findByText('System error')).toBeInTheDocument();
    expect(screen.queryByText("L'application")).not.toBeInTheDocument();
  });

  it('shows the app once the API answers', async () => {
    fakeApi({ 'GET /health': () => Response.json({ status: 'ok' }) });

    renderGate();

    expect(await screen.findByText("L'application")).toBeInTheDocument();
    expect(screen.queryByText('Chargement…')).not.toBeInTheDocument();
  });

  it('shows the error page at once when a request cannot reach the API, over the app', async () => {
    fakeApi({ 'GET /health': () => Response.json({ status: 'ok' }) });
    renderGate();
    await screen.findByText("L'application");

    stopTheApi();
    await expect(fetchModels()).rejects.toThrow();

    // At once: no new check of /health was needed.
    expect(await screen.findByText('System error')).toBeInTheDocument();
    expect(vi.mocked(fetch)).toHaveBeenCalledTimes(1);
    // The app is still there, under the page: nothing typed is lost.
    expect(screen.getByText("L'application")).toBeInTheDocument();
  });
});
