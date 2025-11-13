import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';
import { TOffer } from '../../types/offer';

export const fetchList = createAsyncThunk<
  TOffer[],
  undefined,
  { extra: AxiosInstance }
>('favorites/fetch', async (_, { extra: api }) => {
  const response = await api.get<TOffer[]>('/favorite');
  return response.data;
});

export const setStatus = createAsyncThunk<
  TOffer,
  { offerId: string; isFavorite: boolean },
  { extra: AxiosInstance }
>('favorites/toggle', async ({ offerId, isFavorite }, { extra: api }) => {
  const response = await api.post<TOffer>(
    `/favorite/${offerId}/${isFavorite ? '1' : '0'}`
  );
  return response.data;
});
