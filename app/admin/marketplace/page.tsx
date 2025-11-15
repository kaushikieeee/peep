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
    estimate: '₹2,05,000 - ₹4,10,000',
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
    estimate: '₹1,23,000 - ₹2,87,000',
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
    estimate: '₹2,46,000 - ₹6,56,000',
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
    estimate: '₹1,48,000 - ₹5,33,000',
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
    estimate: '₹1,80,000 - ₹5,74,000',
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
    estimate: '₹1,64,000 - ₹4,92,000',
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
    estimate: '₹65,600 - ₹2,46,000',
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
    estimate: '₹1,23,000 - ₹3,69,000',
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
    estimate: '₹2,05,000 - ₹6,15,000',
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
    estimate: '₹98,400 - ₹3,28,000',
    specialties: ['Air quality monitoring', 'Emissions testing', 'Real-time tracking'],
    responseTime: '1-2 hours',
    availability: '24/7 Monitoring',
  },
  {
    id: 11,
    name: 'SmogBuster Environmental',
    service: 'Air quality improvement & pollution control',
    rating: 4.8,
    reviews: 145,
    estimate: '₹1,64,000 - ₹4,51,000',
    specialties: ['Air purification', 'Emission reduction', 'Industrial cleanup'],
    responseTime: '2-4 hours',
    availability: 'Mon-Fri, 8AM-6PM',
  },
  {
    id: 12,
    name: 'Waste Master Solutions',
    service: 'Hazardous waste management & disposal',
    rating: 4.7,
    reviews: 189,
    estimate: '₹2,05,000 - ₹6,56,000',
    specialties: ['Hazardous waste', 'Safe disposal', 'Documentation'],
    responseTime: '3-5 hours',
    availability: 'Mon-Sun, 24/7',
  },
  {
    id: 13,
    name: 'RiverClean Technologies',
    service: 'Water body cleanup & restoration',
    rating: 4.9,
    reviews: 176,
    estimate: '₹2,87,000 - ₹8,20,000',
    specialties: ['Water body cleanup', 'Aquatic ecosystem', 'Sediment removal'],
    responseTime: '1-3 hours',
    availability: 'Mon-Sun, 7AM-7PM',
  },
  {
    id: 14,
    name: 'GreenShield Environmental',
    service: 'Industrial pollution mitigation',
    rating: 4.6,
    reviews: 128,
    estimate: '₹2,30,000 - ₹6,15,000',
    specialties: ['Industrial cleanup', 'Chemical treatment', 'Compliance audit'],
    responseTime: '2-6 hours',
    availability: 'Mon-Fri, 8AM-5PM',
  },
  {
    id: 15,
    name: 'AirGuard Pro Services',
    service: 'Air pollution monitoring & control',
    rating: 4.8,
    reviews: 152,
    estimate: '₹1,23,000 - ₹3,28,000',
    specialties: ['Air monitoring', 'PM2.5 reduction', 'Dust control'],
    responseTime: '1-2 hours',
    availability: '24/7 Monitoring',
  },
  {
    id: 16,
    name: 'SoilSafe Restoration',
    service: 'Contaminated soil treatment & disposal',
    rating: 4.7,
    reviews: 131,
    estimate: '₹1,80,000 - ₹5,58,000',
    specialties: ['Soil treatment', 'Toxin removal', 'Certification'],
    responseTime: '3-4 hours',
    availability: 'Mon-Sat, 9AM-5PM',
  },
  {
    id: 17,
    name: 'EcoWater Systems',
    service: 'Wastewater treatment & recycling',
    rating: 4.9,
    reviews: 198,
    estimate: '₹2,05,000 - ₹5,74,000',
    specialties: ['Wastewater treatment', 'Water recycling', 'Quality testing'],
    responseTime: '2-3 hours',
    availability: 'Mon-Sun, 8AM-8PM',
  },
  {
    id: 18,
    name: 'ChemClean Specialists',
    service: 'Chemical spill cleanup & remediation',
    rating: 4.8,
    reviews: 167,
    estimate: '₹1,64,000 - ₹5,33,000',
    specialties: ['Chemical cleanup', 'Emergency response', 'Decontamination'],
    responseTime: '1-2 hours',
    availability: '24/7 Emergency',
  },
  {
    id: 19,
    name: 'GreenRecycle Solutions',
    service: 'Waste segregation & recycling management',
    rating: 4.6,
    reviews: 114,
    estimate: '₹65,600 - ₹2,87,000',
    specialties: ['Waste sorting', 'Recycling', 'Composting', 'E-waste'],
    responseTime: '3-4 hours',
    availability: 'Mon-Sat, 7AM-6PM',
  },
  {
    id: 20,
    name: 'BioClean Environmental',
    service: 'Organic waste & sewage treatment',
    rating: 4.7,
    reviews: 143,
    estimate: '₹1,48,000 - ₹4,51,000',
    specialties: ['Sewage treatment', 'Composting', 'Odor control'],
    responseTime: '2-4 hours',
    availability: 'Mon-Fri, 9AM-6PM',
  },
  {
    id: 21,
    name: 'PollutionShield Pro',
    service: 'Comprehensive pollution control & prevention',
    rating: 4.9,
    reviews: 212,
    estimate: '₹2,46,000 - ₹7,38,000',
    specialties: ['All pollution types', 'Long-term prevention', 'Consulting'],
    responseTime: '1-2 hours',
    availability: '24/7 Support',
  },
  {
    id: 22,
    name: 'Urban EcoClean',
    service: 'Street & urban area pollution cleanup',
    rating: 4.7,
    reviews: 156,
    estimate: '₹98,400 - ₹3,94,000',
    specialties: ['Street cleaning', 'Public area cleanup', 'Dust management'],
    responseTime: '2-3 hours',
    availability: 'Mon-Sun, 6AM-8PM',
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

  const handleAutoAssignAll = () => {
    if (!caseDetails.trim()) {
      alert('Please enter case details before assigning tasks');
      return;
    }

    const newTasks: AssignmentRecord[] = mockProviders.map((provider) => ({
      providerId: provider.id,
      providerName: provider.name,
      timestamp: new Date().toLocaleString(),
      status: 'assigned',
    }));

    setAssignedTasks(newTasks);
    setShowAssignConfirm(true);

    setTimeout(() => setShowAssignConfirm(false), 3000);
  };

  const handleAssignSingle = (provider: Provider) => {
    if (!caseDetails.trim()) {
      alert('Please enter case details before assigning a task');
      return;
    }

    const isAlreadyAssigned = assignedTasks.some((t) => t.providerId === provider.id);
    if (isAlreadyAssigned) {
      alert('This provider is already assigned to this case');
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
            <span className="text-sm font-medium">✓ Task(s) assigned successfully! Providers notified.</span>
          </div>
        )}

        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-3 gap-6">
            {/* Left: Case details & Task list */}
            <div className="col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4 sticky top-24 max-h-[calc(100vh-200px)] overflow-y-auto">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Case Details</h3>
                  <textarea
                    value={caseDetails}
                    onChange={(e) => setCaseDetails(e.target.value)}
                    placeholder="Describe the pollution issue, location, severity, and required services..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={6}
                  />
                  <button
                    onClick={handleAutoAssignAll}
                    className="w-full mt-3 py-2 px-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold text-sm transition-all"
                  >
                    Assign to All Providers
                  </button>
                </div>

                {assignedTasks.length > 0 && (
                  <div>
                    <p className="text-sm font-bold text-gray-900 mb-3">
                      Assigned Tasks ({assignedTasks.length}/{mockProviders.length})
                    </p>
                    <div className="space-y-2">
                      {assignedTasks.map((task, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg bg-green-50 border border-green-200"
                        >
                          <p className="text-xs font-semibold text-green-800">{task.providerName}</p>
                          <p className="text-xs text-green-700">Task ID: #{1000 + idx}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded capitalize font-semibold">
                              ✓ Assigned
                            </span>
                            <span className="text-xs text-green-600">{task.timestamp.split(',')[0]}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Provider cards (2 columns) */}
            <div className="col-span-2">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Available Service Providers ({mockProviders.length})</h2>
              <div className="grid grid-cols-2 gap-4">
                {mockProviders.map((provider) => {
                  const isAssigned = assignedTasks.some((t) => t.providerId === provider.id);
                  return (
                    <div
                      key={provider.id}
                      className={`bg-white rounded-lg border transition-all cursor-pointer ${
                        isAssigned
                          ? 'border-green-500 bg-green-50 shadow-md'
                          : selectedProvider?.id === provider.id
                          ? 'border-2 shadow-lg border-blue-500'
                          : 'border-gray-200 hover:shadow-md'
                      }`}
                      onClick={() => setSelectedProvider(provider)}
                    >
                      <div className="p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-sm">{provider.name}</h3>
                            <p className="text-xs text-gray-600">{provider.service}</p>
                          </div>
                          {isAssigned && (
                            <span className="text-xs bg-green-500 text-white px-2 py-1 rounded font-bold">✓</span>
                          )}
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

                        <div className="bg-blue-50 rounded p-2">
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
                            handleAssignSingle(provider);
                          }}
                          disabled={isAssigned}
                          className="w-full py-2 px-3 rounded-lg text-white font-semibold text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          style={{
                            backgroundColor: isAssigned ? '#16a34a' : '#8b5cf6',
                          }}
                        >
                          {isAssigned ? (
                            <>✓ Assigned</>
                          ) : (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              Assign Task
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
