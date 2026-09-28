import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MOCK_MODELS } from '../models.mock';
import { ModelList } from './ModelList';

/** Given. Step 3. */
describe('ModelList', () => {
  it('shows one list item per model', () => {
    render(<ModelList models={MOCK_MODELS} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(MOCK_MODELS.length);
  });

  it('shows a card for each model, in the given order', () => {
    render(<ModelList models={MOCK_MODELS} />);
    const headings = screen.getAllByRole('heading').map((heading) => heading.textContent);
    expect(headings).toEqual(MOCK_MODELS.map((model) => model.name));
  });

  it('says so when there is no model, instead of an empty list', () => {
    render(<ModelList models={[]} />);
    expect(screen.getByText('Aucun modèle pour ce filtre.')).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });
});
