'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, MapPin, User } from 'lucide-react';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ backgroundColor: 'var(--peep-neutral-1)' }}>
      {/* Mobile header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3" style={{ backgroundColor: 'var(--peep-neutral-1)' }}>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold" style={{ color: 'var(--peep-primary)' }}>PEEP</h1>
          <button
            onClick={() => setNavOpen(!navOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            {navOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile nav menu */}
        {navOpen && (
          <nav className="mt-3 space-y-2 pb-3 border-t border-gray-200 pt-3">
            <Link href="/peep/user" className="block py-2 px-2 rounded hover:bg-gray-100">
              Home
            </Link>
            <Link href="/peep/user/map" className="block py-2 px-2 rounded hover:bg-gray-100 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Map
            </Link>
            <Link href="/peep/user/profile" className="block py-2 px-2 rounded hover:bg-gray-100 flex items-center gap-2">
              <User className="w-4 h-4" /> Profile
            </Link>
          </nav>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-24">{children}</main>
    </div>
  );
}
