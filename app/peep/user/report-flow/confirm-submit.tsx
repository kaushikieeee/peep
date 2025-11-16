'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Share2, AlertCircle } from 'lucide-react';

export default function ConfirmSubmitStep() {
  const [reportData, setReportData] = useState<any>(null);
  const [severityScore, setSeverityScore] = useState(65);
  const [submitted, setSubmitted] = useState(false);
  const [reporterName, setReporterName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Gather all report data from session storage
    const photo = sessionStorage.getItem('peep-report-photo');
    const title = sessionStorage.getItem('peep-report-title');
    const category = sessionStorage.getItem('peep-report-category');
    const severity = sessionStorage.getItem('peep-report-severity');
    const description = sessionStorage.getItem('peep-report-description');
    const lat = sessionStorage.getItem('peep-report-lat');
    const lng = sessionStorage.getItem('peep-report-lng');

    console.log('[ConfirmSubmit] Loaded report data from sessionStorage:', {
      hasPhoto: !!photo,
      title,
      category,
      severity,
      lat,
      lng,
      descriptionLength: description?.length || 0,
    });

    setReportData({ photo, title, category, severity, description, lat, lng });

    // Mock severity score calculation
    const baseScore = severity === 'High' ? 80 : severity === 'Medium' ? 65 : 40;
    setSeverityScore(baseScore + Math.random() * 20 - 10);
  }, []);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError('');

      // Get fresh data from sessionStorage (don't rely on state)
      const photo = sessionStorage.getItem('peep-report-photo');
      const title = sessionStorage.getItem('peep-report-title');
      const category = sessionStorage.getItem('peep-report-category');
      const severity = sessionStorage.getItem('peep-report-severity');
      const description = sessionStorage.getItem('peep-report-description');
      const lat = sessionStorage.getItem('peep-report-lat');
      const lng = sessionStorage.getItem('peep-report-lng');

      console.log('[ConfirmSubmit] Submitting with fresh sessionStorage data:', {
        hasPhoto: !!photo,
        title,
        category,
        severity,
        lat,
        lng,
        hasDescription: !!description,
      });

      // Prepare evidence data for submission
      const evidenceData = {
        lat: parseFloat(lat || '0') || 0,
        lng: parseFloat(lng || '0') || 0,
        category: category || '',
        severity: severity || 'Low',
        title: title || 'Untitled Report',
        note: description || '',
        reporter: reporterName || 'Anonymous',
        date: new Date().toISOString().split('T')[0],
        zone: 'User Submitted',
        upvotes: 0,
        verified: false,
        status: 'Open',
        images: photo ? [photo] : [],
      };

      console.log('[ConfirmSubmit] Submitting evidence:', {
        id: `E${Date.now()}`,
        lat: evidenceData.lat,
        lng: evidenceData.lng,
        category: evidenceData.category,
        severity: evidenceData.severity,
        title: evidenceData.title,
        hasPhoto: !!photo,
        description: evidenceData.note.substring(0, 50),
      });

      // Validate required fields
      if (!evidenceData.lat || !evidenceData.lng || !evidenceData.category) {
        throw new Error(`Missing required fields: lat=${evidenceData.lat}, lng=${evidenceData.lng}, category=${evidenceData.category}`);
      }

      console.log('[ConfirmSubmit] Making fetch request to /api/evidence/submit');

      // Submit to API endpoint
      const response = await fetch('/api/evidence/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(evidenceData),
      });

      console.log('[ConfirmSubmit] Got response:', { status: response.status, ok: response.ok });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to submit report (${response.status})`);
      }

      const result = await response.json();
      console.log('[ConfirmSubmit] Success:', result);

      // Clear session storage
      sessionStorage.removeItem('peep-report-photo');
      sessionStorage.removeItem('peep-report-title');
      sessionStorage.removeItem('peep-report-category');
      sessionStorage.removeItem('peep-report-severity');
      sessionStorage.removeItem('peep-report-description');
      sessionStorage.removeItem('peep-report-lat');
      sessionStorage.removeItem('peep-report-lng');

      setSubmitted(true);
    } catch (err) {
      console.error('[ConfirmSubmit] Error submitting report:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit report. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-black">
        <CheckCircle2 className="w-16 h-16 mb-4" style={{ color: 'var(--peep-primary)' }} />
        <h1 className="text-2xl font-bold mb-2 text-center text-balance text-white">Report Submitted!</h1>
        <p className="text-gray-400 text-center mb-6">Your evidence has been added to PEEP. Authorities will review it soon.</p>

        <Link
          href="/peep/user"
          className="w-full max-w-sm py-3 px-4 rounded-2xl font-semibold text-white text-center transition-all active:scale-95"
          style={{ backgroundColor: 'var(--peep-primary)' }}
        >
          Back to Home
        </Link>

        <button className="w-full max-w-sm mt-2 py-2 px-4 rounded-lg border border-gray-700 hover:bg-gray-900 text-gray-300 text-sm flex items-center justify-center gap-2">
          <Share2 className="w-4 h-4" /> Share This Report
        </button>
      </div>
    );
  }

  if (!reportData) return null;

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
                backgroundColor: 'var(--peep-primary)',
              }}
            />
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">Step 7 of 7</p>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-4 py-6 space-y-4">
        <h2 className="text-xl font-semibold text-balance text-white">Review Your Report</h2>

        {/* Photo preview */}
        {reportData.photo && (
          <div>
            <p className="text-sm font-medium mb-2 text-gray-300">Photo</p>
            <img src={reportData.photo || "/placeholder.svg"} alt="Report preview" className="w-full rounded-2xl object-cover max-h-48" />
          </div>
        )}

        {/* Details - Glassmorphism Cards */}
        <div className="space-y-3">
          {reportData.title && (
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-3 hover:bg-white/15 transition">
              <p className="text-xs text-gray-400">Title</p>
              <p className="font-medium text-white">{reportData.title}</p>
            </div>
          )}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-3 hover:bg-white/15 transition">
            <p className="text-xs text-gray-400">Category</p>
            <p className="font-medium text-white">{reportData.category}</p>
          </div>
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-3 hover:bg-white/15 transition">
            <p className="text-xs text-gray-400">Severity</p>
            <p className="font-medium text-white">{reportData.severity}</p>
          </div>
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-3 hover:bg-white/15 transition">
            <p className="text-xs text-gray-400">Description</p>
            <p className="font-medium text-sm text-gray-200">{reportData.description}</p>
          </div>
        </div>

        {/* Severity score slider - Glassmorphism */}
        <div className="backdrop-blur-xl bg-gradient-to-br from-yellow-400/20 to-yellow-600/10 rounded-2xl border border-yellow-400/30 p-4">
          <p className="text-sm font-semibold text-yellow-300 mb-3">Estimated Severity Score</p>
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <input
                type="range"
                min="0"
                max="100"
                value={severityScore}
                readOnly
                className="w-full h-2 rounded-full accent-yellow-400"
              />
            </div>
            <span className="text-xl font-bold text-yellow-300 min-w-fit">{Math.round(severityScore)}</span>
          </div>
          <p className="text-xs text-yellow-200/70 mt-2">Based on category and severity level</p>
        </div>

        {/* Reporter Name - Glassmorphism */}
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-4">
          <label className="text-sm font-medium text-white">Your Name (Optional)</label>
          <p className="text-xs text-gray-400 mb-2">Share your name or report anonymously</p>
          <input
            type="text"
            placeholder="Enter your name or leave blank"
            value={reporterName}
            onChange={(e) => setReporterName(e.target.value)}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white placeholder-gray-500 text-sm"
          />
        </div>

        {/* Error Message - Glassmorphism */}
        {error && (
          <div className="backdrop-blur-xl bg-red-500/20 border border-red-500/50 rounded-2xl p-3 flex gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}
      </div>

      {/* Bottom CTA - Glassmorphism */}
      <div className="backdrop-blur-xl bg-white/5 border-t border-white/10 px-4 py-4 space-y-2">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full py-3 px-4 rounded-2xl font-semibold text-white transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: 'var(--peep-primary)' }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Report'}
        </button>
        <button
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="w-full py-2 px-4 rounded-lg border border-white/20 hover:bg-white/10 text-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Back
        </button>
      </div>
    </div>
  );
}
