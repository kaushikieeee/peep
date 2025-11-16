'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Upload, MapPin, ArrowLeft } from 'lucide-react';

export default function UploadPhotoStep() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [exifScrub, setExifScrub] = useState(true);
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handlePhotoUpload = async (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhoto(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Mock geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
      });
    }
  };

  const handleContinue = () => {
    if (photo) {
      // Store in session storage for multi-step form
      sessionStorage.setItem('peep-report-photo', photo);
      sessionStorage.setItem('peep-report-lat', lat?.toString() || '');
      sessionStorage.setItem('peep-report-lng', lng?.toString() || '');
      sessionStorage.setItem('peep-report-exif-scrubbed', exifScrub.toString());
      router.push('/peep/user/report-flow/select-category');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      {/* Header - Glassmorphism */}
      <div className="backdrop-blur-xl bg-white/10 border-b border-white/10 px-4 py-4 flex items-center gap-2">
        <Link href="/peep/user" className="p-1 text-white hover:text-gray-300 transition">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-lg font-semibold text-white">Report Pollution</h1>
      </div>

      {/* Progress indicator - Glassmorphism */}
      <div className="backdrop-blur-xl bg-white/5 px-4 py-3 border-b border-white/10">
        <div className="flex justify-between items-center gap-2">
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              className="flex-1 h-2 rounded-full"
              style={{
                backgroundColor: step === 1 ? 'var(--peep-primary)' : step < 1 ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.1)',
              }}
            />
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">Step 1 of 5</p>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-4 py-6">
        <h2 className="text-xl font-semibold mb-2 text-balance text-white">Upload a Photo</h2>
        <p className="text-sm text-gray-400 mb-6">Take a clear photo of the pollution. We'll add location automatically.</p>

        {photo ? (
          <div className="mb-6">
            <img src={photo || "/placeholder.svg"} alt="Uploaded" className="w-full rounded-2xl mb-4 object-cover max-h-72" />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2 px-4 text-sm border border-white/20 rounded-lg hover:bg-white/10 text-gray-300 transition"
            >
              Change Photo
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 border-2 border-dashed border-white/30 rounded-2xl flex flex-col items-center justify-center mb-6 cursor-pointer hover:border-white/50 transition backdrop-blur-sm bg-white/5"
          >
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm font-medium text-gray-300">Tap to upload photo</p>
            <p className="text-xs text-gray-500">or drag and drop</p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && handlePhotoUpload(e.target.files[0])}
          className="hidden"
        />

        {/* Location display - Glassmorphism */}
        {lat && lng && (
          <div className="backdrop-blur-xl bg-gradient-to-br from-yellow-400/20 to-yellow-600/10 border border-yellow-400/30 rounded-2xl p-3 mb-6 flex items-start gap-2">
            <MapPin className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-yellow-300">Location detected</p>
              <p className="text-xs text-yellow-200/70">{lat.toFixed(4)}, {lng.toFixed(4)}</p>
            </div>
          </div>
        )}

        {/* EXIF checkbox - Glassmorphism */}
        <div className="mb-6 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={exifScrub}
              onChange={(e) => setExifScrub(e.target.checked)}
              className="w-4 h-4 rounded bg-white/20 border-white/30 text-yellow-400"
            />
            <span className="text-sm text-gray-300">
              Scrub EXIF data before uploading <span className="text-xs text-gray-500">(recommended)</span>
            </span>
          </label>
        </div>

        {/* Share checkbox - Glassmorphism */}
        <div className="mb-6 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded bg-white/20 border-white/30 text-yellow-400" />
            <span className="text-sm text-gray-300">Share photo publicly</span>
          </label>
        </div>
      </div>

      {/* Bottom CTA - Glassmorphism */}
      <div className="backdrop-blur-xl bg-white/5 border-t border-white/10 px-4 py-4 space-y-2">
        <button
          onClick={handleContinue}
          disabled={!photo}
          className="w-full py-3 px-4 rounded-2xl font-semibold text-white transition-all active:scale-95 disabled:opacity-50"
          style={{ backgroundColor: 'var(--peep-primary)' }}
        >
          Continue
        </button>
        <Link href="/peep/user" className="block w-full py-2 px-4 text-center rounded-lg border border-white/20 hover:bg-white/10 text-gray-300 text-sm transition">
          Cancel
        </Link>
      </div>
    </div>
  );
}
