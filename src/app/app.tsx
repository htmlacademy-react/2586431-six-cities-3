import { MainPage } from '../pages/main-page/main-page';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppRoute, AuthorizationStatus } from '../components/const/const';
import { LoginPage } from '../pages/login-page/login-page';
import { FavoritesPage } from '../pages/favorites-page/favorites-page';
import { OfferPage } from '../pages/offer-page/offer-page';
import { NotFoundPage } from '../pages/404-page/404-page';
import PrivateRoute from '../components/private-route/private-route';
import Layout from '../components/layout/layout';
import { TOffer } from '../types/offer';

type AppProps = {
  offers: TOffer[];
};

function App({ offers }: AppProps): JSX.Element {
  const authorizationStatus = AuthorizationStatus.Auth;
  return (
    <BrowserRouter>
      <Routes>
        <Route path={AppRoute.Root} element={<Layout />}>
          <Route index element={<MainPage offers={offers} />} />
          <Route path={AppRoute.Login} element={<LoginPage />} />

          <Route
            path={AppRoute.Favorites}
            element={
              <PrivateRoute
                accessGranted={authorizationStatus === AuthorizationStatus.Auth}
                redirectTo={AppRoute.Login}
              >
                <FavoritesPage offers={offers} />
              </PrivateRoute>
            }
          />
          <Route path={AppRoute.Offer} element={<OfferPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
