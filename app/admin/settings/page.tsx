'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Save, RotateCcw } from 'lucide-react';
import AdminSidebar from '@/components/admin/sidebar';

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState({
    publicVisibility: true,
    enableNotifications: true,
    autoVerify: false,
    maxReportsPerDay: 100,
  });
  const [saved, setSaved] = useState(false);
  const [categories] = useState([
    'Air Pollution - Factory Emissions',
    'Water Pollution - Stagnant Water',
    'Soil Degradation - Erosion',
    'Waste Management Issues',
    'Noise Pollution - Industrial',
    'Chemical Spills',
  ]);

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

  const handleSave = () => {
    localStorage.setItem('peep-settings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setSettings({
      publicVisibility: true,
      enableNotifications: true,
      autoVerify: false,
      maxReportsPerDay: 100,
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar open={true} onClose={() => {}} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-2xl space-y-6">
            {/* Visibility Settings */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Visibility Settings</h2>
              
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.publicVisibility}
                    onChange={(e) =>
                      setSettings({ ...settings, publicVisibility: e.target.checked })
                    }
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm text-gray-700">Make all reports public by default</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enableNotifications}
                    onChange={(e) =>
                      setSettings({ ...settings, enableNotifications: e.target.checked })
                    }
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm text-gray-700">Enable email notifications for new reports</span>
                </label>
              </div>
            </div>

            {/* Verification Settings */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Verification Settings</h2>
              
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoVerify}
                    onChange={(e) =>
                      setSettings({ ...settings, autoVerify: e.target.checked })
                    }
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm text-gray-700">Auto-verify reports with multiple confirmations</span>
                </label>

                <div className="pt-2">
                  <label className="text-sm font-medium text-gray-700">Max Reports Per Day</label>
                  <input
                    type="number"
                    value={settings.maxReportsPerDay}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        maxReportsPerDay: parseInt(e.target.value) || 100,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mt-2"
                  />
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Report Categories</h2>
              
              <div className="grid grid-cols-2 gap-3">
                {categories.map((category) => (
                  <div key={category} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-700">{category}</p>
                  </div>
                ))}
              </div>

              <button className="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-sm transition-all">
                Manage Categories
              </button>
            </div>

            {/* Data Management */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Data Management</h2>
              
              <div className="space-y-2">
                <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-all">
                  Export as CSV
                </button>
                <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-all">
                  Export as JSON
                </button>
                <button className="w-full py-2 px-4 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 font-medium text-sm transition-all">
                  Reset Mock Data
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-all"
              >
                <Save className="w-5 h-5" />
                {saved ? 'Saved!' : 'Save Settings'}
              </button>
              <button
                onClick={handleReset}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-all"
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
