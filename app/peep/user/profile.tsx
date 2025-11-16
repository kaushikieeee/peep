'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, Trophy, Star, Target } from 'lucide-react';
import Link from 'next/link';
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

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: 'star' | 'trophy' | 'target';
  unlocked: boolean;
}

const badges: Badge[] = [
  {
    id: 'first-reporter',
    name: 'First Reporter',
    description: 'Submitted your first report',
    icon: 'star',
    unlocked: true,
  },
  {
    id: 'neighborhood-watch',
    name: 'Neighborhood Watch',
    description: 'Submitted 5+ reports in one area',
    icon: 'target',
    unlocked: true,
  },
  {
    id: 'top-reporter',
    name: 'Top 10% Reporter (City-wide)',
    description: 'Ranked in top 10% by upvotes',
    icon: 'trophy',
    unlocked: false,
  },
  {
    id: 'verified-expert',
    name: 'Verified Expert',
    description: 'Had 10+ reports verified',
    icon: 'star',
    unlocked: false,
  },
];

export default function UserProfilePage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [userReports, setUserReports] = useState<Report[]>([]);
  const [view, setView] = useState<'stats' | 'reports'>('stats');

  useEffect(() => {
    // Load evidence from API (which now fetches from Google Sheets)
    fetch('/api/data/reports')
      .then((res) => res.json())
      .then((data) => {
        setReports(data);
        // Simulate user's own reports - use first 3 items
        setUserReports(data.slice(0, 3));
      })
      .catch(() => {
        console.error('Failed to load evidence data');
        // No fallback data - empty state
        setReports([]);
        setUserReports([]);
      });
  }, []);

  const myUpvotes = userReports.reduce((sum, r) => sum + r.upvotes, 0);
  const verifiedReports = userReports.filter((r) => r.verified).length;
  const contributionScore = userReports.length * 10 + myUpvotes * 2 + verifiedReports * 15;

  const getBadgeIcon = (icon: string) => {
    switch (icon) {
      case 'trophy':
        return <Trophy className="w-5 h-5" />;
      case 'target':
        return <Target className="w-5 h-5" />;
      default:
        return <Star className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white" style={{ backgroundColor: 'var(--peep-neutral-1)' }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 flex items-center gap-2 sticky top-0 z-40">
        <Link href="/peep/user" className="p-1">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-lg font-semibold">My Profile</h1>
      </div>

      {/* Profile header */}
      <div className="bg-white border-b border-gray-200 px-4 py-6">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-16 h-16 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white text-2xl font-bold"
            style={{ backgroundColor: 'var(--peep-primary)' }}
          >
            U
          </div>

          {/* Name and stats */}
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900">You</h2>
            <p className="text-sm text-gray-600">PEEP Reporter</p>
          </div>
        </div>

        {/* View toggle */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mt-6">
          <button
            onClick={() => setView('stats')}
            className="flex-1 px-3 py-2 text-xs font-medium rounded transition-all"
            style={{
              backgroundColor: view === 'stats' ? 'var(--peep-primary)' : 'transparent',
              color: view === 'stats' ? 'white' : '#666',
            }}
          >
            Stats
          </button>
          <button
            onClick={() => setView('reports')}
            className="flex-1 px-3 py-2 text-xs font-medium rounded transition-all"
            style={{
              backgroundColor: view === 'reports' ? 'var(--peep-primary)' : 'transparent',
              color: view === 'reports' ? 'white' : '#666',
            }}
          >
            My Reports
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-24 space-y-4">
        {view === 'stats' ? (
          <>
            {/* Big stats */}
            <div className="space-y-3">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <p className="text-xs text-gray-600 mb-1">Reports Sent</p>
                <p
                  className="text-3xl font-bold"
                  style={{ color: 'var(--peep-primary)' }}
                >
                  {userReports.length}
                </p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <p className="text-xs text-gray-600 mb-1">Upvotes Received</p>
                <p
                  className="text-3xl font-bold"
                  style={{ color: 'var(--peep-accent)' }}
                >
                  {myUpvotes}
                </p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <p className="text-xs text-gray-600 mb-1">Contribution Score</p>
                <p
                  className="text-3xl font-bold"
                  style={{ color: 'var(--peep-neutral-2)' }}
                >
                  {contributionScore}
                </p>
              </div>
            </div>

            {/* Badges section */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Badges</h3>
              <div className="grid grid-cols-2 gap-3">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className="p-3 rounded-lg border transition-all"
                    style={{
                      backgroundColor: badge.unlocked ? 'var(--peep-neutral-1)' : '#f3f4f6',
                      borderColor: badge.unlocked ? 'var(--peep-primary)' : '#d1d5db',
                      opacity: badge.unlocked ? 1 : 0.6,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        style={{
                          color: badge.unlocked ? 'var(--peep-primary)' : '#999',
                        }}
                      >
                        {getBadgeIcon(badge.icon)}
                      </div>
                      <p className="text-xs font-semibold text-gray-900">{badge.name}</p>
                    </div>
                    <p className="text-xs text-gray-600">{badge.description}</p>
                    {!badge.unlocked && (
                      <p className="text-xs text-gray-500 mt-1 font-medium">Locked</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* My reports list */}
            {userReports.length > 0 ? (
              userReports.map((report) => (
                <EvidenceCard key={report.id} {...report} />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No reports yet. Start by creating one!</p>
                <Link
                  href="/peep/user/report-flow/upload-photo"
                  className="inline-block mt-4 py-2 px-4 rounded-lg text-sm font-medium text-white transition-all"
                  style={{ backgroundColor: 'var(--peep-primary)' }}
                >
                  Create Report
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
