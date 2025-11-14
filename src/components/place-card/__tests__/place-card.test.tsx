import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { PlaceCard } from '../place-card';
import { createMockOffer } from '../../../store/__tests__/test-utils';
import { AuthorizationStatus } from '../../../constants';
import { State } from '../../../types/state';

describe('PlaceCard', () => {
  const mockStoreCreator = configureMockStore<State>();

  it('should render correctly', () => {
    const offer = createMockOffer({
      id: '1',
      title: 'Test Offer',
      price: 100,
      rating: 4.5,
      type: 'apartment',
      isPremium: true,
    });

    const store = mockStoreCreator({
      auth: {
        status: AuthorizationStatus.Auth,
        authorizationLoading: false,
        loginLoading: false,
        user: null,
      },
    });

    render(
      <Provider store={store}>
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

    const store = mockStoreCreator({
      auth: {
        status: AuthorizationStatus.Auth,
        authorizationLoading: false,
        loginLoading: false,
        user: null,
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <PlaceCard offer={offer} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should not render bookmark button when user is not authorized', () => {
    const offer = createMockOffer();

    const store = mockStoreCreator({
      auth: {
        status: AuthorizationStatus.NoAuth,
        authorizationLoading: false,
        loginLoading: false,
        user: null,
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <PlaceCard offer={offer} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should render with favorites viewMode', () => {
    const offer = createMockOffer({ title: 'Favorite Offer' });

    const store = mockStoreCreator({
      auth: {
        status: AuthorizationStatus.Auth,
        authorizationLoading: false,
        loginLoading: false,
        user: null,
      },
    });

    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <PlaceCard offer={offer} viewMode="favorites" />
        </MemoryRouter>
      </Provider>
    );

    expect(container.querySelector('.favorites__card')).toBeInTheDocument();
  });
});
