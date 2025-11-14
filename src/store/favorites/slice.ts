import { createSlice } from '@reduxjs/toolkit';
import { TFavoritesState } from './types';
import { fetchList, setStatus } from './actions';

const initialState: TFavoritesState = {
  list: undefined,
  listLoading: false,
  setStatusLoading: false,
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // fetchList
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

    // setStatus
    builder.addCase(setStatus.fulfilled, (state, action) => {
      state.setStatusLoading = false;
      if (!state.list) {
        return;
      }
      if (action.meta.arg.isFavorite) {
        if (state.list.some((offer) => offer.id === action.payload.id)) {
          return;
        }
        state.list.push(action.payload);
      } else {
        state.list = state.list.filter(
          (offer) => offer.id !== action.meta.arg.offerId
        );
      }
    });
    builder.addCase(setStatus.pending, (state) => {
      state.setStatusLoading = true;
    });
    builder.addCase(setStatus.rejected, (state) => {
      state.setStatusLoading = false;
    });
  },
});

export default favoritesSlice;
