'use client';

import { useState, useEffect } from 'react';
import { MapPin, AlertCircle, ChevronUp, Loader2, Check, Share2, Eye, Menu, User } from 'lucide-react';
import Link from 'next/link';
import LiveMap from '@/components/peep/live-map';
import { fuzzySearch } from '@/lib/fuzzy-search';

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

interface POI {
  name: string;
  lat: number;
  lng: number;
  zone: string;
}

type ReportingStep = 'location' | 'details' | 'impact' | 'success';

const MOCK_REPORTS: Report[] = [];

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

export default function MapPage() {
  // Map & location state
  const [reports, setReports] = useState<Report[]>([]);
  const [pois, setPois] = useState<POI[]>(MOCK_POIS);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [selectedPin, setSelectedPin] = useState<Report | null>(null);

  // Reporting state
  const [showReportSheet, setShowReportSheet] = useState(false);
  const [reportStep, setReportStep] = useState<ReportingStep>('location');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // Step 1: Location
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; label: string } | null>(null);
  const [locationSearch, setLocationSearch] = useState('');
  const [searchResults, setSearchResults] = useState<POI[]>([]);
  
  // Step 2: Details
  const [reportTitle, setReportTitle] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [reportCategory, setReportCategory] = useState('');
  const [reportSeverity, setReportSeverity] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [scrubExif, setScrubExif] = useState(true);
  
  // Step 3: Impact
  const [impacts, setImpacts] = useState<string[]>([]);
  const [affectedPeople, setAffectedPeople] = useState('');
  const [sharePublicly, setSharePublicly] = useState(true);
  
  // Success
  const [newCaseId, setNewCaseId] = useState<number | null>(null);

  // Load data from API
  useEffect(() => {
    console.log('[MapPage] Fetching reports from API...');
    fetch('/api/data/reports')
      .then(r => r.json())
      .then(reportsData => {
        console.log('[MapPage] Loaded reports:', reportsData.length);
        // Map the data to include imagePlaceholder from images array
        const mappedData = reportsData.map((report: any) => ({
          ...report,
          imagePlaceholder: report.images && report.images[0] ? report.images[0] : '/data/mock-reports.json'
        }));
        setReports(mappedData);
      })
      .catch(err => console.error('[MapPage] Failed to load data:', err));
  }, []);

  // Get user location
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
          setUserLocation(loc);
          setSelectedLocation({ ...loc, label: 'Current Location' });
        },
        (err) => {
          setGeoError("Can't access your location. Type a place name or drag the pin.");
        }
      );
    }
  }, []);

  // Handle location search
  useEffect(() => {
    if (locationSearch.trim()) {
      const results = fuzzySearch(locationSearch, pois);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [locationSearch, pois]);

  // Step 1 validation
  const step1Valid = selectedLocation !== null;

  // Step 2 validation
  const step2Valid = reportTitle.trim().length >= 5 && reportDescription.trim().length > 0 && reportCategory && photoFile !== null;

  // Step 3 validation
  const step3Valid = true; // Impacts and affected people are optional

  // Handle impact toggle
  const toggleImpact = (impact: string) => {
    setImpacts(prev => prev.includes(impact) ? prev.filter(i => i !== impact) : [...prev, impact]);
  };

  // Handle submit
  const handleSubmit = () => {
    // Generate next case ID from max existing + 1
    const nextId = Math.max(...reports.map(r => r.id), 100) + 1;
    setNewCaseId(nextId);
    setReportStep('success');
    
    // In real app, would save to backend here
    console.log('[v0] Report submitted:', {
      caseId: nextId,
      title: reportTitle,
      location: selectedLocation,
      category: reportCategory,
      severity: reportSeverity,
      impacts,
      affectedPeople,
      sharePublicly
    });
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-white flex flex-col">
      {/* Header */}
      <div className="z-30 bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-balance" style={{ color: 'var(--peep-primary)' }}>
              <span className="sr-only">PEEP - </span>Pollution Map
            </h1>
            <p className="text-xs text-gray-600 mt-1">View reports near you • No reports nearby? Be the first to PEEP!</p>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              aria-label="Profile menu"
            >
              <User className="w-6 h-6 text-gray-700" />
            </button>
            {showProfileMenu && (
              <div className="absolute right-0 mt-1 bg-white rounded-lg border border-gray-200 shadow-lg p-3 min-w-max z-50">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Pragadeesh</p>
                    <p className="text-xs text-gray-600">Local Reporter</p>
                  </div>
                </div>
                <hr className="my-2" />
                <Link href="/peep/user/profile" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                  My Reports
                </Link>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                  Settings
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Map Area - absolute positioning to fill remaining space */}
      <div className="absolute top-14 left-0 right-0 bottom-0">
        <LiveMap
          pins={reports.map((r) => ({
            id: r.id,
            lat: r.lat,
            lng: r.lng,
            category: r.category,
            severity: r.severity,
            note: r.note,
          }))}
          onPinClick={(pin) => {
            const report = reports.find((r) => r.id === pin.id);
            setSelectedPin(report || null);
          }}
        />

        {/* Selected Report Card */}
        {selectedPin && (
          <div className="absolute bottom-20 left-4 right-4 bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden max-w-sm z-50">
            {/* Image */}
            <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden flex items-center justify-center">
              {selectedPin.imagePlaceholder ? (
                <img 
                  src={selectedPin.imagePlaceholder} 
                  alt={selectedPin.category}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to gray background if image fails to load
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <AlertCircle className="w-8 h-8 mb-2" />
                  <p className="text-xs">No image</p>
                </div>
              )}
            </div>
            
            {/* Content */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-sm font-bold">Case #{selectedPin.id}</h3>
                <button onClick={() => setSelectedPin(null)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>
              <p className="text-xs text-gray-600 mb-1">{selectedPin.category}</p>
              <p className="text-sm text-gray-700 mb-3">{selectedPin.note}</p>
              <div className="flex gap-2">
                <span className="px-2 py-1 rounded text-xs font-bold" style={{
                  backgroundColor: selectedPin.severity === 'High' ? '#fca5a5' : selectedPin.severity === 'Medium' ? '#fcd34d' : '#c6f6d5',
                  color: selectedPin.severity === 'High' ? '#7f1d1d' : selectedPin.severity === 'Medium' ? '#78350f' : '#15803d',
                }}>
                  {selectedPin.severity}
                </span>
                <span className="text-xs text-gray-500">By {selectedPin.reporter}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Start Report Button - Fixed at bottom */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-40 transition-all duration-300 ${showReportSheet ? 'translate-y-full' : 'translate-y-0'}`}>
        <Link
          href="/peep/user/new-report"
          className="w-full py-3 px-6 rounded-2xl font-bold text-white shadow-lg transition-all active:scale-95 block text-center"
          style={{ backgroundColor: 'var(--peep-primary)' }}
        >
          Start Report
        </Link>
      </div>

      {/* Reporting Sheet */}
      <div className={`fixed bottom-0 left-0 right-0 top-0 bg-white border-t border-gray-200 rounded-t-2xl transition-all duration-300 z-[9999] max-h-screen overflow-y-auto ${
        showReportSheet ? 'translate-y-0' : 'translate-y-full'
      }`}>
        {/* Sheet Handle */}
        <div className="sticky top-0 bg-white px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <div className="flex-1 text-center">
            <div className="text-xs font-bold text-gray-500 tracking-wide">
              STEP {reportStep === 'location' ? '1' : reportStep === 'details' ? '2' : reportStep === 'impact' ? '3' : '✓'} OF 3
            </div>
          </div>
          <button
            onClick={() => {
              if (reportStep === 'location') setShowReportSheet(false);
              else setReportStep(reportStep === 'details' ? 'location' : reportStep === 'impact' ? 'details' : 'impact');
            }}
            className="p-1 hover:bg-gray-100 rounded-lg"
            aria-label="Collapse sheet"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-4 pt-4">
          <div className="flex gap-2">
            {(['location', 'details', 'impact'] as const).map((step, idx) => (
              <div key={step} className="flex-1 h-1 rounded-full" style={{
                backgroundColor: 
                  step === 'location' ? (reportStep === 'location' || reportStep === 'details' || reportStep === 'impact' ? 'var(--peep-primary)' : '#ddd') :
                  step === 'details' ? (reportStep === 'details' || reportStep === 'impact' ? 'var(--peep-primary)' : '#ddd') :
                  reportStep === 'impact' ? 'var(--peep-primary)' : '#ddd'
              }} />
            ))}
          </div>
        </div>

        <div className="p-4 pb-8">
          {reportStep === 'success' ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto bg-green-100">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Report Submitted</h2>
              <p className="text-sm text-gray-600">Case #{newCaseId}</p>
              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => {
                    setShowReportSheet(false);
                    setReportStep('location');
                    setReportTitle('');
                    setReportDescription('');
                    setReportCategory('');
                    setImpacts([]);
                  }}
                  className="flex-1 py-3 px-4 rounded-lg font-semibold text-white transition-all active:scale-95"
                  style={{ backgroundColor: 'var(--peep-primary)' }}
                >
                  <Share2 className="w-4 h-4 inline mr-2" />
                  Share
                </button>
              </div>
            </div>
          ) : reportStep === 'location' ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Step 1: Choose Location</h3>
                
                {geoError && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3 flex gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                    <p className="text-sm text-yellow-800">{geoError}</p>
                  </div>
                )}

                {userLocation && (
                  <button
                    onClick={() => setSelectedLocation({ ...userLocation, label: 'Current Location' })}
                    className="w-full p-3 border-2 rounded-lg text-left transition-all mb-3"
                    style={{
                      borderColor: selectedLocation?.label === 'Current Location' ? 'var(--peep-primary)' : '#ddd',
                      backgroundColor: selectedLocation?.label === 'Current Location' ? 'rgba(0, 128, 96, 0.05)' : 'transparent'
                    }}
                  >
                    <p className="font-medium text-sm text-gray-900">Use My Current Location</p>
                    <p className="text-xs text-gray-600 mt-1">Lat: {userLocation.lat.toFixed(4)}, Lng: {userLocation.lng.toFixed(4)}</p>
                  </button>
                )}

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Type location name or street"
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2"
                    style={{ outlineColor: 'var(--peep-primary)' }}
                    aria-label="Search for location"
                  />
                  {searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                      {searchResults.map((poi) => (
                        <button
                          key={`${poi.lat}-${poi.lng}`}
                          onClick={() => {
                            setSelectedLocation({ lat: poi.lat, lng: poi.lng, label: poi.name });
                            setLocationSearch('');
                            setSearchResults([]);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm border-b border-gray-100 last:border-0"
                        >
                          <p className="font-medium text-gray-900">{poi.name}</p>
                          <p className="text-xs text-gray-600">{poi.zone}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {selectedLocation && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Selected Location</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{selectedLocation.label}</p>
                  <p className="text-xs text-gray-600">Lat: {selectedLocation.lat.toFixed(4)}, Lng: {selectedLocation.lng.toFixed(4)}</p>
                </div>
              )}

              <p className="text-xs text-gray-600 text-center">Location is required so authorities can find the spot.</p>

              <button
                onClick={() => step1Valid && setReportStep('details')}
                disabled={!step1Valid}
                className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: 'var(--peep-primary)' }}
              >
                Next: Add Details
              </button>
            </div>
          ) : reportStep === 'details' ? (
            <div className="space-y-4">
              <h3 className="font-bold text-gray-900">Step 2: Title, Description & Category</h3>

              <div>
                <label className="text-sm font-medium text-gray-900">Clear Title *</label>
                <input
                  type="text"
                  placeholder="e.g., Blackish runoff behind school gate"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  maxLength={100}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2"
                  aria-label="Report title"
                />
                <p className="text-xs text-gray-600 mt-1">{reportTitle.length}/100 characters</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-900">Description *</label>
                <textarea
                  placeholder="Describe what you see in one line. Add detail about when you saw it, how often, who is affected."
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  maxLength={500}
                  rows={3}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2"
                  aria-label="Report description"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-900">Category *</label>
                <select
                  value={reportCategory}
                  onChange={(e) => setReportCategory(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2"
                  aria-label="Problem category"
                >
                  <option value="">Select category...</option>
                  <option value="Soil contamination">Soil contamination</option>
                  <option value="Stagnant water">Stagnant water</option>
                  <option value="Plastic / microplastics">Plastic / microplastics</option>
                  <option value="Damaged turf / turf runoff">Damaged turf / turf runoff</option>
                  <option value="Waste dumping">Waste dumping</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-900 block mb-3">How bad is it? *</label>
                <div className="flex gap-2">
                  {(['Low', 'Medium', 'High'] as const).map((sev) => (
                    <button
                      key={sev}
                      onClick={() => setReportSeverity(sev)}
                      className="flex-1 py-2 px-3 rounded-lg font-semibold text-sm transition-all"
                      style={{
                        backgroundColor: reportSeverity === sev ? 
                          (sev === 'High' ? '#ef4444' : sev === 'Medium' ? '#eab308' : '#22c55e') :
                          '#f3f4f6',
                        color: reportSeverity === sev ? 'white' : '#666'
                      }}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-900 block mb-2">Attach Photo *</label>
                <div className="flex gap-2">
                  <label className="flex-1 px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-gray-400 transition-all">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                      className="hidden"
                      aria-label="Upload photo from gallery"
                    />
                    <p className="text-sm text-gray-600">{photoFile ? '✓ Photo selected' : 'Gallery'}</p>
                  </label>
                  <label className="flex-1 px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-gray-400 transition-all">
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                      className="hidden"
                      aria-label="Take photo with camera"
                    />
                    <p className="text-sm text-gray-600">Camera</p>
                  </label>
                </div>
              </div>

              <div>
                <button
                  onClick={() => setReportStep('location')}
                  className="flex-1 py-2 px-4 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={() => step2Valid && setReportStep('impact')}
                  disabled={!step2Valid}
                  className="flex-1 py-2 px-4 rounded-lg font-medium text-white transition-all active:scale-95 disabled:opacity-50"
                  style={{ backgroundColor: 'var(--peep-primary)' }}
                >
                  Next: Impact
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="font-bold text-gray-900">Step 3: Who's Affected?</h3>

              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">How could this affect people?</p>
                <div className="space-y-2">
                  {[
                    { id: 'health', label: 'Health (respiratory / skin)', hint: 'Respiratory or skin irritation risk' },
                    { id: 'mosquito', label: 'Mosquito / vector risk', hint: 'Breeding ground for disease vectors' },
                    { id: 'safety', label: 'Safety (slippery surfaces)', hint: 'Risk of falls or accidents' },
                    { id: 'kids', label: 'Play & sports risk for kids', hint: 'Children playing nearby' },
                    { id: 'water', label: 'Contaminated water source', hint: 'Downstream water pollution' },
                  ].map(option => (
                    <label key={option.id} className="flex items-start gap-2 p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={impacts.includes(option.id)}
                        onChange={() => toggleImpact(option.id)}
                        className="mt-1 w-4 h-4"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{option.label}</p>
                        <p className="text-xs text-gray-600">{option.hint}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-900 block mb-2">Who is affected?</label>
                <select
                  value={affectedPeople}
                  onChange={(e) => setAffectedPeople(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2"
                >
                  <option value="">Choose...</option>
                  <option value="Children">Children</option>
                  <option value="Residents">Residents</option>
                  <option value="Athletes">Athletes</option>
                  <option value="Everyone">Everyone</option>
                  <option value="Not sure">Not sure</option>
                </select>
              </div>

              <label className="flex items-start gap-2 p-2 border border-gray-200 rounded-lg">
                <input
                  type="checkbox"
                  checked={sharePublicly}
                  onChange={(e) => setSharePublicly(e.target.checked)}
                  className="mt-1 w-4 h-4"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Share photo publicly</p>
                  <p className="text-xs text-gray-600">Make your photo visible to others viewing this report.</p>
                </div>
              </label>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setReportStep('details')}
                  className="flex-1 py-2 px-4 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-3 px-4 rounded-lg font-semibold text-white transition-all active:scale-95"
                  style={{ backgroundColor: 'var(--peep-primary)' }}
                >
                  Submit Report
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
