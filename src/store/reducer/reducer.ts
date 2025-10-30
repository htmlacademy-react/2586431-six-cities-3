import { createReducer } from '@reduxjs/toolkit';
import { changeCity, changeSort, loadOffersList } from '../action/action';
import { TOffer } from '../../types/offer';
import { offers } from '../../mocks/offers/offers';
import { CITIES, USortingOptionValue } from '../../components/const/const';

type InitialState = {
  city: string;
  sort: USortingOptionValue;
  offersList: TOffer[];
};
const initialState: InitialState = {
  city: CITIES[0],
  sort: 'popular',
  offersList: [],
};

const reducer = createReducer(initialState, (builder) => {
  builder.addCase(changeCity, (state, action) => {
    state.city = action.payload ?? null;
  });
  builder.addCase(loadOffersList, (state) => {
    state.offersList = offers;
  });
  builder.addCase(changeSort, (state, action) => {
    state.sort = action.payload ?? 'popular';
  });
});

export { reducer };
