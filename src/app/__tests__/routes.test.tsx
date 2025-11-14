import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { AppRoutes } from '../routes';
import { AppRoute, AuthorizationStatus } from '../../constants';
import { State } from '../../types/state';

describe('AppRoutes', () => {
  const mockStoreCreator = configureMockStore<State>();

  const createMockStore = (
    authStatus: AuthorizationStatus = AuthorizationStatus.NoAuth
  ) =>
    mockStoreCreator({
      auth: {
        status: authStatus,
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

  it('should render MainPage on root route', () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[AppRoute.Root]}>
          <AppRoutes />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Cities')).toBeInTheDocument();
  });

  it('should render LoginPage on /login route', () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[AppRoute.Login]}>
          <AppRoutes />
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.getByRole('heading', { name: 'Sign in' })
    ).toBeInTheDocument();
  });

  it('should render FavoritesPage on /favorites route when authorized', () => {
    const store = createMockStore(AuthorizationStatus.Auth);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[AppRoute.Favorites]}>
          <AppRoutes />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Saved listing')).toBeInTheDocument();
  });

  it('should redirect to login when accessing /favorites without authorization', () => {
    const store = createMockStore(AuthorizationStatus.NoAuth);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[AppRoute.Favorites]}>
          <AppRoutes />
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.getByRole('heading', { name: 'Sign in' })
    ).toBeInTheDocument();
    expect(screen.queryByText('Saved listing')).not.toBeInTheDocument();
  });

  it('should render OfferPage on /offer/:id route', () => {
    const store = createMockStore();
    const offerId = '123';

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/offer/${offerId}`]}>
          <AppRoutes />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.queryByText('Cities')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Sign in' })
    ).not.toBeInTheDocument();
  });

  it('should render NotFoundPage on unknown route', () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/unknown-route']}>
          <AppRoutes />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page not found')).toBeInTheDocument();
  });
});
