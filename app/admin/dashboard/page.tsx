'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut, BarChart3, AlertTriangle, Clock, CheckCircle2, Menu, X } from 'lucide-react';
import AdminSidebar from '@/components/admin/sidebar';
import LiveMap from '@/components/peep/live-map';
import { useAdminAuth, clearAdminSession } from '@/hooks/useAdminAuth';

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

export default function AdminDashboard() {
  const router = useRouter();
  useAdminAuth(); // Check authentication and redirect if not logged in
  const [reports, setReports] = useState<Report[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  const loadReports = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/data/reports');
      const data = await response.json();
      setReports(data);
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleLogout = () => {
    clearAdminSession();
    router.push('/admin/login');
  };

  // Calculate stats
  const totalReports = reports.length;
  const redZoneCases = reports.filter(r => r.severity === 'High').length;
  const pendingVerifications = reports.filter(r => !r.verified).length;
  const assignedToAuthorities = 0; // No assignment tracking in current schema

  const recentReports = reports.slice(0, 10);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading dashboard...</p>
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
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Reports */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Total Reports (30 days)</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{totalReports}</p>
                    <p className="text-xs text-green-600 mt-2">↑ 12% from last month</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              {/* Red Zone Cases */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Open Red Zone Cases</p>
                    <p className="text-3xl font-bold text-red-600 mt-2">{redZoneCases}</p>
                    <p className="text-xs text-red-600 mt-2">Urgent attention needed</p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </div>

              {/* Pending Verifications */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Pending Verifications</p>
                    <p className="text-3xl font-bold text-yellow-600 mt-2">{pendingVerifications}</p>
                    <p className="text-xs text-yellow-600 mt-2">Awaiting review</p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>

              {/* Assigned to Authorities */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Assigned to Authorities</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">{assignedToAuthorities}</p>
                    <p className="text-xs text-green-600 mt-2">In progress</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Map and Filter Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Report Location Map</h2>
              <div className="h-96 rounded-lg overflow-hidden">
                <LiveMap 
                  pins={reports.map(r => ({
                    id: r.id,
                    lat: r.lat,
                    lng: r.lng,
                    category: r.category,
                    severity: r.severity,
                    note: r.note,
                  }))}
                />
              </div>
            </div>

            {/* Recent Reports Table */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Recent Reports</h2>
                <Link href="/admin/evidence" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All →
                </Link>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                {recentReports.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <p>No reports found. Add evidence to get started.</p>
                  </div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">ID</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Severity</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Location</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Reporter</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentReports.map((report) => (
                        <tr key={report.id} className="border-b border-gray-200 hover:bg-gray-50">
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
                              {report.verified ? 'Verified' : 'New'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <button className="text-blue-600 hover:text-blue-700 font-medium text-xs">
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
