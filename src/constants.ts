import { TLocation } from './types/offer';

export enum AppRoute {
  Root = '/',
  Login = '/login',
  Favorites = '/favorites',
  Offer = '/offer/:id',
}

export enum AuthorizationStatus {
  Auth = 'AUTH',
  NoAuth = 'NO_AUTH',
  Unknown = 'UNKNOWN',
}

export const URL_MARKER_DEFAULT =
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/demo/interactive-map/pin.svg';

export const URL_MARKER_CURRENT =
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/demo/interactive-map/main-pin.svg';

export const CITIES = [
  'Paris',
  'Cologne',
  'Brussels',
  'Amsterdam',
  'Hamburg',
  'Dusseldorf',
];

export const CITY_CENTER_LOCATIONS: Record<string, TLocation> = {
  Paris: {
    latitude: 48.8566,
    longitude: 2.3522,
  },
  Cologne: {
    latitude: 50.938361,
    longitude: 6.959974,
  },
  Brussels: {
    latitude: 50.8476,
    longitude: 4.3572,
  },
  Amsterdam: {
    latitude: 52.370216,
    longitude: 4.895168,
  },
  Hamburg: {
    latitude: 53.551086,
    longitude: 9.993682,
  },
  Dusseldorf: {
    latitude: 51.225402,
    longitude: 6.776314,
  },
};

export const DEFAULT_ZOOM = 12;

export type USortingOptionValue =
  | 'popular'
  | 'price-low-to-high'
  | 'price-high-to-low'
  | 'top-rated-first';

export type TSortingOption = {
  label: string;
  value: USortingOptionValue;
};

export const SORTING_OPTIONS: TSortingOption[] = [
  {
    label: 'Popular',
    value: 'popular',
  },
  {
    label: 'Price: low to high',
    value: 'price-low-to-high',
  },
  {
    label: 'Price: high to low',
    value: 'price-high-to-low',
  },
  {
    label: 'Top rated first',
    value: 'top-rated-first',
  },
];

export const BASE_URL = 'https://15.design.htmlacademy.pro/six-cities';

export const AUTH_TOKEN_KEY = 'six-cities-auth-token';

export const MAX_REVIEWS_COUNT = 10;
