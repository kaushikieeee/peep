'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, AlertCircle, Edit2, Check, X } from 'lucide-react';

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
  const [username, setUsername] = useState('reporter_001');
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [tempUsername, setTempUsername] = useState(username);

  useEffect(() => {
    // Load username from localStorage
    const savedUsername = localStorage.getItem('peep_username');
    if (savedUsername) {
      setUsername(savedUsername);
      setTempUsername(savedUsername);
    }

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

  const handleSaveUsername = () => {
    if (tempUsername.trim()) {
      setUsername(tempUsername.trim());
      localStorage.setItem('peep_username', tempUsername.trim());
      setIsEditingUsername(false);
    }
  };

  const handleCancelEdit = () => {
    setTempUsername(username);
    setIsEditingUsername(false);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-black border-b border-gray-800 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/peep/user" className="p-2 hover:bg-gray-900 rounded-lg">
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </Link>
            <h1 className="text-xl font-bold text-yellow-400">
              My Profile
            </h1>
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <div className="p-4 space-y-4">
        {/* Profile Card */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-yellow-400 bg-opacity-20 flex items-center justify-center border border-yellow-400">
                <span className="text-2xl font-bold text-yellow-400">{username.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex-1">
                {isEditingUsername ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={tempUsername}
                      onChange={(e) => setTempUsername(e.target.value)}
                      className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-white text-lg font-bold w-full focus:outline-none focus:border-yellow-400"
                      placeholder="Enter username"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveUsername}
                        className="px-2 py-1 bg-green-600 hover:bg-green-700 rounded text-white text-xs font-medium flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" /> Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-white text-xs font-medium flex items-center gap-1"
                      >
                        <X className="w-3 h-3" /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-lg font-bold text-white">{username}</h2>
                    <p className="text-sm text-gray-400">Community Reporter</p>
                    <p className="text-xs text-gray-500 mt-1">Member since today</p>
                  </>
                )}
              </div>
            </div>
            {!isEditingUsername && (
              <button
                onClick={() => setIsEditingUsername(true)}
                className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-yellow-400 transition-colors"
              >
                <Edit2 className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Privacy Disclaimer */}
          <div className="mt-4 p-3 bg-gray-800 border border-gray-700 rounded text-xs text-gray-300 space-y-1">
            <p className="font-semibold text-gray-200">🔒 Privacy Notice</p>
            <p>Your username is stored locally on your device only. It will never be sent to any server or shared with anyone.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-yellow-400 bg-opacity-10 border border-yellow-400 border-opacity-30 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-yellow-400">{reports.length}</p>
              <p className="text-xs text-gray-400">Reports</p>
            </div>
            <div className="bg-green-500 bg-opacity-10 border border-green-500 border-opacity-30 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-green-400">{reports.filter(r => r.verified).length}</p>
              <p className="text-xs text-gray-400">Verified</p>
            </div>
            <div className="bg-purple-500 bg-opacity-10 border border-purple-500 border-opacity-30 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-purple-400">{reports.reduce((sum, r) => sum + r.upvotes, 0)}</p>
              <p className="text-xs text-gray-400">Upvotes</p>
            </div>
          </div>
        </div>

        {/* My Reports Section */}
        <div>
          <h3 className="text-lg font-bold text-white mb-3">My Reports</h3>
          {loading ? (
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 text-center">
              <p className="text-gray-400">Loading reports...</p>
            </div>
          ) : reports.length > 0 ? (
            <div className="space-y-2">
              {reports.map((report) => (
                <div key={report.id} className="bg-gray-900 rounded-lg border border-gray-800 p-3 hover:border-gray-700 transition-all">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">Case #{report.id}</h4>
                        {report.verified && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-600 bg-opacity-30 text-green-400">
                            ✓ Verified
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{report.category}</p>
                      <p className="text-sm text-gray-300 mt-2">{report.note}</p>
                    </div>
                    <span
                      className="px-2 py-1 rounded text-xs font-bold flex-shrink-0"
                      style={{
                        backgroundColor: report.severity === 'High' ? 'rgba(239, 68, 68, 0.2)' : report.severity === 'Medium' ? 'rgba(251, 191, 36, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                        color: report.severity === 'High' ? '#ef4444' : report.severity === 'Medium' ? '#fbbf24' : '#22c55e',
                      }}
                    >
                      {report.severity}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-800">
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
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 text-center">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-600" />
              <p className="text-gray-400">No reports yet. Start reporting pollution!</p>
              <Link
                href="/peep/user"
                className="inline-block mt-3 px-4 py-2 rounded-lg font-medium text-black bg-yellow-400 hover:bg-yellow-500 transition-all"
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
