import { useEffect, useMemo } from 'react';
import { FavoritesLocation } from '../../components/favorites-location';
import { TOffer } from '../../types/offer';
import { useSelector } from 'react-redux';
import { State } from '../../types/state';
import { store, favoritesActions } from '../../store';

function FavoritesPage(): JSX.Element {
  const favoritesList = useSelector((state: State) => state.favorites.list);
  useEffect(() => {
    // по идее их уже загрузит layout, но если нет, то загружаем здесь
    if (favoritesList) {
      return;
    }
    store.dispatch(favoritesActions.fetchList());
  }, [favoritesList]);

  const groupedOffers = useMemo(() => {
    if (!favoritesList) {
      return {};
    }
    const result = {} as Record<string, TOffer[]>;
    favoritesList.forEach((offer) => {
      const city = offer.city.name;
      if (!result[city]) {
        result[city] = [];
      }
      result[city].push(offer);
    });
    return result;
  }, [favoritesList]);
  return (
    <div className="page">
      <main className="page__main page__main--favorites">
        <div className="page__favorites-container container">
          <section className="favorites">
            <h1 className="favorites__title">Saved listing</h1>
            <ul className="favorites__list">
              {Object.entries(groupedOffers).map(([name, cityOffers]) => (
                <FavoritesLocation key={name} name={name} offers={cityOffers} />
              ))}
            </ul>
          </section>
        </div>
      </main>
      <footer className="footer container">
        <a className="footer__logo-link" href="main.html">
          <img
            className="footer__logo"
            src="img/logo.svg"
            alt="6 cities logo"
            width={64}
            height={33}
          />
        </a>
      </footer>
    </div>
  );
}

export { FavoritesPage };
