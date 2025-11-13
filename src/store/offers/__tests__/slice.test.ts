import { describe, it, expect } from 'vitest';
import offersSlice from '../slice';
import { fetchList, fetchNearby } from '../actions';
import { setStatus } from '../../favorites/actions';
import { createMockOffer } from '../../__tests__/test-utils';

describe('offersSlice', () => {
  const initialState = offersSlice.getInitialState();

  it('should return initial state', () => {
    expect(initialState).toEqual({
      list: [],
      listLoading: false,
      nearby: [],
      nearbyLoading: false,
    });
  });

  describe('fetchList', () => {
    it('should set loading on pending', () => {
      const state = offersSlice.reducer(
        initialState,
        fetchList.pending('', undefined)
      );
      expect(state.listLoading).toBe(true);
    });

    it('should set list on fulfilled', () => {
      const offers = [
        createMockOffer({ id: '1' }),
        createMockOffer({ id: '2' }),
      ];
      const state = offersSlice.reducer(
        initialState,
        fetchList.fulfilled(offers, '', undefined)
      );
      expect(state.list).toEqual(offers);
      expect(state.listLoading).toBe(false);
    });

    it('should clear loading on rejected', () => {
      const state = offersSlice.reducer(
        initialState,
        fetchList.rejected(null, '', undefined)
      );
      expect(state.listLoading).toBe(false);
    });
  });

  describe('fetchNearby', () => {
    it('should set loading and clear nearby on pending', () => {
      const state = offersSlice.reducer(
        initialState,
        fetchNearby.pending('', '1')
      );
      expect(state.nearbyLoading).toBe(true);
      expect(state.nearby).toEqual([]);
    });

    it('should set nearby on fulfilled', () => {
      const nearbyOffers = [createMockOffer({ id: '3' })];
      const state = offersSlice.reducer(
        initialState,
        fetchNearby.fulfilled(nearbyOffers, '', '1')
      );
      expect(state.nearby).toEqual(nearbyOffers);
      expect(state.nearbyLoading).toBe(false);
    });

    it('should clear loading and nearby on rejected', () => {
      const state = offersSlice.reducer(
        initialState,
        fetchNearby.rejected(null, '', '1')
      );
      expect(state.nearbyLoading).toBe(false);
      expect(state.nearby).toEqual([]);
    });
  });

  describe('setStatus', () => {
    it('should update offer in list', () => {
      const offer1 = createMockOffer({ id: '1', isFavorite: false });
      const offer2 = createMockOffer({ id: '2', isFavorite: false });
      const stateWithOffers = offersSlice.reducer(
        initialState,
        fetchList.fulfilled([offer1, offer2], '', undefined)
      );
      const updatedOffer = { ...offer1, isFavorite: true };
      const state = offersSlice.reducer(
        stateWithOffers,
        setStatus.fulfilled(updatedOffer, '', {
          offerId: '1',
          isFavorite: true,
        })
      );
      expect(state.list[0].isFavorite).toBe(true);
      expect(state.list[1]).toEqual(offer2);
    });

    it('should update offer in nearby', () => {
      const nearbyOffer = createMockOffer({ id: '3', isFavorite: false });
      const stateWithNearby = offersSlice.reducer(
        initialState,
        fetchNearby.fulfilled([nearbyOffer], '', '1')
      );
      const updatedOffer = { ...nearbyOffer, isFavorite: true };
      const state = offersSlice.reducer(
        stateWithNearby,
        setStatus.fulfilled(updatedOffer, '', {
          offerId: '3',
          isFavorite: true,
        })
      );
      expect(state.nearby[0].isFavorite).toBe(true);
    });

    it('should ignore updates when offer not found', () => {
      const offer = createMockOffer({ id: '1' });
      const stateWithOffers = offersSlice.reducer(
        initialState,
        fetchList.fulfilled([offer], '', undefined)
      );
      const updatedOffer = createMockOffer({ id: '999', isFavorite: true });
      const state = offersSlice.reducer(
        stateWithOffers,
        setStatus.fulfilled(updatedOffer, '', {
          offerId: '999',
          isFavorite: true,
        })
      );
      expect(state.list).toEqual([offer]);
    });
  });
});
