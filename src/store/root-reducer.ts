import { combineReducers } from '@reduxjs/toolkit';
import { offersSlice } from './offers';
import { filtersSlice } from './filters';
import { offerDetailsSlice } from './offer-details';
import { reviewsSlice } from './reviews';
import { authSlice } from './auth';

export const rootReducer = combineReducers({
  filters: filtersSlice.reducer,
  offers: offersSlice.reducer,
  offerDetails: offerDetailsSlice.reducer,
  reviews: reviewsSlice.reducer,
  auth: authSlice.reducer,
});
