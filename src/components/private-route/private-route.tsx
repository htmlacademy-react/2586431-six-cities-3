import { Navigate } from 'react-router-dom';
import { AppRoute, AuthorizationStatus } from '../../constants';
import { useSelector } from 'react-redux';
import { State } from '../../types/state';
import { Spinner } from '../spinner';

type PrivateRouteProps = {
  /** Доступ разрешен */
  children: JSX.Element;
  /** Куда перенаправлять в случае отсутствия доступа */
  redirectTo?: AppRoute;
};

function PrivateRoute(props: PrivateRouteProps): JSX.Element {
  const { children, redirectTo = AppRoute.Login } = props;
  const accessGranted = useSelector(
    (state: State) => state.auth.status === AuthorizationStatus.Auth
  );
  const accessDenied = useSelector(
    (state: State) => state.auth.status === AuthorizationStatus.NoAuth
  );

  if (accessGranted) {
    return children;
  }
  if (accessDenied) {
    return <Navigate to={redirectTo} />;
  }
  return <Spinner />;
}

export default PrivateRoute;
