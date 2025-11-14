import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { FavoritesPage } from '../favorites-page';
import { State } from '../../../types/state';
import { AuthorizationStatus } from '../../../constants';
import { createMockOffer } from '../../../store/__tests__/test-utils';
import { store as realStore } from '../../../store';

vi.mock('../../../store', async () => {
  const actual = await vi.importActual<typeof import('../../../store')>(
    '../../../store'
  );
  const mockDispatch = vi.fn();
  return {
    ...actual,
    store: {
      dispatch: mockDispatch,
      getState: vi.fn(),
      subscribe: vi.fn(),
      replaceReducer: vi.fn(),
    },
  };
});

describe('FavoritesPage', () => {
  const mockStoreCreator = configureMockStore<State>();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createMockStore = (
    favoritesList?: ReturnType<typeof createMockOffer>[]
  ) =>
    mockStoreCreator({
      auth: {
        status: AuthorizationStatus.Auth,
        authorizationLoading: false,
        loginLoading: false,
        logoutLoading: false,
        user: null,
      },
      offers: {
        list: [],
        listLoading: false,
        nearby: [],
        nearbyLoading: false,
      },
      filters: {
        city: 'Paris',
        sort: 'popular',
      },
      offerDetails: {
        current: null,
        currentLoading: false,
      },
      favorites: {
        list: favoritesList,
        listLoading: false,
        setStatusLoading: false,
      },
      reviews: {
        list: [],
        listLoading: false,
        postNewLoading: false,
      },
    });

  it('should render page title when not empty', () => {
    const store = createMockStore([createMockOffer()]);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <FavoritesPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Saved listing')).toBeInTheDocument();
  });

  it('should render empty list when no favorites', () => {
    const store = createMockStore([]);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <FavoritesPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Nothing yet saved.')).toBeInTheDocument();
  });

  it('should group offers by city', () => {
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

    const store = createMockStore([parisOffer1, parisOffer2, amsterdamOffer]);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <FavoritesPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(screen.getByText('Amsterdam')).toBeInTheDocument();
  });

  it('should dispatch fetchList when favorites list is undefined', () => {
    const store = createMockStore(undefined);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <FavoritesPage />
        </MemoryRouter>
      </Provider>
    );

    expect(realStore.dispatch).toHaveBeenCalled();
  });

  it('should not dispatch fetchList when favorites list exists', () => {
    const store = createMockStore([]);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <FavoritesPage />
        </MemoryRouter>
      </Provider>
    );

    expect(realStore.dispatch).not.toHaveBeenCalled();
  });

  it('should handle multiple cities correctly', () => {
    const offers = [
      createMockOffer({
        id: '1',
        city: {
          name: 'Paris',
          location: { latitude: 48.8566, longitude: 2.3522 },
        },
      }),
      createMockOffer({
        id: '2',
        city: {
          name: 'Paris',
          location: { latitude: 48.8566, longitude: 2.3522 },
        },
      }),
      createMockOffer({
        id: '3',
        city: {
          name: 'Amsterdam',
          location: { latitude: 52.370216, longitude: 4.895168 },
        },
      }),
      createMockOffer({
        id: '4',
        city: {
          name: 'Cologne',
          location: { latitude: 50.938361, longitude: 6.959974 },
        },
      }),
    ];

    const store = createMockStore(offers);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <FavoritesPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(screen.getByText('Amsterdam')).toBeInTheDocument();
    expect(screen.getByText('Cologne')).toBeInTheDocument();
  });
});
