'use client';

import { useState } from 'react';
import { ArrowLeft, Camera, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CapturePhotoPage() {
  const [photo, setPhoto] = useState<string | null>(null);
  const router = useRouter();

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPhoto(result);
        sessionStorage.setItem('peep-report-photo', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRetake = () => {
    setPhoto(null);
    sessionStorage.removeItem('peep-report-photo');
  };

  const handleContinue = () => {
    if (photo) {
      router.push('/peep/user/report-flow/add-title');
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 backdrop-blur-xl bg-white/5">
        <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-lg transition text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold text-white">Report Pollution</h1>
        <div className="w-10" />
      </div>

      {/* Progress Bar */}
      <div className="backdrop-blur-xl bg-white/5 px-4 py-3 border-b border-white/10">
        <div className="flex justify-between items-center gap-2">
          {[1, 2, 3, 4, 5, 6, 7].map((step) => (
            <div
              key={step}
              className="flex-1 h-2 rounded-full"
              style={{
                backgroundColor: step <= 2 ? 'var(--peep-primary)' : 'rgba(255,255,255,0.1)',
              }}
            />
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">Step 2 of 7</p>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-6 flex flex-col items-center justify-center">
        {photo ? (
          <div className="w-full max-w-sm space-y-4">
            <div className="relative w-full aspect-square rounded-lg overflow-hidden border-2 border-white/20">
              <img src={photo || "/placeholder.svg"} alt="Captured evidence" className="w-full h-full object-cover" />
            </div>
            <button
              onClick={handleRetake}
              className="w-full py-2 px-4 border border-white/20 rounded-lg text-gray-300 hover:bg-white/10 font-medium transition"
            >
              Retake Photo
            </button>
            <button
              onClick={handleContinue}
              className="w-full py-3 px-4 rounded-lg font-semibold text-white text-center transition-all active:scale-95"
              style={{ backgroundColor: 'var(--peep-primary)' }}
            >
              Next: Add Title
            </button>
          </div>
        ) : (
          <div className="w-full max-w-sm text-center space-y-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: 'var(--peep-primary)' }}>
              <Camera className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-gray-100">Capture the Issue</h2>
            <p className="text-sm text-gray-400">Take a clear photo of the environmental problem you found.</p>
            <label className="block w-full py-3 px-4 rounded-lg font-semibold text-white cursor-pointer transition-all active:scale-95" style={{ backgroundColor: 'var(--peep-primary)' }}>
              <Camera className="w-5 h-5 inline mr-2" />
              Take Photo
              <input type="file" accept="image/*" capture="environment" onChange={handlePhotoCapture} className="hidden" />
            </label>
            <label className="block w-full py-3 px-4 rounded-lg font-semibold border-2 border-white/20 text-gray-300 cursor-pointer hover:bg-white/5 transition">
              <Upload className="w-5 h-5 inline mr-2" />
              Upload from Gallery
              <input type="file" accept="image/*" onChange={handlePhotoCapture} className="hidden" />
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
