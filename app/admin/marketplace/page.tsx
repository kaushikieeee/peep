'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Star, CheckCircle, Clock, RefreshCw, Plus, Edit2 } from 'lucide-react';
import AdminSidebar from '@/components/admin/sidebar';
import ProviderEditor from '@/components/admin/provider-editor';
import ProblemEditor from '@/components/admin/problem-editor';
import { fetchProvidersFromSheets, fetchProblemsFromSheets } from '@/lib/googleSheets';
import { ProviderData, ProblemData } from '@/lib/sheetClientAPI';
import { useAdminAuth, clearAdminSession } from '@/hooks/useAdminAuth';

interface Provider extends ProviderData {
  rowIndex?: number;
}

interface Problem extends ProblemData {
  rowIndex?: number;
}

export default function MarketplacePage() {
  const router = useRouter();
  useAdminAuth(); // Check authentication
  const [providers, setProviders] = useState<Provider[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [showProviderEditor, setShowProviderEditor] = useState(false);
  const [showProblemEditor, setShowProblemEditor] = useState(false);
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null);
  const [tab, setTab] = useState<'providers' | 'problems'>('providers');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [fetchedProviders, fetchedProblems] = await Promise.all([
        fetchProvidersFromSheets(),
        fetchProblemsFromSheets(),
      ]);
      setProviders(fetchedProviders as Provider[]);
      setProblems(fetchedProblems as Problem[]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAdminSession();
    router.push('/admin/login');
  };

  const handleEditProvider = (provider: Provider) => {
    setEditingProvider(provider);
    setShowProviderEditor(true);
  };

  const handleNewProvider = () => {
    setEditingProvider(null);
    setShowProviderEditor(true);
  };

  const handleEditProblem = (problem: Problem) => {
    setEditingProblem(problem);
    setShowProblemEditor(true);
  };

  const handleNewProblem = () => {
    setEditingProblem(null);
    setShowProblemEditor(true);
  };

  const handleSave = () => {
    loadData();
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar open={true} onClose={() => {}} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-20">
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all disabled:opacity-50"
              title="Refresh data from Google Sheets"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>

        {loading && (
          <div className="bg-blue-50 border-b border-blue-200 px-6 py-3 flex items-center gap-3 text-blue-700">
            <RefreshCw size={20} className="animate-spin flex-shrink-0" />
            <span className="text-sm font-medium">Loading data from Google Sheets...</span>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white border-b border-gray-200 px-6 flex gap-8">
          <button
            onClick={() => setTab('providers')}
            className={`py-4 px-2 font-medium border-b-2 transition-all ${
              tab === 'providers'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Service Providers ({providers.length})
          </button>
          <button
            onClick={() => setTab('problems')}
            className={`py-4 px-2 font-medium border-b-2 transition-all ${
              tab === 'problems'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Pollution Problems ({problems.length})
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {tab === 'providers' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-900">Service Providers</h2>
                <button
                  onClick={handleNewProvider}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                >
                  <Plus size={20} />
                  Add Provider
                </button>
              </div>

              {providers.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p>No providers found. Create one to get started.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {providers.map((provider, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-all"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{provider.name}</h3>
                          <p className="text-sm text-gray-600">{provider.service}</p>
                        </div>
                        <button
                          onClick={() => handleEditProvider(provider)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Edit2 size={18} />
                        </button>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="font-medium">{provider.rating}</span>
                          <span className="text-gray-600">({provider.reviews} reviews)</span>
                        </div>
                        <p className="text-gray-700">
                          <span className="font-medium">Est. Cost:</span> {provider.estimate}
                        </p>
                        {provider.email && (
                          <p className="text-gray-700">
                            <span className="font-medium">Email:</span> {provider.email}
                          </p>
                        )}
                        {provider.phone && (
                          <p className="text-gray-700">
                            <span className="font-medium">Phone:</span> {provider.phone}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {provider.specialties?.slice(0, 2).map((spec) => (
                            <span
                              key={spec}
                              className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'problems' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Pollution Problems</h2>
                  <p className="text-sm text-gray-500 mt-1">Problems are created by escalating unresolved evidence items</p>
                </div>
              </div>

              {problems.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p>No problems yet. Escalate unresolved evidence to create problems.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {problems.map((problem, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-all"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{problem.title}</h3>
                            <span
                              className={`text-xs font-bold px-3 py-1 rounded ${
                                problem.severity === 'Critical'
                                  ? 'bg-red-100 text-red-700'
                                  : problem.severity === 'High'
                                  ? 'bg-orange-100 text-orange-700'
                                  : problem.severity === 'Medium'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-green-100 text-green-700'
                              }`}
                            >
                              {problem.severity}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{problem.location}</p>
                          {problem.description && (
                            <p className="text-sm text-gray-700 mb-2">{problem.description}</p>
                          )}
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            {problem.category && (
                              <span>
                                <span className="font-medium">Category:</span> {problem.category}
                              </span>
                            )}
                            {problem.status && (
                              <span>
                                <span className="font-medium">Status:</span> {problem.status}
                              </span>
                            )}
                            {problem.reportedBy && (
                              <span>
                                <span className="font-medium">Reported by:</span> {problem.reportedBy}
                              </span>
                            )}
                          </div>
                          {problem.tags && problem.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {problem.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleEditProblem(problem)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition flex-shrink-0"
                        >
                          <Edit2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Editors */}
      {showProviderEditor && (
        <ProviderEditor
          provider={editingProvider || undefined}
          onClose={() => {
            setShowProviderEditor(false);
            setEditingProvider(null);
          }}
          onSave={handleSave}
          isNew={!editingProvider}
        />
      )}

      {showProblemEditor && (
        <ProblemEditor
          problem={editingProblem || undefined}
          onClose={() => {
            setShowProblemEditor(false);
            setEditingProblem(null);
          }}
          onSave={handleSave}
          isNew={!editingProblem}
        />
      )}
    </div>
  );
}
