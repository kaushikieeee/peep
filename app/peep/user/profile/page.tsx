'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, AlertCircle, Edit2 } from 'lucide-react';

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

export default function ProfilePage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('[ProfilePage] Fetching reports from API...');
    fetch('/api/data/reports')
      .then(r => r.json())
      .then(reportsData => {
        console.log('[ProfilePage] Loaded reports:', reportsData.length);
        setReports(reportsData);
        setLoading(false);
      })
      .catch(err => {
        console.error('[ProfilePage] Failed to load data:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/peep/user" className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </Link>
            <h1 className="text-xl font-bold" style={{ color: 'var(--peep-primary)' }}>
              My Profile
            </h1>
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <div className="p-4 space-y-4">
        {/* Profile Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">P</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Pragadeesh</h2>
                <p className="text-sm text-gray-600">Local Reporter</p>
                <p className="text-xs text-gray-500 mt-1">Joined 3 months ago</p>
              </div>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Edit2 className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-blue-600">{reports.length}</p>
              <p className="text-xs text-gray-600">Reports</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-green-600">{reports.filter(r => r.verified).length}</p>
              <p className="text-xs text-gray-600">Verified</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-purple-600">{reports.reduce((sum, r) => sum + r.upvotes, 0)}</p>
              <p className="text-xs text-gray-600">Upvotes</p>
            </div>
          </div>
        </div>

        {/* My Reports Section */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3">My Reports</h3>
          {loading ? (
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <p className="text-gray-600">Loading reports...</p>
            </div>
          ) : reports.length > 0 ? (
            <div className="space-y-2">
              {reports.map((report) => (
                <div key={report.id} className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-gray-900">Case #{report.id}</h4>
                        {report.verified && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ✓ Verified
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{report.category}</p>
                      <p className="text-sm text-gray-700 mt-2">{report.note}</p>
                    </div>
                    <span
                      className="px-2 py-1 rounded text-xs font-bold flex-shrink-0"
                      style={{
                        backgroundColor: report.severity === 'High' ? '#fca5a5' : report.severity === 'Medium' ? '#fcd34d' : '#c6f6d5',
                        color: report.severity === 'High' ? '#7f1d1d' : report.severity === 'Medium' ? '#78350f' : '#15803d',
                      }}
                    >
                      {report.severity}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {report.zone}
                    </div>
                    <span>{report.upvotes} upvotes</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-gray-600">No reports yet. Start reporting pollution!</p>
              <Link
                href="/peep/user"
                className="inline-block mt-3 px-4 py-2 rounded-lg font-medium text-white transition-all"
                style={{ backgroundColor: 'var(--peep-primary)' }}
              >
                Go to Map
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
