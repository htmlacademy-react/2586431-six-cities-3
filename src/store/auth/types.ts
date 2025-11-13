import { AuthorizationStatus } from '../../constants';
import { TUser } from '../../types/user';

export type TAuthState = {
  status: AuthorizationStatus;
  authorizationLoading: boolean;
  loginLoading: boolean;
  logoutLoading: boolean;
  user: TUser | null;
};
