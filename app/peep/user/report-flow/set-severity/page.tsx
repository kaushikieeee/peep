'use client';

import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const severities = [
  { level: 'Low', description: 'Minor issue, no immediate health risk', color: '#10b981' },
  { level: 'Medium', description: 'Could affect people in the area', color: '#f59e0b' },
  { level: 'High', description: 'Serious threat to public health', color: '#ef4444' },
];

export default function SetSeverityPage() {
  const [selected, setSelected] = useState<string>('');

  useEffect(() => {
    const saved = sessionStorage.getItem('peep-report-severity');
    if (saved) setSelected(saved);
  }, []);

  const handleSelect = (level: string) => {
    setSelected(level);
    sessionStorage.setItem('peep-report-severity', level);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <Link href="/peep/user/report-flow/select-category" className="p-2 hover:bg-gray-100 rounded-lg">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-lg font-semibold">How bad could it be?</h1>
        <div className="w-10" />
      </div>

      {/* Progress Stepper */}
      <div className="px-4 py-3 bg-gray-50 flex justify-between items-center text-xs font-semibold overflow-x-auto gap-1">
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs" style={{ backgroundColor: 'var(--peep-primary)' }}>✓</div>
          <p className="mt-1 text-gray-600 text-xs">Photo</p>
        </div>
        <div className="flex-1 h-0.5 bg-gray-300 flex-shrink-0" />
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs" style={{ backgroundColor: 'var(--peep-primary)' }}>✓</div>
          <p className="mt-1 text-gray-600 text-xs">Title</p>
        </div>
        <div className="flex-1 h-0.5 bg-gray-300 flex-shrink-0" />
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs" style={{ backgroundColor: 'var(--peep-primary)' }}>✓</div>
          <p className="mt-1 text-gray-600 text-xs">Type</p>
        </div>
        <div className="flex-1 h-0.5 bg-gray-300 flex-shrink-0" />
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs" style={{ backgroundColor: 'var(--peep-primary)' }}>4</div>
          <p className="mt-1 text-gray-600 text-xs">Impact</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-6 flex flex-col">
        <h2 className="text-base font-semibold text-gray-900 mb-4">How bad could it affect people?</h2>
        <div className="space-y-3 flex-1">
          {severities.map(({ level, description, color }) => (
            <button
              key={level}
              onClick={() => handleSelect(level)}
              className="w-full p-4 rounded-lg border-2 text-left transition-all"
              style={{
                borderColor: selected === level ? color : '#e5e7eb',
                backgroundColor: selected === level ? `${color}15` : 'white',
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                <div>
                  <p className="font-semibold text-gray-900">{level}</p>
                  <p className="text-sm text-gray-600">{description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="mt-6 space-y-2">
          <Link
            href={selected ? '/peep/user/report-flow/confirm-submit' : '#'}
            onClick={(e) => !selected && e.preventDefault()}
            className="block w-full py-3 px-4 rounded-lg font-semibold text-white text-center"
            style={{ backgroundColor: selected ? 'var(--peep-primary)' : '#ccc' }}
          >
            Next: Review & Submit
          </Link>
        </div>
      </div>
    </div>
  );
}
