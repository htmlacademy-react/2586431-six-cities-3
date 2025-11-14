import { createSlice } from '@reduxjs/toolkit';
import { TOffersState } from './types';
import { fetchList, fetchNearby } from './actions';
import { setStatus } from '../favorites/actions';

const initialState: TOffersState = {
  list: [],
  listLoading: false,
  nearby: [],
  nearbyLoading: false,
};

const offersSlice = createSlice({
  name: 'offers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // offersList
    builder.addCase(fetchList.fulfilled, (state, action) => {
      state.list = action.payload;
      state.listLoading = false;
    });
    builder.addCase(fetchList.pending, (state) => {
      state.listLoading = true;
    });
    builder.addCase(fetchList.rejected, (state) => {
      state.listLoading = false;
    });

    // offersNearby
    builder.addCase(fetchNearby.fulfilled, (state, action) => {
      state.nearbyLoading = false;
      state.nearby = action.payload;
    });
    builder.addCase(fetchNearby.pending, (state) => {
      state.nearbyLoading = true;
      state.nearby = [];
    });
    builder.addCase(fetchNearby.rejected, (state) => {
      state.nearbyLoading = false;
      state.nearby = [];
    });

    builder.addCase(setStatus.fulfilled, (state, action) => {
      const updatedOffer = action.payload;
      const { offerId } = action.meta.arg;

      const offerIndex = state.list.findIndex((offer) => offer.id === offerId);
      if (offerIndex !== -1) {
        state.list[offerIndex] = updatedOffer;
      }

      const nearbyIndex = state.nearby.findIndex(
        (offer) => offer.id === offerId
      );
      if (nearbyIndex !== -1) {
        state.nearby[nearbyIndex] = updatedOffer;
      }
    });
  },
});

export default offersSlice;
