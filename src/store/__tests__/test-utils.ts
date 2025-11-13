/* eslint-disable indent */ // преттиер справляется лучше, а он мешает...
import { TOffer, TOfferDetails } from '../../types/offer';
import { TUser } from '../../types/user';
import { TReview } from '../../types/review';

export const createMockUser = (overrides?: Partial<TUser>): TUser => ({
  name: 'Test User',
  avatarUrl: 'avatar.jpg',
  isPro: false,
  email: 'test@test.com',
  token: 'test-token',
  ...overrides,
});

export const createMockOffer = (overrides?: Partial<TOffer>): TOffer => ({
  id: '1',
  title: 'Test Offer',
  type: 'apartment',
  price: 100,
  city: {
    name: 'Paris',
    location: { latitude: 48.8566, longitude: 2.3522 },
  },
  location: { latitude: 48.8566, longitude: 2.3522 },
  isFavorite: false,
  isPremium: false,
  rating: 4.5,
  previewImage: 'test.jpg',
  ...overrides,
});

export const createMockOfferDetails = (
  overrides?: Partial<TOfferDetails>
): TOfferDetails => ({
  ...createMockOffer(),
  description: 'Test description',
  bedrooms: 2,
  goods: ['Wi-Fi', 'Kitchen'],
  host: createMockUser(),
  images: ['image1.jpg', 'image2.jpg'],
  maxAdults: 4,
  ...overrides,
});

export const createMockReview = (overrides?: Partial<TReview>): TReview => ({
  id: '1',
  comment: 'Test comment',
  rating: 5,
  date: '2024-01-01T00:00:00.000Z',
  user: createMockUser(),
  ...overrides,
});

export const createMockAsyncAction = <T>(
  type: string,
  payload: T,
  meta?: unknown
) => ({
  type,
  payload,
  meta: meta ?? {
    arg: undefined,
    requestId: 'test',
    requestStatus: 'fulfilled' as const,
  },
});

export const createMockPendingAction = (type: string, meta?: unknown) => ({
  type,
  meta: meta ?? {
    arg: undefined,
    requestId: 'test',
    requestStatus: 'pending' as const,
  },
});

export const createMockRejectedAction = (type: string, meta?: unknown) => ({
  type,
  meta: meta ?? {
    arg: undefined,
    requestId: 'test',
    requestStatus: 'rejected' as const,
  },
});

import type { State } from '../../types/state';
import type { Action } from 'redux';
import type { AxiosInstance } from 'axios';
import type { ThunkDispatch } from 'redux-thunk';

export type AppThunkDispatch = ThunkDispatch<
  State,
  AxiosInstance,
  Action<string>
>;

export const extractActionsTypes = (actions: Array<{ type: string }>) =>
  actions.map(({ type }) => type);
