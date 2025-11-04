import { createAction } from '@reduxjs/toolkit';
import { USortingOptionValue } from '../constants';

export const changeCity = createAction<string>('city/change');
export const changeSort = createAction<USortingOptionValue | undefined>(
  'sort/change'
);
