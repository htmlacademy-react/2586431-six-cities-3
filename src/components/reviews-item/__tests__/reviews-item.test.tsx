import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ReviewsItem } from '../reviews-item';
import { createMockReview } from '../../../store/__tests__/test-utils';

describe('ReviewsItem', () => {
  it('should render correctly', () => {
    const review = createMockReview({
      comment: 'Great place!',
      rating: 5,
      date: '2024-01-15T00:00:00.000Z',
      user: {
        name: 'John Doe',
        avatarUrl: 'avatar.jpg',
        isPro: true,
        email: 'john@test.com',
        token: 'token',
      },
    });

    render(<ReviewsItem review={review} />);

    expect(screen.getByText('Great place!')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByAltText('Reviews avatar')).toBeInTheDocument();
    expect(screen.getByAltText('Reviews avatar')).toHaveAttribute(
      'src',
      'avatar.jpg'
    );
  });
});
