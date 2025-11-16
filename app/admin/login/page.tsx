'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, AlertCircle } from 'lucide-react';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [locked, setLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);
  const [remainingTime, setRemainingTime] = useState(0);

  // Check lockout status on component mount
  useEffect(() => {
    const lockoutData = localStorage.getItem('admin-lockout');
    if (lockoutData) {
      const lockoutEnd = parseInt(lockoutData);
      const now = Date.now();
      if (now < lockoutEnd) {
        setLocked(true);
        setLockoutTime(lockoutEnd);
      } else {
        // Lockout expired
        localStorage.removeItem('admin-lockout');
        localStorage.removeItem('admin-attempts');
      }
    }
  }, []);

  // Update remaining lockout time
  useEffect(() => {
    if (!locked || !lockoutTime) return;
    
    const interval = setInterval(() => {
      const remaining = lockoutTime - Date.now();
      if (remaining <= 0) {
        setLocked(false);
        setLockoutTime(null);
        localStorage.removeItem('admin-lockout');
        localStorage.removeItem('admin-attempts');
        clearInterval(interval);
      } else {
        setRemainingTime(Math.ceil(remaining / 1000));
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [locked, lockoutTime]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (locked) {
      setError(`Account temporarily locked. Try again in ${remainingTime} seconds.`);
      return;
    }

    setError('');
    setLoading(true);

    // Input validation
    if (!email || !password) {
      setError('Email and password are required');
      setLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Invalid email or password');
      setLoading(false);
      return;
    }

    try {
      // Server-side authentication
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Clear failed attempts on success
        localStorage.removeItem('admin-attempts');
        localStorage.removeItem('admin-lockout');
        // Store secure session token
        localStorage.setItem('admin-auth', data.token);
        localStorage.setItem('admin-auth-expires', data.expiresAt);
        router.push('/admin/dashboard');
      } else {
        const errorData = await response.json();
        
        // Handle rate limiting (429)
        if (response.status === 429) {
          setError('Too many login attempts. Account locked for 15 minutes.');
          setLocked(true);
          const lockoutEnd = Date.now() + LOCKOUT_DURATION;
          setLockoutTime(lockoutEnd);
          localStorage.setItem('admin-lockout', lockoutEnd.toString());
          localStorage.removeItem('admin-attempts');
        } else {
          // Increment failed attempts
          const attempts = parseInt(localStorage.getItem('admin-attempts') || '0') + 1;
          localStorage.setItem('admin-attempts', attempts.toString());
          
          if (attempts >= MAX_LOGIN_ATTEMPTS) {
            setError('Too many failed attempts. Account locked for 15 minutes.');
            setLocked(true);
            const lockoutEnd = Date.now() + LOCKOUT_DURATION;
            setLockoutTime(lockoutEnd);
            localStorage.setItem('admin-lockout', lockoutEnd.toString());
          } else {
            setError(errorData.message || 'Invalid email or password');
          }
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--peep-primary)' }}>
            PEEP
          </h1>
          <p className="text-gray-600 font-medium">Admin Portal</p>
          <p className="text-sm text-gray-500 mt-1">Public Environmental Evidence Platform</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@peep.com"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1"
                  style={{ '--tw-ring-color': 'var(--peep-primary)' } as any}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1"
                  style={{ '--tw-ring-color': 'var(--peep-primary)' } as any}
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading || locked}
              className="w-full py-2 px-4 rounded-lg font-semibold text-white transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: 'var(--peep-primary)' }}
            >
              {locked ? `Locked (${remainingTime}s)` : loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-900 font-medium">Security Features Enabled</p>
              <ul className="text-xs text-blue-800 mt-2 space-y-1">
                <li>✓ Server-side authentication</li>
                <li>✓ Rate limiting (5 attempts / 15 mins)</li>
                <li>✓ Session tokens with expiration</li>
                <li>✓ Input validation & sanitization</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 space-y-2">
          <p className="text-sm text-gray-600">Authorized personnel only</p>
          <p className="text-xs text-gray-500">Demo: admin@peep.com / admin123</p>
        </div>
      </div>
    </div>
  );
}
