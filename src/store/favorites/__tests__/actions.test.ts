import { describe, it, expect, beforeEach } from 'vitest';
import { configureMockStore } from '@jedmao/redux-mock-store';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import thunk from 'redux-thunk';
import { Action } from 'redux';
import {
  AppThunkDispatch,
  extractActionsTypes,
  createMockOffer,
} from '../../__tests__/test-utils';
import { State } from '../../../types/state';
import { fetchList, setStatus } from '../actions';
import { BASE_URL } from '../../../constants';

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
      favorites: {
        list: [],
        listLoading: false,
      },
    });
    mockAxiosAdapter.reset();
  });

  describe('fetchList', () => {
    it('should dispatch "fetchList.pending" and "fetchList.fulfilled" when server response 200', async () => {
      const mockOffers = [
        createMockOffer({ id: '1', isFavorite: true }),
        createMockOffer({ id: '2', isFavorite: true }),
      ];
      mockAxiosAdapter.onGet('/favorite').reply(200, mockOffers);

      await (store.dispatch(fetchList()) as Promise<unknown>);

      const emittedActions = store.getActions();
      const extractedActionsTypes = extractActionsTypes(emittedActions);
      const fetchListFulfilled = emittedActions.at(1) as ReturnType<
        typeof fetchList.fulfilled
      >;

      expect(extractedActionsTypes).toEqual([
        fetchList.pending.type,
        fetchList.fulfilled.type,
      ]);

      expect(fetchListFulfilled.payload).toEqual(mockOffers);
    });

    it('should dispatch "fetchList.pending" and "fetchList.rejected" when server response 400', async () => {
      mockAxiosAdapter.onGet('/favorite').reply(400);

      await (store.dispatch(fetchList()) as Promise<unknown>);
      const actions = extractActionsTypes(store.getActions());

      expect(actions).toEqual([
        fetchList.pending.type,
        fetchList.rejected.type,
      ]);
    });
  });

  describe('setStatus', () => {
    it('should dispatch "setStatus.pending" and "setStatus.fulfilled" when server response 200', async () => {
      const mockOffer = createMockOffer({ id: '1', isFavorite: true });
      const statusData = { offerId: '1', isFavorite: true };
      mockAxiosAdapter.onPost('/favorite/1/1').reply(200, mockOffer);

      await (store.dispatch(setStatus(statusData)) as Promise<unknown>);

      const emittedActions = store.getActions();
      const extractedActionsTypes = extractActionsTypes(emittedActions);
      const setStatusFulfilled = emittedActions.at(1) as ReturnType<
        typeof setStatus.fulfilled
      >;

      expect(extractedActionsTypes).toEqual([
        setStatus.pending.type,
        setStatus.fulfilled.type,
      ]);

      expect(setStatusFulfilled.payload).toEqual(mockOffer);
    });

    it('should dispatch "setStatus.pending" and "setStatus.rejected" when server response 400', async () => {
      const statusData = { offerId: '1', isFavorite: true };
      mockAxiosAdapter.onPost('/favorite/1/1').reply(400);

      await (store.dispatch(setStatus(statusData)) as Promise<unknown>);
      const actions = extractActionsTypes(store.getActions());

      expect(actions).toEqual([
        setStatus.pending.type,
        setStatus.rejected.type,
      ]);
    });
  });
});
