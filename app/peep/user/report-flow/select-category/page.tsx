'use client';

import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const categories = [
  'Damaged turf / turf runoff',
  'Stagnant water / standing water',
  'Plastic sediment / microplastics',
  'Dark soil / sediment residue',
  'Waste dumping',
  'Chemical spill',
  'Air pollution / smoke',
  'Other',
];

export default function SelectCategoryPage() {
  const [selected, setSelected] = useState<string>('');

  useEffect(() => {
    const saved = sessionStorage.getItem('peep-report-category');
    if (saved) setSelected(saved);
  }, []);

  const handleSelect = (category: string) => {
    setSelected(category);
    sessionStorage.setItem('peep-report-category', category);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <Link href="/peep/user/report-flow/add-title" className="p-2 hover:bg-gray-100 rounded-lg">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-lg font-semibold">What type of problem?</h1>
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
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs" style={{ backgroundColor: 'var(--peep-primary)' }}>3</div>
          <p className="mt-1 text-gray-600 text-xs">Type</p>
        </div>
        <div className="flex-1 h-0.5 bg-gray-300 flex-shrink-0" />
        <div className="flex flex-col items-center flex-shrink-0 opacity-50">
          <div className="w-6 h-6 rounded-full flex items-center justify-center bg-gray-300 text-gray-600 text-xs">4</div>
          <p className="mt-1 text-gray-600 text-xs">Impact</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-6 flex flex-col">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Choose what sort of problem this is:</h2>
        <div className="space-y-2 flex-1 overflow-y-auto">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleSelect(category)}
              className="w-full p-4 rounded-lg border-2 text-left font-medium transition-all"
              style={{
                borderColor: selected === category ? 'var(--peep-primary)' : '#e5e7eb',
                backgroundColor: selected === category ? 'rgba(74, 150, 110, 0.05)' : 'white',
                color: '#1f2937',
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="mt-6 space-y-2">
          <Link
            href={selected ? '/peep/user/report-flow/set-severity' : '#'}
            onClick={(e) => !selected && e.preventDefault()}
            className="block w-full py-3 px-4 rounded-lg font-semibold text-white text-center"
            style={{ backgroundColor: selected ? 'var(--peep-primary)' : '#ccc' }}
          >
            Next: How Bad?
          </Link>
        </div>
      </div>
    </div>
  );
}
