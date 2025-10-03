import { PlaceCard } from '../../components/place-card/place-card';
import { TOffer } from '../../types/offer';

type FavoritesLocationProps = {
  name: string;
  offers: TOffer[];
};

export function FavoritesLocation({
  name,
  offers,
}: FavoritesLocationProps): JSX.Element {
  return (
    <li className="favorites__locations-items">
      <div className="favorites__locations locations locations--current">
        <div className="locations__item">
          <a className="locations__item-link" href="#">
            <span>{name}</span>
          </a>
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
