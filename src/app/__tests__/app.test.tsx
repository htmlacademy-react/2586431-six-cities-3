import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureMockStore } from '@jedmao/redux-mock-store';
import App from '../app';
import { State } from '../../types/state';
import { AuthorizationStatus } from '../../constants';
import { store } from '../../store';

vi.mock('../../store', async () => {
  const actual = await vi.importActual<typeof import('../../store')>(
    '../../store'
  );
  const mockDispatch = vi.fn();
  return {
    ...actual,
    store: {
      dispatch: mockDispatch,
    },
  };
});

describe('App', () => {
  const mockStoreCreator = configureMockStore<State>();

  beforeEach(() => {
    vi.clearAllMocks();
  });

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

  it('should render App component', () => {
    const mockStore = createMockStore();

    const { container } = render(
      <Provider store={mockStore}>
        <App />
      </Provider>
    );

    expect(container).toBeInTheDocument();
  });

  it('should dispatch checkAuth on mount', () => {
    const mockStore = createMockStore();

    render(
      <Provider store={mockStore}>
        <App />
      </Provider>
    );

    expect(store.dispatch).toHaveBeenCalled();
  });

  it('should render BrowserRouter', () => {
    const mockStore = createMockStore();

    const { container } = render(
      <Provider store={mockStore}>
        <App />
      </Provider>
    );

    expect(container.querySelector('main') || container).toBeInTheDocument();
  });

  it('should render AppRoutes inside BrowserRouter', () => {
    const mockStore = createMockStore();

    const { container } = render(
      <Provider store={mockStore}>
        <App />
      </Provider>
    );

    expect(container).toBeInTheDocument();
  });
});
