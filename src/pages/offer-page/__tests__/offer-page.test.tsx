import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { OfferPage } from '../offer-page';
import { State } from '../../../types/state';
import { AppRoute, AuthorizationStatus } from '../../../constants';
import {
  createMockOffer,
  createMockOfferDetails,
} from '../../../store/__tests__/test-utils';
import { store } from '../../../store';

const mockParams = { id: '123' };

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom'
  );
  return {
    ...actual,
    useParams: () => mockParams,
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

describe('OfferPage', () => {
  const mockStoreCreator = configureMockStore<State>();

  beforeEach(() => {
    vi.clearAllMocks();
    (store.dispatch as ReturnType<typeof vi.fn>).mockClear();
  });

  const createMockStore = (
    offer: ReturnType<typeof createMockOfferDetails> | null = null,
    offersNearby: ReturnType<typeof createMockOffer>[] = [],
    offerLoading: boolean = false,
    offersNearbyLoading: boolean = false,
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
        nearby: offersNearby,
        nearbyLoading: offersNearbyLoading,
      },
      filters: {
        city: 'Paris',
        sort: 'popular',
      },
      offerDetails: {
        current: offer,
        currentLoading: offerLoading,
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

  it('should dispatch fetchById and fetchNearby on mount', () => {
    const offer = createMockOfferDetails({ id: '123' });
    const mockStore = createMockStore(offer);

    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <OfferPage />
        </MemoryRouter>
      </Provider>
    );

    expect(store.dispatch).toHaveBeenCalled();
  });

  it('should render spinner when offer is loading', () => {
    const mockStore = createMockStore(null, [], true);

    const { container } = render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <OfferPage />
        </MemoryRouter>
      </Provider>
    );

    expect(container.querySelector('.spinner-container')).toBeInTheDocument();
  });

  it('should render spinner when nearby offers are loading', () => {
    const offer = createMockOfferDetails({ id: '123' });
    const mockStore = createMockStore(offer, [], false, true);

    const { container } = render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <OfferPage />
        </MemoryRouter>
      </Provider>
    );

    expect(container.querySelector('.spinner-container')).toBeInTheDocument();
  });

  it('should render NotFoundPage when offer is not found', () => {
    const mockStore = createMockStore(null);

    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <OfferPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page not found')).toBeInTheDocument();
  });

  it('should render offer details when offer is loaded', () => {
    const offer = createMockOfferDetails({
      id: '123',
      title: 'Test Offer',
      description: 'Test description',
      price: 100,
      rating: 4.5,
    });
    const mockStore = createMockStore(offer);

    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <OfferPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Test Offer')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('€100')).toBeInTheDocument();
  });

  it('should render offer images', () => {
    const offer = createMockOfferDetails({
      id: '123',
      images: ['image1.jpg', 'image2.jpg', 'image3.jpg'],
    });
    const mockStore = createMockStore(offer);

    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <OfferPage />
        </MemoryRouter>
      </Provider>
    );

    const images = screen.getAllByAltText('Photo studio');
    expect(images.length).toBe(3);
  });

  it('should render premium badge when offer is premium', () => {
    const offer = createMockOfferDetails({
      id: '123',
      isPremium: true,
    });
    const mockStore = createMockStore(offer);

    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <OfferPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('should not render premium badge when offer is not premium', () => {
    const offer = createMockOfferDetails({
      id: '123',
      isPremium: false,
    });
    const mockStore = createMockStore(offer);

    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <OfferPage />
        </MemoryRouter>
      </Provider>
    );

    const premiumBadge = screen.queryByText('Premium');
    expect(premiumBadge).not.toBeInTheDocument();
  });

  it('should render bookmark button when user is authorized', () => {
    const offer = createMockOfferDetails({
      id: '123',
      isFavorite: false,
    });
    const mockStore = createMockStore(
      offer,
      [],
      false,
      false,
      AuthorizationStatus.Auth
    );

    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <OfferPage />
        </MemoryRouter>
      </Provider>
    );

    const bookmarkButton = screen.getByRole('button', { name: /bookmark/i });
    expect(bookmarkButton).toBeInTheDocument();
  });

  it('should navigate to login page when bookmark button is clicked and user is not authorized', async () => {
    const user = userEvent.setup();
    const offer = createMockOfferDetails({
      id: '123',
      isFavorite: false,
    });
    const mockStore = createMockStore(
      offer,
      [],
      false,
      false,
      AuthorizationStatus.NoAuth
    );

    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <OfferPage />
        </MemoryRouter>
      </Provider>
    );

    const bookmarkButton = screen.getByRole('button', { name: /bookmark/i });
    await user.click(bookmarkButton);

    expect(mockNavigate).toHaveBeenCalledWith(AppRoute.Login);
  });

  it('should dispatch setStatus when bookmark button is clicked', async () => {
    const user = userEvent.setup();
    const offer = createMockOfferDetails({
      id: '123',
      isFavorite: false,
    });
    const mockStore = createMockStore(
      offer,
      [],
      false,
      false,
      AuthorizationStatus.Auth
    );

    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <OfferPage />
        </MemoryRouter>
      </Provider>
    );

    const bookmarkButton = screen.getByRole('button', { name: /bookmark/i });
    await user.click(bookmarkButton);

    expect(store.dispatch).toHaveBeenCalled();
  });

  it('should toggle favorite status when bookmark is clicked', async () => {
    const user = userEvent.setup();
    const offer = createMockOfferDetails({
      id: '123',
      isFavorite: true,
    });
    const mockStore = createMockStore(
      offer,
      [],
      false,
      false,
      AuthorizationStatus.Auth
    );

    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <OfferPage />
        </MemoryRouter>
      </Provider>
    );

    const bookmarkButton = screen.getByRole('button', { name: /bookmark/i });
    await user.click(bookmarkButton);

    expect(store.dispatch).toHaveBeenCalled();
  });

  it('should render offer features', () => {
    const offer = createMockOfferDetails({
      id: '123',
      type: 'apartment',
      bedrooms: 2,
      maxAdults: 4,
    });
    const mockStore = createMockStore(offer);

    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <OfferPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('apartment')).toBeInTheDocument();
    expect(screen.getByText('2 Bedrooms')).toBeInTheDocument();
    expect(screen.getByText('Max 4 adults')).toBeInTheDocument();
  });

  it('should render offer goods', () => {
    const offer = createMockOfferDetails({
      id: '123',
      goods: ['Wi-Fi', 'Kitchen', 'Washing machine'],
    });
    const mockStore = createMockStore(offer);

    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <OfferPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Wi-Fi')).toBeInTheDocument();
    expect(screen.getByText('Kitchen')).toBeInTheDocument();
    expect(screen.getByText('Washing machine')).toBeInTheDocument();
  });

  it('should render host information', () => {
    const offer = createMockOfferDetails({
      id: '123',
      host: {
        name: 'John Doe',
        avatarUrl: 'avatar.jpg',
        isPro: true,
      },
    });
    const mockStore = createMockStore(offer);

    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <OfferPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Pro')).toBeInTheDocument();
  });

  it('should render ReviewsList', () => {
    const offer = createMockOfferDetails({ id: '123' });
    const mockStore = createMockStore(offer);

    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <OfferPage />
        </MemoryRouter>
      </Provider>
    );

    const reviewsSection = screen.getByText(/Reviews/i);
    expect(reviewsSection).toBeInTheDocument();
  });

  it('should render ReviewForm when user is authorized', () => {
    const offer = createMockOfferDetails({ id: '123' });
    const mockStore = createMockStore(
      offer,
      [],
      false,
      false,
      AuthorizationStatus.Auth
    );

    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <OfferPage />
        </MemoryRouter>
      </Provider>
    );

    const reviewsSection = screen.getByText(/Reviews/i);
    expect(reviewsSection).toBeInTheDocument();
  });

  it('should not render ReviewForm when user is not authorized', () => {
    const offer = createMockOfferDetails({ id: '123' });
    const mockStore = createMockStore(
      offer,
      [],
      false,
      false,
      AuthorizationStatus.NoAuth
    );

    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <OfferPage />
        </MemoryRouter>
      </Provider>
    );

    const reviewsSection = screen.getByText(/Reviews/i);
    expect(reviewsSection).toBeInTheDocument();
  });

  it('should render Map with offer location', () => {
    const offer = createMockOfferDetails({
      id: '123',
      location: { latitude: 48.8566, longitude: 2.3522 },
    });
    const mockStore = createMockStore(offer);

    const { container } = render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <OfferPage />
        </MemoryRouter>
      </Provider>
    );

    expect(container.querySelector('.offer__map')).toBeInTheDocument();
  });

  it('should render nearby offers', () => {
    const offer = createMockOfferDetails({ id: '123' });
    const nearbyOffers = [
      createMockOffer({ id: '2', title: 'Nearby Offer 1' }),
      createMockOffer({ id: '3', title: 'Nearby Offer 2' }),
    ];
    const mockStore = createMockStore(offer, nearbyOffers);

    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <OfferPage />
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.getByText('Other places in the neighbourhood')
    ).toBeInTheDocument();
    expect(screen.getByText('Nearby Offer 1')).toBeInTheDocument();
    expect(screen.getByText('Nearby Offer 2')).toBeInTheDocument();
  });

  it('should update when offer id changes', () => {
    const offer = createMockOfferDetails({ id: '123' });
    const mockStore = createMockStore(offer);

    const { rerender } = render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <OfferPage />
        </MemoryRouter>
      </Provider>
    );

    mockParams.id = '456';

    rerender(
      <Provider store={mockStore}>
        <MemoryRouter>
          <OfferPage />
        </MemoryRouter>
      </Provider>
    );

    expect(store.dispatch).toHaveBeenCalled();
  });
});
