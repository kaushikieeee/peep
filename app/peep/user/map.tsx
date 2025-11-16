'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, MapPinIcon } from 'lucide-react';
import Link from 'next/link';
import LiveMap from '@/components/peep/live-map';
import EvidenceCard from '@/components/peep/evidence-card';

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

export default function UserMapPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedPin, setSelectedPin] = useState<Report | null>(null);
  const [view, setView] = useState<'map' | 'list'>('map');

  useEffect(() => {
    // Load evidence from API (which now fetches from Google Sheets)
    fetch('/api/data/reports')
      .then((res) => res.json())
      .then((data) => setReports(data))
      .catch(() => {
        // No fallback data - empty state
        console.error('Failed to load evidence data');
        setReports([]);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white" style={{ backgroundColor: 'var(--peep-neutral-1)' }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Link href="/peep/user" className="p-1">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-semibold">Pollution Map</h1>
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setView('map')}
            className="px-3 py-1 text-xs font-medium rounded transition-all"
            style={{
              backgroundColor: view === 'map' ? 'var(--peep-primary)' : 'transparent',
              color: view === 'map' ? 'white' : '#666',
            }}
          >
            Map
          </button>
          <button
            onClick={() => setView('list')}
            className="px-3 py-1 text-xs font-medium rounded transition-all"
            style={{
              backgroundColor: view === 'list' ? 'var(--peep-primary)' : 'transparent',
              color: view === 'list' ? 'white' : '#666',
            }}
          >
            List
          </button>
        </div>
      </div>

      {/* View switcher */}
      {view === 'map' ? (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1">
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
          </div>

          {/* Bottom panel with selected report */}
          {selectedPin && (
            <div className="bg-white border-t border-gray-200 px-4 py-3 max-h-40 overflow-y-auto">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-sm font-semibold">Case #{selectedPin.id}</h3>
                <button
                  onClick={() => setSelectedPin(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs text-gray-600 mb-2">{selectedPin.category}</p>
              <p className="text-sm text-gray-700 mb-3">{selectedPin.note}</p>
              <Link
                href={`/peep/user/evidence/${selectedPin.id}`}
                className="inline-block py-2 px-3 rounded-lg text-xs font-medium text-white transition-all"
                style={{ backgroundColor: 'var(--peep-primary)' }}
              >
                View Details
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {reports.length > 0 ? (
            reports.map((report) => (
              <EvidenceCard
                key={report.id}
                {...report}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <MapPinIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-gray-600">No reports in this area yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
