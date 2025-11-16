'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Edit2, Plus, AlertTriangle } from 'lucide-react';
import AdminSidebar from '@/components/admin/sidebar';
import EvidenceEditor from '@/components/admin/evidence-editor';
import { fetchEvidenceFromSheets, Evidence } from '@/lib/evidenceSheets';
import { createProblem } from '@/lib/sheetClientAPI';
import { useAdminAuth, clearAdminSession } from '@/hooks/useAdminAuth';

interface EvidenceWithIndex extends Evidence {
  rowIndex?: number;
}

export default function EvidenceManagement() {
  const router = useRouter();
  useAdminAuth(); // Check authentication
  const [evidence, setEvidence] = useState<EvidenceWithIndex[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingEvidence, setEditingEvidence] = useState<EvidenceWithIndex | null>(null);

  // Filter state
  const [categoryFilter, setCategoryFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [zoneFilter, setZoneFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadEvidence();
  }, []);

  const loadEvidence = async () => {
    try {
      setLoading(true);
      const data = await fetchEvidenceFromSheets();
      setEvidence(data as EvidenceWithIndex[]);
    } catch (error) {
      console.error('Failed to load evidence:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAdminSession();
    router.push('/admin/login');
  };

  const handleEditEvidence = (item: EvidenceWithIndex) => {
    setEditingEvidence(item);
    setShowEditor(true);
  };

  const handleNewEvidence = () => {
    setEditingEvidence(null);
    setShowEditor(true);
  };

  const handleSave = () => {
    setShowEditor(false);
    loadEvidence();
  };

  const handleEscalateEvidence = async (item: EvidenceWithIndex) => {
    // Create a problem from this evidence item
    const confirmed = window.confirm(
      `Escalate "${item.note}" to a problem for remediation?\n\nThis will create a new problem entry linked to this evidence.`
    );
    
    if (!confirmed) return;

    try {
      const problemData = {
        id: `PROB-${Date.now()}`,
        title: `Problem: ${item.category}`,
        location: item.zone,
        latitude: item.lat,
        longitude: item.lng,
        severity: (item.severity === 'High' ? 'Critical' : item.severity) as 'Low' | 'Medium' | 'High' | 'Critical',
        category: item.category,
        description: `Escalated from evidence #${item.id}:\n${item.note}`,
        reportedBy: item.reporter,
        reportedDate: item.date,
        status: 'Open' as const,
        priority: (item.severity === 'High' ? 'High' : 'Medium') as 'Low' | 'Medium' | 'High' | 'Critical',
        estimatedCost: '',
        deadline: '',
        images: item.images || [],
        tags: ['escalated', `evidence-${item.id}`],
      };

      await createProblem(problemData);
      alert(`✓ Problem created from evidence #${item.id}`);
      // Optionally navigate to problems tab
    } catch (error) {
      console.error('Failed to escalate evidence:', error);
      alert('Failed to escalate evidence. Please try again.');
    }
  };

  // Filter evidence
  const filteredEvidence = evidence.filter((item: EvidenceWithIndex) => {
    if (categoryFilter && item.category !== categoryFilter) return false;
    if (severityFilter && item.severity !== severityFilter) return false;
    if (zoneFilter && item.zone !== zoneFilter) return false;
    if (statusFilter === 'verified' && !item.verified) return false;
    if (statusFilter === 'unverified' && item.verified) return false;
    return true;
  });

  // Get unique values for filters
  const categories = Array.from(new Set(evidence.map((r: EvidenceWithIndex) => r.category)));
  const zones = Array.from(new Set(evidence.map((r: EvidenceWithIndex) => r.zone)));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading evidence management...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Evidence Management</h1>
              <p className="text-sm text-gray-600 mt-1">{filteredEvidence.length} evidence items</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          {/* Add Button */}
          <div className="mb-6">
            <button
              onClick={handleNewEvidence}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              <Plus size={18} />
              Add Evidence
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                >
                  <option value="">All Severities</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Zone</label>
                <select
                  value={zoneFilter}
                  onChange={(e) => setZoneFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                >
                  <option value="">All Zones</option>
                  {zones.map((zone) => (
                    <option key={zone} value={zone}>{zone}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                >
                  <option value="">All Statuses</option>
                  <option value="verified">Verified</option>
                  <option value="unverified">Unverified</option>
                </select>
              </div>
            </div>
          </div>

          {/* Evidence List */}
          <div className="space-y-4">
            {filteredEvidence.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-600">No evidence items found</p>
              </div>
            ) : (
              filteredEvidence.map((item: EvidenceWithIndex) => (
                <div key={item.id} className="bg-white rounded-lg shadow hover:shadow-md transition p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-gray-900">#{item.id}</span>
                        <span className="inline-block px-2 py-1 text-xs font-medium rounded-full" 
                          style={{
                            backgroundColor: item.severity === 'High' ? '#fee2e2' : 
                                           item.severity === 'Medium' ? '#fef3c7' : '#dcfce7',
                            color: item.severity === 'High' ? '#991b1b' : 
                                   item.severity === 'Medium' ? '#92400e' : '#166534'
                          }}>
                          {item.severity}
                        </span>
                        <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-900">
                          {item.category}
                        </span>
                        <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-900">
                          {item.zone}
                        </span>
                        {item.verified && (
                          <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-900">
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{item.note}</p>
                      <div className="grid grid-cols-3 gap-4 text-xs text-gray-600">
                        <div><span className="font-medium">Reporter:</span> {item.reporter}</div>
                        <div><span className="font-medium">Date:</span> {item.date}</div>
                        <div><span className="font-medium">Upvotes:</span> {item.upvotes}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-4">
                      <button
                        onClick={() => handleEditEvidence(item)}
                        className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded transition"
                        title="Edit evidence"
                      >
                        <Edit2 size={16} />
                      </button>
                      {!item.verified && (
                        <button
                          onClick={() => handleEscalateEvidence(item)}
                          className="flex items-center gap-2 px-3 py-2 text-orange-600 hover:bg-orange-50 rounded transition"
                          title="Escalate to problem"
                        >
                          <AlertTriangle size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      {/* Editor Modal */}
      {showEditor && (
        <EvidenceEditor
          evidence={editingEvidence}
          onClose={() => {
            setShowEditor(false);
            setEditingEvidence(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
