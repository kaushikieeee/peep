'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Send, CheckCircle2 } from 'lucide-react';
import AdminSidebar from '@/components/admin/sidebar';
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

// Map categories to relevant government departments
const categoryToDepartments: Record<string, string[]> = {
  'Soil contamination': ['Environmental Protection Department', 'Mining & Geology', 'Agricultural Department'],
  'Stagnant water': ['Water Management', 'Public Health Department', 'Municipal Corporation'],
  'Plastic / microplastics': ['Environmental Protection Department', 'Sanitation Department', 'Coastal Authority'],
  'Damaged turf / turf runoff': ['Parks & Recreation', 'Urban Development', 'Drainage Department'],
  'Waste dumping': ['Sanitation Department', 'Environmental Protection Department', 'Municipal Corporation'],
  'Other': ['Municipal Corporation', 'Environmental Protection Department', 'Public Health Department'],
};

// Mock reports for testing
const getMockReports = (): Report[] => [
  {
    id: 1,
    lat: 12.9716,
    lng: 77.5946,
    category: 'Soil contamination',
    severity: 'High',
    note: 'Heavy soil contamination near the school with industrial waste',
    reporter: 'John Doe',
    date: '2024-11-16',
    zone: 'Zone P1',
    upvotes: 5,
    verified: false,
    imagePlaceholder: 'soil-1.jpg',
  },
  {
    id: 2,
    lat: 12.9740,
    lng: 77.5955,
    category: 'Stagnant water',
    severity: 'Medium',
    note: 'Stagnant water accumulated in the park causing mosquito breeding',
    reporter: 'Jane Smith',
    date: '2024-11-15',
    zone: 'Zone W2',
    upvotes: 3,
    verified: false,
    imagePlaceholder: 'water-1.jpg',
  },
  {
    id: 3,
    lat: 12.9705,
    lng: 77.5935,
    category: 'Plastic / microplastics',
    severity: 'Medium',
    note: 'Plastic debris scattered across the playground area',
    reporter: 'Ram Kumar',
    date: '2024-11-14',
    zone: 'Zone P2',
    upvotes: 2,
    verified: true,
    imagePlaceholder: 'plastic-1.jpg',
  },
  {
    id: 4,
    lat: 12.9719,
    lng: 77.5950,
    category: 'Waste dumping',
    severity: 'High',
    note: 'Illegal waste dumping site with hazardous materials',
    reporter: 'Anonymous',
    date: '2024-11-13',
    zone: 'Zone P1',
    upvotes: 8,
    verified: false,
    imagePlaceholder: 'waste-1.jpg',
  },
  {
    id: 5,
    lat: 12.9715,
    lng: 77.5965,
    category: 'Damaged turf / turf runoff',
    severity: 'Low',
    note: 'Grass area damaged with water runoff issues',
    reporter: 'Priya Sharma',
    date: '2024-11-12',
    zone: 'Zone C3',
    upvotes: 1,
    verified: false,
    imagePlaceholder: 'turf-1.jpg',
  },
];

export default function ForwardingPage() {
  const router = useRouter();
  useAdminAuth(); // Check authentication
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [selectedDept, setSelectedDept] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const isAuth = localStorage.getItem('admin-auth');
    if (!isAuth) {
      router.push('/admin/login');
    }

    const loadReports = async () => {
      try {
        const response = await fetch('/api/data/reports');
        const data = await response.json();
        console.log('[Forwarding] Loaded reports:', data.length);
        setReports(data && data.length > 0 ? data : getMockReports());
      } catch (err) {
        console.error('[Forwarding] Error loading reports, using mock data:', err);
        setReports(getMockReports());
      }
    };

    loadReports();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('admin-auth');
    router.push('/admin/login');
  };

  const handleSelectReport = (report: Report) => {
    setSelectedReport(report);
    setSelectedDept('');
    const relevantDepts = categoryToDepartments[report.category] || categoryToDepartments['Other'];
    setMessage(
      `Case #${report.id} - ${report.category}\nSeverity: ${report.severity}\nLocation: ${report.lat.toFixed(4)}, ${report.lng.toFixed(4)}\nZone: ${report.zone}\n\nDescription: ${report.note}\n\nReporter: ${report.reporter || 'Anonymous'}\nDate: ${report.date}\n\nPlease verify this report and take appropriate action.`
    );
  };

  const handleForward = () => {
    if (selectedReport && selectedDept && message) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setSelectedReport(null);
        setSelectedDept('');
        setMessage('');
      }, 2000);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar open={true} onClose={() => {}} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Authority Forwarding</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Left: Report list */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col">
              <div className="p-4 border-b border-gray-200 font-semibold text-gray-900">Select Report</div>
              <div className="flex-1 overflow-y-auto divide-y">
                {reports.map((report) => (
                  <button
                    key={report.id}
                    onClick={() => handleSelectReport(report)}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                      selectedReport?.id === report.id ? 'bg-blue-50 border-l-4' : ''
                    }`}
                    style={{
                      borderLeftColor: selectedReport?.id === report.id ? '#3b82f6' : 'transparent',
                    }}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="font-medium text-sm text-gray-900">Case #{report.id}</p>
                      <span
                        className="text-xs font-bold rounded-full px-2 py-1"
                        style={{
                          backgroundColor:
                            report.severity === 'High'
                              ? '#fca5a5'
                              : report.severity === 'Medium'
                                ? '#fcd34d'
                                : '#c6f6d5',
                          color:
                            report.severity === 'High'
                              ? '#7f1d1d'
                              : report.severity === 'Medium'
                                ? '#78350f'
                                : '#15803d',
                        }}
                      >
                        {report.severity}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{report.category}</p>
                    <p className="text-xs text-gray-500 mt-1">{report.note}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Forward form */}
            <div className="space-y-4">
              {selectedReport ? (
                <>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm font-semibold text-blue-900 mb-2">Case #{selectedReport.id} Selected</p>
                    <p className="text-xs text-blue-700">{selectedReport.category}</p>
                    <p className="text-xs text-blue-600 mt-1">{selectedReport.note}</p>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-2">
                    <label className="text-sm font-semibold text-gray-900">Forward to Department</label>
                    <p className="text-xs text-gray-600 mb-2">
                      Recommended for {selectedReport.category}:
                    </p>
                    <select
                      value={selectedDept}
                      onChange={(e) => setSelectedDept(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="">Select department...</option>
                      {(categoryToDepartments[selectedReport.category] || categoryToDepartments['Other']).map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-2">
                    <label className="text-sm font-semibold text-gray-900">Message</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Message to authority..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                      rows={6}
                    />
                    <p className="text-xs text-gray-500">Customize the message or use the default template.</p>
                  </div>

                  <button
                    onClick={handleForward}
                    disabled={!selectedDept || !message || submitted}
                    className="w-full py-3 px-4 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    style={{ backgroundColor: submitted ? '#16a34a' : '#3b82f6' }}
                  >
                    {submitted ? (
                      <>
                        <CheckCircle2 className="w-5 h-5" /> Forwarded
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" /> Forward to {selectedDept || 'Authority'}
                      </>
                    )}
                  </button>
                </>
              ) : (
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 text-center flex items-center justify-center h-full">
                  <p className="text-gray-600">Select a report to forward to authorities</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
