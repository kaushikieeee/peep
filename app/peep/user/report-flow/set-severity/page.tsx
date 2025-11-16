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
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/20 backdrop-blur-xl bg-white/5">
        <Link href="/peep/user/report-flow/select-category" className="p-2 hover:bg-white/10 rounded-lg">
          <ChevronLeft className="w-5 h-5 text-white" />
        </Link>
        <h1 className="text-lg font-semibold text-white">How bad could it be?</h1>
        <div className="w-10" />
      </div>

      {/* Progress Stepper */}
      <div className="px-4 py-2 bg-white/5 flex justify-between items-center text-xs font-semibold overflow-x-auto gap-1 border-b border-white/20">
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs" style={{ backgroundColor: 'var(--peep-primary)' }}>✓</div>
          <p className="mt-1 text-white/60 text-xs">Photo</p>
        </div>
        <div className="flex-1 h-0.5 bg-white/20 flex-shrink-0" />
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs" style={{ backgroundColor: 'var(--peep-primary)' }}>✓</div>
          <p className="mt-1 text-white/60 text-xs">Title</p>
        </div>
        <div className="flex-1 h-0.5 bg-white/20 flex-shrink-0" />
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs" style={{ backgroundColor: 'var(--peep-primary)' }}>✓</div>
          <p className="mt-1 text-white/60 text-xs">Type</p>
        </div>
        <div className="flex-1 h-0.5 bg-white/20 flex-shrink-0" />
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs" style={{ backgroundColor: 'var(--peep-primary)' }}>4</div>
          <p className="mt-1 text-white/60 text-xs">Impact</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-2 flex flex-col">
        <h2 className="text-sm font-semibold text-white mb-2">How bad could it affect people?</h2>
        <div className="space-y-1 flex-1">
          {severities.map(({ level, description, color }) => (
            <button
              key={level}
              onClick={() => handleSelect(level)}
              className="w-full p-2 rounded-lg border-2 text-left transition-all"
              style={{
                borderColor: selected === level ? color : 'rgba(255, 255, 255, 0.2)',
                backgroundColor: selected === level ? `${color}20` : 'rgba(255, 255, 255, 0.03)',
              }}
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                <div>
                  <p className="font-semibold text-white text-sm">{level}</p>
                  <p className="text-xs text-white/60">{description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="mt-2 space-y-1">
          <Link
            href={selected ? '/peep/user/report-flow/describe-issue' : '#'}
            onClick={(e) => !selected && e.preventDefault()}
            className="block w-full py-2 px-4 rounded-lg font-semibold text-white text-center text-sm"
            style={{ backgroundColor: selected ? 'var(--peep-primary)' : '#ccc' }}
          >
            Next: Review & Submit
          </Link>
        </div>
      </div>
    </div>
  );
}
