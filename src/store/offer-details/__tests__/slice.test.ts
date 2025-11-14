import { describe, it, expect } from 'vitest';
import offerDetailsSlice from '../slice';
import { fetchById } from '../actions';
import { setStatus } from '../../favorites/actions';
import {
  createMockOfferDetails,
  createMockOffer,
} from '../../__tests__/test-utils';

describe('offerDetailsSlice', () => {
  const initialState = offerDetailsSlice.getInitialState();

  it('should return initial state', () => {
    expect(initialState).toEqual({
      current: null,
      currentLoading: false,
    });
  });

  describe('fetchById', () => {
    it('should set loading and clear current on pending', () => {
      const state = offerDetailsSlice.reducer(
        initialState,
        fetchById.pending('', '1')
      );
      expect(state.currentLoading).toBe(true);
      expect(state.current).toBeNull();
    });

    it('should set offer on fulfilled', () => {
      const offer = createMockOfferDetails({ id: '1' });
      const state = offerDetailsSlice.reducer(
        initialState,
        fetchById.fulfilled(offer, '', '1')
      );
      expect(state.current).toEqual(offer);
      expect(state.currentLoading).toBe(false);
    });

    it('should clear loading and current on rejected', () => {
      const state = offerDetailsSlice.reducer(
        initialState,
        fetchById.rejected(null, '', '1')
      );
      expect(state.currentLoading).toBe(false);
      expect(state.current).toBeNull();
    });
  });

  describe('setStatus', () => {
    it('should update favorite status when offer matches', () => {
      const offer = createMockOfferDetails({ id: '1', isFavorite: false });
      const stateWithOffer = offerDetailsSlice.reducer(
        initialState,
        fetchById.fulfilled(offer, '', '1')
      );
      const updatedOffer = createMockOffer({ id: '1', isFavorite: true });
      const state = offerDetailsSlice.reducer(
        stateWithOffer,
        setStatus.fulfilled(updatedOffer, '', {
          offerId: '1',
          isFavorite: true,
        })
      );
      expect(state.current?.isFavorite).toBe(true);
    });

    it('should ignore updates when offer id does not match', () => {
      const offer = createMockOfferDetails({ id: '1', isFavorite: false });
      const stateWithOffer = offerDetailsSlice.reducer(
        initialState,
        fetchById.fulfilled(offer, '', '1')
      );
      const updatedOffer = createMockOffer({ id: '999', isFavorite: true });
      const state = offerDetailsSlice.reducer(
        stateWithOffer,
        setStatus.fulfilled(updatedOffer, '', {
          offerId: '999',
          isFavorite: true,
        })
      );
      expect(state.current?.isFavorite).toBe(false);
    });

    it('should ignore updates when current is null', () => {
      const updatedOffer = createMockOffer({ id: '1', isFavorite: true });
      const state = offerDetailsSlice.reducer(
        initialState,
        setStatus.fulfilled(updatedOffer, '', {
          offerId: '1',
          isFavorite: true,
        })
      );
      expect(state.current).toBeNull();
    });
  });
});
