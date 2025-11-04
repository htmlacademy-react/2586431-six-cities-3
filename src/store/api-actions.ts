import { createAsyncThunk } from '@reduxjs/toolkit';
import { TOffer } from '../types/offer';
import { AxiosInstance } from 'axios';

export const loadOffersList = createAsyncThunk<
  TOffer[],
  undefined,
  { extra: AxiosInstance }
>('offers/load', async (_, { extra: api }) => {
  const response = await api.get<TOffer[]>('/offers');
  return response.data;
});
