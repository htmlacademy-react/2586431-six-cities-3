import { createAsyncThunk } from '@reduxjs/toolkit';
import { TOffer, TOfferDetails } from '../types/offer';
import { AxiosInstance } from 'axios';
import { TUser } from '../types/user';
import { tokenHelper } from '../helpers';
import { TReview } from '../types/review';

export const fetchOffersList = createAsyncThunk<
  TOffer[],
  undefined,
  { extra: AxiosInstance }
>('offers/load', async (_, { extra: api }) => {
  const response = await api.get<TOffer[]>('/offers');
  return response.data;
});

export const fetchOfferById = createAsyncThunk<
  TOfferDetails,
  string,
  { extra: AxiosInstance }
>('offers/fetchById', async (id, { extra: api }) => {
  const response = await api.get<TOfferDetails>(`/offers/${id}`);
  return response.data;
});

export const fetchOffersNearby = createAsyncThunk<
  TOffer[],
  string,
  { extra: AxiosInstance }
>('offers/fetchNearby', async (id, { extra: api }) => {
  const response = await api.get<TOffer[]>(`/offers/${id}/nearby`);
  return response.data;
});

export const fetchReviews = createAsyncThunk<
  TReview[],
  string,
  { extra: AxiosInstance }
>('reviews/fetch', async (offerId, { extra: api }) => {
  const response = await api.get<TReview[]>(`/comments/${offerId}`);
  return response.data;
});

export const postReview = createAsyncThunk<
  TReview,
  { offerId: string; comment: string; rating: number },
  { extra: AxiosInstance }
>('reviews/post', async ({ offerId, comment, rating }, { extra: api }) => {
  const response = await api.post<TReview>(`/comments/${offerId}`, {
    comment,
    rating,
  });
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
