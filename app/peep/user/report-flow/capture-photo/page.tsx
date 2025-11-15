'use client';

import { useState } from 'react';
import { ChevronLeft, Camera, Upload } from 'lucide-react';
import Link from 'next/link';

export default function CapturePhotoPage() {
  const [photo, setPhoto] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <Link href="/peep/user/report-flow" className="p-2 hover:bg-gray-100 rounded-lg">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-lg font-semibold">Capture Evidence</h1>
        <div className="w-10" />
      </div>

      {/* Progress Stepper */}
      <div className="px-4 py-3 bg-gray-50 flex justify-between items-center text-xs font-semibold">
        <div className="flex flex-col items-center">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: 'var(--peep-primary)' }}>1</div>
          <p className="mt-1 text-gray-600">Photo</p>
        </div>
        <div className="flex-1 h-0.5 mx-1 bg-gray-300 mt-3" />
        <div className="flex flex-col items-center opacity-50">
          <div className="w-6 h-6 rounded-full flex items-center justify-center bg-gray-300 text-gray-600">2</div>
          <p className="mt-1 text-gray-600">Title</p>
        </div>
        <div className="flex-1 h-0.5 mx-1 bg-gray-300 mt-3" />
        <div className="flex flex-col items-center opacity-50">
          <div className="w-6 h-6 rounded-full flex items-center justify-center bg-gray-300 text-gray-600">3</div>
          <p className="mt-1 text-gray-600">Details</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-6 flex flex-col items-center justify-center">
        {photo ? (
          <div className="w-full space-y-4">
            <div className="relative w-full aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
              <img src={photo || "/placeholder.svg"} alt="Captured evidence" className="w-full h-full object-cover" />
            </div>
            <button
              onClick={handleRetake}
              className="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
            >
              Retake Photo
            </button>
            <Link
              href="/peep/user/report-flow/add-title"
              className="block w-full py-3 px-4 rounded-lg font-semibold text-white text-center"
              style={{ backgroundColor: 'var(--peep-primary)' }}
            >
              Next: Add Title
            </Link>
          </div>
        ) : (
          <div className="w-full max-w-sm text-center space-y-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: 'var(--peep-primary)' }}>
              <Camera className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Capture the Issue</h2>
            <p className="text-sm text-gray-600">Take a clear photo of the environmental problem you found.</p>
            <label className="block w-full py-3 px-4 rounded-lg font-semibold text-white cursor-pointer transition-all active:scale-95" style={{ backgroundColor: 'var(--peep-primary)' }}>
              <Camera className="w-5 h-5 inline mr-2" />
              Take Photo
              <input type="file" accept="image/*" capture="environment" onChange={handlePhotoCapture} className="hidden" />
            </label>
            <label className="block w-full py-3 px-4 rounded-lg font-semibold border-2 border-gray-300 text-gray-700 cursor-pointer hover:bg-gray-50">
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
