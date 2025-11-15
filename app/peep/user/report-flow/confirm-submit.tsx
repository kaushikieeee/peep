'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Share2 } from 'lucide-react';

export default function ConfirmSubmitStep() {
  const [reportData, setReportData] = useState<any>(null);
  const [severityScore, setSeverityScore] = useState(65);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Gather all report data from session storage
    const photo = sessionStorage.getItem('peep-report-photo');
    const category = sessionStorage.getItem('peep-report-category');
    const severity = sessionStorage.getItem('peep-report-severity');
    const description = sessionStorage.getItem('peep-report-description');
    const lat = sessionStorage.getItem('peep-report-lat');
    const lng = sessionStorage.getItem('peep-report-lng');

    setReportData({ photo, category, severity, description, lat, lng });

    // Mock severity score calculation
    const baseScore = severity === 'High' ? 80 : severity === 'Medium' ? 65 : 40;
    setSeverityScore(baseScore + Math.random() * 20 - 10);
  }, []);

  const handleSubmit = async () => {
    // Mock submit to API or database
    console.log('Submitting report:', reportData);
    
    // Clear session storage
    sessionStorage.removeItem('peep-report-photo');
    sessionStorage.removeItem('peep-report-category');
    sessionStorage.removeItem('peep-report-severity');
    sessionStorage.removeItem('peep-report-description');
    sessionStorage.removeItem('peep-report-lat');
    sessionStorage.removeItem('peep-report-lng');

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ backgroundColor: 'var(--peep-neutral-1)' }}>
        <CheckCircle2 className="w-16 h-16 mb-4" style={{ color: 'var(--peep-primary)' }} />
        <h1 className="text-2xl font-bold mb-2 text-center text-balance">Report Submitted!</h1>
        <p className="text-gray-600 text-center mb-6">Your evidence has been added to PEEP. Authorities will review it soon.</p>

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

  if (!reportData) return null;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--peep-neutral-1)' }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 flex items-center gap-2">
        <button onClick={() => router.back()} className="p-1">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold">Report Pollution</h1>
      </div>

      {/* Progress */}
      <div className="bg-white px-4 py-3 border-b border-gray-200">
        <div className="flex justify-between items-center gap-2">
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              className="flex-1 h-2 rounded-full"
              style={{
                backgroundColor: 'var(--peep-primary)',
              }}
            />
          ))}
        </div>
        <p className="text-xs text-gray-600 mt-2">Step 5 of 5</p>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-4 py-6 space-y-4">
        <h2 className="text-xl font-semibold text-balance">Review Your Report</h2>

        {/* Photo preview */}
        {reportData.photo && (
          <div>
            <p className="text-sm font-medium mb-2 text-gray-700">Photo</p>
            <img src={reportData.photo || "/placeholder.svg"} alt="Report preview" className="w-full rounded-lg object-cover max-h-48" />
          </div>
        )}

        {/* Details */}
        <div className="space-y-3">
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <p className="text-xs text-gray-500">Category</p>
            <p className="font-medium">{reportData.category}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <p className="text-xs text-gray-500">Severity</p>
            <p className="font-medium">{reportData.severity}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <p className="text-xs text-gray-500">Description</p>
            <p className="font-medium text-sm">{reportData.description}</p>
          </div>
        </div>

        {/* Severity score slider */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-blue-900 mb-3">Estimated Severity Score</p>
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <input
                type="range"
                min="0"
                max="100"
                value={severityScore}
                readOnly
                className="w-full h-2 rounded-full accent-blue-600"
              />
            </div>
            <span className="text-xl font-bold text-blue-900 min-w-fit">{Math.round(severityScore)}</span>
          </div>
          <p className="text-xs text-blue-700 mt-2">Based on category and severity level</p>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="px-4 py-4 bg-white border-t border-gray-200 space-y-2">
        <button
          onClick={handleSubmit}
          className="w-full py-3 px-4 rounded-2xl font-semibold text-white transition-all active:scale-95"
          style={{ backgroundColor: 'var(--peep-primary)' }}
        >
          Submit Report
        </button>
        <button
          onClick={() => router.back()}
          className="w-full py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm"
        >
          Back
        </button>
      </div>
    </div>
  );
}
