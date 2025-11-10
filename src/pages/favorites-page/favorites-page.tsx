import { useEffect, useMemo } from 'react';
import { FavoritesLocation } from '../../components/favorites-location/favorites-location';
import { TOffer } from '../../types/offer';
import { useSelector } from 'react-redux';
import { State } from '../../types/state';
import { store } from '../../store';
import { fetchOffersList } from '../../store/api-actions';

function FavoritesPage(): JSX.Element {
  // пока у нас нет отдельных favoriteOffersList
  const offers = useSelector((state: State) => state.offersList);
  useEffect(() => {
    store.dispatch(fetchOffersList());
  }, []);

  const groupedOffers = useMemo(() => {
    const result = {} as Record<string, TOffer[]>;
    offers.forEach((offer) => {
      const city = offer.city.name;
      if (!result[city]) {
        result[city] = [];
      }
      result[city].push(offer);
    });
    return result;
  }, [offers]);
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
