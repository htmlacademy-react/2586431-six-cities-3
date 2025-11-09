import { createAsyncThunk } from '@reduxjs/toolkit';
import { TOffer } from '../types/offer';
import { AxiosInstance } from 'axios';
import { TUser } from '../types/user';

export const loadOffersList = createAsyncThunk<
  TOffer[],
  undefined,
  { extra: AxiosInstance }
>('offers/load', async (_, { extra: api }) => {
  const response = await api.get<TOffer[]>('/offers');
  return response.data;
});

export const checkAuth = createAsyncThunk<
  TUser,
  undefined,
  { extra: AxiosInstance }
>('user/checkAuth', async (_, { extra: api }) => {
  const response = await api.get<TUser>('/login');
  return response.data;
});

export const login = createAsyncThunk<
  TUser,
  { email: string; password: string },
  { extra: AxiosInstance }
>('user/login', async ({ email, password }, { extra: api }) => {
  const response = await api.post<TUser>('/login', { email, password });
  return response.data;
});

export const logout = createAsyncThunk<
  void,
  undefined,
  { extra: AxiosInstance }
>('user/logout', async (_, { extra: api }) => {
  await api.delete('/logout');
});
