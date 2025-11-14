import { useRef, useEffect } from 'react';
import { Icon, Marker, layerGroup } from 'leaflet';
import useMap from '../useMap';
import { TLocation, TOffer } from '../../types/offer';
import { DEFAULT_ZOOM } from '../../constants';
import 'leaflet/dist/leaflet.css';

type MapProps = {
  centerLocation: TLocation;
  offers: Pick<TOffer, 'id' | 'location'>[];
  selectedOfferId?: string | null;
  className?: string;
};

const defaultCustomIcon = new Icon({
  iconUrl: 'img/pin.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const currentCustomIcon = new Icon({
  iconUrl: 'img/pin-active.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

function Map(props: MapProps): JSX.Element {
  const { centerLocation, offers, selectedOfferId, className } = props;

  const mapRef = useRef(null);
  const map = useMap(mapRef, centerLocation);

  useEffect(() => {
    if (map) {
      const markerLayer = layerGroup().addTo(map);
      offers.forEach((offer) => {
        const marker = new Marker({
          lat: offer.location.latitude,
          lng: offer.location.longitude,
        });

        marker
          .setIcon(
            selectedOfferId !== undefined && offer.id === selectedOfferId
              ? currentCustomIcon
              : defaultCustomIcon
          )
          .addTo(markerLayer);
      });

      return () => {
        map.removeLayer(markerLayer);
      };
    }
  }, [map, offers, selectedOfferId]);

  useEffect(() => {
    if (map) {
      map.setView(
        {
          lat: centerLocation.latitude,
          lng: centerLocation.longitude,
        },
        centerLocation.zoom ?? DEFAULT_ZOOM
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, centerLocation.latitude, centerLocation.longitude]);

  return (
    <div
      className={`${className ?? ''} map`}
      style={{ height: '500px', margin: '0 10px' }}
      ref={mapRef}
    />
  );
}

export default Map;
