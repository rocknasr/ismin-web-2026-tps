import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { formatDownloads, formatParameters } from '../format';
import type { Model } from '../model';
import { ModelCard } from './ModelCard';

/** Given. Step 2. */
const mistral: Model = {
  id: 'mistral-7b-instruct-v0-3',
  name: 'Mistral-7B-Instruct-v0.3',
  org: 'mistralai',
  task: 'text-generation',
  parameters: 7.25,
  downloads: 1420000,
  license: 'apache-2.0',
};

describe('ModelCard', () => {
  it('shows the name of the model as a heading', () => {
    render(<ModelCard model={mistral} />);
    expect(screen.getByRole('heading', { name: 'Mistral-7B-Instruct-v0.3' })).toBeInTheDocument();
  });

  it('shows the organisation and the task, in French', () => {
    render(<ModelCard model={mistral} />);
    expect(screen.getByText('mistralai')).toBeInTheDocument();
    expect(screen.getByText('Génération de texte')).toBeInTheDocument();
  });

  it('shows the parameters and the downloads, formatted', () => {
    render(<ModelCard model={mistral} />);
    expect(screen.getByText(formatParameters(7.25))).toBeInTheDocument();
    expect(screen.getByText(formatDownloads(1420000))).toBeInTheDocument();
  });

  it('shows the licence when there is one, and nothing when there is none', () => {
    const { unmount } = render(<ModelCard model={mistral} />);
    expect(screen.getByText('Licence apache-2.0')).toBeInTheDocument();
    unmount();

    render(<ModelCard model={{ ...mistral, license: undefined }} />);
    expect(screen.queryByText(/Licence/)).not.toBeInTheDocument();
  });
});
