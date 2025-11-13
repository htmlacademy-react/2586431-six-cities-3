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
      state.list = action.payload;
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
      state.list.push(action.payload);
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
