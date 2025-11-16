'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle, AlertCircle, Info } from 'lucide-react';

const severities = [
  { label: 'Low', color: 'rgba(34, 197, 94, 0.2)', textColor: '#22c55e', icon: Info },
  { label: 'Medium', color: 'rgba(251, 191, 36, 0.2)', textColor: '#fbbf24', icon: AlertCircle },
  { label: 'High', color: 'rgba(239, 68, 68, 0.2)', textColor: '#ef4444', icon: AlertTriangle },
];

export default function SetSeverityStep() {
  const [severity, setSeverity] = useState('');
  const router = useRouter();

  const handleContinue = () => {
    if (severity) {
      sessionStorage.setItem('peep-report-severity', severity);
      router.push('/peep/user/report-flow/describe-issue');
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
                backgroundColor: step <= 5 ? 'var(--peep-primary)' : 'rgba(255,255,255,0.1)',
              }}
            />
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">Step 5 of 7</p>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-4 py-6">
        <h2 className="text-xl font-semibold mb-2 text-balance text-white">How severe is the issue?</h2>
        <p className="text-sm text-gray-400 mb-8">Select the severity level.</p>

        {/* Severity buttons - Glassmorphism */}
        <div className="space-y-3 mb-6">
          {severities.map((sev) => {
            const Icon = sev.icon;
            return (
              <button
                key={sev.label}
                onClick={() => setSeverity(sev.label)}
                className={`w-full p-4 rounded-2xl backdrop-blur-xl border-2 transition-all ${
                  severity === sev.label ? 'border-white/40 shadow-lg shadow-white/20' : 'border-white/20 hover:border-white/30'
                }`}
                style={{
                  backgroundColor: sev.color,
                  color: sev.textColor,
                }}
              >
                <div className="flex items-center gap-3 font-semibold text-lg">
                  <Icon className="w-6 h-6" />
                  {sev.label}
                </div>
              </button>
            );
          })}
        </div>

        {/* Info message - Glassmorphism */}
        {severity && (
          <div className="backdrop-blur-xl bg-gradient-to-br from-yellow-400/20 to-yellow-600/10 border border-yellow-400/30 rounded-2xl p-3 text-sm text-yellow-300">
            Severity: <span className="font-semibold">{severity}</span> — this will help authorities prioritize action.
          </div>
        )}
      </div>

      {/* Bottom CTA - Glassmorphism */}
      <div className="backdrop-blur-xl bg-white/5 border-t border-white/10 px-4 py-4 space-y-2">
        <button
          onClick={handleContinue}
          disabled={!severity}
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
