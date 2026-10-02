'use server';

import { cookies } from 'next/headers';

const BACKEND =
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  'https://campus-guide-backend.vercel.app';

const API = `${BACKEND}/api`;

async function safeJson(res: Response) {
  try {
    const ct = res.headers.get('content-type');
    if (ct?.includes('application/json')) return await res.json();
    return { message: (await res.text()) || res.statusText };
  } catch { return { message: 'Failed to parse response' }; }
}

async function authHeaders(): Promise<HeadersInit> {
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  try {
    const store = await cookies();
    const token = store.get('accessToken')?.value;
    if (token) h['Authorization'] = `Bearer ${token}`;
  } catch {}
  return h;
}

function toList(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;
  const d = (data as any)?.data;
  if (Array.isArray(d)) return d;
  return [];
}

async function req(path: string, opts: { method?: string; body?: unknown } = {}) {
  const headers = await authHeaders();
  const res = await fetch(`${API}${path}`, {
    method: opts.method ?? 'GET',
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
    cache: 'no-store',
  });
  const data = await safeJson(res);
  if (res.status === 401 || res.status === 403)
    return { ok: false, data, message: data?.message ?? 'Unauthorized' };
  return { ok: res.ok, data, message: data?.message as string | undefined };
}

// ── Stats ─────────────────────────────────────────────────────────────────────
export async function fetchMentorStats() {
  const empty = { totalServices: 0, pendingServices: 0, approvedServices: 0, totalBookings: 0, pendingBookings: 0, acceptedBookings: 0 };
  try {
    const [svcRes, bookRes] = await Promise.allSettled([
      req('/mentor-services?limit=500'),
      req('/bookings'),
    ]);

    const stats = { ...empty };

    if (svcRes.status === 'fulfilled' && svcRes.value.ok) {
      const all = toList(svcRes.value.data) as any[];
      stats.totalServices    = all.length;
      stats.pendingServices  = all.filter(s => String(s.status).toUpperCase() === 'PENDING').length;
      stats.approvedServices = all.filter(s => String(s.status).toUpperCase() === 'APPROVED').length;
    }

    if (bookRes.status === 'fulfilled' && bookRes.value.ok) {
      const all = toList(bookRes.value.data) as any[];
      stats.totalBookings   = all.length;
      stats.pendingBookings = all.filter(b => String(b.status).toUpperCase() === 'PENDING').length;
      stats.acceptedBookings = all.filter(b => String(b.status).toUpperCase() === 'ACCEPTED').length;
    }

    return { success: true, data: stats };
  } catch { return { success: false, data: empty }; }
}

// ── Profile ───────────────────────────────────────────────────────────────────
export async function fetchMentorProfile() {
  try {
    const r = await req('/auth/me');
    if (!r.ok) return { success: false, message: r.message, data: null };
    const u = (r.data as any)?.data?.result ?? (r.data as any)?.data ?? r.data;
    return { success: true, data: u };
  } catch (e: any) { return { success: false, message: e?.message, data: null }; }
}

// ── My Services ───────────────────────────────────────────────────────────────
export async function fetchMyServices() {
  try {
    // Fetch all services then filter by mentorId client-side because the
    // public endpoint only returns APPROVED; we need mentor's own services too.
    const r = await req('/mentor-services?limit=500');
    if (!r.ok) return { success: false, message: r.message, data: [] };
    return { success: true, data: toList(r.data) };
  } catch (e: any) { return { success: false, message: e?.message, data: [] }; }
}

export async function createService(payload: {
  name: string; category: string; description: string;
  fee: number; mobile?: string; date?: string; time?: string; image?: string;
}) {
  try {
    const r = await req('/mentor-services', { method: 'POST', body: payload });
    if (!r.ok) return { success: false, message: r.message ?? 'Failed to create service' };
    return { success: true, data: r.data };
  } catch (e: any) { return { success: false, message: e?.message }; }
}

export async function updateService(id: string, payload: Partial<{
  name: string; category: string; description: string;
  fee: number; mobile: string; date: string; time: string; image: string;
}>) {
  try {
    const r = await req(`/mentor-services/${id}`, { method: 'PATCH', body: payload });
    if (!r.ok) return { success: false, message: r.message ?? 'Failed to update service' };
    return { success: true, data: r.data };
  } catch (e: any) { return { success: false, message: e?.message }; }
}

export async function deleteService(id: string) {
  try {
    const r = await req(`/mentor-services/${id}`, { method: 'DELETE' });
    if (!r.ok) return { success: false, message: r.message ?? 'Failed to delete service' };
    return { success: true };
  } catch (e: any) { return { success: false, message: e?.message }; }
}

// ── Bookings ──────────────────────────────────────────────────────────────────
export async function fetchMentorBookings() {
  try {
    const r = await req('/bookings');
    if (!r.ok) return { success: false, message: r.message, data: [] };
    return { success: true, data: toList(r.data) };
  } catch (e: any) { return { success: false, message: e?.message, data: [] }; }
}

export async function respondToBooking(id: string, action: 'ACCEPT' | 'REJECT') {
  try {
    const r = await req(`/bookings/${id}`, { method: 'PATCH', body: { action } });
    if (!r.ok) return { success: false, message: r.message ?? 'Failed to update booking' };
    return { success: true, data: r.data };
  } catch (e: any) { return { success: false, message: e?.message }; }
}
