import { TOffer } from '../../types/offer';

export type TOffersState = {
  list: TOffer[];
  listLoading: boolean;
  nearby: TOffer[];
  nearbyLoading: boolean;
};
