import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { OffersList } from '../offers-list';
import { createMockOffer } from '../../../store/__tests__/test-utils';
import { AuthorizationStatus } from '../../../constants';
import { State } from '../../../types/state';

describe('OffersList', () => {
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

  it('should render correctly with offers', () => {
    const offers = [
      createMockOffer({ id: '1', title: 'Offer 1' }),
      createMockOffer({ id: '2', title: 'Offer 2' }),
    ];

    renderWithProviders(<OffersList offers={offers} />);

    expect(screen.getByText('Offer 1')).toBeInTheDocument();
    expect(screen.getByText('Offer 2')).toBeInTheDocument();
  });

  it('should render correctly with empty offers list', () => {
    const { container } = renderWithProviders(<OffersList offers={[]} />);

    expect(container.querySelector('.cities__places-list')).toBeInTheDocument();
  });

  it('should render with near-places viewMode', () => {
    const offers = [createMockOffer({ id: '1', title: 'Offer 1' })];

    const { container } = renderWithProviders(
      <OffersList offers={offers} viewMode="near-places" />
    );

    expect(container.querySelector('.near-places__list')).toBeInTheDocument();
  });
});
