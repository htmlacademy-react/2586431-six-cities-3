import { describe, it, expect } from 'vitest';
import favoritesSlice from '../slice';
import { fetchList, setStatus } from '../actions';
import { createMockOffer } from '../../__tests__/test-utils';

describe('favoritesSlice', () => {
  const initialState = favoritesSlice.getInitialState();

  it('should return initial state', () => {
    expect(initialState).toEqual({
      list: undefined,
      listLoading: false,
      setStatusLoading: false,
    });
  });

  describe('fetchList', () => {
    it('should set loading on pending', () => {
      const state = favoritesSlice.reducer(
        initialState,
        fetchList.pending('', undefined)
      );
      expect(state.listLoading).toBe(true);
    });

    it('should set list on fulfilled', () => {
      const favorites = [createMockOffer({ id: '1', isFavorite: true })];
      const state = favoritesSlice.reducer(
        initialState,
        fetchList.fulfilled(favorites, '', undefined)
      );
      expect(state.list).toEqual(favorites);
      expect(state.listLoading).toBe(false);
    });

    it('should clear loading on rejected', () => {
      const state = favoritesSlice.reducer(
        initialState,
        fetchList.rejected(null, '', undefined)
      );
      expect(state.listLoading).toBe(false);
    });
  });

  describe('setStatus', () => {
    it('should set loading on pending', () => {
      const state = favoritesSlice.reducer(
        initialState,
        setStatus.pending('', { offerId: '1', isFavorite: true })
      );
      expect(state.setStatusLoading).toBe(true);
    });

    it('should add offer when favoriting', () => {
      const offer = createMockOffer({ id: '1', isFavorite: true });
      const stateWithList = favoritesSlice.reducer(
        initialState,
        fetchList.fulfilled([], '', undefined)
      );
      const state = favoritesSlice.reducer(
        stateWithList,
        setStatus.fulfilled(offer, '', { offerId: '1', isFavorite: true })
      );
      expect(state.list).toContainEqual(offer);
      expect(state.setStatusLoading).toBe(false);
    });

    it('should remove offer when unfavoriting', () => {
      const offer1 = createMockOffer({ id: '1', isFavorite: true });
      const offer2 = createMockOffer({ id: '2', isFavorite: true });
      const stateWithList = favoritesSlice.reducer(
        initialState,
        fetchList.fulfilled([offer1, offer2], '', undefined)
      );
      const updatedOffer = { ...offer1, isFavorite: false };
      const state = favoritesSlice.reducer(
        stateWithList,
        setStatus.fulfilled(updatedOffer, '', {
          offerId: '1',
          isFavorite: false,
        })
      );
      expect(state.list).toEqual([offer2]);
    });

    it('should prevent duplicate offers', () => {
      const offer = createMockOffer({ id: '1', isFavorite: true });
      const stateWithList = favoritesSlice.reducer(
        initialState,
        fetchList.fulfilled([offer], '', undefined)
      );
      const state = favoritesSlice.reducer(
        stateWithList,
        setStatus.fulfilled(offer, '', { offerId: '1', isFavorite: true })
      );
      expect(state.list).toHaveLength(1);
    });

    it('should ignore updates when list is undefined', () => {
      const offer = createMockOffer({ id: '1', isFavorite: true });
      const state = favoritesSlice.reducer(
        initialState,
        setStatus.fulfilled(offer, '', { offerId: '1', isFavorite: true })
      );
      expect(state.list).toBeUndefined();
      expect(state.setStatusLoading).toBe(false);
    });

    it('should clear loading on rejected', () => {
      const state = favoritesSlice.reducer(
        initialState,
        setStatus.rejected(null, '', { offerId: '1', isFavorite: true })
      );
      expect(state.setStatusLoading).toBe(false);
    });
  });
});
