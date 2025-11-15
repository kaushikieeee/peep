'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl, { type Map as MaplibreMap } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface MapPin {
  id: number;
  lat: number;
  lng: number;
  category: string;
  severity: 'Low' | 'Medium' | 'High';
  note?: string;
}

const severityColors = {
  Low: '#16a34a',
  Medium: '#f59e0b',
  High: '#ef4444',
};

interface LiveMapProps {
  pins: MapPin[];
  onPinClick?: (pin: MapPin) => void;
}

export default function LiveMap({ pins, onPinClick }: LiveMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<MaplibreMap | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;
    
    console.log('[LiveMap] Initializing Maplibre GL');

    try {
      // Check for WebGL support
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        console.error('[LiveMap] WebGL not supported');
      }

      const mapInstance = new maplibregl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            'osm': {
              type: 'raster',
              tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
              tileSize: 256,
              attribution: '© OpenStreetMap contributors'
            }
          },
          layers: [
            {
              id: 'osm',
              type: 'raster',
              source: 'osm',
              minzoom: 0,
              maxzoom: 19
            }
          ]
        },
        center: [77.0269, 11.0420],
        zoom: 13,
      });

      mapInstance.on('load', () => {
        console.log('[LiveMap] Map loaded successfully');
        map.current = mapInstance;
      });

      mapInstance.on('error', (e: any) => {
        console.error('[LiveMap] Map error event:', {
          message: e?.message,
          type: e?.type,
          error: e?.error,
        });
      });

      mapInstance.on('style.load', () => {
        console.log('[LiveMap] Style loaded');
      });

      return () => {
        if (map.current) {
          try {
            map.current.remove();
          } catch (e) {
            console.error('[LiveMap] Error removing map:', e);
          }
          map.current = null;
        }
      };
    } catch (err) {
      console.error('[LiveMap] Error creating map:', err);
      if (err instanceof Error) {
        console.error('[LiveMap] Error details:', err.message);
      }
    }
  }, []);

  // Add markers when pins change
  useEffect(() => {
    if (!map.current) return;

    console.log('[LiveMap] Adding', pins.length, 'markers');

    // Remove existing markers
    const existingMarkers = document.querySelectorAll('.pin-marker');
    existingMarkers.forEach(marker => marker.remove());

    // Add new markers
    pins.forEach((pin) => {
      // Create marker element
      const markerEl = document.createElement('div');
      markerEl.className = 'pin-marker';
      markerEl.style.cssText = `
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        cursor: pointer;
      `;
      // Use emoji based on severity
      const severityEmojis = {
        Low: '❗',
        Medium: '❗️❗️',
        High: '⚠️',
      };
      markerEl.textContent = severityEmojis[pin.severity];
      // Adjust letter spacing for medium severity to reduce gap
      if (pin.severity === 'Medium') {
        markerEl.style.letterSpacing = '-0.3em';
        markerEl.style.fontSize = '20px';
      }

      // Create marker (without popup - use card instead)
      const marker = new maplibregl.Marker({ element: markerEl })
        .setLngLat([pin.lng, pin.lat])
        .addTo(map.current!);

      // Add click handler to show card
      markerEl.addEventListener('click', () => {
        onPinClick?.(pin);
      });
    });
  }, [pins, onPinClick]);

  // Get user location and center map on it, fallback to mock data center
  useEffect(() => {
    const centerMapOnLocation = (lng: number, lat: number) => {
      if (map.current) {
        map.current.flyTo({
          center: [lng, lat],
          zoom: 15,
          duration: 1500,
        });
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc: [number, number] = [position.coords.longitude, position.coords.latitude];
          setUserLocation(loc);
          console.log('[LiveMap] Got user location:', loc);
          centerMapOnLocation(loc[0], loc[1]);
        },
        (error) => {
          console.log('[LiveMap] Geolocation error:', error.code, '- Using fallback location');
          // Fallback to mock data center point (11.0420, 77.0269)
          centerMapOnLocation(77.0269, 11.0420);
        },
        { timeout: 5000, maximumAge: 3600000 }
      );
    } else {
      console.log('[LiveMap] Geolocation not available - Using fallback location');
      // Fallback to mock data center point
      centerMapOnLocation(77.0269, 11.0420);
    }
  }, []);

  // Add user location marker
  useEffect(() => {
    if (!map.current || !userLocation) return;

    const userMarkerEl = document.createElement('div');
    userMarkerEl.style.cssText = `
      background-color: #3b82f6;
      border: 3px solid white;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    `;

    new maplibregl.Marker({ element: userMarkerEl })
      .setLngLat(userLocation)
      .addTo(map.current);
  }, [userLocation]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-gray-100">
      <div
        ref={mapContainer}
        className="w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />

    </div>
  );
}
