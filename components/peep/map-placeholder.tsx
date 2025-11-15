'use client';

import { useState } from 'react';
import { X, ZoomIn, ZoomOut } from 'lucide-react';

interface MapPin {
  id: number;
  lat: number;
  lng: number;
  category: string;
  severity: 'Low' | 'Medium' | 'High';
}

const severityColors = {
  Low: '#16a34a',
  Medium: '#f59e0b',
  High: '#ef4444',
};

interface MapPlaceholderProps {
  pins: MapPin[];
  onPinClick?: (pin: MapPin) => void;
  selectedPin?: MapPin | null;
  onClose?: () => void;
}

export default function MapPlaceholder({
  pins,
  onPinClick,
  selectedPin,
  onClose,
}: MapPlaceholderProps) {
  const [zoom, setZoom] = useState(12);

  return (
    <div className="w-full h-full flex flex-col bg-blue-50 relative">
      {/* Map container */}
      <div className="flex-1 relative bg-gradient-to-br from-blue-100 via-blue-50 to-green-50 overflow-hidden">
        {/* Simple map grid background */}
        <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 800 600">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#cbd5e1" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="800" height="600" fill="url(#grid)" />
        </svg>

        {/* Map pins */}
        {pins.map((pin, idx) => {
          const x = ((pin.lng - 77.59) / 0.02) * 100;
          const y = ((12.975 - pin.lat) / 0.01) * 100;

          return (
            <button
              key={pin.id}
              onClick={() => onPinClick?.(pin)}
              className="absolute w-8 h-8 rounded-full border-2 border-white shadow-lg hover:scale-110 transition-transform cursor-pointer flex items-center justify-center"
              style={{
                left: `${Math.max(5, Math.min(95, x))}%`,
                top: `${Math.max(5, Math.min(95, y))}%`,
                backgroundColor: severityColors[pin.severity],
              }}
              title={`${pin.category} - ${pin.severity}`}
            >
              <span className="text-white text-xs font-bold">{pin.severity[0]}</span>
            </button>
          );
        })}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg border border-gray-200 shadow-lg p-3 max-w-xs">
          <h3 className="text-xs font-semibold mb-2 text-gray-900">Legend</h3>
          <div className="space-y-1">
            {Object.entries(severityColors).map(([severity, color]) => (
              <div key={severity} className="flex items-center gap-2 text-xs">
                <div
                  className="w-4 h-4 rounded-full border border-white shadow-sm"
                  style={{ backgroundColor: color }}
                />
                <span className="text-gray-700">{severity} Severity</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {pins.length} report{pins.length !== 1 ? 's' : ''} in this area
          </p>
        </div>

        {/* Zoom controls */}
        <div className="absolute top-4 right-4 bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden">
          <button
            onClick={() => setZoom(Math.min(zoom + 2, 18))}
            className="p-2 hover:bg-gray-100 border-b border-gray-200"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4 text-gray-700" />
          </button>
          <button
            onClick={() => setZoom(Math.max(zoom - 2, 8))}
            className="p-2 hover:bg-gray-100"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4 text-gray-700" />
          </button>
        </div>

        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 bg-white rounded-lg border border-gray-200 shadow-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        )}
      </div>

      {/* Info panel */}
      {selectedPin && (
        <div className="bg-white border-t border-gray-200 p-4 max-h-32 overflow-y-auto">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">Case #{selectedPin.id}</p>
              <p className="text-xs text-gray-600">{selectedPin.category}</p>
              <span
                className="inline-block text-xs font-bold rounded-full px-2 py-1 mt-1"
                style={{
                  backgroundColor:
                    selectedPin.severity === 'High'
                      ? '#fca5a5'
                      : selectedPin.severity === 'Medium'
                        ? '#fcd34d'
                        : '#c6f6d5',
                  color:
                    selectedPin.severity === 'High'
                      ? '#7f1d1d'
                      : selectedPin.severity === 'Medium'
                        ? '#78350f'
                        : '#15803d',
                }}
              >
                {selectedPin.severity}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
