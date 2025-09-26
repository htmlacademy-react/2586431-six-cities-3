import { MainPage } from '../pages/main-page/main-page';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppRoute, AuthorizationStatus } from '../components/const/const';
import { LoginPage } from '../pages/login-page/login-page';
import { FavoritesPage } from '../pages/favorites-page/favorites-page';
import { OfferPage } from '../pages/offer-page/offer-page';
import { NotFoundPage } from '../pages/404-page/404-page';
import PrivateRoute from '../components/private-route/private-route';
import Layout from '../components/layout/layout';

type AppProps = {
  placesCount: number;
};

function App({ placesCount }: AppProps): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={AppRoute.Root} element={<Layout />}>
          <Route index element={<MainPage placesCount={placesCount} />} />
          <Route path={AppRoute.Login} element={<LoginPage />} />

          <Route
            path={AppRoute.Favorites}
            element={
              <PrivateRoute authorizationStatus={AuthorizationStatus.NoAuth}>
                <FavoritesPage />
              </PrivateRoute>
            }
          />
          <Route path={AppRoute.Favorites} element={<FavoritesPage />} />
          <Route path={AppRoute.Offer} element={<OfferPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
