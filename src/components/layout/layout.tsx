import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AppRoute, AuthorizationStatus } from '../../constants';
import { useSelector } from 'react-redux';
import { State } from '../../types/state';
import { store, authActions } from '../../store';
import { useMemo } from 'react';

const useLayoutState = () => {
  const { pathname } = useLocation();

  return useMemo(() => {
    switch (pathname) {
      case AppRoute.Root:
        return {
          rootClassName: 'page--gray page--main',
          linkClassName: 'header__logo-link header__logo-link--active',
          shouldRenderUser: true,
        };
      case AppRoute.Login:
        return {
          rootClassName: 'page page--login',
          linkClassName: 'header__logo-link',
          shouldRenderUser: false,
        };
      case AppRoute.Favorites:
        return {
          rootClassName: 'page--gray page--favorites',
          shouldRenderUser: false,
        };
      default:
        return {
          rootClassName: '',
          linkClassName: '',
          shouldRenderUser: true,
        };
    }
  }, [pathname]);
};

function Layout() {
  const navigate = useNavigate();
  const { rootClassName, linkClassName, shouldRenderUser } = useLayoutState();
  const user = useSelector((state: State) => state.auth.user);
  const auth = useSelector((state: State) => state.auth.status);
  const handleLogout = () => {
    store.dispatch(authActions.logout()).then(() => {
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
