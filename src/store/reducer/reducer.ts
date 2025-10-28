import { createReducer } from '@reduxjs/toolkit';
import { changeCity, loadOffersList } from '../action/action';
import { TOffer } from '../../types/offer';
import { offers } from '../../mocks/offers/offers';
import { CITIES } from '../../components/const/const';

type InitialState = {
  city: string;
  offersList: TOffer[];
};
const initialState: InitialState = {
  city: CITIES[0],
  offersList: [],
};

const reducer = createReducer(initialState, (builder) => {
  builder.addCase(changeCity, (state, action) => {
    state.city = action.payload ?? null;
  });
  builder.addCase(loadOffersList, (state) => {
    state.offersList = offers;
  });
});

export { reducer };
