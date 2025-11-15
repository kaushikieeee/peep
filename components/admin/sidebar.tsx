'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  MapPin,
  Share2,
  Store,
  Settings,
  X,
} from 'lucide-react';

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
}

const menuItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/evidence', label: 'Evidence Management', icon: FileText },
  { href: '/admin/zones', label: 'Zone Editor', icon: MapPin },
  { href: '/admin/forwarding', label: 'Authority Forwarding', icon: Share2 },
  { href: '/admin/marketplace', label: 'Service Marketplace', icon: Store },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:relative w-64 h-screen bg-gray-900 text-white transition-all z-40 ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <Link href="/admin/dashboard" className="text-2xl font-bold">
              PEEP
            </Link>
            <button onClick={onClose} className="lg:hidden p-1 hover:bg-gray-800 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">Admin Portal</p>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <p className="text-xs text-gray-500 text-center">
            PEEP Admin v1.0
          </p>
        </div>
      </div>
    </>
  );
}
