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

// ── Admin: fetch all payments ─────────────────────────────────────────────────
export async function fetchAllPaymentsAction(params?: { status?: string; page?: number }) {
  try {
    const qs = new URLSearchParams();
    if (params?.status) qs.set('status', params.status);
    if (params?.page)   qs.set('page',   String(params.page));
    const r = await req(`/payments?${qs.toString()}`);
    if (!r.ok) return { success: false, message: r.message, data: [], meta: null };
    return {
      success: true,
      data:    toList(r.data),
      meta:    (r.data as any)?.meta ?? null,
    };
  } catch (e: any) { return { success: false, message: e?.message, data: [], meta: null }; }
}

// ── Admin: payment stats ──────────────────────────────────────────────────────
export async function fetchPaymentStatsAction() {
  try {
    const r = await req('/payments/stats');
    if (!r.ok) return { success: false, data: null };
    const d = (r.data as any)?.data ?? r.data;
    return { success: true, data: d };
  } catch { return { success: false, data: null }; }
}

// ── My payments (student/mentor) ──────────────────────────────────────────────
export async function fetchMyPaymentsAction() {
  try {
    const r = await req('/payments/my');
    if (!r.ok) return { success: false, message: r.message, data: [] };
    return { success: true, data: toList(r.data) };
  } catch (e: any) { return { success: false, message: e?.message, data: [] }; }
}

// ── Confirm payment (student simulates gateway callback) ──────────────────────
export async function confirmPaymentAction(paymentId: string, transactionId: string) {
  try {
    const r = await req(`/payments/${paymentId}/confirm`, {
      method: 'POST',
      body:   { transactionId, provider: 'manual' },
    });
    if (!r.ok) return { success: false, message: r.message ?? 'Payment confirmation failed' };
    return { success: true, data: r.data };
  } catch (e: any) { return { success: false, message: e?.message }; }
}

// ── Admin: release payment ────────────────────────────────────────────────────
export async function releasePaymentAction(paymentId: string) {
  try {
    const r = await req(`/payments/${paymentId}/release`, { method: 'POST' });
    if (!r.ok) return { success: false, message: r.message ?? 'Release failed' };
    return { success: true, data: r.data };
  } catch (e: any) { return { success: false, message: e?.message }; }
}

// ── Admin: refund payment ─────────────────────────────────────────────────────
export async function refundPaymentAction(paymentId: string) {
  try {
    const r = await req(`/payments/${paymentId}/refund`, { method: 'POST' });
    if (!r.ok) return { success: false, message: r.message ?? 'Refund failed' };
    return { success: true, data: r.data };
  } catch (e: any) { return { success: false, message: e?.message }; }
}

// ── Admin: all payouts ────────────────────────────────────────────────────────
export async function fetchAllPayoutsAction(params?: { status?: string }) {
  try {
    const qs = params?.status ? `?status=${params.status}` : '';
    const r = await req(`/payouts${qs}`);
    if (!r.ok) return { success: false, message: r.message, data: [], meta: null };
    return { success: true, data: toList(r.data), meta: (r.data as any)?.meta ?? null };
  } catch (e: any) { return { success: false, message: e?.message, data: [], meta: null }; }
}

// ── Mentor: my payouts ────────────────────────────────────────────────────────
export async function fetchMyPayoutsAction() {
  try {
    const r = await req('/payouts/my');
    if (!r.ok) return { success: false, message: r.message, data: [] };
    return { success: true, data: toList(r.data) };
  } catch (e: any) { return { success: false, message: e?.message, data: [] }; }
}

// ── Admin: process payout ─────────────────────────────────────────────────────
export async function processPayoutAction(payoutId: string) {
  try {
    const r = await req(`/payouts/${payoutId}/process`, { method: 'POST' });
    if (!r.ok) return { success: false, message: r.message ?? 'Failed' };
    return { success: true, data: r.data };
  } catch (e: any) { return { success: false, message: e?.message }; }
}

// ── Admin: mark payout paid ───────────────────────────────────────────────────
export async function markPayoutPaidAction(payoutId: string) {
  try {
    const r = await req(`/payouts/${payoutId}/mark-paid`, { method: 'POST' });
    if (!r.ok) return { success: false, message: r.message ?? 'Failed' };
    return { success: true, data: r.data };
  } catch (e: any) { return { success: false, message: e?.message }; }
}
