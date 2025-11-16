'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function AddTitlePage() {
  const [title, setTitle] = useState('');
  const maxLength = 100;
  const router = useRouter();

  const handleContinue = () => {
    if (title.trim()) {
      sessionStorage.setItem('peep-report-title', title);
      router.push('/peep/user/report-flow/select-category');
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
                backgroundColor: step <= 3 ? 'var(--peep-primary)' : 'rgba(255,255,255,0.1)',
              }}
            />
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">Step 3 of 7</p>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-4 py-6">
        <h2 className="text-xl font-semibold mb-2 text-balance text-white">Give it a title</h2>
        <p className="text-sm text-gray-400 mb-6">A short, clear title for your report.</p>

        {/* Input - Glassmorphism */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value.slice(0, maxLength))}
          placeholder="e.g. Pollution near school entrance..."
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-2 text-white placeholder-gray-500"
        />

        {/* Character count */}
        <div className="text-xs text-gray-400 mb-6 text-right">
          {title.length}/{maxLength} characters
        </div>

        {/* Info - Glassmorphism */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-3 text-xs text-gray-300 mb-6">
          <p className="font-semibold mb-1 text-white">Good examples:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>"Stagnant water pooling near park"</li>
            <li>"Chemical spill on main road"</li>
            <li>"Plastic waste dumping site"</li>
          </ul>
        </div>
      </div>

      {/* Bottom CTA - Glassmorphism */}
      <div className="backdrop-blur-xl bg-white/5 border-t border-white/10 px-4 py-4 space-y-2">
        <button
          onClick={handleContinue}
          disabled={!title.trim()}
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
