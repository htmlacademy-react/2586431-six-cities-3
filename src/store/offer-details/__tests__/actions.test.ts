import { describe, it, expect, beforeEach } from 'vitest';
import { configureMockStore } from '@jedmao/redux-mock-store';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import thunk from 'redux-thunk';
import { Action } from 'redux';
import {
  AppThunkDispatch,
  extractActionsTypes,
  createMockOfferDetails,
} from '../../__tests__/test-utils';
import { State } from '../../../types/state';
import { fetchById } from '../actions';
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
      offerDetails: {
        current: null,
        currentLoading: false,
      },
    });
    mockAxiosAdapter.reset();
  });

  describe('fetchById', () => {
    it('should dispatch "fetchById.pending" and "fetchById.fulfilled" when server response 200', async () => {
      const mockOfferDetails = createMockOfferDetails({ id: '1' });
      const offerId = '1';
      mockAxiosAdapter.onGet(`/offers/${offerId}`).reply(200, mockOfferDetails);

      await (store.dispatch(fetchById(offerId)) as Promise<unknown>);

      const emittedActions = store.getActions();
      const extractedActionsTypes = extractActionsTypes(emittedActions);
      const fetchByIdFulfilled = emittedActions.at(1) as ReturnType<
        typeof fetchById.fulfilled
      >;

      expect(extractedActionsTypes).toEqual([
        fetchById.pending.type,
        fetchById.fulfilled.type,
      ]);

      expect(fetchByIdFulfilled.payload).toEqual(mockOfferDetails);
    });

    it('should dispatch "fetchById.pending" and "fetchById.rejected" when server response 400', async () => {
      const offerId = '1';
      mockAxiosAdapter.onGet(`/offers/${offerId}`).reply(400);

      await (store.dispatch(fetchById(offerId)) as Promise<unknown>);
      const actions = extractActionsTypes(store.getActions());

      expect(actions).toEqual([
        fetchById.pending.type,
        fetchById.rejected.type,
      ]);
    });
  });
});
