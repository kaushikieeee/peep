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
                backgroundColor: step <= 6 ? 'var(--peep-primary)' : 'rgba(255,255,255,0.1)',
              }}
            />
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">Step 6 of 7</p>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-4 py-6">
        <h2 className="text-xl font-semibold mb-2 text-balance text-white">Describe what you see</h2>
        <p className="text-sm text-gray-400 mb-6">One line is enough. What's the issue? What's the impact?</p>

        {/* Textarea - Glassmorphism */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value.slice(0, maxLength))}
          placeholder="Blackish runoff near school gate, kids play here..."
          className="flex-1 w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-2 text-white placeholder-gray-500"
          minRows={6}
        />

        {/* Character count */}
        <div className="text-xs text-gray-400 mb-6 text-right">
          {description.length}/{maxLength} characters
        </div>

        {/* Info - Glassmorphism */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-3 text-xs text-gray-300">
          <p className="font-semibold mb-1 text-white">Good examples:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>"Stagnant water pooling, foul smell, insects"</li>
            <li>"Chemical residue, discoloration visible"</li>
            <li>"Plastic debris scattered throughout area"</li>
          </ul>
        </div>
      </div>

      {/* Bottom CTA - Glassmorphism */}
      <div className="backdrop-blur-xl bg-white/5 border-t border-white/10 px-4 py-4 space-y-2">
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
          className="w-full py-2 px-4 rounded-lg border border-white/20 hover:bg-white/10 text-gray-300 text-sm transition"
        >
          Back
        </button>
      </div>
    </div>
  );
}
