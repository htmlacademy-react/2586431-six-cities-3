import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';
import { TReview } from '../../types/review';

export const fetchList = createAsyncThunk<
  TReview[],
  string,
  { extra: AxiosInstance }
>('reviews/fetch', async (offerId, { extra: api }) => {
  const response = await api.get<TReview[]>(`/comments/${offerId}`);
  return response.data;
});

export const postNew = createAsyncThunk<
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
