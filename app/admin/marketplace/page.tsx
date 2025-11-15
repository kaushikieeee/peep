'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Send, Star, CheckCircle, Clock } from 'lucide-react';
import AdminSidebar from '@/components/admin/sidebar';

interface Provider {
  id: number;
  name: string;
  service: string;
  rating: number;
  reviews: number;
  estimate: string;
  specialties: string[];
  responseTime?: string;
  availability?: string;
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
    responseTime: '2-4 hours',
    availability: 'Mon-Sat, 7AM-6PM',
  },
  {
    id: 2,
    name: 'DrainWell Solutions',
    service: 'Water drainage & treatment',
    rating: 4.6,
    reviews: 87,
    estimate: '$1,500 - $3,500',
    specialties: ['Water treatment', 'Drainage systems', 'Stagnant water'],
    responseTime: '4-6 hours',
    availability: '24/7 Emergency',
  },
  {
    id: 3,
    name: 'CleanSoil Labs',
    service: 'Soil testing & remediation',
    rating: 4.9,
    reviews: 156,
    estimate: '$3,000 - $8,000',
    specialties: ['Soil analysis', 'Contamination testing', 'Remediation'],
    responseTime: '1-2 hours',
    availability: 'Mon-Sun, 8AM-8PM',
  },
  {
    id: 4,
    name: 'EcoClean Pro Services',
    service: 'Environmental cleanup & waste management',
    rating: 4.7,
    reviews: 203,
    estimate: '$1,800 - $6,500',
    specialties: ['Waste removal', 'Site cleanup', 'Environmental compliance'],
    responseTime: '2-3 hours',
    availability: 'Mon-Fri, 9AM-5PM',
  },
  {
    id: 5,
    name: 'AquaPure Treatment',
    service: 'Water purification & testing',
    rating: 4.9,
    reviews: 178,
    estimate: '$2,200 - $7,000',
    specialties: ['Water testing', 'Purification systems', 'Quality assurance'],
    responseTime: '1-2 hours',
    availability: '24/7 Support',
  },
  {
    id: 6,
    name: 'Soil Restoration Inc',
    service: 'Soil analysis & heavy metal removal',
    rating: 4.5,
    reviews: 95,
    estimate: '$2,000 - $6,000',
    specialties: ['Heavy metal removal', 'Soil testing', 'Certification'],
    responseTime: '3-4 hours',
    availability: 'Mon-Sat, 8AM-6PM',
  },
  {
    id: 7,
    name: 'NoiseControl Systems',
    service: 'Noise monitoring & reduction',
    rating: 4.6,
    reviews: 112,
    estimate: '$800 - $3,000',
    specialties: ['Noise measurement', 'Sound barriers', 'Compliance reports'],
    responseTime: '2-6 hours',
    availability: 'Mon-Sun, 24/7',
  },
  {
    id: 8,
    name: 'PlasticClean Technologies',
    service: 'Plastic waste & microplastic removal',
    rating: 4.8,
    reviews: 167,
    estimate: '$1,500 - $4,500',
    specialties: ['Microplastic removal', 'Recycling', 'Waste sorting'],
    responseTime: '2-3 hours',
    availability: 'Mon-Sun, 7AM-7PM',
  },
  {
    id: 9,
    name: 'BioRemediation Experts',
    service: 'Biological contamination treatment',
    rating: 4.7,
    reviews: 134,
    estimate: '$2,500 - $7,500',
    specialties: ['Bioremediation', 'Enzyme treatment', 'Bacterial cultures'],
    responseTime: '4-6 hours',
    availability: 'Mon-Fri, 9AM-6PM',
  },
  {
    id: 10,
    name: 'PollutionDetect Services',
    service: 'Pollution monitoring & detection',
    rating: 4.9,
    reviews: 201,
    estimate: '$1,200 - $4,000',
    specialties: ['Air quality monitoring', 'Emissions testing', 'Real-time tracking'],
    responseTime: '1-2 hours',
    availability: '24/7 Monitoring',
  },
];

