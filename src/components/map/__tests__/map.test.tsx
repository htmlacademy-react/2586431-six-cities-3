import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import Map from '../map';
import { createMockOffer } from '../../../store/__tests__/test-utils';
import { TLocation } from '../../../types/offer';

vi.mock('leaflet', () => {
  const mockMapInstance = {
    setView: vi.fn(),
    addLayer: vi.fn(),
    removeLayer: vi.fn(),
  };

  const mockMarker = {
    setIcon: vi.fn().mockReturnThis(),
    addTo: vi.fn().mockReturnThis(),
  };

  const mockLayerGroup = vi.fn(() => ({
    addTo: vi.fn().mockReturnThis(),
  }));

  return {
    Map: vi.fn(() => mockMapInstance),
    TileLayer: vi.fn(),
    Icon: vi.fn(),
    Marker: vi.fn(() => mockMarker),
    layerGroup: mockLayerGroup,
  };
});

vi.mock('../useMap', () => ({
  default: vi.fn(() => ({
    setView: vi.fn(),
    addLayer: vi.fn(),
    removeLayer: vi.fn(),
  })),
}));

describe('Map', () => {
  const mockLocation: TLocation = {
    latitude: 48.8566,
    longitude: 2.3522,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly', () => {
    const { container } = render(
      <Map centerLocation={mockLocation} offers={[]} />
    );

    const mapElement = container.querySelector('.map');
    expect(mapElement).toBeInTheDocument();
    expect(mapElement).toHaveStyle({ height: '500px' });
  });

  it('should apply custom className', () => {
    const { container } = render(
      <Map
        centerLocation={mockLocation}
        offers={[]}
        className="custom-map-class"
      />
    );

    const mapElement = container.querySelector('.map');
    expect(mapElement).toHaveClass('custom-map-class');
    expect(mapElement).toHaveClass('map');
  });

  it('should render with offers', () => {
    const offers = [
      createMockOffer({
        id: '1',
        location: { latitude: 48.8566, longitude: 2.3522 },
      }),
      createMockOffer({
        id: '2',
        location: { latitude: 48.8606, longitude: 2.3376 },
      }),
    ];

    const { container } = render(
      <Map centerLocation={mockLocation} offers={offers} />
    );

    const mapElement = container.querySelector('.map');
    expect(mapElement).toBeInTheDocument();
  });

  it('should render with selectedOfferId', () => {
    const offers = [
      createMockOffer({
        id: '1',
        location: { latitude: 48.8566, longitude: 2.3522 },
      }),
    ];

    const { container } = render(
      <Map centerLocation={mockLocation} offers={offers} selectedOfferId="1" />
    );

    const mapElement = container.querySelector('.map');
    expect(mapElement).toBeInTheDocument();
  });
});
