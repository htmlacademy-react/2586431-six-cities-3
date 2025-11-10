import { TUser } from './user';

export type TLocation = {
  latitude: number;
  longitude: number;
  zoom?: number;
};

export type TOfferCity = {
  name: string;
  location: TLocation;
};

export type TOffer = {
  id: string;
  title: string;
  type: string;
  price: number;
  city: TOfferCity;
  location: TLocation;
  isFavorite: boolean;
  isPremium: boolean;
  rating: number;
  previewImage: string;
};

export type TOfferDetails = Omit<TOffer, 'previewImage'> & {
  description: string;
  bedrooms: number;
  goods: string[];
  host: TUser;
  images: string[];
  maxAdults: number;
};
