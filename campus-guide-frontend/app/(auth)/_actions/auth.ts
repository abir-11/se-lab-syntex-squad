'use server';

import { cookies } from 'next/headers';

const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  'https://campus-guide-backend.vercel.app';

type Role = 'ADMIN' | 'MENTOR' | 'STUDENT';

const getRoleDashboard = (role?: string) => {
  const normalizedRole = role?.toUpperCase();
  switch (normalizedRole) {
    case 'ADMIN': return '/dashboard/admin';
    case 'MENTOR': return '/dashboard/mentor';
    case 'STUDENT': return '/dashboard/student';
    default: return '/';
  }
};

const getRoleFromToken = (token: string): string | undefined => {
  try {
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return undefined;
    const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
    const decodedJson = Buffer.from(base64, 'base64').toString('utf-8');
    const decoded = JSON.parse(decodedJson);
    return decoded?.role || decoded?.user?.role;
  } catch {
    return undefined;
  }
};

const extractRole = (data: any, token?: string, defaultRole?: Role): Role | undefined => {
  const rawRole =
    data?.data?.JwtPayload?.role ||
    data?.data?.role ||
    data?.role ||
    data?.user?.role ||
    data?.data?.user?.role ||
    (token ? getRoleFromToken(token) : undefined) ||
    defaultRole;

  if (!rawRole) return undefined;
  const upper = String(rawRole).toUpperCase();
  if (upper === 'ADMIN' || upper === 'MENTOR' || upper === 'STUDENT') return upper as Role;
  return undefined;
};

const setAccessToken = async (token: string) => {
  const cookieStore = await cookies();

  cookieStore.set('accessToken', token, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  });
};

export async function loginUserAction(payload: { email: string; password: string; }) {
  try {
    const response = await fetch(`${BACKEND_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return { success: false, message: `Server Error: Backend-এ সমস্যা হয়েছে।` };
    }

    const data = await response.json();
    if (!response.ok) {
      return { success: false, message: data?.message || 'Login failed' };
    }

    const token = data?.accessToken || data?.data?.accessToken || data?.token || data?.data?.token;

    if (!token) {
      return { success: false, message: 'Access token not found।' };
    }

    const role = extractRole(data, token);
    if (!role) {
      return { success: false, message: 'User role not found।' };
    }

    await setAccessToken(token);
    const dashboard = getRoleDashboard(role);
    
    // Redirect না করে URL রিটার্ন করছি
    return { success: true, redirectUrl: dashboard };
  } catch (error: any) {
    return { success: false, message: error?.message || 'Something went wrong' };
  }
}

export async function registerUserAction(payload: any) {
  try {
    const registerResponse = await fetch(`${BACKEND_API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    const contentType = registerResponse.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return { success: false, message: `Server error (${registerResponse.status})` };
    }

    const registerData = await registerResponse.json();
    if (!registerResponse.ok) {
      return { success: false, message: registerData?.message || 'Registration failed' };
    }

    // Auto-login
    const loginResponse = await fetch(`${BACKEND_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: payload.email, password: payload.password }),
      cache: 'no-store',
    });

    const loginData = await loginResponse.json();
    const token = loginData?.accessToken || loginData?.data?.accessToken || loginData?.token;

    if (!token) {
      return { success: true, message: 'registered_no_token' };
    }

    const role = extractRole(loginData, token, 'STUDENT');
    await setAccessToken(token);
    const dashboard = getRoleDashboard(role);

    return { success: true, redirectUrl: dashboard };
  } catch (error: any) {
    return { success: false, message: error?.message || 'Something went wrong' };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('accessToken');
}