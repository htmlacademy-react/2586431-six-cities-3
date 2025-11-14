import { describe, it, expect } from 'vitest';
import reviewsSlice from '../slice';
import { fetchList, postNew } from '../actions';
import { createMockReview } from '../../__tests__/test-utils';

describe('reviewsSlice', () => {
  const initialState = reviewsSlice.getInitialState();

  it('should return initial state', () => {
    expect(initialState).toEqual({
      list: [],
      listLoading: false,
      postNewLoading: false,
    });
  });

  describe('fetchList', () => {
    it('should set loading and clear list on pending', () => {
      const state = reviewsSlice.reducer(
        initialState,
        fetchList.pending('', '1')
      );
      expect(state.listLoading).toBe(true);
      expect(state.list).toEqual([]);
    });

    it('should set list on fulfilled', () => {
      const reviews = [
        createMockReview({ id: '1' }),
        createMockReview({ id: '2' }),
      ];
      const state = reviewsSlice.reducer(
        initialState,
        fetchList.fulfilled(reviews, '', '1')
      );
      expect(state.list).toEqual(reviews);
      expect(state.listLoading).toBe(false);
    });

    it('should clear loading and list on rejected', () => {
      const state = reviewsSlice.reducer(
        initialState,
        fetchList.rejected(null, '', '1')
      );
      expect(state.listLoading).toBe(false);
      expect(state.list).toEqual([]);
    });
  });

  describe('postNew', () => {
    it('should set loading on pending', () => {
      const state = reviewsSlice.reducer(
        initialState,
        postNew.pending('', { comment: '', rating: 5, offerId: '1' })
      );
      expect(state.postNewLoading).toBe(true);
    });

    it('should append review on fulfilled', () => {
      const existingReview = createMockReview({ id: '1' });
      const stateWithReviews = reviewsSlice.reducer(
        initialState,
        fetchList.fulfilled([existingReview], '', '1')
      );
      const newReview = createMockReview({ id: '2' });
      const state = reviewsSlice.reducer(
        stateWithReviews,
        postNew.fulfilled(newReview, '', {
          comment: '',
          rating: 5,
          offerId: '1',
        })
      );
      expect(state.list).toEqual([existingReview, newReview]);
      expect(state.postNewLoading).toBe(false);
    });

    it('should clear loading on rejected', () => {
      const state = reviewsSlice.reducer(
        initialState,
        postNew.rejected(null, '', { comment: '', rating: 5, offerId: '1' })
      );
      expect(state.postNewLoading).toBe(false);
    });
  });
});
