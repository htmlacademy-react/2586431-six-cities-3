import { TReview } from '../../types/review';

export type TReviewsState = {
  list: TReview[];
  listLoading: boolean;
  postNewLoading: boolean;
};
