import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';
import { TUser } from '../../types/user';
import { tokenHelper } from '../../helpers';

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
  tokenHelper.save(response.data.token);
  return response.data;
});

export const logout = createAsyncThunk<
  void,
  { intercepted?: boolean } | undefined,
  { extra: AxiosInstance }
>('user/logout', async ({ intercepted } = {}, { extra: api }) => {
  if (!intercepted) {
    await api.delete('/logout');
  }
  tokenHelper.purge();
});
