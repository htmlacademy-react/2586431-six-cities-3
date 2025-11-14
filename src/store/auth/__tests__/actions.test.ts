import { describe, it, expect, beforeEach } from 'vitest';
import { configureMockStore } from '@jedmao/redux-mock-store';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import thunk from 'redux-thunk';
import { Action } from 'redux';
import {
  AppThunkDispatch,
  extractActionsTypes,
  createMockUser,
} from '../../__tests__/test-utils';
import { State } from '../../../types/state';
import { checkAuth, login, logout } from '../actions';
import { BASE_URL, AuthorizationStatus } from '../../../constants';

describe('Async actions', () => {
  const axiosInstance = axios.create({
    baseURL: BASE_URL,
  });
  const mockAxiosAdapter = new MockAdapter(axiosInstance);
  const middleware = [thunk.withExtraArgument(axiosInstance)];
  const mockStoreCreator = configureMockStore<
    State,
    Action<string>,
    AppThunkDispatch
  >(middleware);
  let store: ReturnType<typeof mockStoreCreator>;

  beforeEach(() => {
    store = mockStoreCreator({
      auth: {
        status: AuthorizationStatus.Unknown,
        authorizationLoading: false,
        loginLoading: false,
        logoutLoading: false,
        user: null,
      },
    } as State);
    mockAxiosAdapter.reset();
  });

  describe('checkAuth', () => {
    it('should dispatch "checkAuth.pending" and "checkAuth.fulfilled" when server response 200', async () => {
      const mockUser = createMockUser();
      mockAxiosAdapter.onGet('/login').reply(200, mockUser);

      await (store.dispatch(checkAuth()) as Promise<unknown>);
      const actions = extractActionsTypes(store.getActions());

      expect(actions).toEqual([
        checkAuth.pending.type,
        checkAuth.fulfilled.type,
      ]);
    });

    it('should dispatch "checkAuth.pending" and "checkAuth.rejected" when server response 400', async () => {
      mockAxiosAdapter.onGet('/login').reply(400);

      await (store.dispatch(checkAuth()) as Promise<unknown>);
      const actions = extractActionsTypes(store.getActions());

      expect(actions).toEqual([
        checkAuth.pending.type,
        checkAuth.rejected.type,
      ]);
    });
  });

  describe('login', () => {
    it('should dispatch "login.pending" and "login.fulfilled" when server response 200', async () => {
      const fakeUser = { email: 'test@test.ru', password: '123456' };
      const mockUser = createMockUser();
      mockAxiosAdapter.onPost('/login').reply(200, mockUser);

      await (store.dispatch(login(fakeUser)) as Promise<unknown>);
      const actions = extractActionsTypes(store.getActions());

      expect(actions).toEqual([login.pending.type, login.fulfilled.type]);
    });

    it('should dispatch "login.pending" and "login.rejected" when server response 400', async () => {
      const fakeUser = { email: 'test@test.ru', password: '123456' };
      mockAxiosAdapter.onPost('/login').reply(400);

      await (store.dispatch(login(fakeUser)) as Promise<unknown>);
      const actions = extractActionsTypes(store.getActions());

      expect(actions).toEqual([login.pending.type, login.rejected.type]);
    });
  });

  describe('logout', () => {
    it('should dispatch "logout.pending" and "logout.fulfilled" when server response 204', async () => {
      mockAxiosAdapter.onDelete('/logout').reply(204);

      await (store.dispatch(logout()) as Promise<unknown>);
      const actions = extractActionsTypes(store.getActions());

      expect(actions).toEqual([logout.pending.type, logout.fulfilled.type]);
    });

    it('should dispatch "logout.pending" and "logout.fulfilled" when intercepted is true', async () => {
      await (store.dispatch(logout({ intercepted: true })) as Promise<unknown>);
      const actions = extractActionsTypes(store.getActions());

      expect(actions).toEqual([logout.pending.type, logout.fulfilled.type]);
    });
  });
});
