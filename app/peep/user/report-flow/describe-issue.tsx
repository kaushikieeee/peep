'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function DescribeIssueStep() {
  const [description, setDescription] = useState('');
  const maxLength = 200;
  const router = useRouter();

  const handleContinue = () => {
    if (description.trim()) {
      sessionStorage.setItem('peep-report-description', description);
      router.push('/peep/user/report-flow/confirm-submit');
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
                backgroundColor: step <= 4 ? 'var(--peep-primary)' : '#e5e7eb',
              }}
            />
          ))}
        </div>
        <p className="text-xs text-gray-600 mt-2">Step 4 of 5</p>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-4 py-6">
        <h2 className="text-xl font-semibold mb-2 text-balance">Describe what you see</h2>
        <p className="text-sm text-gray-600 mb-6">One line is enough. What's the issue? What's the impact?</p>

        {/* Textarea */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value.slice(0, maxLength))}
          placeholder="Blackish runoff near school gate, kids play here..."
          className="flex-1 w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-gray-400 mb-2"
          minRows={6}
        />

        {/* Character count */}
        <div className="text-xs text-gray-500 mb-6 text-right">
          {description.length}/{maxLength} characters
        </div>

        {/* Info */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-700">
          <p className="font-semibold mb-1">Good examples:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>"Stagnant water pooling, foul smell, insects"</li>
            <li>"Chemical residue, discoloration visible"</li>
            <li>"Plastic debris scattered throughout area"</li>
          </ul>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="px-4 py-4 bg-white border-t border-gray-200 space-y-2">
        <button
          onClick={handleContinue}
          disabled={!description.trim()}
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
