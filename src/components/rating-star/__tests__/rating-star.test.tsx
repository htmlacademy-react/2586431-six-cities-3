import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RatingStar, TRatingValue } from '../rating-star';

describe('RatingStar', () => {
  const mockOnChange = () => {};

  it('should render correctly', () => {
    const rating: TRatingValue = 5;
    const value: TRatingValue = 3;

    const { container } = render(
      <RatingStar value={value} onChange={mockOnChange} rating={rating} />
    );

    const input = screen.getByRole('radio');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('id', '5-stars');
    expect(input).toHaveAttribute('value', String(value));

    const label = container.querySelector('label[for="5-stars"]');
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('title', 'perfect');
  });

  it('should be checked when value >= rating', () => {
    const rating: TRatingValue = 4;
    const value: TRatingValue = 4;

    render(
      <RatingStar value={value} onChange={mockOnChange} rating={rating} />
    );

    const input = screen.getByRole('radio');
    expect(input).toBeChecked();
  });

  it('should not be checked when value < rating', () => {
    const rating: TRatingValue = 5;
    const value: TRatingValue = 3;

    render(
      <RatingStar value={value} onChange={mockOnChange} rating={rating} />
    );

    const input = screen.getByRole('radio');
    expect(input).not.toBeChecked();
  });
});
