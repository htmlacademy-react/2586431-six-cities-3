import { PlaceCard } from '../place-card/place-card';
import { TOffer } from '../../types/offer';
import { useState } from 'react';

type OffersListProps = {
  offers: TOffer[];
  onOfferHover: (offerId: string | null) => void;
};

export function OffersList({
  offers,
  onOfferHover,
}: OffersListProps): JSX.Element {
  const [, setActiveOfferId] = useState<string | null>(null);

  const handleOfferHover = (offerId: string | null) => {
    setActiveOfferId(offerId);
    onOfferHover(offerId);
  };

  return (
    <div className="cities__places-list places__list tabs__content">
      {offers.map((offer) => (
        <PlaceCard
          key={offer.id}
          offer={offer}
          onMouseEnter={() => handleOfferHover(offer.id)}
          onMouseLeave={() => handleOfferHover(null)}
        />
      ))}
    </div>
  );
}
