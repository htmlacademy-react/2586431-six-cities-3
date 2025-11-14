import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { MainPage } from '../main-page';
import { State } from '../../../types/state';
import { AuthorizationStatus, CITIES } from '../../../constants';
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

describe('MainPage', () => {
  const mockStoreCreator = configureMockStore<State>();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createMockStore = (
    offers: ReturnType<typeof createMockOffer>[] = [],
    city: string = 'Paris',
    isLoading: boolean = false
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
        listLoading: isLoading,
        nearby: [],
        nearbyLoading: false,
      },
      filters: {
        city,
        sort: 'popular',
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

  it('should dispatch fetchList on mount', () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MainPage />
        </MemoryRouter>
      </Provider>
    );

    expect(realStore.dispatch).toHaveBeenCalled();
  });

  it('should render spinner when loading', () => {
    const store = createMockStore([], 'Paris', true);

    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <MainPage />
        </MemoryRouter>
      </Provider>
    );

    expect(container.querySelector('.spinner-container')).toBeInTheDocument();
  });

  it('should render city tabs', () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MainPage />
        </MemoryRouter>
      </Provider>
    );

    CITIES.forEach((city) => {
      expect(screen.getByText(city)).toBeInTheDocument();
    });
  });

  it('should highlight active city', () => {
    const store = createMockStore([], 'Amsterdam');

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MainPage />
        </MemoryRouter>
      </Provider>
    );

    const amsterdamTab = screen.getByText('Amsterdam').closest('.tabs__item');
    expect(amsterdamTab).toHaveClass('tabs__item--active');
  });

  it('should dispatch changeCity when city tab is clicked', async () => {
    const user = userEvent.setup();
    const store = createMockStore();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MainPage />
        </MemoryRouter>
      </Provider>
    );

    const parisTab = screen.getByText('Paris');
    await user.click(parisTab);

    expect(realStore.dispatch).toHaveBeenCalled();
    expect(parisTab.closest('.tabs__item')).toHaveClass('tabs__item--active');
  });

  it('should render offers count', () => {
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
    ];
    const store = createMockStore(offers, 'Paris');

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MainPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('2 places to stay in Paris')).toBeInTheDocument();
  });

  it('should render NoOffers when no offers available', () => {
    const store = createMockStore([], 'Paris');

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MainPage />
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.getByText(/No places to stay available/i)
    ).toBeInTheDocument();
  });

  it('should render OffersList when offers are available', () => {
    const offers = [
      createMockOffer({
        id: '1',
        city: {
          name: 'Paris',
          location: { latitude: 48.8566, longitude: 2.3522 },
        },
      }),
    ];
    const store = createMockStore(offers, 'Paris');

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MainPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Test Offer')).toBeInTheDocument();
  });

  it('should render Map when offers are available', () => {
    const offers = [
      createMockOffer({
        id: '1',
        city: {
          name: 'Paris',
          location: { latitude: 48.8566, longitude: 2.3522 },
        },
      }),
    ];
    const store = createMockStore(offers, 'Paris');

    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <MainPage />
        </MemoryRouter>
      </Provider>
    );

    expect(container.querySelector('.cities__map')).toBeInTheDocument();
  });

  it('should not render Map when no offers available', () => {
    const store = createMockStore([], 'Paris');

    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <MainPage />
        </MemoryRouter>
      </Provider>
    );

    const map = container.querySelector('.cities__map');
    expect(map).not.toBeInTheDocument();
  });

  it('should render SortingOptions when offers are available', () => {
    const offers = [
      createMockOffer({
        id: '1',
        city: {
          name: 'Paris',
          location: { latitude: 48.8566, longitude: 2.3522 },
        },
      }),
    ];
    const store = createMockStore(offers, 'Paris');

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MainPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Sort by')).toBeInTheDocument();
  });

  it('should apply correct CSS classes based on offers availability', () => {
    const offers = [
      createMockOffer({
        id: '1',
        city: {
          name: 'Paris',
          location: { latitude: 48.8566, longitude: 2.3522 },
        },
      }),
    ];
    const store = createMockStore(offers, 'Paris');

    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <MainPage />
        </MemoryRouter>
      </Provider>
    );

    const main = container.querySelector('.page__main--index');
    expect(main).not.toHaveClass('page__main--index-empty');
  });

  it('should apply empty class when no offers', () => {
    const store = createMockStore([], 'Paris');

    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <MainPage />
        </MemoryRouter>
      </Provider>
    );

    const main = container.querySelector('.page__main--index');
    expect(main).toHaveClass('page__main--index-empty');
  });
});
