import { useState, useEffect } from 'react';
import Map from '../../components/map/map';
import { OffersList } from '../../components/offers-list/offers-list';
import { useOffersList as useOffersList } from '../../store/hooks';
import { changeCity } from '../../store/actions';
import { fetchOffersList } from '../../store/api-actions';
import { store } from '../../store';
import { useSelector } from 'react-redux';
import { State } from '../../types/state';
import { CITIES, CITY_CENTER_LOCATIONS } from '../../constants';
import { SortingOptions } from '../../components/sorting-options/sorting-options';
import { Spinner } from '../../components/spinner/spinner';

const CityItem = ({ city }: { city: string }) => {
  const isActive = useSelector((state: State) => state.city === city);
  const handleCityChange = () => {
    store.dispatch(changeCity(city));
  };

  return (
    <li className="locations__item">
      <a
        className={`locations__item-link tabs__item ${
          isActive ? 'tabs__item--active' : ''
        }`}
        onClick={handleCityChange}
      >
        <span>{city}</span>
      </a>
    </li>
  );
};

function MainPage(): JSX.Element {
  const [activeOfferId, setActiveOfferId] = useState<string | null>(null);
  const offers = useOffersList();
  const city = useSelector((state: State) => state.city);
  const isLoading = useSelector((state: State) => state.offersListLoading);

  useEffect(() => {
    store.dispatch(fetchOffersList());
  }, []);

  const handleOfferHover = (offerId: string | null) => {
    setActiveOfferId(offerId);
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="page page--gray page--main">
      <main className="page__main page__main--index">
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
          <div className="cities__places-container container">
            <section className="cities__places places">
              <h2 className="visually-hidden">Places</h2>
              <b className="places__found">
                {offers.length} places to stay in {city}
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
          </div>
        </div>
      </main>
    </div>
  );
}

export { MainPage };
