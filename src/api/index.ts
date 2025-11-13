import axios, { HttpStatusCode, isAxiosError } from 'axios';
import { BASE_URL } from '../constants';
import { tokenHelper } from '../helpers';
import { authActions } from '../store';
import { store } from '../store';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});

api.interceptors.request.use((config) => {
  const token = tokenHelper.get();

  if (token) {
    config.headers['X-Token'] = token;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!isAxiosError(error)) {
      throw error;
    }
    const { response } = error;
    if (response?.status === HttpStatusCode.Unauthorized) {
      store.dispatch(authActions.logout({ intercepted: true }));
    }
    return Promise.reject(error);
  }
);
