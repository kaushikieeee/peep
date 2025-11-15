'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Send, Star } from 'lucide-react';
import AdminSidebar from '@/components/admin/sidebar';

interface Provider {
  id: number;
  name: string;
  service: string;
  rating: number;
  reviews: number;
  estimate: string;
  specialties: string[];
}

const mockProviders: Provider[] = [
  {
    id: 1,
    name: 'GreenFix Turfcare',
    service: 'Turf restoration & cleanup',
    rating: 4.8,
    reviews: 124,
    estimate: '$2,500 - $5,000',
    specialties: ['Turf restoration', 'Soil remediation', 'Land cleanup'],
  },
  {
    id: 2,
    name: 'DrainWell Solutions',
    service: 'Water drainage & treatment',
    rating: 4.6,
    reviews: 87,
    estimate: '$1,500 - $3,500',
    specialties: ['Water treatment', 'Drainage systems', 'Stagnant water'],
  },
  {
    id: 3,
    name: 'CleanSoil Labs',
    service: 'Soil testing & remediation',
    rating: 4.9,
    reviews: 156,
    estimate: '$3,000 - $8,000',
    specialties: ['Soil analysis', 'Contamination testing', 'Remediation'],
  },
];

export default function MarketplacePage() {
  const router = useRouter();
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [invitedProviders, setInvitedProviders] = useState<number[]>([]);
  const [caseDetails, setCaseDetails] = useState('');

  useEffect(() => {
    const isAuth = localStorage.getItem('admin-auth');
    if (!isAuth) {
      router.push('/admin/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('admin-auth');
    router.push('/admin/login');
  };

  const handleInvite = (provider: Provider) => {
    if (!invitedProviders.includes(provider.id)) {
      setInvitedProviders([...invitedProviders, provider.id]);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar open={true} onClose={() => {}} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Service Provider Marketplace</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-3 gap-6">
            {/* Left: Case details */}
            <div className="col-span-1 bg-white rounded-lg border border-gray-200 p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Case Details</h3>
                <textarea
                  value={caseDetails}
                  onChange={(e) => setCaseDetails(e.target.value)}
                  placeholder="Describe the remediation work needed..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                  rows={4}
                />
              </div>

              {invitedProviders.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Invitations Sent</p>
                  <div className="space-y-2">
                    {mockProviders
                      .filter((p) => invitedProviders.includes(p.id))
                      .map((p) => (
                        <div
                          key={p.id}
                          className="p-2 rounded-lg bg-green-50 border border-green-200 text-xs text-green-700"
                        >
                          ✓ {p.name}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Provider cards */}
            <div className="col-span-2 grid grid-cols-2 gap-4">
              {mockProviders.map((provider) => (
                <div
                  key={provider.id}
                  className={`bg-white rounded-lg border transition-all cursor-pointer ${
                    selectedProvider?.id === provider.id
                      ? 'border-2 shadow-lg border-blue-500'
                      : 'border-gray-200 hover:shadow-md'
                  }`}
                  onClick={() => setSelectedProvider(provider)}
                >
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">{provider.name}</h3>
                      <p className="text-xs text-gray-600">{provider.service}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-3 h-3"
                            style={{
                              fill: i < Math.floor(provider.rating) ? '#f59e0b' : '#e5e7eb',
                              color: i < Math.floor(provider.rating) ? '#f59e0b' : '#e5e7eb',
                            }}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-semibold text-gray-900">{provider.rating}</span>
                      <span className="text-xs text-gray-500">({provider.reviews} reviews)</span>
                    </div>

                    <div className="bg-gray-50 rounded p-2">
                      <p className="text-xs text-gray-600">Est. Cost</p>
                      <p className="text-sm font-bold text-blue-600">{provider.estimate}</p>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {provider.specialties.slice(0, 2).map((spec) => (
                        <span
                          key={spec}
                          className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInvite(provider);
                      }}
                      disabled={invitedProviders.includes(provider.id)}
                      className="w-full py-2 px-3 rounded-lg text-white font-medium text-xs transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      style={{
                        backgroundColor: invitedProviders.includes(provider.id) ? '#16a34a' : '#3b82f6',
                      }}
                    >
                      {invitedProviders.includes(provider.id) ? (
                        <>✓ Invited</>
                      ) : (
                        <>
                          <Send className="w-3 h-3" />
                          Invite to Bid
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
