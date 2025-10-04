export type TLocation = {
  latitude: number;
  longitude: number;
  zoom: number;
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
