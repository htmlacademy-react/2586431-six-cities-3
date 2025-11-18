import { useEffect, useState, MutableRefObject, useRef } from 'react';
import { Map, TileLayer } from 'leaflet';
import { TLocation } from '../../types/offer';
import {
  DEFAULT_ZOOM,
  MAP_TILE_LAYER_ATTRIBUTION,
  MAP_TILE_LAYER_URL,
} from '../../constants';

function useMap(
  mapRef: MutableRefObject<HTMLElement | null>,
  centerLocation: TLocation
): Map | null {
  const [map, setMap] = useState<Map | null>(null);
  const isRenderedRef = useRef<boolean>(false);

  useEffect(() => {
    if (mapRef.current !== null && !isRenderedRef.current) {
      const instance = new Map(mapRef.current, {
        center: {
          lat: centerLocation.latitude,
          lng: centerLocation.longitude,
        },
        zoom: centerLocation.zoom ?? DEFAULT_ZOOM,
        attributionControl: false,
      });

      const layer = new TileLayer(MAP_TILE_LAYER_URL, {
        attribution: MAP_TILE_LAYER_ATTRIBUTION,
      });

      instance.addLayer(layer);

      setMap(instance);
      isRenderedRef.current = true;
    }
  }, [mapRef, centerLocation]);

  return map;
}

export default useMap;
