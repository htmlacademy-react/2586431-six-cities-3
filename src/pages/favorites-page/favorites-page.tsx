import { useMemo } from 'react';
import { FavoritesLocation } from '../../components/favorites-location/favorites-location';
import { TOffer } from '../../types/offer';

type FavoritesPageProps = {
  offers: TOffer[];
};

function FavoritesPage({ offers }: FavoritesPageProps): JSX.Element {
  const groupedOffers = useMemo(
    () =>
      offers.reduce((acc, offer) => {
        if (!acc[offer.city.name]) {
          acc[offer.city.name] = [];
        }
        acc[offer.city.name].push(offer);
        return acc;
      }, {} as Record<string, TOffer[]>),
    [offers]
  );
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
