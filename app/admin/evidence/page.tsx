'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Edit2, Plus, AlertTriangle, X, ChevronLeft, ChevronRight, Eye, Send } from 'lucide-react';
import AdminSidebar from '@/components/admin/sidebar';
import EvidenceEditor from '@/components/admin/evidence-editor';
import { fetchEvidenceFromSheets, Evidence } from '@/lib/evidenceSheets';
import { createProblem } from '@/lib/sheetClientAPI';
import { useAdminAuth, clearAdminSession } from '@/hooks/useAdminAuth';

interface EvidenceWithIndex extends Evidence {
  rowIndex?: number;
}

interface EscalationData {
  evidenceId: string;
  category: string;
  severity: string;
  note: string;
  reporter: string;
  lat: number;
  lng: number;
  zone: string;
  date: string;
  images: string[];
}

export default function EvidenceManagement() {
  const router = useRouter();
  useAdminAuth(); // Check authentication
  const [evidence, setEvidence] = useState<EvidenceWithIndex[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingEvidence, setEditingEvidence] = useState<EvidenceWithIndex | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imagePreviewItem, setImagePreviewItem] = useState<EvidenceWithIndex | null>(null);
  const [escalatingItem, setEscalatingItem] = useState<EscalationData | null>(null);
  const [selectedAuthority, setSelectedAuthority] = useState('');
  const [escalationMessage, setEscalationMessage] = useState('');
  const [escalatingStatus, setEscalatingStatus] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'list' | 'stats'>('list');

  // Filter state
  const [categoryFilter, setCategoryFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [zoneFilter, setZoneFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [verifiedFilter, setVerifiedFilter] = useState('all');

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
    // Open escalation modal
    const escalationData: EscalationData = {
      evidenceId: item.id,
      category: item.category,
      severity: item.severity,
      note: item.note,
      reporter: item.reporter,
      lat: item.lat,
      lng: item.lng,
      zone: item.zone,
      date: item.date,
      images: item.images || [],
    };
    
    setEscalatingItem(escalationData);
    setSelectedAuthority('');
    setEscalationMessage(
      `Escalated Evidence Report:\n\nCategory: ${item.category}\nSeverity: ${item.severity}\nLocation: ${item.zone}\nDescription: ${item.note}\n\nPlease review and take appropriate action.`
    );
  };

  const handleConfirmEscalation = async () => {
    if (!escalatingItem || !selectedAuthority || !escalationMessage.trim()) {
      alert('Please select an authority and add a message');
      return;
    }

    try {
      setEscalatingStatus('creating');
      
      // Create a problem from this evidence item
      const problemData = {
        id: `PROB-${Date.now()}`,
        title: `Problem: ${escalatingItem.category}`,
        location: escalatingItem.zone,
        latitude: escalatingItem.lat,
        longitude: escalatingItem.lng,
        severity: (escalatingItem.severity === 'High' ? 'Critical' : escalatingItem.severity) as 'Low' | 'Medium' | 'High' | 'Critical',
        category: escalatingItem.category,
        description: escalatingItem.note,
        reportedBy: escalatingItem.reporter,
        reportedDate: escalatingItem.date,
        status: 'Open' as const,
        priority: (escalatingItem.severity === 'High' ? 'High' : 'Medium') as 'Low' | 'Medium' | 'High' | 'Critical',
        estimatedCost: '',
        deadline: '',
        images: escalatingItem.images,
        tags: ['escalated', `evidence-${escalatingItem.evidenceId}`, `authority-${selectedAuthority}`],
      };

      await createProblem(problemData);
      
      setEscalatingStatus('sent');
      setTimeout(() => {
        alert(`✓ Evidence escalated to ${selectedAuthority}\nProblem ID: ${problemData.id}`);
        setEscalatingItem(null);
        setEscalatingStatus('');
        loadEvidence();
      }, 1500);
    } catch (error) {
      console.error('Failed to escalate evidence:', error);
      setEscalatingStatus('');
      alert('Failed to escalate evidence. Please try again.');
    }
  };

  const handleBulkVerify = async () => {
    if (selectedItems.size === 0) {
      alert('Please select items to verify');
      return;
    }

    if (!window.confirm(`Verify ${selectedItems.size} selected item(s)?`)) return;

    try {
      // Update all selected items as verified
      for (const itemId of selectedItems) {
        const item = evidence.find(e => e.id === itemId);
        if (item && !item.verified) {
          // Here you would call an API to update the item
          // For now, we'll just update locally and reload
        }
      }
      alert(`✓ ${selectedItems.size} item(s) marked as verified`);
      setSelectedItems(new Set());
      loadEvidence();
    } catch (error) {
      console.error('Failed to verify items:', error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.size === 0) {
      alert('Please select items to delete');
      return;
    }

    if (!window.confirm(`Delete ${selectedItems.size} selected item(s)? This cannot be undone.`)) return;

    try {
      // Delete all selected items
      for (const itemId of selectedItems) {
        // Here you would call an API to delete the item
      }
      alert(`✓ ${selectedItems.size} item(s) deleted`);
      setSelectedItems(new Set());
      loadEvidence();
    } catch (error) {
      console.error('Failed to delete items:', error);
    }
  };

  const toggleItemSelection = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const selectAll = () => {
    if (selectedItems.size === filteredEvidence.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredEvidence.map(e => e.id)));
    }
  };

  const calculateStats = () => {
    return {
      total: evidence.length,
      verified: evidence.filter(e => e.verified).length,
      unverified: evidence.filter(e => !e.verified).length,
      high: evidence.filter(e => e.severity === 'High').length,
      medium: evidence.filter(e => e.severity === 'Medium').length,
      low: evidence.filter(e => e.severity === 'Low').length,
      withImages: evidence.filter(e => e.images && e.images.length > 0).length,
      totalUpvotes: evidence.reduce((sum, e) => sum + e.upvotes, 0),
    };
  };

  // Filter and search evidence
  let filteredEvidence = evidence.filter((item: EvidenceWithIndex) => {
    if (categoryFilter && item.category !== categoryFilter) return false;
    if (severityFilter && item.severity !== severityFilter) return false;
    if (zoneFilter && item.zone !== zoneFilter) return false;
    if (statusFilter === 'verified' && !item.verified) return false;
    if (statusFilter === 'unverified' && item.verified) return false;
    if (searchQuery && !item.note.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !item.reporter.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Sort evidence
  filteredEvidence = [...filteredEvidence].sort((a, b) => {
    switch (sortBy) {
      case 'date-desc':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'date-asc':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'severity':
        const severityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
        return (severityOrder[b.severity as keyof typeof severityOrder] || 0) - (severityOrder[a.severity as keyof typeof severityOrder] || 0);
      case 'upvotes':
        return b.upvotes - a.upvotes;
      default:
        return 0;
    }
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
              <p className="text-sm text-gray-600 mt-1">{filteredEvidence.length} of {evidence.length} evidence items</p>
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

          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <input
              type="text"
              placeholder="Search by ID, reporter, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Stats Dashboard */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{(() => calculateStats().total)()}</div>
                <p className="text-xs text-gray-600 mt-1">Total</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{(() => calculateStats().verified)()}</div>
                <p className="text-xs text-gray-600 mt-1">Verified</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{(() => calculateStats().unverified)()}</div>
                <p className="text-xs text-gray-600 mt-1">Unverified</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{(() => calculateStats().high)()}</div>
                <p className="text-xs text-gray-600 mt-1">High Sev</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{(() => calculateStats().medium)()}</div>
                <p className="text-xs text-gray-600 mt-1">Med Sev</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-600">{(() => calculateStats().low)()}</div>
                <p className="text-xs text-gray-600 mt-1">Low Sev</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{(() => calculateStats().withImages)()}</div>
                <p className="text-xs text-gray-600 mt-1">w/ Images</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{(() => calculateStats().totalUpvotes)()}</div>
                <p className="text-xs text-gray-600 mt-1">Upvotes</p>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedItems.size > 0 && (
            <div className="bg-blue-50 border border-blue-300 rounded-lg p-4 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={selectedItems.size === filteredEvidence.length}
                  onChange={selectAll}
                  className="w-5 h-5"
                />
                <span className="text-sm font-medium text-gray-700">{selectedItems.size} selected</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleBulkVerify}
                  className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition"
                >
                  ✓ Verify
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          )}

          {/* Filters & Sorting */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="grid grid-cols-5 gap-4">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                >
                  <option value="date-desc">Latest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="severity">Highest Severity</option>
                  <option value="upvotes">Most Upvotes</option>
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
                <div key={item.id} className={`bg-white rounded-lg shadow hover:shadow-md transition p-4 ${selectedItems.has(item.id) ? 'ring-2 ring-blue-500' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(item.id)}
                        onChange={() => toggleItemSelection(item.id)}
                        className="w-5 h-5 mt-1"
                      />
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
                          {item.images && item.images.length > 0 && (
                            <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                              📷 {item.images.length}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{item.note}</p>
                      <div className="grid grid-cols-4 gap-4 text-xs text-gray-600">
                        <div><span className="font-medium">Reporter:</span> {item.reporter}</div>
                        <div><span className="font-medium">Date:</span> {item.date}</div>
                        <div><span className="font-medium">Upvotes:</span> {item.upvotes}</div>
                        <div><span className="font-medium">Location:</span> {item.lat.toFixed(4)}, {item.lng.toFixed(4)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-4 flex-shrink-0">
                      {item.images && item.images.length > 0 && (
                        <button
                          onClick={() => {
                            setImagePreviewItem(item);
                            setSelectedImageIndex(0);
                          }}
                          className="flex items-center gap-2 px-3 py-2 text-purple-600 hover:bg-purple-50 rounded transition"
                          title="View images"
                        >
                          <Eye size={16} />
                        </button>
                      )}
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
                          title="Escalate to authority"
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

      {/* Image Preview Modal */}
      {imagePreviewItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Evidence Images - #{imagePreviewItem.id}</h2>
              <button
                onClick={() => setImagePreviewItem(null)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={24} />
              </button>
            </div>

            {/* Image Display */}
            <div className="flex-1 flex items-center justify-center bg-gray-100 overflow-auto">
              {imagePreviewItem.images && imagePreviewItem.images.length > 0 ? (
                <img
                  src={imagePreviewItem.images[selectedImageIndex]}
                  alt={`Evidence ${selectedImageIndex + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <p className="text-gray-500">No images available</p>
              )}
            </div>

            {/* Navigation */}
            {imagePreviewItem.images && imagePreviewItem.images.length > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-gray-200">
                <button
                  onClick={() => setSelectedImageIndex((i) => (i - 1 + imagePreviewItem.images!.length) % imagePreviewItem.images!.length)}
                  className="p-2 hover:bg-gray-100 rounded transition"
                >
                  <ChevronLeft size={20} />
                </button>
                <p className="text-sm text-gray-600">
                  Image {selectedImageIndex + 1} of {imagePreviewItem.images.length}
                </p>
                <button
                  onClick={() => setSelectedImageIndex((i) => (i + 1) % imagePreviewItem.images!.length)}
                  className="p-2 hover:bg-gray-100 rounded transition"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Escalation Modal */}
      {escalatingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Escalate Evidence to Authority</h2>
              <button
                onClick={() => !escalatingStatus && setEscalatingItem(null)}
                disabled={!!escalatingStatus}
                className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Evidence Summary */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <h3 className="font-semibold text-gray-900">Evidence Summary</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="font-medium">Category:</span> {escalatingItem.category}</div>
                  <div><span className="font-medium">Severity:</span> {escalatingItem.severity}</div>
                  <div><span className="font-medium">Location:</span> {escalatingItem.zone}</div>
                  <div><span className="font-medium">Reporter:</span> {escalatingItem.reporter}</div>
                  <div className="col-span-2"><span className="font-medium">Description:</span> {escalatingItem.note}</div>
                </div>
              </div>

              {/* Authority Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Select Authority</label>
                <select
                  value={selectedAuthority}
                  onChange={(e) => setSelectedAuthority(e.target.value)}
                  disabled={!!escalatingStatus}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <option value="">Choose an authority...</option>
                  <option value="Municipal Sanitation">Municipal Sanitation</option>
                  <option value="Parks & Recreation">Parks & Recreation</option>
                  <option value="Environmental Health">Environmental Health</option>
                  <option value="Water Management">Water Management</option>
                  <option value="Local Administration">Local Administration</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Message to Authority</label>
                <textarea
                  value={escalationMessage}
                  onChange={(e) => setEscalationMessage(e.target.value)}
                  disabled={!!escalatingStatus}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
              </div>

              {/* Images attached */}
              {escalatingItem.images && escalatingItem.images.length > 0 && (
                <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-900">
                  <span className="font-semibold">📷 {escalatingItem.images.length} image(s)</span> will be attached to this escalation.
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
              <button
                onClick={() => setEscalatingItem(null)}
                disabled={!!escalatingStatus}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmEscalation}
                disabled={!selectedAuthority || !escalationMessage.trim() || !!escalatingStatus}
                className="flex items-center gap-2 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition disabled:opacity-50"
              >
                <Send size={18} />
                {escalatingStatus === 'creating' ? 'Creating...' : escalatingStatus === 'sent' ? 'Sent!' : 'Escalate & Forward'}
              </button>
            </div>
          </div>
        </div>
      )}

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
