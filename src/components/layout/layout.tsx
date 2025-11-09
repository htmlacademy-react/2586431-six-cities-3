import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AppRoute, AuthorizationStatus } from '../../constants';
import { useSelector } from 'react-redux';
import { State } from '../../types/state';
import { logout } from '../../store/api-actions';
import { store } from '../../store';

const getLayoutState = (pathname: AppRoute) => {
  let rootClassName = '';
  let linkClassName = '';
  let shouldRenderUser = true;

  if (pathname === AppRoute.Root) {
    rootClassName = 'page--gray page--main';
    linkClassName = 'header__logo-link header__logo-link--active';
  } else if (pathname === AppRoute.Login) {
    rootClassName = 'page page--login';
    linkClassName = 'header__logo-link';
    shouldRenderUser = false;
  } else if (pathname === AppRoute.Favorites) {
    rootClassName = 'page--gray page--favorites';
    shouldRenderUser = false;
  }
  return { rootClassName, linkClassName, shouldRenderUser };
};

function Layout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { rootClassName, linkClassName, shouldRenderUser } = getLayoutState(
    pathname as AppRoute
  );
  const user = useSelector((state: State) => state.user);
  const auth = useSelector((state: State) => state.authorizationStatus);
  const handleLogout = () => {
    store.dispatch(logout()).then(() => {
      navigate(AppRoute.Root);
    });
  };
  return (
    <div className={`page${rootClassName}`}>
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <Link
                to={AppRoute.Root}
                className={`header__logo-link${linkClassName}`}
              >
                <img
                  className="header__logo"
                  src="img/logo.svg"
                  alt="6 cities logo"
                  width={81}
                  height={41}
                />
              </Link>
            </div>
            {shouldRenderUser ? (
              <nav className="header__nav">
                {auth === AuthorizationStatus.Auth && user && (
                  <ul className="header__nav-list">
                    <li className="header__nav-item user">
                      <a
                        className="header__nav-link header__nav-link--profile"
                        href="#"
                      >
                        <div className="header__avatar-wrapper user__avatar-wrapper"></div>
                        <span className="header__user-name user__name">
                          {user.email}
                        </span>
                        <span className="header__favorite-count">3</span>
                      </a>
                    </li>
                    <li className="header__nav-item">
                      <a className="header__nav-link" onClick={handleLogout}>
                        <span className="header__signout">Sign out</span>
                      </a>
                    </li>
                  </ul>
                )}
                {auth === AuthorizationStatus.NoAuth && (
                  <ul className="header__nav-list">
                    <li className="header__nav-item user">
                      <Link
                        className="header__nav-link header__nav-link--profile"
                        to={AppRoute.Login}
                      >
                        <div className="header__avatar-wrapper user__avatar-wrapper"></div>
                        <a className="header__login" href="#">
                          Sign in
                        </a>
                      </Link>
                    </li>
                  </ul>
                )}
              </nav>
            ) : null}
          </div>
        </div>
      </header>
      <Outlet />
    </div>
  );
}

export default Layout;
