import { useLocation } from 'react-router-dom';
import { AppRoute } from '../../constants';
import { useMemo } from 'react';

export const usePageSuffix = () => {
  const { pathname } = useLocation();

  return useMemo(() => {
    if (pathname.startsWith(AppRoute.Login)) {
      return 'login';
    }
    if (pathname.startsWith(AppRoute.Favorites)) {
      return 'favorites';
    }
    if (pathname.startsWith(AppRoute.Offer.split(':')[0])) {
      return 'offer';
    }
    if (pathname === (AppRoute.Root as string)) {
      return 'index';
    }
    return undefined;
  }, [pathname]);
};
