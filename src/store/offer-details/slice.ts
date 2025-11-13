import { createSlice } from '@reduxjs/toolkit';
import { TOfferDetailsState } from './types';
import { fetchById } from './actions';

const initialState: TOfferDetailsState = {
  current: null,
  currentLoading: false,
};

const offerDetailsSlice = createSlice({
  name: 'offerDetails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchById.fulfilled, (state, action) => {
      state.currentLoading = false;
      state.current = action.payload;
    });
    builder.addCase(fetchById.pending, (state) => {
      state.currentLoading = true;
      state.current = null;
    });
    builder.addCase(fetchById.rejected, (state) => {
      state.currentLoading = false;
      state.current = null;
    });
  },
});

export default offerDetailsSlice;
