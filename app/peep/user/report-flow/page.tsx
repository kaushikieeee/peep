'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, MapPin, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function ReportFlowPage() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch user's current location
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          // Store location in session storage for the report
          sessionStorage.setItem('peep-report-location', JSON.stringify({ lat: latitude, lng: longitude }));
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
  }, []);

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
        {isLoading ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto animate-pulse" style={{ backgroundColor: 'var(--peep-primary)' }}>
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Finding your location...</h2>
            <p className="text-sm text-gray-600">This helps us pinpoint where the issue is.</p>
          </div>
        ) : error ? (
          <div className="w-full max-w-sm text-center space-y-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto bg-red-100">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Location Access Required</h2>
            <p className="text-sm text-gray-600">{error}</p>
            <p className="text-xs text-gray-500">Please enable location in your browser settings and refresh.</p>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 px-4 rounded-lg font-semibold text-white"
              style={{ backgroundColor: 'var(--peep-primary)' }}
            >
              Try Again
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
            <Link
              href="/peep/user/report-flow/capture-photo"
              className="block w-full py-3 px-4 rounded-lg font-semibold text-white transition-all active:scale-95"
              style={{ backgroundColor: 'var(--peep-primary)' }}
            >
              Next: Capture Photo
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
