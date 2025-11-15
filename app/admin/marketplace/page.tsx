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
];

interface AssignmentRecord {
  providerId: number;
  providerName: string;
  problemId: string;
  problemTitle: string;
  timestamp: string;
  status: 'assigned' | 'in-progress' | 'completed';
}

interface PollutionProblem {
  id: string;
  title: string;
  location: string;
  severity: 'Low' | 'Medium' | 'High';
  category: string;
}

const mockProblems: PollutionProblem[] = [
  {
    id: 'P001',
    title: 'Stagnant water at Market Street',
    location: 'Market Street, Downtown',
    severity: 'High',
    category: 'Water Pollution',
  },
  {
    id: 'P002',
    title: 'Soil contamination near Industrial Zone',
    location: 'Industrial Area, East Side',
    severity: 'High',
    category: 'Soil Pollution',
  },
  {
    id: 'P003',
    title: 'Air quality degradation at Main Road',
    location: 'Main Road Junction',
    severity: 'Medium',
    category: 'Air Pollution',
  },
  {
    id: 'P004',
    title: 'Plastic waste accumulation in Park',
    location: 'Central Park',
    severity: 'Medium',
    category: 'Waste Pollution',
  },
  {
    id: 'P005',
    title: 'Heavy metal residue at Abandoned Factory',
    location: 'Old Industrial Factory',
    severity: 'High',
    category: 'Chemical Pollution',
  },
];

export default function MarketplacePage() {
  const router = useRouter();
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [assignedTasks, setAssignedTasks] = useState<AssignmentRecord[]>([]);
  const [showAssignConfirm, setShowAssignConfirm] = useState(false);
  const [showProblemModal, setShowProblemModal] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<PollutionProblem | null>(null);
  const [providerForAssignment, setProviderForAssignment] = useState<Provider | null>(null);

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

  const handleOpenProblemModal = (provider: Provider) => {
    setProviderForAssignment(provider);
    setShowProblemModal(true);
  };

  const handleAssignProblem = (problem: PollutionProblem) => {
    if (!providerForAssignment) return;

    const isAlreadyAssigned = assignedTasks.some(
      (t) => t.providerId === providerForAssignment.id && t.problemId === problem.id
    );

    if (isAlreadyAssigned) {
      alert('This problem is already assigned to this provider');
      return;
    }

    const newTask: AssignmentRecord = {
      providerId: providerForAssignment.id,
      providerName: providerForAssignment.name,
      problemId: problem.id,
      problemTitle: problem.title,
      timestamp: new Date().toLocaleString(),
      status: 'assigned',
    };

    setAssignedTasks([...assignedTasks, newTask]);
    setShowAssignConfirm(true);
    setShowProblemModal(false);
    setSelectedProblem(null);
    setProviderForAssignment(null);

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
            <span className="text-sm font-medium">✓ Task assigned successfully!</span>
          </div>
        )}

        {/* Problem Selection Modal */}
        {showProblemModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                  Select a Problem to Assign
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Assigning to: <span className="font-semibold">{providerForAssignment?.name}</span>
                </p>
              </div>

              <div className="max-h-96 overflow-y-auto p-6 space-y-3">
                {mockProblems.map((problem) => (
                  <div
                    key={problem.id}
                    className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition"
                    onClick={() => handleAssignProblem(problem)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{problem.title}</h3>
                        <p className="text-sm text-gray-600">{problem.location}</p>
                        <p className="text-xs text-gray-500 mt-1">{problem.category}</p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded ${
                            problem.severity === 'High'
                              ? 'bg-red-100 text-red-700'
                              : problem.severity === 'Medium'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {problem.severity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowProblemModal(false);
                    setProviderForAssignment(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-3 gap-6">
            {/* Left: Task list */}
            <div className="col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4 sticky top-24 max-h-[calc(100vh-200px)] overflow-y-auto">
                <h2 className="text-lg font-bold text-gray-900">
                  Assigned Tasks ({assignedTasks.length})
                </h2>

                {assignedTasks.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">No tasks assigned yet. Select a provider and problem to begin.</p>
                ) : (
                  <div className="space-y-2">
                    {assignedTasks.map((task, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-green-50 border border-green-200"
                      >
                        <p className="text-xs font-semibold text-green-800">{task.providerName}</p>
                        <p className="text-xs text-gray-700 mt-1">{task.problemTitle}</p>
                        <p className="text-xs text-green-600 mt-1">Task ID: #{1000 + idx}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded font-semibold">
                            ✓ Assigned
                          </span>
                          <span className="text-xs text-gray-600">{task.timestamp.split(',')[0]}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Provider cards (2 columns) */}
            <div className="col-span-2">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Service Providers ({mockProviders.length})</h2>
              <div className="grid grid-cols-2 gap-4">
                {mockProviders.map((provider) => {
                  const providerTaskCount = assignedTasks.filter((t) => t.providerId === provider.id).length;
                  return (
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
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-sm">{provider.name}</h3>
                            <p className="text-xs text-gray-600">{provider.service}</p>
                          </div>
                          {providerTaskCount > 0 && (
                            <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded font-bold">
                              {providerTaskCount}
                            </span>
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
                            handleOpenProblemModal(provider);
                          }}
                          className="w-full py-2 px-3 rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-3 h-3" />
                          Assign Task
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
