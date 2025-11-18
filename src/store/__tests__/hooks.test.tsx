import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { useOffersList } from '../hooks';
import { State } from '../../types/state';
import { createMockOffer } from './test-utils';
import { USortingOptionValue, AuthorizationStatus } from '../../constants';

describe('useOffersList', () => {
  const mockStoreCreator = configureMockStore<State>();

  const createMockStore = (
    offers: ReturnType<typeof createMockOffer>[],
    city: string = 'Paris',
    sort: USortingOptionValue = 'popular'
  ) =>
    mockStoreCreator({
      auth: {
        status: AuthorizationStatus.NoAuth,
        authorizationLoading: false,
        loginLoading: false,
        logoutLoading: false,
        user: null,
      },
      offers: {
        list: offers,
        listLoading: false,
        nearby: [],
        nearbyLoading: false,
      },
      filters: {
        city,
        sort,
      },
      offerDetails: {
        current: null,
        currentLoading: false,
      },
      favorites: {
        list: undefined,
        listLoading: false,
        setStatusLoading: false,
      },
      reviews: {
        list: [],
        listLoading: false,
        postNewLoading: false,
      },
    });

  it('should return filtered offers by city', () => {
    const parisOffer1 = createMockOffer({
      id: '1',
      city: {
        name: 'Paris',
        location: { latitude: 48.8566, longitude: 2.3522 },
      },
    });
    const parisOffer2 = createMockOffer({
      id: '2',
      city: {
        name: 'Paris',
        location: { latitude: 48.8566, longitude: 2.3522 },
      },
    });
    const amsterdamOffer = createMockOffer({
      id: '3',
      city: {
        name: 'Amsterdam',
        location: { latitude: 52.370216, longitude: 4.895168 },
      },
    });

    const store = createMockStore(
      [parisOffer1, parisOffer2, amsterdamOffer],
      'Paris'
    );

    const { result } = renderHook(() => useOffersList(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    expect(result.current).toHaveLength(2);
    expect(result.current).toEqual([parisOffer1, parisOffer2]);
  });

  it('should return empty array when no offers match city', () => {
    const parisOffer = createMockOffer({
      id: '1',
      city: {
        name: 'Paris',
        location: { latitude: 48.8566, longitude: 2.3522 },
      },
    });
    const store = createMockStore([parisOffer], 'Amsterdam');

    const { result } = renderHook(() => useOffersList(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    expect(result.current).toHaveLength(0);
  });

  it('should return offers without sorting when sort is popular', () => {
    const offer1 = createMockOffer({ id: '1', price: 100, rating: 4.5 });
    const offer2 = createMockOffer({ id: '2', price: 200, rating: 4.0 });
    const offer3 = createMockOffer({ id: '3', price: 150, rating: 5.0 });

    const store = createMockStore([offer1, offer2, offer3], 'Paris', 'popular');

    const { result } = renderHook(() => useOffersList(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    expect(result.current).toHaveLength(3);
    expect(result.current[0].id).toBe('1');
    expect(result.current[1].id).toBe('2');
    expect(result.current[2].id).toBe('3');
  });

  it('should sort offers by price low to high', () => {
    const offer1 = createMockOffer({ id: '1', price: 300 });
    const offer2 = createMockOffer({ id: '2', price: 100 });
    const offer3 = createMockOffer({ id: '3', price: 200 });

    const store = createMockStore(
      [offer1, offer2, offer3],
      'Paris',
      'price-low-to-high'
    );

    const { result } = renderHook(() => useOffersList(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    expect(result.current).toHaveLength(3);
    expect(result.current[0].price).toBe(100);
    expect(result.current[1].price).toBe(200);
    expect(result.current[2].price).toBe(300);
  });

  it('should sort offers by price high to low', () => {
    const offer1 = createMockOffer({ id: '1', price: 100 });
    const offer2 = createMockOffer({ id: '2', price: 300 });
    const offer3 = createMockOffer({ id: '3', price: 200 });

    const store = createMockStore(
      [offer1, offer2, offer3],
      'Paris',
      'price-high-to-low'
    );

    const { result } = renderHook(() => useOffersList(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    expect(result.current).toHaveLength(3);
    expect(result.current[0].price).toBe(300);
    expect(result.current[1].price).toBe(200);
    expect(result.current[2].price).toBe(100);
  });

  it('should sort offers by rating top first', () => {
    const offer1 = createMockOffer({ id: '1', rating: 3.5 });
    const offer2 = createMockOffer({ id: '2', rating: 5.0 });
    const offer3 = createMockOffer({ id: '3', rating: 4.5 });

    const store = createMockStore(
      [offer1, offer2, offer3],
      'Paris',
      'top-rated-first'
    );

    const { result } = renderHook(() => useOffersList(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    expect(result.current).toHaveLength(3);
    expect(result.current[0].rating).toBe(5.0);
    expect(result.current[1].rating).toBe(4.5);
    expect(result.current[2].rating).toBe(3.5);
  });

  it('should update when city changes', () => {
    const parisOffer = createMockOffer({
      id: '1',
      city: {
        name: 'Paris',
        location: { latitude: 48.8566, longitude: 2.3522 },
      },
    });
    const amsterdamOffer = createMockOffer({
      id: '2',
      city: {
        name: 'Amsterdam',
        location: { latitude: 52.370216, longitude: 4.895168 },
      },
    });

    const store = createMockStore([parisOffer, amsterdamOffer], 'Paris');

    const { result, rerender } = renderHook(() => useOffersList(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    expect(result.current).toHaveLength(1);
    expect(result.current[0].id).toBe('1');

    const newStore = createMockStore([parisOffer, amsterdamOffer], 'Amsterdam');
    store.getState = () => newStore.getState();

    rerender();

    expect(result.current).toHaveLength(1);
    expect(result.current[0].id).toBe('2');
  });

  it('should update when sort changes', () => {
    const offer1 = createMockOffer({ id: '1', price: 300 });
    const offer2 = createMockOffer({ id: '2', price: 100 });

    const store = createMockStore(
      [offer1, offer2],
      'Paris',
      'price-low-to-high'
    );

    const { result } = renderHook(() => useOffersList(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    expect(result.current[0].price).toBe(100);
    expect(result.current[1].price).toBe(300);
  });
});
