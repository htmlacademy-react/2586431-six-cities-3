import { useState, useEffect } from 'react';
import Map from '../../components/map/map';
import { OffersList } from '../../components/offers-list/offers-list';
import { AMSTERDAM } from '../../mocks/offers/offers';
import { useOffersByCity } from '../../store/hooks/hooks';
import { changeCity, loadOffersList } from '../../store/action/action';
import { store } from '../../store';
import { useSelector } from 'react-redux';
import { State } from '../../types/state/state';
import { CITIES } from '../../components/const/const';

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
  const offers = useOffersByCity();
  const city = useSelector((state: State) => state.city);

  useEffect(() => {
    store.dispatch(loadOffersList());
  }, []);

  const handleOfferHover = (offerId: string | null) => {
    setActiveOfferId(offerId);
  };

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
              <form className="places__sorting" action="#" method="get">
                <span className="places__sorting-caption">Sort by</span>
                <span className="places__sorting-type" tabIndex={0}>
                  Popular
                  <svg className="places__sorting-arrow" width={7} height={4}>
                    <use xlinkHref="#icon-arrow-select" />
                  </svg>
                </span>
                <ul className="places__options places__options--custom">
                  <li
                    className="places__option places__option--active"
                    tabIndex={0}
                  >
                    Popular
                  </li>
                  <li className="places__option" tabIndex={0}>
                    Price: low to high
                  </li>
                  <li className="places__option" tabIndex={0}>
                    Price: high to low
                  </li>
                  <li className="places__option" tabIndex={0}>
                    Top rated first
                  </li>
                </ul>
              </form>
              <OffersList offers={offers} onOfferHover={handleOfferHover} />
            </section>
            <div className="cities__right-section">
              <Map
                centerLocation={AMSTERDAM.location}
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
