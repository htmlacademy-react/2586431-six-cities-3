import { createAsyncThunk } from '@reduxjs/toolkit';
import { TOfferDetails } from '../../types/offer';
import { AxiosInstance } from 'axios';

export const fetchById = createAsyncThunk<
  TOfferDetails,
  string,
  { extra: AxiosInstance }
>('offers/fetchById', async (id, { extra: api }) => {
  const response = await api.get<TOfferDetails>(`/offers/${id}`);
  return response.data;
});
