import { createSlice } from '@reduxjs/toolkit';
import { TOffersState } from './types';
import { fetchList, fetchNearby } from './actions';

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
  },
});

export default offersSlice;
