import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { LoginPage } from '../login-page';
import { State } from '../../../types/state';
import { AuthorizationStatus, AppRoute, CITIES } from '../../../constants';
import { filtersActions, store as realStore } from '../../../store';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom'
  );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

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

describe('LoginPage', () => {
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

  it('should render login form', () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.getByRole('heading', { name: 'Sign in' })
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('should redirect to root when user is already authorized', () => {
    const store = createMockStore(AuthorizationStatus.Auth);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    expect(mockNavigate).toHaveBeenCalledWith(AppRoute.Root);
  });

  it('should not redirect when user is not authorized', () => {
    const store = createMockStore(AuthorizationStatus.NoAuth);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should dispatch login action on form submit', async () => {
    const user = userEvent.setup();
    const store = createMockStore();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign in' });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    expect(realStore.dispatch).toHaveBeenCalled();
  });

  it('should have required email input', () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    const emailInput = screen.getByPlaceholderText('Email');
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('required');
  });

  it('should have required password input with pattern', () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    const passwordInput = screen.getByPlaceholderText('Password');
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(passwordInput).toHaveAttribute('required');
    expect(passwordInput).toHaveAttribute(
      'pattern',
      '^(?=.*[A-Za-z])(?=.*\\d).+$'
    );
  });

  it('should render random city', () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    const randomCityLink = screen.getByTestId('random-city-link');
    expect(randomCityLink).toBeInTheDocument();
    expect(randomCityLink).toHaveTextContent(new RegExp(CITIES.join('|')));
  });

  it('should navigate to random city when random city link is clicked', async () => {
    const user = userEvent.setup();
    const store = createMockStore();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    const randomCityLink = screen.getByTestId('random-city-link');
    const randomCity = randomCityLink.textContent ?? '';
    await user.click(randomCityLink);

    expect(mockNavigate).toHaveBeenCalledWith(AppRoute.Root);
    expect(realStore.dispatch).toHaveBeenCalledWith(
      filtersActions.changeCity(randomCity)
    );
  });

  it('should update redirect when auth status changes', () => {
    const store = createMockStore(AuthorizationStatus.NoAuth);

    const { rerender } = render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    expect(mockNavigate).not.toHaveBeenCalled();

    const newStore = createMockStore(AuthorizationStatus.Auth);
    rerender(
      <Provider store={newStore}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    expect(mockNavigate).toHaveBeenCalledWith(AppRoute.Root);
  });
});
