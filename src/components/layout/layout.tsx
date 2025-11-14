import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AppRoute, AuthorizationStatus } from '../../constants';
import { useSelector } from 'react-redux';
import { State } from '../../types/state';
import { store, authActions, favoritesActions } from '../../store';
import { useEffect, useMemo } from 'react';
import { classNames } from '../../helpers';

const usePageSuffix = () => {
  const { pathname } = useLocation();

  return useMemo(() => {
    if (pathname.startsWith(AppRoute.Login)) {
      return 'login';
    }
    if (pathname.startsWith(AppRoute.Favorites)) {
      return 'favorites';
    }
    if (pathname.startsWith(AppRoute.Offer)) {
      return 'offer';
    }
    if (pathname.startsWith(AppRoute.Root)) {
      return 'index';
    }
    return undefined;
  }, [pathname]);
};

function Layout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const pageSuffix = usePageSuffix();

  const showUser = useMemo(
    () => !pathname.startsWith(AppRoute.Login),
    [pathname]
  );
  const user = useSelector((state: State) => state.auth.user);
  const auth = useSelector((state: State) => state.auth.status);
  const favoritesCount = useSelector(
    (state: State) => state.favorites.list?.length ?? 0
  );
  useEffect(() => {
    // грузим только для авторизованных пользователей
    if (auth !== AuthorizationStatus.Auth) {
      return;
    }
    store.dispatch(favoritesActions.fetchList());
  }, [auth]);
  const handleLogout = () => {
    store.dispatch(authActions.logout()).then(() => {
      navigate(AppRoute.Root);
    });
  };
  return (
    <div
      className={classNames('page', {
        'page--gray page--login': pageSuffix === 'login',
        'page--favorites-empty':
          pageSuffix === 'favorites' && favoritesCount === 0,
      })}
    >
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <Link
                to={AppRoute.Root}
                className={classNames('header__logo-link', {
                  'header__logo-link--active': pageSuffix === 'index',
                })}
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
            {showUser ? (
              <nav className="header__nav">
                {auth === AuthorizationStatus.Auth && user && (
                  <ul className="header__nav-list">
                    <li className="header__nav-item user">
                      <a
                        className="header__nav-link header__nav-link--profile"
                        href="#"
                      >
                        <div className="header__avatar-wrapper user__avatar-wrapper"></div>
                        <Link to={AppRoute.Favorites}>
                          <span className="header__user-name user__name">
                            {user.email}
                          </span>
                          <span className="header__favorite-count">
                            {favoritesCount}
                          </span>
                        </Link>
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
      <main
        className={classNames('page__main', {
          [`page__main--${pageSuffix}`]: !!pageSuffix,
        })}
      >
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
