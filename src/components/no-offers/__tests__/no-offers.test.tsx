import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NoOffers } from '../no-offers';

describe('NoOffers', () => {
  it('should render correctly with city name', () => {
    render(<NoOffers city="Paris" />);

    expect(screen.getByText('No places to stay available')).toBeInTheDocument();
    expect(
      screen.getByText(
        /We could not find any property available at the moment in Paris/
      )
    ).toBeInTheDocument();
  });
});
