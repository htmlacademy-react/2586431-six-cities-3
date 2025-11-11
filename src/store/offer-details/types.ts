import { TOfferDetails } from '../../types/offer';

export type TOfferDetailsState = {
  current: TOfferDetails | null;
  currentLoading: boolean;
};
