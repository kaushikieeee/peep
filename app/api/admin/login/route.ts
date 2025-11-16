import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// In-memory rate limiting store (for production, use Redis)
const loginAttempts = new Map<string, { count: number; resetTime: number }>();

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Helper to hash passwords (simple PBKDF2)
 */
function hashPassword(password: string, salt: string): string {
  return crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha256')
    .toString('hex');
}

/**
 * Check if IP/email is rate limited
 */
function isRateLimited(key: string): boolean {
  const attempt = loginAttempts.get(key);
  if (!attempt) return false;

  const now = Date.now();
  if (now > attempt.resetTime) {
    loginAttempts.delete(key);
    return false;
  }

  return attempt.count >= MAX_ATTEMPTS;
}

/**
 * Record failed login attempt
 */
function recordFailedAttempt(key: string): void {
  const now = Date.now();
  const attempt = loginAttempts.get(key);

  if (!attempt || now > attempt.resetTime) {
    loginAttempts.set(key, {
      count: 1,
      resetTime: now + LOCKOUT_DURATION,
    });
  } else {
    attempt.count++;
  }
}

/**
 * Clear failed attempts
 */
function clearAttempts(key: string): void {
  loginAttempts.delete(key);
}

/**
 * Generate secure session token
 */
function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body with error handling
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return NextResponse.json(
        { message: 'Invalid request format' },
        { status: 400 }
      );
    }

    const { email, password } = body;

    // Input validation
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Get client IP for rate limiting (X-Forwarded-For or connection IP)
    const clientIP =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    const rateLimitKey = `${clientIP}:${email}`;

    // Check if account is locked
    if (isRateLimited(rateLimitKey)) {
      return NextResponse.json(
        { message: 'Too many failed login attempts. Please try again later.' },
        { status: 429 }
      );
    }

    // Get credentials from environment variables
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@peep.com';
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';

    // Simple string comparison (in production, use proper password hashing)
    const emailMatch = email === adminEmail;
    const passwordMatch = password === adminPassword;

    if (!emailMatch || !passwordMatch) {
      recordFailedAttempt(rateLimitKey);
      
      // Don't reveal which field is wrong
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Clear failed attempts on success
    clearAttempts(rateLimitKey);

    // Generate session token
    const token = generateToken();
    const expiresAt = new Date(Date.now() + SESSION_DURATION).toISOString();

    // Log successful login (for security auditing)
    console.log(`[AUTH] Successful login: ${email} from ${clientIP} at ${new Date().toISOString()}`);

    return NextResponse.json(
      {
        token,
        expiresAt,
        message: 'Login successful',
      },
      {
        status: 200,
        headers: {
          // Secure cookie headers (if using cookies instead of localStorage)
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
        },
      }
    );
  } catch (error) {
    console.error('[AUTH] Login error:', error);
    return NextResponse.json(
      { message: 'An error occurred during authentication' },
      { status: 500 }
    );
  }
}

// Security headers
export const metadata = {
  headers: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
  },
};
