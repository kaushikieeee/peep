'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Plus, Trash2, Edit2, X } from 'lucide-react';
import AdminSidebar from '@/components/admin/sidebar';
import LiveMap from '@/components/peep/live-map';

interface Zone {
  id: string;
  name: string;
  location: string;
  severity: 'Red' | 'Yellow' | 'Green';
  color: string;
}

const mockZones: Zone[] = [
  { id: 'zone-a', name: 'Zone A', location: 'Park North', severity: 'Red', color: '#ef4444' },
  { id: 'zone-b', name: 'Zone B', location: 'School East', severity: 'Yellow', color: '#f59e0b' },
  { id: 'zone-c', name: 'Zone C', location: 'Community Center', severity: 'Green', color: '#16a34a' },
];

export default function ZonesPage() {
  const router = useRouter();
  const [zones, setZones] = useState<Zone[]>(mockZones);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', location: '', severity: 'Green' });
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    const isAuth = localStorage.getItem('admin-auth');
    if (!isAuth) {
      router.push('/admin/login');
    }

    fetch('/api/data/reports')
      .then(r => r.json())
      .then(data => {
        setReports(data.map((r: any) => ({
          id: r.id,
          lat: r.lat,
          lng: r.lng,
          category: r.category,
          severity: r.severity,
          note: r.note,
        })));
      })
      .catch(err => console.error('Failed to load reports:', err));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('admin-auth');
    router.push('/admin/login');
  };

  const handleAddZone = () => {
    if (!formData.name.trim()) return;
    
    const newZone: Zone = {
      id: `zone-${Date.now()}`,
      name: formData.name,
      location: formData.location,
      severity: formData.severity as 'Red' | 'Yellow' | 'Green',
      color:
        formData.severity === 'Red'
          ? '#ef4444'
          : formData.severity === 'Yellow'
            ? '#f59e0b'
            : '#16a34a',
    };
    setZones([...zones, newZone]);
    setFormData({ name: '', location: '', severity: 'Green' });
    setShowForm(false);
  };

  const handleDeleteZone = (id: string) => {
    setZones(zones.filter((z) => z.id !== id));
    if (selectedZone?.id === id) setSelectedZone(null);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar open={true} onClose={() => {}} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Zone Editor</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-4 gap-6 h-full">
            {/* Left Panel */}
            <div className="col-span-1 space-y-4">
              <button
                onClick={() => setShowForm(!showForm)}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-white font-medium bg-blue-600 hover:bg-blue-700 transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Zone
              </button>

              {showForm && (
                <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
                  <input
                    type="text"
                    placeholder="Zone name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <select
                    value={formData.severity}
                    onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option>Green</option>
                    <option>Yellow</option>
                    <option>Red</option>
                  </select>
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddZone}
                      disabled={!formData.name.trim()}
                      className="flex-1 py-2 px-3 rounded-lg text-white text-sm font-medium bg-blue-600 disabled:opacity-50"
                    >
                      Create
                    </button>
                    <button
                      onClick={() => setShowForm(false)}
                      className="flex-1 py-2 px-3 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 font-semibold text-gray-900">Zones ({zones.length})</div>
                <div className="divide-y max-h-96 overflow-y-auto">
                  {zones.map((zone) => (
                    <div
                      key={zone.id}
                      onClick={() => setSelectedZone(zone)}
                      className={`p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedZone?.id === zone.id ? 'bg-blue-50 border-l-4' : ''
                      }`}
                      style={{ borderLeftColor: selectedZone?.id === zone.id ? '#3b82f6' : 'transparent' }}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex-1">
                          <p className="font-medium text-sm text-gray-900">{zone.name}</p>
                          <p className="text-xs text-gray-600">{zone.location}</p>
                        </div>
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: zone.color }} />
                      </div>
                      <div className="flex gap-1">
                        <button className="flex-1 px-2 py-1 text-xs rounded hover:bg-gray-200 flex items-center justify-center gap-1">
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteZone(zone.id);
                          }}
                          className="flex-1 px-2 py-1 text-xs rounded hover:bg-red-100 text-red-600 flex items-center justify-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Panel - Map */}
            <div className="col-span-3 bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="h-full">
                <LiveMap
                  pins={reports}
                  onPinClick={(pin) => {
                    console.log('Clicked pin:', pin);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