interface AssignmentRecord {
  providerId: number;
  providerName: string;
  timestamp: string;
  status: 'assigned' | 'in-progress' | 'completed';
}

export default function MarketplacePage() {
  const router = useRouter();
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [invitedProviders, setInvitedProviders] = useState<number[]>([]);
  const [caseDetails, setCaseDetails] = useState('');
  const [assignedTasks, setAssignedTasks] = useState<AssignmentRecord[]>([]);
  const [showAssignConfirm, setShowAssignConfirm] = useState(false);

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

  const handleAssignTask = (provider: Provider) => {
    if (!caseDetails.trim()) {
      alert('Please enter case details before assigning a task');
      return;
    }

    const newTask: AssignmentRecord = {
      providerId: provider.id,
      providerName: provider.name,
      timestamp: new Date().toLocaleString(),
      status: 'assigned',
    };

    setAssignedTasks([...assignedTasks, newTask]);
    setShowAssignConfirm(true);

    setTimeout(() => setShowAssignConfirm(false), 3000);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar open={true} onClose={() => {}} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-20">
          <h1 className="text-2xl font-bold text-gray-900">Service Provider Marketplace</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>

        {/* Success Message */}
        {showAssignConfirm && (
          <div className="bg-green-50 border-b border-green-200 px-6 py-3 flex items-center gap-3 text-green-700 animate-pulse">
            <CheckCircle size={20} className="flex-shrink-0" />
            <span className="text-sm font-medium">✓ Task assigned successfully! Provider will be notified shortly.</span>
          </div>
        )}

        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-4 gap-6">
            {/* Left: Case details */}
            <div className="col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4 sticky top-24">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Case Details</h3>
                  <textarea
                    value={caseDetails}
                    onChange={(e) => setCaseDetails(e.target.value)}
                    placeholder="Describe the pollution issue, location, severity, and required services..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={6}
                  />
                  <p className="text-xs text-gray-500 mt-2">Required to assign tasks</p>
                </div>

                {invitedProviders.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Invitations Sent ({invitedProviders.length})</p>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {mockProviders
                        .filter((p) => invitedProviders.includes(p.id))
                        .map((p) => (
                          <div
                            key={p.id}
                            className="p-2 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-700"
                          >
                            📧 {p.name}
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {assignedTasks.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Tasks Assigned ({assignedTasks.length})</p>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {assignedTasks.map((task, idx) => (
                        <div
                          key={idx}
                          className="p-2 rounded-lg bg-green-50 border border-green-200 text-xs text-green-700"
                        >
                          ✓ {task.providerName}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Provider cards */}
            <div className="col-span-3">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Available Service Providers ({mockProviders.length})</h2>
              <div className="grid grid-cols-3 gap-4">
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
                        <span className="text-xs text-gray-500">({provider.reviews})</span>
                      </div>

                      <div className="space-y-1">
                        <div className="bg-blue-50 rounded p-2">
                          <p className="text-xs text-gray-600">Est. Cost</p>
                          <p className="text-sm font-bold text-blue-600">{provider.estimate}</p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Clock size={14} />
                          <span>{provider.responseTime}</span>
                        </div>
                        <p className="text-xs text-gray-600">
                          <span className="font-semibold">Hours:</span> {provider.availability}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {provider.specialties.map((spec) => (
                          <span
                            key={spec}
                            className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>

                      <div className="space-y-2 pt-2 border-t border-gray-200">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInvite(provider);
                          }}
                          disabled={invitedProviders.includes(provider.id)}
                          className="w-full py-2 px-3 rounded-lg text-white font-medium text-xs transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAssignTask(provider);
                          }}
                          className="w-full py-2 px-3 rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-medium text-xs transition-all flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-3 h-3" />
                          Assign Task
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
