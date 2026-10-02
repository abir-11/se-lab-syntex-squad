'use server';

import { cookies } from 'next/headers';

const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  'https://campus-guide-backend.vercel.app';

const API = `${BACKEND_API_URL}/api`;

async function safeJsonParse(res: Response) {
  try {
    const ct = res.headers.get('content-type');
    if (ct?.includes('application/json')) return await res.json();
    return { message: (await res.text()) || res.statusText };
  } catch {
    return { message: 'Failed to parse response' };
  }
}

async function getAuthHeaders(): Promise<HeadersInit> {
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

async function req(
  path: string,
  opts: { method?: string; body?: unknown } = {}
) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API}${path}`, {
    method: opts.method ?? 'GET',
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
    cache: 'no-store',
  });
  const data = await safeJsonParse(response);
  if (response.status === 401 || response.status === 403)
    return { ok: false, data, message: data?.message ?? 'Unauthorized' };
  return { ok: response.ok, data, message: data?.message as string | undefined };
}

// ── Stats ─────────────────────────────────────────────────────────────────────
export async function fetchStudentStats() {
  const empty = {
    totalBookings: 0, pendingBookings: 0, confirmedBookings: 0,
    totalMentors: 0, totalEvents: 0, totalResources: 0,
  };
  try {
    const [bookRes, mentorRes, eventRes, resRes] = await Promise.allSettled([
      req('/bookings'),
      req('/mentors'),
      req('/events'),
      req('/resources/public'),
    ]);
    const stats = { ...empty };
    if (bookRes.status === 'fulfilled' && bookRes.value.ok) {
      const b = toList(bookRes.value.data) as any[];
      stats.totalBookings     = b.length;
      stats.pendingBookings   = b.filter(x => String(x.status).toUpperCase() === 'PENDING').length;
      stats.confirmedBookings = b.filter(x => ['CONFIRMED','ACCEPTED'].includes(String(x.status).toUpperCase())).length;
    }
    if (mentorRes.status === 'fulfilled' && mentorRes.value.ok)
      stats.totalMentors = toList(mentorRes.value.data).length;
    if (eventRes.status === 'fulfilled' && eventRes.value.ok)
      stats.totalEvents = toList(eventRes.value.data).length;
    if (resRes.status === 'fulfilled' && resRes.value.ok)
      stats.totalResources = toList(resRes.value.data).length;
    return { success: true, data: stats };
  } catch {
    return { success: false, data: empty };
  }
}

// ── Bookings ──────────────────────────────────────────────────────────────────
export async function fetchMyBookings() {
  try {
    const r = await req('/bookings');
    if (!r.ok) return { success: false, message: r.message ?? 'Failed', data: [] };
    return { success: true, data: toList(r.data) };
  } catch (e: any) { return { success: false, message: e?.message, data: [] }; }
}

export async function createBooking(payload: {
  serviceId: string; mentorId: string; date: string; time: string; notes?: string;
}) {
  try {
    const r = await req('/bookings/create', { method: 'POST', body: payload });
    if (!r.ok) return { success: false, message: r.message ?? 'Failed to create booking' };
    return { success: true, data: r.data };
  } catch (e: any) { return { success: false, message: e?.message }; }
}

export async function cancelBooking(id: string) {
  try {
    const r = await req(`/bookings/${id}`, { method: 'DELETE' });
    if (!r.ok) return { success: false, message: r.message ?? 'Failed to cancel' };
    return { success: true };
  } catch (e: any) { return { success: false, message: e?.message }; }
}

// ── Mentors ───────────────────────────────────────────────────────────────────
export async function fetchMentors() {
  try {
    const r = await req('/mentors');
    if (!r.ok) return { success: false, message: r.message ?? 'Failed', data: [] };
    return { success: true, data: toList(r.data) };
  } catch (e: any) { return { success: false, message: e?.message, data: [] }; }
}

export async function fetchMentorServices() {
  try {
    const r = await req('/mentor-services');
    if (!r.ok) return { success: false, message: r.message ?? 'Failed', data: [] };
    return { success: true, data: toList(r.data) };
  } catch (e: any) { return { success: false, message: e?.message, data: [] }; }
}

// ── Events ────────────────────────────────────────────────────────────────────
export async function fetchPublicEvents() {
  try {
    const r = await req('/events');
    if (!r.ok) return { success: false, message: r.message ?? 'Failed', data: [] };
    return { success: true, data: toList(r.data) };
  } catch (e: any) { return { success: false, message: e?.message, data: [] }; }
}

// ── Campus News ───────────────────────────────────────────────────────────────
export async function fetchPublishedNews() {
  try {
    const r = await req('/campus-news/published');
    if (!r.ok) return { success: false, message: r.message ?? 'Failed', data: [] };
    return { success: true, data: toList(r.data) };
  } catch (e: any) { return { success: false, message: e?.message, data: [] }; }
}

// ── Alerts ────────────────────────────────────────────────────────────────────
export async function fetchActiveAlerts() {
  try {
    const r = await req('/alerts/active');
    if (!r.ok) return { success: false, message: r.message ?? 'Failed', data: [] };
    return { success: true, data: toList(r.data) };
  } catch (e: any) { return { success: false, message: e?.message, data: [] }; }
}

// ── Resources ─────────────────────────────────────────────────────────────────
export async function fetchPublicResources() {
  try {
    const r = await req('/resources/public');
    if (!r.ok) return { success: false, message: r.message ?? 'Failed', data: [] };
    return { success: true, data: toList(r.data) };
  } catch (e: any) { return { success: false, message: e?.message, data: [] }; }
}
