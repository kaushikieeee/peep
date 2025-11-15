'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, X, Check, AlertCircle, Share2, Briefcase, Eye } from 'lucide-react';
import AdminSidebar from '@/components/admin/sidebar';

interface Report {
  id: number;
  lat: number;
  lng: number;
  category: string;
  severity: 'Low' | 'Medium' | 'High';
  note: string;
  reporter: string;
  date: string;
  zone: string;
  upvotes: number;
  verified: boolean;
  imagePlaceholder: string;
}

export default function EvidenceManagement() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');

  // Filter state
  const [categoryFilter, setCategoryFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [zoneFilter, setZoneFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    // Check authentication
    const isAuth = localStorage.getItem('admin-auth');
    if (!isAuth) {
      router.push('/admin/login');
    }

    // Load reports
    fetch('/api/data/reports')
      .then(r => r.json())
      .then(data => {
        setReports(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load reports:', err);
        setLoading(false);
      });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('admin-auth');
    router.push('/admin/login');
  };

  // Action handlers
  const handleVerify = () => {
    if (!selectedReport) return;
    
    const updatedReports = reports.map(r =>
      r.id === selectedReport.id ? { ...r, verified: true } : r
    );
    setReports(updatedReports);
    setSelectedReport({ ...selectedReport, verified: true });
    setActionMessage('Report verified successfully!');
    setTimeout(() => setActionMessage(''), 3000);
  };

  const handleFollowUp = () => {
    if (!selectedReport) return;
    setActionMessage(`Marked Report #${selectedReport.id} for follow-up by compliance team`);
    setTimeout(() => setActionMessage(''), 3000);
  };

  const handleForwardToAuthority = () => {
    if (!selectedReport) return;
    const authorityZones: Record<string, string> = {
      'Zone A': 'City Environmental Department',
      'Zone B': 'Regional EPA Office',
      'Zone C': 'State Pollution Control Board',
      'Zone D': 'Municipal Health Division',
      'Zone E': 'Industrial Regulation Authority',
      'Zone F': 'Water Quality Department'
    };
    
    const authority = authorityZones[selectedReport.zone] || 'Local Authority';
    setActionMessage(`Report #${selectedReport.id} forwarded to ${authority}`);
    setTimeout(() => setActionMessage(''), 3000);
  };

  const handleAssignToProvider = () => {
    if (!selectedReport) return;
    const providers = ['EcoClean Solutions', 'GreenTech Services', 'PollutionFix Inc', 'EnviroGuard'];
    const provider = providers[Math.floor(Math.random() * providers.length)];
    setActionMessage(`Report #${selectedReport.id} assigned to ${provider} for remediation`);
    setTimeout(() => setActionMessage(''), 3000);
  };

  // Filter reports
  const filteredReports = reports.filter(report => {
    if (categoryFilter && report.category !== categoryFilter) return false;
    if (severityFilter && report.severity !== severityFilter) return false;
    if (zoneFilter && report.zone !== zoneFilter) return false;
    if (statusFilter === 'verified' && !report.verified) return false;
    if (statusFilter === 'unverified' && report.verified) return false;
    return true;
  });

  // Get unique values for filters
  const categories = Array.from(new Set(reports.map(r => r.category)));
  const zones = Array.from(new Set(reports.map(r => r.zone)));

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
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Evidence Management</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>

        {/* Action Message */}
        {actionMessage && (
          <div className="bg-green-50 border-b border-green-200 p-4 text-green-700 font-medium animate-pulse">
            ✓ {actionMessage}
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 flex gap-4 p-6 overflow-hidden">
          {/* Filter Panel */}
          <div className="w-64 bg-white rounded-lg border border-gray-200 p-4 shadow-sm h-full overflow-y-auto">
            <h3 className="font-bold text-gray-900 mb-4">Filters</h3>

            {/* Category Filter */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-2">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Severity Filter */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-2">Severity</label>
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2"
              >
                <option value="">All Severities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            {/* Zone Filter */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-2">Zone</label>
              <select
                value={zoneFilter}
                onChange={(e) => setZoneFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2"
              >
                <option value="">All Zones</option>
                {zones.map(zone => (
                  <option key={zone} value={zone}>{zone}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2"
              >
                <option value="">All Status</option>
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
              </select>
            </div>

            {/* Reset Filters */}
            <button
              onClick={() => {
                setCategoryFilter('');
                setSeverityFilter('');
                setZoneFilter('');
                setStatusFilter('');
              }}
              className="w-full py-2 px-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all"
            >
              Reset Filters
            </button>
          </div>

          {/* Table and Detail Panel */}
          <div className="flex-1 flex gap-4 overflow-hidden">
            {/* Reports Table */}
            <div className="flex-1 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-700">
                  {filteredReports.length} of {reports.length} reports
                </p>
              </div>

              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">ID</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Severity</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Zone</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Reporter</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.map((report) => (
                      <tr
                        key={report.id}
                        onClick={() => setSelectedReport(report)}
                        className={`border-b border-gray-200 cursor-pointer hover:bg-blue-50 transition-all ${
                          selectedReport?.id === report.id ? 'bg-blue-100' : ''
                        }`}
                      >
                        <td className="py-3 px-4 text-gray-900 font-medium">#{report.id}</td>
                        <td className="py-3 px-4 text-gray-700">{report.category}</td>
                        <td className="py-3 px-4">
                          <span
                            className="px-3 py-1 rounded-full text-xs font-bold"
                            style={{
                              backgroundColor: report.severity === 'High' ? '#fca5a5' : report.severity === 'Medium' ? '#fcd34d' : '#c6f6d5',
                              color: report.severity === 'High' ? '#7f1d1d' : report.severity === 'Medium' ? '#78350f' : '#15803d',
                            }}
                          >
                            {report.severity}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-700">{report.zone}</td>
                        <td className="py-3 px-4 text-gray-700">{report.reporter}</td>
                        <td className="py-3 px-4 text-gray-700">{report.date}</td>
                        <td className="py-3 px-4">
                          <span
                            className="px-3 py-1 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: report.verified ? '#dbeafe' : '#fef3c7',
                              color: report.verified ? '#1e40af' : '#92400e',
                            }}
                          >
                            {report.verified ? '✓ Verified' : 'Unverified'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Detail Panel */}
            {selectedReport && (
              <div className="w-96 bg-white rounded-lg border border-gray-200 shadow-sm p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Case #{selectedReport.id}</h3>
                  <button
                    onClick={() => setSelectedReport(null)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Image Placeholder */}
                <div className="w-full h-40 bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                  <img 
                    src={selectedReport.imagePlaceholder} 
                    alt={selectedReport.category}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-gray-600">Category</label>
                    <p className="text-sm font-medium text-gray-900">{selectedReport.category}</p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-600">Description</label>
                    <p className="text-sm text-gray-700">{selectedReport.note}</p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-600">Severity</label>
                    <span
                      className="inline-block px-3 py-1 rounded-full text-xs font-bold mt-1"
                      style={{
                        backgroundColor: selectedReport.severity === 'High' ? '#fca5a5' : selectedReport.severity === 'Medium' ? '#fcd34d' : '#c6f6d5',
                        color: selectedReport.severity === 'High' ? '#7f1d1d' : selectedReport.severity === 'Medium' ? '#78350f' : '#15803d',
                      }}
                    >
                      {selectedReport.severity}
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-600">Reporter</label>
                    <p className="text-sm font-medium text-gray-900">{selectedReport.reporter}</p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-600">Zone</label>
                    <p className="text-sm font-medium text-gray-900">{selectedReport.zone}</p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-600">Submitted</label>
                    <p className="text-sm text-gray-700">{selectedReport.date}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-gray-200 space-y-2">
                    <button 
                      onClick={handleVerify}
                      disabled={selectedReport.verified}
                      className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium text-sm transition-all ${
                        selectedReport.verified 
                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      {selectedReport.verified ? 'Verified' : 'Verify'}
                    </button>
                    <button 
                      onClick={handleFollowUp}
                      className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg font-medium text-sm transition-all"
                    >
                      <AlertCircle className="w-4 h-4" />
                      Mark for Follow-Up
                    </button>
                    <button 
                      onClick={handleForwardToAuthority}
                      className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg font-medium text-sm transition-all"
                    >
                      <Share2 className="w-4 h-4" />
                      Forward to Authority
                    </button>
                    <button 
                      onClick={handleAssignToProvider}
                      className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-orange-100 text-orange-700 hover:bg-orange-200 rounded-lg font-medium text-sm transition-all"
                    >
                      <Briefcase className="w-4 h-4" />
                      Assign to Provider
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
