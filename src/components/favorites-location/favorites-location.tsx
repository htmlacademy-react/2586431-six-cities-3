import { PlaceCard } from '../place-card';
import { TOffer } from '../../types/offer';
import { filtersActions, store } from '../../store';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from '../../constants';

type FavoritesLocationProps = {
  name: string;
  offers: TOffer[];
};

export function FavoritesLocation({
  name,
  offers,
}: FavoritesLocationProps): JSX.Element {
  const navigate = useNavigate();
  const handleCityChange = () => {
    store.dispatch(filtersActions.changeCity(name));
    navigate(AppRoute.Root);
  };
  return (
    <li className="favorites__locations-items">
      <div className="favorites__locations locations locations--current">
        <div className="locations__item">
          <span
            className="locations__item-link"
            onClick={handleCityChange}
            role="button"
            tabIndex={0}
            data-testid="city-link"
          >
            <span>{name}</span>
          </span>
        </div>
      </div>
      <div className="favorites__places">
        {offers.map((offer) => (
          <PlaceCard key={offer.id} offer={offer} viewMode="favorites" />
        ))}
      </div>
    </li>
  );
}
