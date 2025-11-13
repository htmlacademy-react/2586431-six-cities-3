import { describe, it, expect } from 'vitest';
import authSlice from '../slice';
import { checkAuth, login, logout } from '../actions';
import { AuthorizationStatus } from '../../../constants';
import { createMockUser } from '../../__tests__/test-utils';

describe('authSlice', () => {
  const initialState = authSlice.getInitialState();

  it('should return initial state', () => {
    expect(initialState).toEqual({
      status: AuthorizationStatus.Unknown,
      authorizationLoading: false,
      loginLoading: false,
      logoutLoading: false,
      user: null,
    });
  });

  describe('checkAuth', () => {
    it('should set loading on pending', () => {
      const state = authSlice.reducer(
        initialState,
        checkAuth.pending('', undefined)
      );
      expect(state.authorizationLoading).toBe(true);
    });

    it('should set user and auth status on fulfilled', () => {
      const user = createMockUser();
      const state = authSlice.reducer(
        initialState,
        checkAuth.fulfilled(user, '', undefined)
      );
      expect(state.status).toBe(AuthorizationStatus.Auth);
      expect(state.user).toEqual(user);
      expect(state.authorizationLoading).toBe(false);
    });

    it('should clear user and set noAuth on rejected', () => {
      const state = authSlice.reducer(
        initialState,
        checkAuth.rejected(null, '', undefined)
      );
      expect(state.status).toBe(AuthorizationStatus.NoAuth);
      expect(state.authorizationLoading).toBe(false);
      expect(state.user).toBeNull();
    });
  });

  describe('login', () => {
    it('should set loading on pending', () => {
      const state = authSlice.reducer(
        initialState,
        login.pending('', { email: '', password: '' })
      );
      expect(state.loginLoading).toBe(true);
    });

    it('should set user and auth status on fulfilled', () => {
      const user = createMockUser();
      const state = authSlice.reducer(
        initialState,
        login.fulfilled(user, '', { email: '', password: '' })
      );
      expect(state.status).toBe(AuthorizationStatus.Auth);
      expect(state.user).toEqual(user);
      expect(state.loginLoading).toBe(false);
    });

    it('should clear loading on rejected', () => {
      const state = authSlice.reducer(
        initialState,
        login.rejected(null, '', { email: '', password: '' })
      );
      expect(state.loginLoading).toBe(false);
    });
  });

  describe('logout', () => {
    it('should set loading on pending', () => {
      const state = authSlice.reducer(
        initialState,
        logout.pending('', undefined)
      );
      expect(state.logoutLoading).toBe(true);
    });

    it('should clear user and set noAuth on fulfilled', () => {
      const user = createMockUser();
      const stateWithUser = authSlice.reducer(
        initialState,
        login.fulfilled(user, '', { email: '', password: '' })
      );
      const state = authSlice.reducer(
        stateWithUser,
        logout.fulfilled(undefined, '', undefined)
      );
      expect(state.status).toBe(AuthorizationStatus.NoAuth);
      expect(state.logoutLoading).toBe(false);
      expect(state.user).toBeNull();
    });

    it('should clear user and reset status on rejected', () => {
      const state = authSlice.reducer(
        initialState,
        logout.rejected(null, '', undefined)
      );
      expect(state.status).toBe(AuthorizationStatus.Unknown);
      expect(state.logoutLoading).toBe(false);
      expect(state.user).toBeNull();
    });
  });
});
