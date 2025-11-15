'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
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

export default function ZoneEditor() {
  const [zones, setZones] = useState<Zone[]>(mockZones);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', location: '', severity: 'Green' });
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    // Load reports from API
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
  }, []);

  const handleAddZone = () => {
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Zone Editor</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 py-2 px-4 rounded-lg text-white font-medium transition-all"
          style={{ backgroundColor: 'var(--peep-primary)' }}
        >
          <Plus className="w-4 h-4" />
          Add Zone
        </button>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-4 gap-6">
        {/* Left panel: Zone controls */}
        <div className="col-span-1 space-y-4">
          {/* Form */}
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
                onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option>Green</option>
                <option>Yellow</option>
                <option>Red</option>
              </select>
              <div className="flex gap-2">
                <button
                  onClick={handleAddZone}
                  disabled={!formData.name}
                  className="flex-1 py-2 px-3 rounded-lg text-white text-sm font-medium disabled:opacity-50 transition-all"
                  style={{ backgroundColor: 'var(--peep-primary)' }}
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

          {/* Zone list */}
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
                  style={{ borderLeftColor: selectedZone?.id === zone.id ? 'var(--peep-primary)' : 'transparent' }}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-900">{zone.name}</p>
                      <p className="text-xs text-gray-600">{zone.location}</p>
                    </div>
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: zone.color }}
                    />
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

        {/* Right panel: Map */}
        <div className="col-span-3 bg-white rounded-lg border border-gray-200 overflow-hidden" style={{ height: '500px' }}>
          <LiveMap
            pins={reports}
            onPinClick={(pin) => {
              // Handle pin click if needed
            }}
          />
        </div>
      </div>

      {/* Info section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">Zones</span> are geographic areas where you can track and manage pollution reports. Use severity levels (Red/Yellow/Green) to prioritize response actions.
        </p>
      </div>
    </div>
  );
}
