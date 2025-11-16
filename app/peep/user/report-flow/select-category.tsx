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
    <div className="min-h-screen flex flex-col bg-black">
      {/* Header - Glassmorphism */}
      <div className="backdrop-blur-xl bg-white/10 border-b border-white/10 px-4 py-4 flex items-center gap-2">
        <button onClick={() => router.back()} className="p-1 text-white hover:text-gray-300 transition">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold text-white">Report Pollution</h1>
      </div>

      {/* Progress - Glassmorphism */}
      <div className="backdrop-blur-xl bg-white/5 px-4 py-3 border-b border-white/10">
        <div className="flex justify-between items-center gap-2">
          {[1, 2, 3, 4, 5, 6, 7].map((step) => (
            <div
              key={step}
              className="flex-1 h-2 rounded-full"
              style={{
                backgroundColor: step <= 4 ? 'var(--peep-primary)' : 'rgba(255,255,255,0.1)',
              }}
            />
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">Step 4 of 7</p>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-4 py-6">
        <h2 className="text-xl font-semibold mb-2 text-balance text-white">What type of pollution?</h2>
        <p className="text-sm text-gray-400 mb-6">Select the category that best describes the issue.</p>

        {/* Dropdown - Glassmorphism */}
        <div className="relative mb-6">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full px-4 py-3 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 text-white text-left font-medium flex items-center justify-between hover:bg-white/15 transition"
          >
            {category || 'Select category...'}
            <ChevronDown className="w-5 h-5 text-gray-300" />
          </button>

          {dropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 backdrop-blur-xl bg-black border border-white/20 rounded-2xl shadow-2xl z-10 overflow-hidden">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setCategory(cat);
                    setDropdownOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left text-white hover:bg-white/10 border-b border-white/10 last:border-b-0 transition"
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Description - Glassmorphism */}
        {category && (
          <div className="backdrop-blur-xl bg-gradient-to-br from-yellow-400/20 to-yellow-600/10 border border-yellow-400/30 rounded-2xl p-3 text-sm text-yellow-300">
            Selected: <span className="font-semibold">{category}</span>
          </div>
        )}
      </div>

      {/* Bottom CTA - Glassmorphism */}
      <div className="backdrop-blur-xl bg-white/5 border-t border-white/10 px-4 py-4 space-y-2">
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
          className="w-full py-2 px-4 rounded-lg border border-white/20 hover:bg-white/10 text-gray-300 text-sm transition"
        >
          Back
        </button>
      </div>
    </div>
  );
}
