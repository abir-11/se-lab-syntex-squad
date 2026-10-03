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

// ── Create Booking (student) ──────────────────────────────────────────────────
export async function createBookingAction(payload: {
  serviceId: string;
  date: string;
  time: string;
  notes?: string;
}) {
  try {
    const r = await req('/bookings/create', { method: 'POST', body: payload });
    if (!r.ok) return { success: false, message: r.message ?? 'Failed to create booking' };
    return { success: true, data: r.data };
  } catch (e: any) { return { success: false, message: e?.message }; }
}

// ── Get My Bookings ───────────────────────────────────────────────────────────
export async function fetchMyBookingsAction() {
  try {
    const r = await req('/bookings');
    if (!r.ok) return { success: false, message: r.message, data: [] };
    return { success: true, data: toList(r.data) };
  } catch (e: any) { return { success: false, message: e?.message, data: [] }; }
}

// ── Get Single Booking ────────────────────────────────────────────────────────
export async function fetchBookingByIdAction(id: string) {
  try {
    const r = await req(`/bookings/${id}`);
    if (!r.ok) return { success: false, message: r.message, data: null };
    const d = (r.data as any)?.data ?? r.data;
    return { success: true, data: d };
  } catch (e: any) { return { success: false, message: e?.message, data: null }; }
}

// ── Update Booking (action: accept/reject/start/complete/confirm/student_complete/cancel) ──
export async function updateBookingAction(id: string, action: string) {
  try {
    const r = await req(`/bookings/${id}`, { method: 'PATCH', body: { action } });
    if (!r.ok) return { success: false, message: r.message ?? 'Failed to update booking' };
    return { success: true, data: r.data };
  } catch (e: any) { return { success: false, message: e?.message }; }
}

// ── Cancel/Delete Booking ─────────────────────────────────────────────────────
export async function cancelBookingAction(id: string) {
  try {
    const r = await req(`/bookings/${id}`, { method: 'DELETE' });
    if (!r.ok) return { success: false, message: r.message ?? 'Failed to cancel booking' };
    return { success: true };
  } catch (e: any) { return { success: false, message: e?.message }; }
}
