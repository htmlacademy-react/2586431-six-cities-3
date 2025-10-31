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
