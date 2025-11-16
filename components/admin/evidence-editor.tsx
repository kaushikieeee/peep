'use client';

import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Evidence, updateEvidence, createEvidence, deleteEvidence } from '@/lib/evidenceClientAPI';

interface EvidenceEditorProps {
  evidence?: Evidence & { rowIndex?: number };
  onClose: () => void;
  onSave: () => void;
  isNew?: boolean;
}

const ZONES = ['Zone A', 'Zone B', 'Zone C', 'Zone D', 'Zone E', 'Zone F'];
const CATEGORIES = ['Air Pollution', 'Water Pollution', 'Soil Contamination', 'Noise Pollution', 'Waste Management', 'Other'];

export default function EvidenceEditor({ evidence, onClose, onSave, isNew }: EvidenceEditorProps) {
  const [formData, setFormData] = useState<Evidence>(
    evidence || {
      id: `E${Date.now()}`,
      lat: 11.0420,
      lng: 77.0269,
      category: '',
      severity: 'Medium',
      note: '',
      reporter: '',
      date: new Date().toISOString().split('T')[0],
      zone: '',
      upvotes: 0,
      verified: false,
      status: 'Open',
      images: [],
      assignedTo: '',
      assignedDate: '',
    }
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newImage, setNewImage] = useState('');

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: Evidence) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddImage = () => {
    if (newImage.trim()) {
      setFormData((prev: Evidence) => ({
        ...prev,
        images: [...(prev.images || []), newImage.trim()],
      }));
      setNewImage('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev: Evidence) => ({
      ...prev,
      images: prev.images?.filter((_: string, i: number) => i !== index) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isNew) {
        await createEvidence(formData);
      } else {
        const rowIndex = (evidence as any)?.rowIndex || 2;
        await updateEvidence(formData, rowIndex);
      }
      onSave();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save evidence');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this evidence?')) return;
    
    setLoading(true);
    setError('');

    try {
      const rowIndex = (evidence as any)?.rowIndex || 2;
      await deleteEvidence(rowIndex);
      onSave();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete evidence');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {isNew ? 'Add New Evidence' : 'Edit Evidence'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reporter Name *
              </label>
              <input
                type="text"
                value={formData.reporter}
                onChange={(e) => handleInputChange('reporter', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Category</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Severity *
              </label>
              <select
                value={formData.severity}
                onChange={(e) => handleInputChange('severity', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zone *
              </label>
              <select
                value={formData.zone}
                onChange={(e) => handleInputChange('zone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Zone</option>
                {ZONES.map(zone => (
                  <option key={zone} value={zone}>{zone}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Escalated">Escalated</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Latitude
              </label>
              <input
                type="number"
                step="0.0001"
                value={formData.lat}
                onChange={(e) => handleInputChange('lat', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Longitude
              </label>
              <input
                type="number"
                step="0.0001"
                value={formData.lng}
                onChange={(e) => handleInputChange('lng', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assigned To
              </label>
              <input
                type="text"
                value={formData.assignedTo}
                onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assigned Date
              </label>
              <input
                type="date"
                value={formData.assignedDate}
                onChange={(e) => handleInputChange('assignedDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description/Note
            </label>
            <textarea
              value={formData.note}
              onChange={(e) => handleInputChange('note', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Verified
            </label>
            <input
              type="checkbox"
              checked={formData.verified}
              onChange={(e) => handleInputChange('verified', e.target.checked)}
              className="w-4 h-4"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Image URLs
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="url"
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddImage()}
                placeholder="Add image URL..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="space-y-2">
              {formData.images?.map((image: string, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-100 rounded-lg text-sm"
                >
                  <span className="text-gray-700 truncate">{image}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-between gap-2 -mx-6 -mb-6">
            <div>
              {!isNew && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <Trash2 size={18} />
                  Delete
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
