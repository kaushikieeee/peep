'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function AddTitlePage() {
  const [title, setTitle] = useState('');
  const [savedTitle, setSavedTitle] = useState('');

  useEffect(() => {
    const saved = sessionStorage.getItem('peep-report-title');
    if (saved) {
      setTitle(saved);
      setSavedTitle(saved);
    }
  }, []);

  const handleSave = () => {
    if (title.trim()) {
      sessionStorage.setItem('peep-report-title', title);
      setSavedTitle(title);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <Link href="/peep/user/report-flow/capture-photo" className="p-2 hover:bg-gray-100 rounded-lg">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-lg font-semibold">Give It a Title</h1>
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
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: 'var(--peep-primary)' }}>2</div>
          <p className="mt-1 text-gray-600">Title</p>
        </div>
        <div className="flex-1 h-0.5 mx-1 bg-gray-300 mt-3" />
        <div className="flex flex-col items-center opacity-50">
          <div className="w-6 h-6 rounded-full flex items-center justify-center bg-gray-300 text-gray-600">3</div>
          <p className="mt-1 text-gray-600">Details</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-8 flex flex-col">
        <div className="max-w-md mx-auto w-full space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Report Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Dark soil runoff near field"
              maxLength={80}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0"
              style={{ focusRingColor: 'var(--peep-primary)' }}
            />
            <p className="text-xs text-gray-500 mt-1">{title.length}/80 characters</p>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-gray-600 font-semibold">Suggestions:</p>
            {['Turf runoff with dark sediment', 'Stagnant water pooling', 'Plastic waste near drain', 'Chemical residue on soil'].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setTitle(suggestion)}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 border border-gray-200 rounded hover:bg-gray-50"
              >
                {suggestion}
              </button>
            ))}
          </div>

          <div className="flex-1" />

          <div className="space-y-2">
            <button
              onClick={handleSave}
              className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-all active:scale-95"
              style={{ backgroundColor: title.trim() ? 'var(--peep-primary)' : '#ccc' }}
              disabled={!title.trim()}
            >
              Save Title
            </button>
            {savedTitle && (
              <Link
                href="/peep/user/report-flow/select-category"
                className="block w-full py-3 px-4 rounded-lg font-semibold text-white text-center"
                style={{ backgroundColor: 'var(--peep-primary)' }}
              >
                Next: Select Category
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
