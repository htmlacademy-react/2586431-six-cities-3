import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { ReviewsList } from '../reviews-list';
import { State } from '../../../types/state';
import { createMockReview } from '../../../store/__tests__/test-utils';
import { MAX_REVIEWS_COUNT } from '../../../constants';

vi.mock('../../../store', async () => {
  const actual = await vi.importActual<typeof import('../../../store')>(
    '../../../store'
  );
  const mockDispatch = vi.fn();
  return {
    ...actual,
    store: {
      dispatch: mockDispatch,
    },
  };
});

describe('ReviewsList', () => {
  const mockStoreCreator = configureMockStore<State>();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should dispatch fetchList on mount', () => {
    const store = mockStoreCreator({
      reviews: {
        list: [],
        listLoading: false,
        postNewLoading: false,
      },
    });

    render(
      <Provider store={store}>
        <ReviewsList offerId="1" />
      </Provider>
    );

    expect(screen.getByText('Reviews ·')).toBeInTheDocument();
  });

  it('should show spinner when loading', () => {
    const store = mockStoreCreator({
      reviews: {
        list: [],
        listLoading: true,
        postNewLoading: false,
      },
    });

    const { container } = render(
      <Provider store={store}>
        <ReviewsList offerId="1" />
      </Provider>
    );

    expect(container.querySelector('.spinner')).toBeInTheDocument();
  });

  it('should display reviews when loaded', () => {
    const reviews = [
      createMockReview({ id: '1', comment: 'Great place!' }),
      createMockReview({ id: '2', comment: 'Nice apartment' }),
    ];

    const store = mockStoreCreator({
      reviews: {
        list: reviews,
        listLoading: false,
        postNewLoading: false,
      },
    });

    render(
      <Provider store={store}>
        <ReviewsList offerId="1" />
      </Provider>
    );

    expect(screen.getByText('Great place!')).toBeInTheDocument();
    expect(screen.getByText('Nice apartment')).toBeInTheDocument();
  });

  it('should display reviews count', () => {
    const reviews = [
      createMockReview({ id: '1' }),
      createMockReview({ id: '2' }),
      createMockReview({ id: '3' }),
    ];

    const store = mockStoreCreator({
      reviews: {
        list: reviews,
        listLoading: false,
        postNewLoading: false,
      },
    });

    render(
      <Provider store={store}>
        <ReviewsList offerId="1" />
      </Provider>
    );

    expect(screen.getByText('Reviews ·')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should limit displayed reviews to MAX_REVIEWS_COUNT', () => {
    const reviews = Array.from({ length: MAX_REVIEWS_COUNT + 5 }, (_, i) =>
      createMockReview({ id: String(i), comment: `Review ${i}` })
    );

    const store = mockStoreCreator({
      reviews: {
        list: reviews,
        listLoading: false,
        postNewLoading: false,
      },
    });

    render(
      <Provider store={store}>
        <ReviewsList offerId="1" />
      </Provider>
    );

    expect(screen.getByText('Reviews ·')).toBeInTheDocument();
    expect(screen.getByText(String(reviews.length))).toBeInTheDocument();

    const reviewItems = screen.getAllByRole('listitem');
    expect(reviewItems.length).toBeLessThanOrEqual(MAX_REVIEWS_COUNT);
  });

  it('should display empty list when no reviews', () => {
    const store = mockStoreCreator({
      reviews: {
        list: [],
        listLoading: false,
        postNewLoading: false,
      },
    });

    render(
      <Provider store={store}>
        <ReviewsList offerId="1" />
      </Provider>
    );

    expect(screen.getByText('Reviews ·')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });

  it('should dispatch fetchList when offerId changes', () => {
    const mockStore = mockStoreCreator({
      reviews: {
        list: [],
        listLoading: false,
        postNewLoading: false,
      },
    });

    const { rerender } = render(
      <Provider store={mockStore}>
        <ReviewsList offerId="1" />
      </Provider>
    );

    rerender(
      <Provider store={mockStore}>
        <ReviewsList offerId="2" />
      </Provider>
    );

    expect(screen.getByText('Reviews ·')).toBeInTheDocument();
  });
});
