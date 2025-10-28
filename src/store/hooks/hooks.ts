import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import { State } from '../../types/state/state';

const useOffersByCity = () => {
  const offers = useSelector((state: State) => state.offersList);
  const city = useSelector((state: State) => state.city);
  return useMemo(
    () => (city ? offers.filter((offer) => offer.city.name === city) : []),
    [offers, city]
  );
};

export { useOffersByCity };
