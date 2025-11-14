import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { FavoritesLocation } from '../favorites-location';
import { createMockOffer } from '../../../store/__tests__/test-utils';
import { AuthorizationStatus } from '../../../constants';
import { State } from '../../../types/state';

describe('FavoritesLocation', () => {
  const mockStoreCreator = configureMockStore<State>();

  const renderWithProviders = (component: JSX.Element) => {
    const store = mockStoreCreator({
      auth: {
        status: AuthorizationStatus.NoAuth,
        authorizationLoading: false,
        loginLoading: false,
        user: null,
      },
    });

    return render(
      <Provider store={store}>
        <MemoryRouter>{component}</MemoryRouter>
      </Provider>
    );
  };

  it('should render correctly with location name and offers', () => {
    const offers = [
      createMockOffer({ id: '1', title: 'Offer 1' }),
      createMockOffer({ id: '2', title: 'Offer 2' }),
    ];

    renderWithProviders(<FavoritesLocation name="Paris" offers={offers} />);

    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(screen.getByText('Offer 1')).toBeInTheDocument();
    expect(screen.getByText('Offer 2')).toBeInTheDocument();
  });

  it('should render correctly with empty offers list', () => {
    renderWithProviders(<FavoritesLocation name="Amsterdam" offers={[]} />);

    expect(screen.getByText('Amsterdam')).toBeInTheDocument();
  });
});
