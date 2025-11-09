import { createReducer } from '@reduxjs/toolkit';
import { changeCity, changeSort } from './actions';
import { checkAuth, loadOffersList, login, logout } from './api-actions';
import { TOffer } from '../types/offer';
import { AuthorizationStatus, CITIES, USortingOptionValue } from '../constants';
import { TUser } from '../types/user';

type InitialState = {
  city: string;
  sort: USortingOptionValue;
  offersList: TOffer[];
  offersListLoading: boolean;
  authorizationStatus: AuthorizationStatus;
  authorizationLoading: boolean;
  loginLoading: boolean;
  logoutLoading: boolean;
  user: TUser | null;
};
const initialState: InitialState = {
  city: CITIES[0],
  sort: 'popular',
  offersList: [],
  offersListLoading: false,
  authorizationStatus: AuthorizationStatus.Unknown,
  authorizationLoading: false,
  loginLoading: false,
  logoutLoading: false,
  user: null,
};

const reducer = createReducer(initialState, (builder) => {
  builder.addCase(changeCity, (state, action) => {
    state.city = action.payload ?? null;
  });
  builder.addCase(loadOffersList.fulfilled, (state, action) => {
    state.offersList = action.payload;
    state.offersListLoading = false;
  });
  builder.addCase(loadOffersList.pending, (state) => {
    state.offersListLoading = true;
  });
  builder.addCase(loadOffersList.rejected, (state) => {
    state.offersListLoading = false;
  });
  builder.addCase(changeSort, (state, action) => {
    state.sort = action.payload ?? 'popular';
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
});

export { reducer };
