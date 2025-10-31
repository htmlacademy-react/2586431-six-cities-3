import { createAction } from '@reduxjs/toolkit';
import { USortingOptionValue } from '../../components/const/const';

export const changeCity = createAction<string>('city/change');
export const loadOffersList = createAction('offers/load');
export const changeSort = createAction<USortingOptionValue | undefined>(
  'sort/change'
);
