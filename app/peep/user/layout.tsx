'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, MapPin, User, Info } from 'lucide-react';
import PeepLoadingAnimation from '@/components/peep/loading-animation';
import AboutUsModal from '@/components/peep/about-us-modal';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [navOpen, setNavOpen] = useState(false);
  const [aboutUsOpen, setAboutUsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <PeepLoadingAnimation />
      
      {/* Mobile header */}
      <header className="sticky top-0 z-50 bg-black border-b border-gray-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-yellow-400">PEEP</h1>
          <button
            onClick={() => setNavOpen(!navOpen)}
            className="p-2 rounded-lg hover:bg-gray-900 text-white"
            aria-label="Toggle menu"
          >
            {navOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile nav menu */}
        {navOpen && (
          <nav className="mt-3 space-y-2 pb-3 border-t border-gray-800 pt-3">
            <Link href="/peep/user" className="block py-2 px-2 rounded hover:bg-gray-900 text-gray-300 hover:text-white">
              Home
            </Link>
            <Link href="/peep/user/map" className="block py-2 px-2 rounded hover:bg-gray-900 text-gray-300 hover:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Map
            </Link>
            <Link href="/peep/user/profile" className="block py-2 px-2 rounded hover:bg-gray-900 text-gray-300 hover:text-white flex items-center gap-2">
              <User className="w-4 h-4" /> Profile
            </Link>
            <button 
              onClick={() => {
                setAboutUsOpen(true);
                setNavOpen(false);
              }}
              className="w-full text-left py-2 px-2 rounded hover:bg-gray-900 text-gray-300 hover:text-white flex items-center gap-2"
            >
              <Info className="w-4 h-4" /> About Us
            </button>
          </nav>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-24 text-white">{children}</main>

      {/* About Us Modal */}
      <AboutUsModal isOpen={aboutUsOpen} onClose={() => setAboutUsOpen(false)} />
    </div>
  );
}
