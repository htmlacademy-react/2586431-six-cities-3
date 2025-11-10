import { TUser } from './user';

export type TReview = {
  id: string;
  comment: string;
  rating: number;
  date: string;
  user: TUser;
};
