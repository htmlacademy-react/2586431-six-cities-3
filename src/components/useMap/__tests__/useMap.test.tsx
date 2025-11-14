import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import React from 'react';
import useMap from '../useMap';
import { TLocation } from '../../../types/offer';
import { Map, TileLayer } from 'leaflet';

// Мокаем Leaflet
vi.mock('leaflet', () => {
  const mockMapInstance = {
    setView: vi.fn(),
    addLayer: vi.fn(),
    remove: vi.fn(),
  };

  return {
    Map: vi.fn(() => mockMapInstance),
    TileLayer: vi.fn(),
  };
});

describe('useMap', () => {
  let mapRef: React.MutableRefObject<HTMLElement | null>;
  const mockLocation: TLocation = {
    latitude: 48.8566,
    longitude: 2.3522,
  };

  beforeEach(() => {
    // Создаем mock элемент для карты
    const mockElement = document.createElement('div');
    mapRef = { current: mockElement };
    vi.clearAllMocks();
    vi.mocked(Map).mockClear();
    vi.mocked(TileLayer).mockClear();
  });

  it('should return null when mapRef.current is null', () => {
    mapRef.current = null;

    const { result } = renderHook(() => useMap(mapRef, mockLocation));

    expect(result.current).toBeNull();
  });

  it('should create map instance when mapRef.current is not null', () => {
    const { result } = renderHook(() => useMap(mapRef, mockLocation));

    expect(Map).toHaveBeenCalledTimes(1);
    expect(Map).toHaveBeenCalledWith(mapRef.current, {
      center: {
        lat: mockLocation.latitude,
        lng: mockLocation.longitude,
      },
      zoom: 10,
      attributionControl: false,
    });

    expect(TileLayer).toHaveBeenCalledTimes(1);
    expect(TileLayer).toHaveBeenCalledWith(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      }
    );

    expect(result.current).not.toBeNull();
  });

  it('should create map only once even if location changes', () => {
    const { result, rerender } = renderHook(
      ({ location }) => useMap(mapRef, location),
      {
        initialProps: { location: mockLocation },
      }
    );

    const firstMapInstance = result.current;
    expect(Map).toHaveBeenCalledTimes(1);

    const newLocation: TLocation = {
      latitude: 52.370216,
      longitude: 4.895168,
    };

    rerender({ location: newLocation });

    expect(Map).toHaveBeenCalledTimes(1);
    expect(result.current).toBe(firstMapInstance);
  });

  it('should create map only once even if component rerenders', () => {
    const { rerender } = renderHook(() => useMap(mapRef, mockLocation));

    expect(Map).toHaveBeenCalledTimes(1);

    rerender();

    expect(Map).toHaveBeenCalledTimes(1);
  });

  it('should not create map if mapRef becomes null after initial render', () => {
    const { rerender } = renderHook(() => useMap(mapRef, mockLocation));

    expect(Map).toHaveBeenCalledTimes(1);

    mapRef.current = null;
    rerender();

    // Map уже создан, поэтому не должен создаваться снова
    expect(Map).toHaveBeenCalledTimes(1);
  });

  it('should use correct center coordinates from location', () => {
    const customLocation: TLocation = {
      latitude: 50.938361,
      longitude: 6.959974,
    };

    renderHook(() => useMap(mapRef, customLocation));

    expect(Map).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        center: {
          lat: customLocation.latitude,
          lng: customLocation.longitude,
        },
      })
    );
  });
});
