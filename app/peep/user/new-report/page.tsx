'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, MapPin, AlertCircle, Search, X, CheckCircle2, Share2, Camera, AlertTriangle } from 'lucide-react';
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

const categories = [
  'Soil contamination',
  'Stagnant water',
  'Plastic / microplastics',
  'Damaged turf / turf runoff',
  'Waste dumping',
  'Other',
];

const severities = [
  { label: 'Low', color: '#c6f6d5', textColor: '#15803d' },
  { label: 'Medium', color: '#fcd34d', textColor: '#78350f' },
  { label: 'High', color: '#fca5a5', textColor: '#7f1d1d' },
];

export default function NewReportPage() {
  // Location state
  const [location, setLocation] = useState<{ lat: number; lng: number; name?: string } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [useManualSearch, setUseManualSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<POI[]>([]);

  // Form state
  const [category, setCategory] = useState('');
  const [severity, setSeverity] = useState('');
  const [description, setDescription] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState('');

  const router = useRouter();

  // Auto-fetch location on mount
  useEffect(() => {
    if (!useManualSearch) {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ lat: latitude, lng: longitude, name: 'Current Location' });
            setIsLoadingLocation(false);
          },
          (err) => {
            console.log('[NewReport] Geolocation error:', err.message);
            setLocationError('Unable to access your location. Please enable location permissions.');
            setIsLoadingLocation(false);
          }
        );
      } else {
        setLocationError('Geolocation is not supported by your browser.');
        setIsLoadingLocation(false);
      }
    } else {
      setIsLoadingLocation(false);
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
    setLocation({ lat: poi.lat, lng: poi.lng, name: poi.name });
    setSearchQuery('');
    setSearchResults([]);
    setUseManualSearch(false);
  };

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPhotoBase64(base64);
        setPhotoPreview(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all required fields
    if (!location?.lat || !location?.lng) {
      setSubmitError('Location is required');
      return;
    }
    if (!category) {
      setSubmitError('Please select a pollution category');
      return;
    }
    if (!severity) {
      setSubmitError('Please select a severity level');
      return;
    }
    if (!description.trim()) {
      setSubmitError('Please describe the issue');
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError('');

      console.log('[NewReport] Submitting evidence directly without sessionStorage:', {
        lat: location.lat,
        lng: location.lng,
        category,
        severity,
        description,
        reporter: reporterName || 'Anonymous',
        hasPhoto: !!photoBase64,
      });

      // Prepare evidence data
      const evidenceData = {
        lat: location.lat,
        lng: location.lng,
        category,
        severity,
        note: description,
        reporter: reporterName || 'Anonymous',
        date: new Date().toISOString().split('T')[0],
        zone: 'User Submitted',
        upvotes: 0,
        verified: false,
        status: 'Open',
        images: photoBase64 ? [photoBase64] : [],
      };

      // Submit to API
      const response = await fetch('/api/evidence/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(evidenceData),
      });

      console.log('[NewReport] API response:', { status: response.status, ok: response.ok });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Failed to submit report (${response.status})`);
      }

      const result = await response.json();
      console.log('[NewReport] Submission successful:', result);

      setSubmittedId(result.id || `E${Date.now()}`);
      setSubmitted(true);
    } catch (err) {
      console.error('[NewReport] Error submitting report:', err);
      setSubmitError(err instanceof Error ? err.message : 'Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success screen
  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ backgroundColor: 'var(--peep-neutral-1)' }}>
        <CheckCircle2 className="w-16 h-16 mb-4" style={{ color: 'var(--peep-primary)' }} />
        <h1 className="text-2xl font-bold mb-2 text-center text-balance">Report Submitted!</h1>
        <p className="text-gray-600 text-center mb-2">Your evidence has been added to PEEP.</p>
        <p className="text-xs text-gray-500 text-center mb-6">ID: {submittedId}</p>

        <Link
          href="/peep/user"
          className="w-full max-w-sm py-3 px-4 rounded-2xl font-semibold text-white text-center transition-all active:scale-95"
          style={{ backgroundColor: 'var(--peep-primary)' }}
        >
          Back to Home
        </Link>

        <button className="w-full max-w-sm mt-2 py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm flex items-center justify-center gap-2">
          <Share2 className="w-4 h-4" /> Share This Report
        </button>
      </div>
    );
  }

  // Location not ready
  if (isLoadingLocation && !useManualSearch) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <Link href="/peep/user" className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-semibold">New Report</h1>
          <div className="w-10" />
        </div>

        <div className="flex-1 px-4 py-8 flex flex-col items-center justify-center">
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
        </div>
      </div>
    );
  }

  // Location error
  if (locationError && !useManualSearch) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <Link href="/peep/user" className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-semibold">New Report</h1>
          <div className="w-10" />
        </div>

        <div className="flex-1 px-4 py-8 flex flex-col items-center justify-center">
          <div className="w-full max-w-sm text-center space-y-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto bg-red-100">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Location Access Required</h2>
            <p className="text-sm text-gray-600">{locationError}</p>
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
        </div>
      </div>
    );
  }

  // Main form
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
        <Link href="/peep/user" className="p-2 hover:bg-gray-100 rounded-lg">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-lg font-semibold">New Report</h1>
        <div className="w-10" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {/* Location */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-900">Location *</label>
          {location ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 space-y-2">
              <p className="text-sm font-medium text-green-900">{location.name || `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`}</p>
              <button
                type="button"
                onClick={() => {
                  setLocation(null);
                  setUseManualSearch(true);
                }}
                className="text-xs text-green-700 hover:text-green-900 font-semibold"
              >
                Change Location
              </button>
            </div>
          ) : useManualSearch ? (
            <div className="space-y-3">
              <div className="relative">
                <div className="flex items-center gap-2 px-3 py-2 border-2 border-gray-300 rounded-lg">
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
                      type="button"
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
                        type="button"
                        onClick={() => handleSelectLocation(poi)}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors"
                      >
                        <p className="font-medium text-gray-900 text-sm">{poi.name}</p>
                        <p className="text-xs text-gray-600 mt-0.5">{poi.zone}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2 text-xs text-gray-600">
                <p className="font-semibold text-gray-700">Suggested locations:</p>
                <div className="grid grid-cols-2 gap-2">
                  {MOCK_POIS.slice(0, 6).map((poi) => (
                    <button
                      key={`${poi.lat}-${poi.lng}`}
                      type="button"
                      onClick={() => handleSelectLocation(poi)}
                      className="p-2 text-left rounded border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
                    >
                      <p className="text-sm font-medium text-gray-900">{poi.name}</p>
                      <p className="text-xs text-gray-500">{poi.zone}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-900">Pollution Type *</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select category...</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Severity */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-900">Severity *</label>
          <div className="space-y-2">
            {severities.map((sev) => (
              <button
                key={sev.label}
                type="button"
                onClick={() => setSeverity(sev.label)}
                className={`w-full p-3 rounded-lg border-2 transition-all text-left font-semibold ${
                  severity === sev.label ? 'border-gray-400 shadow-md' : 'border-gray-200 hover:border-gray-300'
                }`}
                style={{
                  backgroundColor: sev.color,
                  color: sev.textColor,
                }}
              >
                {sev.label}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-900">Description *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, 200))}
            placeholder="Describe what you see. What's the issue? What's the impact?"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            rows={4}
          />
          <p className="text-xs text-gray-500 mt-1 text-right">{description.length}/200 characters</p>
        </div>

        {/* Photo */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-900">Photo (optional)</label>
          {photoPreview ? (
            <div className="space-y-2">
              <img src={photoPreview} alt="Preview" className="w-full rounded-lg object-cover max-h-48" />
              <button
                type="button"
                onClick={() => {
                  setPhotoBase64(null);
                  setPhotoPreview(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                  if (cameraInputRef.current) cameraInputRef.current.value = '';
                }}
                className="w-full py-2 px-4 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 text-sm font-semibold"
              >
                Remove Photo
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="w-full py-3 px-4 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-all flex items-center justify-center gap-2 text-sm font-semibold text-gray-700"
              >
                <Camera className="w-5 h-5" /> Take Photo
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 px-4 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-all text-sm font-semibold text-gray-700"
              >
                Choose from Gallery
              </button>
            </div>
          )}
          <input ref={cameraInputRef} type="file" accept="image/*" capture onChange={handlePhotoCapture} className="hidden" />
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoCapture} className="hidden" />
        </div>

        {/* Reporter Name */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-900">Your Name (optional)</label>
          <input
            type="text"
            value={reporterName}
            onChange={(e) => setReporterName(e.target.value)}
            placeholder="Leave blank to be anonymous"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* Error message */}
        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{submitError}</p>
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting || !location || !category || !severity || !description.trim()}
          className="w-full py-4 px-4 rounded-2xl font-semibold text-white transition-all active:scale-95 disabled:opacity-50 sticky bottom-0 mt-6"
          style={{ backgroundColor: 'var(--peep-primary)' }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
}
