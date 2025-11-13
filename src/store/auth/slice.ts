import { createSlice } from '@reduxjs/toolkit';
import { AuthorizationStatus } from '../../constants';
import { TAuthState } from './types';
import { checkAuth, login, logout } from './actions';

const initialState: TAuthState = {
  status: AuthorizationStatus.Unknown,
  authorizationLoading: false,
  loginLoading: false,
  logoutLoading: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // checkAuth
    builder.addCase(checkAuth.fulfilled, (state, action) => {
      state.status = AuthorizationStatus.Auth;
      state.user = action.payload;
      state.authorizationLoading = false;
    });
    builder.addCase(checkAuth.pending, (state) => {
      state.authorizationLoading = true;
    });
    builder.addCase(checkAuth.rejected, (state) => {
      state.status = AuthorizationStatus.NoAuth;
      state.authorizationLoading = false;
      state.user = null;
    });

    // login
    builder.addCase(login.fulfilled, (state, action) => {
      state.status = AuthorizationStatus.Auth;
      state.user = action.payload;
      state.loginLoading = false;
    });
    builder.addCase(login.pending, (state) => {
      state.loginLoading = true;
    });
    builder.addCase(login.rejected, (state) => {
      state.loginLoading = false;
    });

    // logout
    builder.addCase(logout.fulfilled, (state) => {
      state.status = AuthorizationStatus.NoAuth;
      state.logoutLoading = false;
      state.user = null;
    });
    builder.addCase(logout.pending, (state) => {
      state.logoutLoading = true;
    });
    builder.addCase(logout.rejected, (state) => {
      state.status = AuthorizationStatus.Unknown;
      state.logoutLoading = false;
      state.user = null;
    });
  },
});

export default authSlice;
