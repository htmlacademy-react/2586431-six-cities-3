import { describe, it, expect } from 'vitest';
import { rootReducer } from '../root-reducer';
import { filtersActions } from '../filters';
import { offersActions } from '../offers';
import { offerDetailsActions } from '../offer-details';
import { reviewsActions } from '../reviews';
import { authActions } from '../auth';
import { favoritesActions } from '../favorites';
import { CITIES } from '../../constants';
import { createMockOffer, createMockOfferDetails } from './test-utils';

describe('rootReducer', () => {
  it('should return initial state with all slices', () => {
    const state = rootReducer(undefined, { type: '@@INIT' });

    expect(state).toHaveProperty('filters');
    expect(state).toHaveProperty('offers');
    expect(state).toHaveProperty('offerDetails');
    expect(state).toHaveProperty('reviews');
    expect(state).toHaveProperty('auth');
    expect(state).toHaveProperty('favorites');
  });

  it('should handle filters actions', () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });
    const newState = rootReducer(
      initialState,
      filtersActions.changeCity('Amsterdam')
    );

    expect(newState.filters.city).toBe('Amsterdam');
    expect(newState.filters).not.toBe(initialState.filters);
  });

  it('should handle offers actions', () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });
    const mockOffers = [createMockOffer({ id: '1' })];

    const newState = rootReducer(
      initialState,
      offersActions.fetchList.fulfilled(mockOffers, 'requestId', undefined)
    );

    expect(newState.offers.list).toEqual(mockOffers);
    expect(newState.offers).not.toBe(initialState.offers);
  });

  it('should handle offerDetails actions', () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });
    const mockOfferDetails = createMockOfferDetails({ id: '1' });

    const newState = rootReducer(
      initialState,
      offerDetailsActions.fetchById.fulfilled(
        mockOfferDetails,
        'requestId',
        '1'
      )
    );

    expect(newState.offerDetails.current).toEqual(mockOfferDetails);
    expect(newState.offerDetails).not.toBe(initialState.offerDetails);
  });

  it('should handle reviews actions', () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });
    const mockReviews = [
      {
        id: '1',
        comment: 'Test',
        rating: 5,
        date: '2024-01-01',
        user: {
          name: 'Test',
          avatarUrl: 'test.jpg',
          isPro: false,
        },
      },
    ];

    const newState = rootReducer(
      initialState,
      reviewsActions.fetchList.fulfilled(mockReviews, 'requestId', '1')
    );

    expect(newState.reviews.list).toEqual(mockReviews);
    expect(newState.reviews).not.toBe(initialState.reviews);
  });

  it('should handle auth actions', () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });
    const mockUser = {
      name: 'Test',
      avatarUrl: 'test.jpg',
      isPro: false,
      email: 'test@test.com',
      token: 'token',
    };

    const newState = rootReducer(
      initialState,
      authActions.login.fulfilled(mockUser, 'requestId', {
        email: 'test@test.com',
        password: 'password',
      })
    );

    expect(newState.auth.user).toEqual(mockUser);
    expect(newState.auth).not.toBe(initialState.auth);
  });

  it('should handle favorites actions', () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });
    const mockOffers = [createMockOffer({ id: '1', isFavorite: true })];

    const newState = rootReducer(
      initialState,
      favoritesActions.fetchList.fulfilled(mockOffers, 'requestId', undefined)
    );

    expect(newState.favorites.list).toEqual(mockOffers);
    expect(newState.favorites).not.toBe(initialState.favorites);
  });

  it('should maintain state immutability', () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });
    const newState = rootReducer(
      initialState,
      filtersActions.changeCity('Amsterdam')
    );

    expect(initialState.filters.city).toBe(CITIES[0]);
    expect(newState.filters.city).toBe('Amsterdam');
  });

  it('should handle multiple actions from different slices', () => {
    let state = rootReducer(undefined, { type: '@@INIT' });

    state = rootReducer(state, filtersActions.changeCity('Amsterdam'));
    state = rootReducer(state, filtersActions.changeSort('price-low-to-high'));

    expect(state.filters.city).toBe('Amsterdam');
    expect(state.filters.sort).toBe('price-low-to-high');
    expect(state.offers.list).toEqual([]);
    expect(state.auth.status).toBeDefined();
  });
});
