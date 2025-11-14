import { useState, useEffect } from 'react';
import Map from '../../components/map';
import { OffersList } from '../../components/offers-list';
import { store, offersActions, useOffersList } from '../../store';
import { useSelector } from 'react-redux';
import { State } from '../../types/state';
import { CITIES, CITY_CENTER_LOCATIONS } from '../../constants';
import { SortingOptions } from '../../components/sorting-options';
import { Spinner } from '../../components/spinner';
import { NoOffers } from '../../components/no-offers';
import CityItem from './city-item';

function MainPage(): JSX.Element {
  const [activeOfferId, setActiveOfferId] = useState<string | null>(null);
  const offers = useOffersList();
  const city = useSelector((state: State) => state.filters.city);
  const isLoading = useSelector((state: State) => state.offers.listLoading);

  useEffect(() => {
    store.dispatch(offersActions.fetchList());
  }, []);

  const handleOfferHover = (offerId: string | null) => {
    setActiveOfferId(offerId);
  };

  if (isLoading) {
    return <Spinner />;
  }

  const hasOffers = offers.length > 0;

  return (
    <div className="page page--gray page--main">
      <main
        className={`page__main page__main--index ${
          !hasOffers ? 'page__main--index-empty' : ''
        }`}
      >
        <h1 className="visually-hidden">Cities</h1>
        <div className="tabs">
          <section className="locations container">
            <ul className="locations__list tabs__list">
              {CITIES.map((cityName) => (
                <CityItem key={cityName} city={cityName} />
              ))}
            </ul>
          </section>
        </div>
        <div className="cities">
          <div
            className={`cities__places-container container ${
              !hasOffers ? 'cities__places-container--empty' : ''
            }`}
          >
            {hasOffers ? (
              <>
                <section className="cities__places places">
                  <h2 className="visually-hidden">Places</h2>
                  <b className="places__found">
                    {offers.length} place{offers.length > 1 ? 's' : ''} to stay
                    in {city}
                  </b>
                  <SortingOptions />
                  <OffersList offers={offers} onOfferHover={handleOfferHover} />
                </section>
                <div className="cities__right-section">
                  <Map
                    centerLocation={CITY_CENTER_LOCATIONS[city]}
                    offers={offers}
                    selectedOfferId={activeOfferId}
                    className="cities__map"
                  />
                </div>
              </>
            ) : (
              <>
                <NoOffers city={city} />
                <div className="cities__right-section"></div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export { MainPage };
