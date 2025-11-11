import { PlaceCard } from '../place-card';
import { TOffer } from '../../types/offer';

type OffersListProps = {
  offers: TOffer[];
  onOfferHover?: (offerId: string | null) => void;
  viewMode?: 'cities' | 'near-places';
};

export function OffersList({
  offers,
  onOfferHover,
  viewMode = 'cities',
}: OffersListProps): JSX.Element {
  return (
    <div
      className={`${
        viewMode === 'near-places' ? 'near-places__list' : 'cities__places-list'
      } places__list tabs__content`}
    >
      {offers.map((offer) => (
        <PlaceCard
          viewMode={viewMode}
          key={offer.id}
          offer={offer}
          onMouseEnter={() => onOfferHover?.(offer.id)}
          onMouseLeave={() => onOfferHover?.(null)}
        />
      ))}
    </div>
  );
}
