import { createAsyncThunk } from '@reduxjs/toolkit';
import { TOffer } from '../../types/offer';
import { AxiosInstance } from 'axios';

export const fetchList = createAsyncThunk<
  TOffer[],
  undefined,
  { extra: AxiosInstance }
>('offers/load', async (_, { extra: api }) => {
  const response = await api.get<TOffer[]>('/offers');
  return response.data;
});

export const fetchNearby = createAsyncThunk<
  TOffer[],
  string,
  { extra: AxiosInstance }
>('offers/fetchNearby', async (id, { extra: api }) => {
  const response = await api.get<TOffer[]>(`/offers/${id}/nearby`);
  return response.data;
});
