import { MainPage } from '../pages/main-page/main-page';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppRoute } from '../constants';
import { LoginPage } from '../pages/login-page/login-page';
import { FavoritesPage } from '../pages/favorites-page/favorites-page';
import { OfferPage } from '../pages/offer-page/offer-page';
import { NotFoundPage } from '../pages/404-page/404-page';
import PrivateRoute from '../components/private-route/private-route';
import Layout from '../components/layout/layout';
import { useEffect } from 'react';
import { store, authActions } from '../store';

function App(): JSX.Element {
  useEffect(() => {
    store.dispatch(authActions.checkAuth());
  }, []);
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;
