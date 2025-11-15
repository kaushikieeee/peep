'use client';

import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function ConfirmSubmitPage() {
  const [formData, setFormData] = useState<any>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const photo = sessionStorage.getItem('peep-report-photo');
    const location = sessionStorage.getItem('peep-report-location');
    const title = sessionStorage.getItem('peep-report-title');
    const category = sessionStorage.getItem('peep-report-category');
    const severity = sessionStorage.getItem('peep-report-severity');

    const parsedLocation = location ? JSON.parse(location) : null;
    setFormData({ photo, location: parsedLocation, title, category, severity });
  }, []);

  const handleSubmit = () => {
    sessionStorage.removeItem('peep-report-photo');
    sessionStorage.removeItem('peep-report-location');
    sessionStorage.removeItem('peep-report-title');
    sessionStorage.removeItem('peep-report-category');
    sessionStorage.removeItem('peep-report-severity');
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--peep-primary)' }}>
          <span className="text-2xl">✓</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Report Submitted!</h1>
        <p className="text-gray-600 mb-6">Your evidence is now public and visible to local authorities. Thank you for keeping us informed.</p>
        <Link href="/peep/user" className="w-full py-3 px-4 rounded-lg font-semibold text-white text-center" style={{ backgroundColor: 'var(--peep-primary)' }}>
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <Link href="/peep/user/report-flow/set-severity" className="p-2 hover:bg-gray-100 rounded-lg">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-lg font-semibold">Review Report</h1>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-6 space-y-4 overflow-y-auto">
        {/* Photo */}
        {formData.photo && (
          <div className="rounded-lg overflow-hidden border-2 border-gray-200">
            <img src={formData.photo || "/placeholder.svg"} alt="Evidence" className="w-full aspect-square object-cover" />
          </div>
        )}

        {/* Title */}
        {formData.title && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Report Title</p>
            <p className="font-semibold text-gray-900">{formData.title}</p>
          </div>
        )}

        {/* Location */}
        {formData.location && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Location</p>
            <p className="text-sm text-gray-700">Lat: {formData.location.lat.toFixed(4)}, Lng: {formData.location.lng.toFixed(4)}</p>
          </div>
        )}

        {/* Category */}
        {formData.category && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Problem Type</p>
            <p className="font-semibold text-gray-900">{formData.category}</p>
          </div>
        )}

        {/* Severity */}
        {formData.severity && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Impact Level</p>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor:
                    formData.severity === 'High'
                      ? '#ef4444'
                      : formData.severity === 'Medium'
                      ? '#f59e0b'
                      : '#10b981',
                }}
              />
              <p className="font-semibold text-gray-900">{formData.severity}</p>
            </div>
          </div>
        )}
      </div>

      {/* Submission buttons */}
      <div className="px-4 py-4 space-y-2 border-t border-gray-200">
        <button
          onClick={handleSubmit}
          className="w-full py-3 px-4 rounded-lg font-semibold text-white"
          style={{ backgroundColor: 'var(--peep-primary)' }}
        >
          Submit Report
        </button>
        <Link href="/peep/user" className="block w-full py-3 px-4 rounded-lg font-semibold border-2 border-gray-300 text-gray-700 text-center hover:bg-gray-50">
          Cancel
        </Link>
      </div>
    </div>
  );
}
