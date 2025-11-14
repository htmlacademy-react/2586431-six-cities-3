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

  it('should have pro class when user is pro', () => {
    const review = createMockReview({
      user: {
        name: 'John Doe',
        avatarUrl: 'avatar.jpg',
        isPro: true,
      },
    });

    const { container } = render(<ReviewsItem review={review} />);

    const avatarWrapper = container.querySelector(
      '.reviews__avatar-wrapper--pro'
    );
    expect(avatarWrapper).toBeInTheDocument();
  });

  it('should not have pro class when user is not pro', () => {
    const review = createMockReview({
      user: {
        name: 'Jane Doe',
        avatarUrl: 'avatar2.jpg',
        isPro: false,
      },
    });

    const { container } = render(<ReviewsItem review={review} />);

    const avatarWrapper = container.querySelector(
      '.reviews__avatar-wrapper--pro'
    );
    expect(avatarWrapper).not.toBeInTheDocument();
  });
});
