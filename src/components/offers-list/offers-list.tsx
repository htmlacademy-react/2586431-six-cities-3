import { PlaceCard } from '../place-card/place-card';
import { TOffer } from '../../types/offer';
import { useState } from 'react';

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
  const [, setActiveOfferId] = useState<string | null>(null);

  const handleOfferHover = (offerId: string | null) => {
    setActiveOfferId(offerId);
    onOfferHover?.(offerId);
  };

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
          onMouseEnter={() => handleOfferHover(offer.id)}
          onMouseLeave={() => handleOfferHover(null)}
        />
      ))}
    </div>
  );
}
