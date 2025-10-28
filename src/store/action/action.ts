import { createAction } from '@reduxjs/toolkit';

export const changeCity = createAction<string>('city/change');
export const loadOffersList = createAction('offers/load');
