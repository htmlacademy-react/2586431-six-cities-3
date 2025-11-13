import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { MemoryRouter } from 'react-router-dom';
import PrivateRoute from '../private-route';
import { AuthorizationStatus, AppRoute } from '../../../constants';
import { State } from '../../../types/state';

describe('PrivateRoute', () => {
  const mockStoreCreator = configureMockStore<State>();

  it('should render children when user is authorized', () => {
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
          <PrivateRoute>
            <div>Protected Content</div>
          </PrivateRoute>
        </MemoryRouter>
      </Provider>
    );

    expect(container.textContent).toContain('Protected Content');
  });

  it('should redirect to login when user is not authorized', () => {
    const store = mockStoreCreator({
      auth: {
        status: AuthorizationStatus.NoAuth,
        authorizationLoading: false,
        loginLoading: false,
        user: null,
      },
    });

    const { container } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[AppRoute.Favorites]}>
          <PrivateRoute>
            <div>Protected Content</div>
          </PrivateRoute>
        </MemoryRouter>
      </Provider>
    );

    expect(container.textContent).not.toContain('Protected Content');
  });
});
