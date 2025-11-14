import { describe, it, expect, beforeEach } from 'vitest';
import { configureMockStore } from '@jedmao/redux-mock-store';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import thunk from 'redux-thunk';
import { Action } from 'redux';
import {
  AppThunkDispatch,
  extractActionsTypes,
  createMockReview,
} from '../../__tests__/test-utils';
import { State } from '../../../types/state';
import { fetchList, postNew } from '../actions';
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
      reviews: {
        list: [],
        listLoading: false,
        postNewLoading: false,
      },
    });
    mockAxiosAdapter.reset();
  });

  describe('fetchList', () => {
    it('should dispatch "fetchList.pending" and "fetchList.fulfilled" when server response 200', async () => {
      const mockReviews = [
        createMockReview({ id: '1' }),
        createMockReview({ id: '2' }),
      ];
      const offerId = '1';
      mockAxiosAdapter.onGet(`/comments/${offerId}`).reply(200, mockReviews);

      await (store.dispatch(fetchList(offerId)) as Promise<unknown>);

      const emittedActions = store.getActions();
      const extractedActionsTypes = extractActionsTypes(emittedActions);
      const fetchListFulfilled = emittedActions.at(1) as ReturnType<
        typeof fetchList.fulfilled
      >;

      expect(extractedActionsTypes).toEqual([
        fetchList.pending.type,
        fetchList.fulfilled.type,
      ]);

      expect(fetchListFulfilled.payload).toEqual(mockReviews);
    });

    it('should dispatch "fetchList.pending" and "fetchList.rejected" when server response 400', async () => {
      const offerId = '1';
      mockAxiosAdapter.onGet(`/comments/${offerId}`).reply(400);

      await (store.dispatch(fetchList(offerId)) as Promise<unknown>);
      const actions = extractActionsTypes(store.getActions());

      expect(actions).toEqual([
        fetchList.pending.type,
        fetchList.rejected.type,
      ]);
    });
  });

  describe('postNew', () => {
    it('should dispatch "postNew.pending" and "postNew.fulfilled" when server response 200', async () => {
      const mockReview = createMockReview({ id: '3' });
      const offerId = '1';
      const commentData = { offerId, comment: 'Test comment', rating: 5 };
      mockAxiosAdapter.onPost(`/comments/${offerId}`).reply(200, mockReview);

      await (store.dispatch(postNew(commentData)) as Promise<unknown>);

      const emittedActions = store.getActions();
      const extractedActionsTypes = extractActionsTypes(emittedActions);
      const postNewFulfilled = emittedActions.at(1) as ReturnType<
        typeof postNew.fulfilled
      >;

      expect(extractedActionsTypes).toEqual([
        postNew.pending.type,
        postNew.fulfilled.type,
      ]);

      expect(postNewFulfilled.payload).toEqual(mockReview);
    });

    it('should dispatch "postNew.pending" and "postNew.rejected" when server response 400', async () => {
      const offerId = '1';
      const commentData = { offerId, comment: 'Test comment', rating: 5 };
      mockAxiosAdapter.onPost(`/comments/${offerId}`).reply(400);

      await (store.dispatch(postNew(commentData)) as Promise<unknown>);
      const actions = extractActionsTypes(store.getActions());

      expect(actions).toEqual([postNew.pending.type, postNew.rejected.type]);
    });
  });
});
