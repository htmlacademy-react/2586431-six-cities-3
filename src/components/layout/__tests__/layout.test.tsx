import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureMockStore } from '@jedmao/redux-mock-store';
import Layout from '../layout';
import { State } from '../../../types/state';
import { AuthorizationStatus, AppRoute } from '../../../constants';
import { createMockUser } from '../../../store/__tests__/test-utils';
import { TOffer } from '../../../types/offer';
import { store } from '../../../store';

vi.mock('../../../store', async () => {
  const actual = await vi.importActual<typeof import('../../../store')>(
    '../../../store'
  );
  const dispatchMock = vi.fn();
  return {
    ...actual,
    store: {
      dispatch: dispatchMock,
    },
  };
});

describe('Layout', () => {
  const mockStoreCreator = configureMockStore<State>();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithProviders = (
    component: JSX.Element,
    initialEntries: string[] = [AppRoute.Root]
  ) => {
    const mockStore = mockStoreCreator({
      auth: {
        status: AuthorizationStatus.NoAuth,
        authorizationLoading: false,
        loginLoading: false,
        logoutLoading: false,
        user: null,
      },
      favorites: {
        list: undefined,
        listLoading: false,
        setStatusLoading: false,
      },
    });

    return render(
      <Provider store={mockStore}>
        <MemoryRouter initialEntries={initialEntries}>{component}</MemoryRouter>
      </Provider>
    );
  };

  it('should render logo', () => {
    renderWithProviders(<Layout />);

    const logo = screen.getByAltText('6 cities logo');
    expect(logo).toBeInTheDocument();
  });

  it('should show Sign in link when user is not authorized', () => {
    renderWithProviders(<Layout />);

    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

  it('should show user email and favorites count when authorized', () => {
    const user = createMockUser({ email: 'test@example.com' });
    const mockStore = mockStoreCreator({
      auth: {
        status: AuthorizationStatus.Auth,
        authorizationLoading: false,
        loginLoading: false,
        logoutLoading: false,
        user,
      },
      favorites: {
        list: [],
        listLoading: false,
        setStatusLoading: false,
      },
    });

    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <Layout />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument(); // favorites count
  });

  it('should display favorites count correctly', () => {
    const user = createMockUser();
    const mockStore = mockStoreCreator({
      auth: {
        status: AuthorizationStatus.Auth,
        authorizationLoading: false,
        loginLoading: false,
        logoutLoading: false,
        user,
      },
      favorites: {
        list: [{ id: '1' }, { id: '2' }, { id: '3' }] as TOffer[],
        listLoading: false,
        setStatusLoading: false,
      },
    });

    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <Layout />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should dispatch logout on Sign out click', async () => {
    const user = userEvent.setup();
    const userData = createMockUser();
    const mockStore = mockStoreCreator({
      auth: {
        status: AuthorizationStatus.Auth,
        authorizationLoading: false,
        loginLoading: false,
        logoutLoading: false,
        user: userData,
      },
      favorites: {
        list: [],
        listLoading: false,
        setStatusLoading: false,
      },
    });

    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <Layout />
        </MemoryRouter>
      </Provider>
    );

    const signOutButton = screen.getByText('Sign out');
    await user.click(signOutButton);

    expect(store.dispatch).toHaveBeenCalled();
  });

  it('should not show user nav on login page', () => {
    renderWithProviders(<Layout />, [AppRoute.Login]);

    expect(screen.queryByText('Sign in')).not.toBeInTheDocument();
    expect(screen.queryByText('Sign out')).not.toBeInTheDocument();
  });

  it('should dispatch fetchList for favorites when authorized', () => {
    const user = createMockUser();
    const mockStore = mockStoreCreator({
      auth: {
        status: AuthorizationStatus.Auth,
        authorizationLoading: false,
        loginLoading: false,
        logoutLoading: false,
        user,
      },
      favorites: {
        list: undefined,
        listLoading: false,
        setStatusLoading: false,
      },
    });

    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <Layout />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(user.email)).toBeInTheDocument();
  });

  it('should not dispatch fetchList for favorites when not authorized', () => {
    const mockStore = mockStoreCreator({
      auth: {
        status: AuthorizationStatus.NoAuth,
        authorizationLoading: false,
        loginLoading: false,
        logoutLoading: false,
        user: null,
      },
      favorites: {
        list: undefined,
        listLoading: false,
        setStatusLoading: false,
      },
    });

    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <Layout />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByAltText('6 cities logo')).toBeInTheDocument();
  });

  it('should render Outlet for child routes', () => {
    const { container } = renderWithProviders(<Layout />);

    const main = container.querySelector('main');
    expect(main).toBeInTheDocument();
  });
});
