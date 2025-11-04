import { createReducer } from '@reduxjs/toolkit';
import { changeCity, changeSort } from './actions';
import { loadOffersList } from './api-actions';
import { TOffer } from '../types/offer';
import { CITIES, USortingOptionValue } from '../constants';

type InitialState = {
  city: string;
  sort: USortingOptionValue;
  offersList: TOffer[];
  offersListLoading: boolean;
};
const initialState: InitialState = {
  city: CITIES[0],
  sort: 'popular',
  offersList: [],
  offersListLoading: false,
};

const reducer = createReducer(initialState, (builder) => {
  builder.addCase(changeCity, (state, action) => {
    state.city = action.payload ?? null;
  });
  builder.addCase(loadOffersList.fulfilled, (state, action) => {
    state.offersList = action.payload;
    state.offersListLoading = false;
  });
  builder.addCase(loadOffersList.pending, (state) => {
    state.offersListLoading = true;
  });
  builder.addCase(loadOffersList.rejected, (state) => {
    state.offersListLoading = false;
  });
  builder.addCase(changeSort, (state, action) => {
    state.sort = action.payload ?? 'popular';
  });
});

export { reducer };
