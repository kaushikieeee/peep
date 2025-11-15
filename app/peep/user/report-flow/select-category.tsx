'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ChevronDown } from 'lucide-react';

const categories = [
  'Soil contamination',
  'Stagnant water',
  'Plastic / microplastics',
  'Damaged turf / turf runoff',
  'Waste dumping',
  'Other',
];

export default function SelectCategoryStep() {
  const [category, setCategory] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const handleContinue = () => {
    if (category) {
      sessionStorage.setItem('peep-report-category', category);
      router.push('/peep/user/report-flow/set-severity');
    }
  };

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
                backgroundColor: step <= 2 ? 'var(--peep-primary)' : '#e5e7eb',
              }}
            />
          ))}
        </div>
        <p className="text-xs text-gray-600 mt-2">Step 2 of 5</p>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-4 py-6">
        <h2 className="text-xl font-semibold mb-2 text-balance">What type of pollution?</h2>
        <p className="text-sm text-gray-600 mb-6">Select the category that best describes the issue.</p>

        {/* Dropdown */}
        <div className="relative mb-6">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-left font-medium flex items-center justify-between hover:border-gray-400"
          >
            {category || 'Select category...'}
            <ChevronDown className="w-5 h-5 text-gray-600" />
          </button>

          {dropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setCategory(cat);
                    setDropdownOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        {category && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-900">
            Selected: <span className="font-semibold">{category}</span>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="px-4 py-4 bg-white border-t border-gray-200 space-y-2">
        <button
          onClick={handleContinue}
          disabled={!category}
          className="w-full py-3 px-4 rounded-2xl font-semibold text-white transition-all active:scale-95 disabled:opacity-50"
          style={{ backgroundColor: 'var(--peep-primary)' }}
        >
          Continue
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
