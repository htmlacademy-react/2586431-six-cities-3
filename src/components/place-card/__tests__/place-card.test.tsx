import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { PlaceCard } from '../place-card';
import { createMockOffer } from '../../../store/__tests__/test-utils';
import { AppRoute, AuthorizationStatus } from '../../../constants';
import { State } from '../../../types/state';
import { store } from '../../../store';

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

describe('PlaceCard', () => {
  const mockStoreCreator = configureMockStore<State>();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly', () => {
    const offer = createMockOffer({
      id: '1',
      title: 'Test Offer',
      price: 100,
      rating: 4.5,
      type: 'apartment',
      isPremium: true,
    });

    const mockStore = mockStoreCreator({
      auth: {
        status: AuthorizationStatus.Auth,
        authorizationLoading: false,
        loginLoading: false,
        user: null,
      },
    });

    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <PlaceCard offer={offer} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Test Offer')).toBeInTheDocument();
    expect(screen.getByText('€100')).toBeInTheDocument();
    expect(screen.getByText('apartment')).toBeInTheDocument();
    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('should render bookmark button when user is authorized', () => {
    const offer = createMockOffer({ isFavorite: false });

    const mockStore = mockStoreCreator({
      auth: {
        status: AuthorizationStatus.Auth,
        authorizationLoading: false,
        loginLoading: false,
        user: null,
      },
    });

    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <PlaceCard offer={offer} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should navigate to login page when bookmark button is clicked and user is not authorized', async () => {
    const user = userEvent.setup();
    const offer = createMockOffer();

    const mockStore = mockStoreCreator({
      auth: {
        status: AuthorizationStatus.NoAuth,
        authorizationLoading: false,
        loginLoading: false,
        user: null,
      },
    });

    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <PlaceCard offer={offer} />
        </MemoryRouter>
      </Provider>
    );

    const bookmarkButton = screen.getByRole('button');
    await user.click(bookmarkButton);

    expect(mockNavigate).toHaveBeenCalledWith(AppRoute.Login);
  });

  it('should render with favorites viewMode', () => {
    const offer = createMockOffer({ title: 'Favorite Offer' });

    const mockStore = mockStoreCreator({
      auth: {
        status: AuthorizationStatus.Auth,
        authorizationLoading: false,
        loginLoading: false,
        user: null,
      },
    });

    const { container } = render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <PlaceCard offer={offer} viewMode="favorites" />
        </MemoryRouter>
      </Provider>
    );

    expect(container.querySelector('.favorites__card')).toBeInTheDocument();
  });

  it('should dispatch setStatus action when bookmark button is clicked', async () => {
    const user = userEvent.setup();
    const offer = createMockOffer({ id: '1', isFavorite: false });

    const mockStore = mockStoreCreator({
      auth: {
        status: AuthorizationStatus.Auth,
        authorizationLoading: false,
        loginLoading: false,
        user: null,
      },
    });

    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <PlaceCard offer={offer} />
        </MemoryRouter>
      </Provider>
    );

    const bookmarkButton = screen.getByRole('button');
    await user.click(bookmarkButton);

    expect(store.dispatch).toHaveBeenCalledOnce();
  });

  it('should call onMouseEnter when mouse enters card', async () => {
    const user = userEvent.setup();
    const onMouseEnter = vi.fn();
    const offer = createMockOffer();

    const mockStore = mockStoreCreator({
      auth: {
        status: AuthorizationStatus.NoAuth,
        authorizationLoading: false,
        loginLoading: false,
        user: null,
      },
    });

    const { container } = render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <PlaceCard offer={offer} onMouseEnter={onMouseEnter} />
        </MemoryRouter>
      </Provider>
    );

    const card = container.querySelector('.place-card');
    if (card) {
      await user.hover(card);
      expect(onMouseEnter).toHaveBeenCalled();
    }
  });

  it('should call onMouseLeave when mouse leaves card', async () => {
    const user = userEvent.setup();
    const onMouseLeave = vi.fn();
    const offer = createMockOffer();

    const mockStore = mockStoreCreator({
      auth: {
        status: AuthorizationStatus.NoAuth,
        authorizationLoading: false,
        loginLoading: false,
        user: null,
      },
    });

    const { container } = render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <PlaceCard offer={offer} onMouseLeave={onMouseLeave} />
        </MemoryRouter>
      </Provider>
    );

    const card = container.querySelector('.place-card');
    if (card) {
      await user.hover(card);
      await user.unhover(card);
      expect(onMouseLeave).toHaveBeenCalled();
    }
  });
});
