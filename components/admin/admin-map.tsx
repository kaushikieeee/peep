'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface Report {
  id: number;
  lat: number;
  lng: number;
  category: string;
  severity: 'Low' | 'Medium' | 'High';
  note: string;
  reporter: string;
  date: string;
  zone: string;
  upvotes: number;
  verified: boolean;
  imagePlaceholder: string;
}

interface AdminMapProps {
  reports: Report[];
}

const severityEmojis = {
  Low: '❗',
  Medium: '❗❗',
  High: '⚠️',
};

export default function AdminMap({ reports }: AdminMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [mapReady, setMapReady] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
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
        map.current = mapInstance;
        setMapReady(true);
      });

      mapInstance.on('error', (e) => {
        console.error('[AdminMap] Map error:', e);
      });
    } catch (error) {
      console.error('[AdminMap] Failed to initialize map:', error);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Add markers when map is ready and reports change
  useEffect(() => {
    if (!map.current || !mapReady) return;

    try {
      // Remove existing markers
      const existingMarkers = document.querySelectorAll('.admin-pin-marker');
      existingMarkers.forEach(marker => marker.remove());

      // Add new markers
      reports.forEach((report) => {
        const markerEl = document.createElement('div');
        markerEl.className = 'admin-pin-marker';
        markerEl.style.cssText = `
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          cursor: pointer;
          user-select: none;
        `;

        const severityEmoji = severityEmojis[report.severity];
        markerEl.textContent = severityEmoji;

        // Add popup
        const popup = new maplibregl.Popup({ offset: 25 }).setHTML(`
          <div style="min-width: 150px; font-family: system-ui;">
            <p style="font-weight: bold; margin: 0 0 5px 0;">Case #${report.id}</p>
            <p style="font-size: 12px; color: #666; margin: 0 0 5px 0;">${report.category}</p>
            <p style="font-size: 12px; color: #333; margin: 0;">${report.note}</p>
            <p style="font-size: 11px; color: #999; margin: 5px 0 0 0;">${report.zone}</p>
          </div>
        `);

        // Create marker
        new maplibregl.Marker({ element: markerEl })
          .setLngLat([report.lng, report.lat])
          .setPopup(popup)
          .addTo(map.current!);
      });
    } catch (error) {
      console.error('[AdminMap] Error adding markers:', error);
    }
  }, [reports, mapReady]);

  return (
    <div 
      ref={mapContainer}
      className="w-full h-full rounded-lg overflow-hidden"
      style={{ 
        width: '100%', 
        height: '100%',
        backgroundColor: '#f0f0f0'
      }}
    />
  );
}
