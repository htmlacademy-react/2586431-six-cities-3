import { createSlice } from '@reduxjs/toolkit';
import { TReviewsState } from './types';
import { fetchList, postNew } from './actions';

const initialState: TReviewsState = {
  list: [],
  listLoading: false,
  postNewLoading: false,
};

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // fetchReviews
    builder.addCase(fetchList.fulfilled, (state, action) => {
      state.list = Array.from(action.payload).sort((a, b) =>
        a.date > b.date ? -1 : 1
      );
      state.listLoading = false;
    });
    builder.addCase(fetchList.pending, (state) => {
      state.listLoading = true;
      state.list = [];
    });
    builder.addCase(fetchList.rejected, (state) => {
      state.listLoading = false;
      state.list = [];
    });

    // postReview
    builder.addCase(postNew.fulfilled, (state, action) => {
      state.list.unshift(action.payload);
      state.postNewLoading = false;
    });
    builder.addCase(postNew.pending, (state) => {
      state.postNewLoading = true;
    });
    builder.addCase(postNew.rejected, (state) => {
      state.postNewLoading = false;
    });
  },
});

export default reviewsSlice;
