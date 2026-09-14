export type UserRole = 'CITIZEN' | 'OFFICER' | 'NODAL_OFFICER' | 'ANALYST' | 'SUPER_ADMIN';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  departmentId?: string | null;
  departmentName?: string | null;
  designation?: string | null;
  phone?: string | null;
}

export const DEMO_USERS: Record<string, AuthUser> = {
  'citizen@pravah.demo': {
    id: 'usr-citizen-01',
    name: 'Priya Sharma',
    email: 'citizen@pravah.demo',
    role: 'CITIZEN',
    phone: '+91 98765 43210',
  },
  'officer@pravah.demo': {
    id: 'usr-officer-01',
    name: 'Vikram Malhotra',
    email: 'officer@pravah.demo',
    role: 'OFFICER',
    departmentName: 'Roads & Highways',
    designation: 'Senior Executive Engineer',
    phone: '+91 98765 43211',
  },
  'nodal@pravah.demo': {
    id: 'usr-nodal-01',
    name: 'Dr. Sunita Rao, IAS',
    email: 'nodal@pravah.demo',
    role: 'NODAL_OFFICER',
    departmentName: 'General Administration',
    designation: 'Principal Secretary / Nodal Officer',
    phone: '+91 98765 43212',
  },
  'analyst@pravah.demo': {
    id: 'usr-analyst-01',
    name: 'Aditya Sen',
    email: 'analyst@pravah.demo',
    role: 'ANALYST',
    departmentName: 'Civic Infrastructure',
    designation: 'Chief Data & Intelligence Analyst',
    phone: '+91 98765 43213',
  },
  'admin@pravah.demo': {
    id: 'usr-admin-01',
    name: 'Super Admin Pravah',
    email: 'admin@pravah.demo',
    role: 'SUPER_ADMIN',
    departmentName: 'Governance Operations',
    designation: 'System Administrator',
    phone: '+91 98765 43214',
  },
};

// Client-side session storage helper
export function getStoredUser(): AuthUser {
  if (typeof window === 'undefined') {
    return DEMO_USERS['nodal@pravah.demo'];
  }
  const stored = localStorage.getItem('pravah_active_user');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fallback
    }
  }
  return DEMO_USERS['nodal@pravah.demo']; // Default fallback
}

export function setStoredUser(user: AuthUser): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('pravah_active_user', JSON.stringify(user));
    window.dispatchEvent(new Event('pravah-auth-change'));
  }
}

/**
 * Client-Side API Authentication helpers
 */
export async function loginWithCredentials(email: string, password: string): Promise<AuthUser> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Authentication failed.');
  }

  setStoredUser(data.user);
  return data.user;
}

export async function loginWithOtp(phone: string, otp: string): Promise<AuthUser> {
  const res = await fetch('/api/auth/otp/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, otp }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'OTP verification failed.');
  }

  setStoredUser(data.user);
  return data.user;
}

export async function sendOtpToPhone(phone: string): Promise<{ success: boolean; message: string; demoOtp?: string }> {
  const res = await fetch('/api/auth/otp/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to send OTP.');
  }

  return data;
}

export async function registerUser(userData: {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  phone?: string;
  departmentId?: string;
  designation?: string;
}): Promise<AuthUser> {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Registration failed.');
  }

  setStoredUser(data.user);
  return data.user;
}

export async function logoutUser(): Promise<void> {
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
  } catch {}

  if (typeof window !== 'undefined') {
    localStorage.removeItem('pravah_active_user');
    window.dispatchEvent(new Event('pravah-auth-change'));
  }
}
