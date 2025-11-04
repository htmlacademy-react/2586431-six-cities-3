import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import { State } from '../types/state';
import { TOffer } from '../types/offer';

const sortPriceLowToHigh = (offers: TOffer[]) =>
  offers.sort((a, b) => a.price - b.price);

const sortPriceHighToLow = (offers: TOffer[]) =>
  offers.sort((a, b) => b.price - a.price);

const sortRatingTop = (offers: TOffer[]) =>
  offers.sort((a, b) => b.rating - a.rating);

const SORT_FUNCTIONS = {
  'price-low-to-high': sortPriceLowToHigh,
  'price-high-to-low': sortPriceHighToLow,
  'top-rated-first': sortRatingTop,
} as const;

const useOffersList = () => {
  const offers = useSelector((state: State) => state.offersList);
  const city = useSelector((state: State) => state.city);
  const sort = useSelector((state: State) => state.sort);
  return useMemo(() => {
    const unsortedOffers = offers.filter((offer) => offer.city.name === city);
    if (sort === 'popular') {
      return unsortedOffers;
    }
    return SORT_FUNCTIONS[sort](unsortedOffers);
  }, [offers, city, sort]);
};

export { useOffersList };
