'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle, AlertCircle, Info } from 'lucide-react';

const severities = [
  { label: 'Low', color: '#c6f6d5', textColor: '#15803d', icon: Info },
  { label: 'Medium', color: '#fcd34d', textColor: '#78350f', icon: AlertCircle },
  { label: 'High', color: '#fca5a5', textColor: '#7f1d1d', icon: AlertTriangle },
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
                backgroundColor: step <= 3 ? 'var(--peep-primary)' : '#e5e7eb',
              }}
            />
          ))}
        </div>
        <p className="text-xs text-gray-600 mt-2">Step 3 of 5</p>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-4 py-6">
        <h2 className="text-xl font-semibold mb-2 text-balance">How severe is the issue?</h2>
        <p className="text-sm text-gray-600 mb-8">Select the severity level.</p>

        {/* Severity buttons */}
        <div className="space-y-3 mb-6">
          {severities.map((sev) => {
            const Icon = sev.icon;
            return (
              <button
                key={sev.label}
                onClick={() => setSeverity(sev.label)}
                className={`w-full p-4 rounded-lg border-2 transition-all ${
                  severity === sev.label ? 'border-gray-400 shadow-md' : 'border-gray-200 hover:border-gray-300'
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

        {/* Info message */}
        {severity && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-900">
            Severity: <span className="font-semibold">{severity}</span> — this will help authorities prioritize action.
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="px-4 py-4 bg-white border-t border-gray-200 space-y-2">
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
          className="w-full py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm"
        >
          Back
        </button>
      </div>
    </div>
  );
}
