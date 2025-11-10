import { AUTH_TOKEN_KEY } from '../constants';

const get = (): string => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  return token ?? '';
};

const save = (token: string): void => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

const purge = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

const token = {
  get,
  save,
  purge,
};

export default token;
