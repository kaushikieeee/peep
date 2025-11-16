import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Hook to check admin authentication and token validity
 * Redirects to login if not authenticated or token expired
 */
export function useAdminAuth() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('admin-auth');
    const expiresAt = localStorage.getItem('admin-auth-expires');

    if (!token) {
      router.push('/admin/login');
      return;
    }

    // Check token expiration
    if (expiresAt) {
      const expiration = new Date(expiresAt);
      if (new Date() > expiration) {
        // Token expired
        localStorage.removeItem('admin-auth');
        localStorage.removeItem('admin-auth-expires');
        router.push('/admin/login?expired=true');
        return;
      }
    }
  }, [router]);
}

/**
 * Clear admin session data
 */
export function clearAdminSession() {
  localStorage.removeItem('admin-auth');
  localStorage.removeItem('admin-auth-expires');
  localStorage.removeItem('admin-attempts');
  localStorage.removeItem('admin-lockout');
}
