'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, MapPin, AlertCircle, Search, X } from 'lucide-react';
import Link from 'next/link';
import { fuzzySearch } from '@/lib/fuzzy-search';

interface POI {
  name: string;
  lat: number;
  lng: number;
  zone: string;
}

const MOCK_POIS: POI[] = [
  { name: 'School Gate', lat: 12.9716, lng: 77.5946, zone: 'Zone P1' },
  { name: 'Park North', lat: 12.9740, lng: 77.5955, zone: 'Zone W2' },
  { name: 'Sports Field', lat: 12.9705, lng: 77.5935, zone: 'Zone P2' },
  { name: 'Drainage Area', lat: 12.9719, lng: 77.5950, zone: 'Zone P1' },
  { name: 'Construction Site', lat: 12.9715, lng: 77.5965, zone: 'Zone C3' },
  { name: 'Residential Corner', lat: 12.9710, lng: 77.5920, zone: 'Zone W3' },
  { name: 'Industrial Zone', lat: 12.9745, lng: 77.5945, zone: 'Zone S1' },
  { name: 'Local Market', lat: 12.9695, lng: 77.5955, zone: 'Zone P3' },
  { name: 'Park South', lat: 12.9735, lng: 77.5930, zone: 'Zone O1' },
  { name: 'Walking Trail', lat: 12.9725, lng: 77.5938, zone: 'Zone C2' },
];

export default function ReportFlowPage() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [useManualSearch, setUseManualSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<POI[]>([]);

  useEffect(() => {
    if (!useManualSearch) {
      // Fetch user's current location
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ lat: latitude, lng: longitude });
            // Store location in session storage for the report
            sessionStorage.setItem('peep-report-lat', latitude.toString());
            sessionStorage.setItem('peep-report-lng', longitude.toString());
            setIsLoading(false);
          },
          (err) => {
            console.log('[v0] Geolocation error:', err.message);
            setError('Unable to access your location. Please enable location permissions.');
            setIsLoading(false);
          }
        );
      } else {
        setError('Geolocation is not supported by your browser.');
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [useManualSearch]);

  // Handle location search
  useEffect(() => {
    if (searchQuery.trim()) {
      const results = fuzzySearch(searchQuery, MOCK_POIS);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleSelectLocation = (poi: POI) => {
    setLocation({ lat: poi.lat, lng: poi.lng });
    sessionStorage.setItem('peep-report-lat', poi.lat.toString());
    sessionStorage.setItem('peep-report-lng', poi.lng.toString());
    setSearchQuery('');
    setSearchResults([]);
    setUseManualSearch(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <Link href="/peep/user" className="p-2 hover:bg-gray-100 rounded-lg">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-lg font-semibold">New Report</h1>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-8 flex flex-col items-center justify-center">
        {isLoading && !useManualSearch ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto animate-pulse" style={{ backgroundColor: 'var(--peep-primary)' }}>
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Finding your location...</h2>
            <p className="text-sm text-gray-600">This helps us pinpoint where the issue is.</p>
            <button
              onClick={() => setUseManualSearch(true)}
              className="text-sm font-semibold"
              style={{ color: 'var(--peep-primary)' }}
            >
              Search location instead
            </button>
          </div>
        ) : error && !useManualSearch ? (
          <div className="w-full max-w-sm text-center space-y-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto bg-red-100">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Location Access Required</h2>
            <p className="text-sm text-gray-600">{error}</p>
            <p className="text-xs text-gray-500">Please enable location in your browser settings and refresh.</p>
            <div className="flex gap-2">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 py-3 px-4 rounded-lg font-semibold text-white transition-all active:scale-95"
                style={{ backgroundColor: 'var(--peep-primary)' }}
              >
                Try Again
              </button>
              <button
                onClick={() => setUseManualSearch(true)}
                className="flex-1 py-3 px-4 rounded-lg font-semibold border-2"
                style={{ borderColor: 'var(--peep-primary)', color: 'var(--peep-primary)' }}
              >
                Search Instead
              </button>
            </div>
          </div>
        ) : useManualSearch ? (
          <div className="w-full max-w-sm space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Search Location</h2>
            
            <div className="relative">
              <div className="flex items-center gap-2 px-3 py-2 border-2 border-gray-300 rounded-lg focus-within:border-2" style={{ 'focusWithinBorderColor': 'var(--peep-primary)' }}>
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Type location name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="flex-1 outline-none text-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSearchResults([]);
                    }}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>

              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                  {searchResults.map((poi) => (
                    <button
                      key={`${poi.lat}-${poi.lng}`}
                      onClick={() => handleSelectLocation(poi)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors"
                    >
                      <p className="font-medium text-gray-900 text-sm">{poi.name}</p>
                      <p className="text-xs text-gray-600 mt-0.5">{poi.zone}</p>
                    </button>
                  ))}
                </div>
              )}

              {searchQuery && searchResults.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg p-4 text-center text-sm text-gray-600 z-50">
                  No locations found. Try another name.
                </div>
              )}
            </div>

            <div className="space-y-2 text-xs text-gray-600">
              <p className="font-semibold text-gray-700">Suggested locations:</p>
              <div className="grid grid-cols-2 gap-2">
                {MOCK_POIS.slice(0, 6).map((poi) => (
                  <button
                    key={`${poi.lat}-${poi.lng}`}
                    onClick={() => handleSelectLocation(poi)}
                    className="p-2 text-left rounded border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
                  >
                    <p className="text-sm font-medium text-gray-900">{poi.name}</p>
                    <p className="text-xs text-gray-500">{poi.zone}</p>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setUseManualSearch(false);
                setSearchQuery('');
                setSearchResults([]);
                setIsLoading(true);
              }}
              className="w-full py-3 px-4 rounded-lg font-semibold border-2 transition-all active:scale-95"
              style={{ borderColor: 'var(--peep-primary)', color: 'var(--peep-primary)' }}
            >
              Use Auto Location Instead
            </button>
          </div>
        ) : (
          <div className="w-full max-w-sm text-center space-y-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: 'var(--peep-primary)' }}>
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Location Captured</h2>
            <p className="text-sm text-gray-600">
              Lat: {location?.lat.toFixed(4)}, Lng: {location?.lng.toFixed(4)}
            </p>
            <p className="text-xs text-gray-500">Ready to document the issue?</p>
            <div className="flex gap-2">
              <Link
                href="/peep/user/report-flow/capture-photo"
                className="flex-1 py-3 px-4 rounded-lg font-semibold text-white transition-all active:scale-95"
                style={{ backgroundColor: 'var(--peep-primary)' }}
              >
                Next: Capture Photo
              </Link>
              <button
                onClick={() => {
                  setUseManualSearch(true);
                  setLocation(null);
                }}
                className="flex-1 py-3 px-4 rounded-lg font-semibold border-2"
                style={{ borderColor: 'var(--peep-primary)', color: 'var(--peep-primary)' }}
              >
                Change Location
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
