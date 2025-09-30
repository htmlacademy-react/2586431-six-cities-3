import { Navigate } from 'react-router-dom';
import { AppRoute } from '../const/const';

type PrivateRouteProps = {
  /** Доступ разрешен */
  accessGranted: boolean;
  children: JSX.Element;
  /** Куда перенаправлять в случае отсутствия доступа */
  redirectTo: AppRoute;
};

function PrivateRoute(props: PrivateRouteProps): JSX.Element {
  const { accessGranted, children, redirectTo } = props;

  return accessGranted ? children : <Navigate to={redirectTo} />;
}

export default PrivateRoute;
