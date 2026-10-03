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

// ── Submit mentor application ─────────────────────────────────────────────────
export async function applyForMentorAction(payload: {
  department: string;
  mobile:     string;
  bio:        string;
  cgpa:       number;
  goodSubjects: string[];
  experience?: string;
  portfolio?:  string;
}) {
  try {
    const r = await req('/mentors-apply/apply', { method: 'POST', body: payload });
    if (!r.ok) return { success: false, message: r.message ?? 'Application failed' };
    return { success: true, data: r.data };
  } catch (e: any) { return { success: false, message: e?.message }; }
}

// ── Get current user's application status ─────────────────────────────────────
export async function fetchMyApplicationAction() {
  try {
    const store = await cookies();
    const token = store.get('accessToken')?.value;
    if (!token) return { success: false, data: null, message: 'Not logged in' };

    const meRes = await fetch(`${BACKEND}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!meRes.ok) return { success: false, data: null, message: 'Cannot fetch user' };

    const meData = await meRes.json();
    const u      = meData?.data?.result ?? meData?.data ?? meData;
    const userId = u?.id;
    const role   = String(u?.role ?? 'STUDENT').toUpperCase();

    if (!userId) return { success: false, data: null, message: 'User not found' };

    // Try pending applications first
    const pendingRes = await req('/mentors-apply/pending-applications?limit=200');
    if (pendingRes.ok) {
      const raw  = (pendingRes.data as any)?.data;
      const list: any[] = Array.isArray(raw?.data) ? raw.data : Array.isArray(raw) ? raw : [];
      const myApp = list.find((a: any) => a.userId === userId);
      if (myApp) return { success: true, data: myApp, role };
    }

    // Try approved applications
    const approvedRes = await req('/mentors-apply/approved?limit=200');
    if (approvedRes.ok) {
      const raw  = (approvedRes.data as any)?.data;
      const list: any[] = Array.isArray(raw?.data) ? raw.data : Array.isArray(raw) ? raw : [];
      const myApp = list.find((a: any) => a.userId === userId);
      if (myApp) return { success: true, data: myApp, role };
    }

    return { success: true, data: null, role };
  } catch (e: any) { return { success: false, data: null, message: e?.message }; }
}
