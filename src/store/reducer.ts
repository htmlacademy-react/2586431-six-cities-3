import { createReducer } from '@reduxjs/toolkit';
import { changeCity, changeSort } from './actions';
import {
  checkAuth,
  fetchOfferById,
  fetchOffersList,
  fetchOffersNearby,
  fetchReviews,
  login,
  logout,
  postReview,
} from './api-actions';
import { TOffer, TOfferDetails } from '../types/offer';
import { AuthorizationStatus, CITIES, USortingOptionValue } from '../constants';
import { TUser } from '../types/user';
import { TReview } from '../types/review';

type InitialState = {
  city: string;
  sort: USortingOptionValue;
  offersList: TOffer[];
  offersListLoading: boolean;
  offerDetails: TOfferDetails | null;
  offerDetailsLoading: boolean;
  offersNearby: TOffer[];
  offersNearbyLoading: boolean;
  authorizationStatus: AuthorizationStatus;
  authorizationLoading: boolean;
  loginLoading: boolean;
  logoutLoading: boolean;
  user: TUser | null;
  reviews: TReview[];
  reviewsLoading: boolean;
  postReviewLoading: boolean;
};
const initialState: InitialState = {
  city: CITIES[0],
  sort: 'popular',
  offersList: [],
  offersListLoading: false,
  offerDetails: null,
  offerDetailsLoading: false,
  offersNearby: [],
  offersNearbyLoading: false,
  authorizationStatus: AuthorizationStatus.Unknown,
  authorizationLoading: false,
  loginLoading: false,
  logoutLoading: false,
  user: null,
  reviews: [],
  reviewsLoading: false,
  postReviewLoading: false,
};

const reducer = createReducer(initialState, (builder) => {
  builder.addCase(changeCity, (state, action) => {
    state.city = action.payload ?? null;
  });
  builder.addCase(fetchOffersList.fulfilled, (state, action) => {
    state.offersList = action.payload;
    state.offersListLoading = false;
  });
  builder.addCase(fetchOffersList.pending, (state) => {
    state.offersListLoading = true;
  });
  builder.addCase(fetchOffersList.rejected, (state) => {
    state.offersListLoading = false;
  });
  builder.addCase(changeSort, (state, action) => {
    state.sort = action.payload ?? 'popular';
  });
  builder.addCase(fetchOfferById.fulfilled, (state, action) => {
    state.offerDetailsLoading = false;
    state.offerDetails = action.payload;
  });
  builder.addCase(fetchOfferById.pending, (state) => {
    state.offerDetailsLoading = true;
    state.offerDetails = null;
  });
  builder.addCase(fetchOfferById.rejected, (state) => {
    state.offerDetailsLoading = false;
    state.offerDetails = null;
  });
  builder.addCase(fetchOffersNearby.fulfilled, (state, action) => {
    state.offersNearbyLoading = false;
    state.offersNearby = action.payload;
  });
  builder.addCase(fetchOffersNearby.pending, (state) => {
    state.offersNearbyLoading = true;
    state.offersNearby = [];
  });
  builder.addCase(fetchOffersNearby.rejected, (state) => {
    state.offersNearbyLoading = false;
    state.offersNearby = [];
  });
  builder.addCase(checkAuth.fulfilled, (state, action) => {
    state.authorizationStatus = AuthorizationStatus.Auth;
    state.user = action.payload;
    state.authorizationLoading = false;
  });
  builder.addCase(checkAuth.pending, (state) => {
    state.authorizationLoading = true;
  });
  builder.addCase(checkAuth.rejected, (state) => {
    state.authorizationStatus = AuthorizationStatus.NoAuth;
    state.authorizationLoading = false;
    state.user = null;
  });

  builder.addCase(login.fulfilled, (state, action) => {
    state.authorizationStatus = AuthorizationStatus.Auth;
    state.user = action.payload;
    state.loginLoading = false;
  });
  builder.addCase(login.pending, (state) => {
    state.loginLoading = true;
  });
  builder.addCase(login.rejected, (state) => {
    state.loginLoading = false;
  });

  builder.addCase(logout.fulfilled, (state) => {
    state.authorizationStatus = AuthorizationStatus.NoAuth;
    state.logoutLoading = false;
    state.user = null;
  });
  builder.addCase(logout.pending, (state) => {
    state.logoutLoading = true;
  });
  builder.addCase(logout.rejected, (state) => {
    state.authorizationStatus = AuthorizationStatus.Unknown;
    state.logoutLoading = false;
    state.user = null;
  });
  builder.addCase(fetchReviews.fulfilled, (state, action) => {
    state.reviews = action.payload;
    state.reviewsLoading = false;
  });
  builder.addCase(fetchReviews.pending, (state) => {
    state.reviewsLoading = true;
    state.reviews = [];
  });
  builder.addCase(fetchReviews.rejected, (state) => {
    state.reviewsLoading = false;
    state.reviews = [];
  });
  builder.addCase(postReview.fulfilled, (state, action) => {
    state.reviews.push(action.payload);
    state.postReviewLoading = false;
  });
  builder.addCase(postReview.pending, (state) => {
    state.postReviewLoading = true;
  });
  builder.addCase(postReview.rejected, (state) => {
    state.postReviewLoading = false;
  });
});

export { reducer };
