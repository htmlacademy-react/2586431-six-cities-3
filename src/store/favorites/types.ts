import { TOffer } from '../../types/offer';

export type TFavoritesState = {
  list?: TOffer[];
  listLoading: boolean;
  setStatusLoading: boolean;
};
