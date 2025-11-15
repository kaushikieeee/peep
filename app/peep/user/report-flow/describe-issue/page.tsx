'use client';

import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function DescribeIssuePage() {
  const [description, setDescription] = useState('');

  useEffect(() => {
    const saved = sessionStorage.getItem('peep-report-description');
    if (saved) setDescription(saved);
  }, []);

  const handleChange = (text: string) => {
    setDescription(text);
    sessionStorage.setItem('peep-report-description', text);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <Link href="/peep/user/report-flow/set-severity" className="p-2 hover:bg-gray-100 rounded-lg">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-lg font-semibold">Report Evidence</h1>
        <div className="w-10" />
      </div>

      {/* Progress Stepper */}
      <div className="px-4 py-3 bg-gray-50 flex justify-between items-center text-xs font-semibold">
        <div className="flex flex-col items-center">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: 'var(--peep-primary)' }}>✓</div>
          <p className="mt-1 text-gray-600">Photo</p>
        </div>
        <div className="flex-1 h-0.5 mx-1 bg-gray-300 mt-3" />
        <div className="flex flex-col items-center">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: 'var(--peep-primary)' }}>✓</div>
          <p className="mt-1 text-gray-600">Category</p>
        </div>
        <div className="flex-1 h-0.5 mx-1 bg-gray-300 mt-3" />
        <div className="flex flex-col items-center">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: 'var(--peep-primary)' }}>✓</div>
          <p className="mt-1 text-gray-600">Severity</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-6 flex flex-col">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Add more details</h2>
        <p className="text-sm text-gray-600 mb-4">Describe what you see and when it started (optional but helpful).</p>
        
        <textarea
          value={description}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="e.g., Dark runoff from field after heavy rain, seen since last week..."
          className="flex-1 p-4 border-2 border-gray-200 rounded-lg focus:outline-none resize-none"
          style={{ borderColor: 'var(--peep-primary)' }}
        />

        {/* Word count */}
        <p className="text-xs text-gray-500 mt-2">{description.length}/500 characters</p>

        {/* Navigation buttons */}
        <div className="mt-6 space-y-2">
          <Link
            href="/peep/user/report-flow/confirm-submit"
            className="block w-full py-3 px-4 rounded-lg font-semibold text-white text-center"
            style={{ backgroundColor: 'var(--peep-primary)' }}
          >
            Next: Review & Submit
          </Link>
        </div>
      </div>
    </div>
  );
}
