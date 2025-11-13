import { describe, it, expect, beforeEach } from 'vitest';
import { configureMockStore } from '@jedmao/redux-mock-store';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import thunk from 'redux-thunk';
import { Action } from 'redux';
import { AppThunkDispatch, extractActionsTypes, createMockOffer } from '../../__tests__/test-utils';
import { State } from '../../../types/state';
import { fetchList, fetchNearby } from '../actions';
import { BASE_URL } from '../../../constants';

describe('Async actions', () => {
  const axiosInstance = axios.create({
    baseURL: BASE_URL,
  });
  const mockAxiosAdapter = new MockAdapter(axiosInstance);
  const middleware = [thunk.withExtraArgument(axiosInstance)];
  const mockStoreCreator = configureMockStore<State, Action<string>, AppThunkDispatch>(middleware);
  let store: ReturnType<typeof mockStoreCreator>;

  beforeEach(() => {
    store = mockStoreCreator({
      offers: {
        list: [],
        listLoading: false,
        nearby: [],
        nearbyLoading: false,
      },
    });
    mockAxiosAdapter.reset();
  });

  describe('fetchList', () => {
    it('should dispatch "fetchList.pending" and "fetchList.fulfilled" when server response 200', async () => {
      const mockOffers = [createMockOffer({ id: '1' }), createMockOffer({ id: '2' })];
      mockAxiosAdapter.onGet('/offers').reply(200, mockOffers);

      await (store.dispatch(fetchList()) as Promise<unknown>);

      const emittedActions = store.getActions();
      const extractedActionsTypes = extractActionsTypes(emittedActions);
      const fetchListFulfilled = emittedActions.at(1) as ReturnType<typeof fetchList.fulfilled>;

      expect(extractedActionsTypes).toEqual([
        fetchList.pending.type,
        fetchList.fulfilled.type,
      ]);

      expect(fetchListFulfilled.payload).toEqual(mockOffers);
    });

    it('should dispatch "fetchList.pending" and "fetchList.rejected" when server response 400', async () => {
      mockAxiosAdapter.onGet('/offers').reply(400);

      await (store.dispatch(fetchList()) as Promise<unknown>);
      const actions = extractActionsTypes(store.getActions());

      expect(actions).toEqual([
        fetchList.pending.type,
        fetchList.rejected.type,
      ]);
    });
  });

  describe('fetchNearby', () => {
    it('should dispatch "fetchNearby.pending" and "fetchNearby.fulfilled" when server response 200', async () => {
      const mockOffers = [createMockOffer({ id: '3' })];
      const offerId = '1';
      mockAxiosAdapter.onGet(`/offers/${offerId}/nearby`).reply(200, mockOffers);

      await (store.dispatch(fetchNearby(offerId)) as Promise<unknown>);

      const emittedActions = store.getActions();
      const extractedActionsTypes = extractActionsTypes(emittedActions);
      const fetchNearbyFulfilled = emittedActions.at(1) as ReturnType<typeof fetchNearby.fulfilled>;

      expect(extractedActionsTypes).toEqual([
        fetchNearby.pending.type,
        fetchNearby.fulfilled.type,
      ]);

      expect(fetchNearbyFulfilled.payload).toEqual(mockOffers);
    });

    it('should dispatch "fetchNearby.pending" and "fetchNearby.rejected" when server response 400', async () => {
      const offerId = '1';
      mockAxiosAdapter.onGet(`/offers/${offerId}/nearby`).reply(400);

      await (store.dispatch(fetchNearby(offerId)) as Promise<unknown>);
      const actions = extractActionsTypes(store.getActions());

      expect(actions).toEqual([
        fetchNearby.pending.type,
        fetchNearby.rejected.type,
      ]);
    });
  });
});

