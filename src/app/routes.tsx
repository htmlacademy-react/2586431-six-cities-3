import { Routes, Route } from 'react-router-dom';
import { MainPage } from '../pages/main-page';
import { LoginPage } from '../pages/login-page';
import { FavoritesPage } from '../pages/favorites-page';
import { OfferPage } from '../pages/offer-page';
import { NotFoundPage } from '../pages/404-page';
import PrivateRoute from '../components/private-route';
import Layout from '../components/layout';
import { AppRoute } from '../constants';

export function AppRoutes() {
  return (
    <Routes>
      <Route path={AppRoute.Root} element={<Layout />}>
        <Route index element={<MainPage />} />
        <Route path={AppRoute.Login} element={<LoginPage />} />
        <Route
          path={AppRoute.Favorites}
          element={
            <PrivateRoute>
              <FavoritesPage />
            </PrivateRoute>
          }
        />
        <Route path={AppRoute.Offer} element={<OfferPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
