'use server';

import { cookies } from 'next/headers';

const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  'https://campus-guide-backend.vercel.app';

const API = `${BACKEND_API_URL}/api`;

async function safeJsonParse(response: Response) {
  try {
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return await response.json();
    }
    const text = await response.text();
    return { message: text || response.statusText };
  } catch {
    return { message: 'Failed to parse response' };
  }
}

async function getAuthHeaders(): Promise<HeadersInit> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;
    if (token) headers['Authorization'] = `Bearer ${token}`;
  } catch (err) {
    console.error('Error reading cookies:', err);
  }
  return headers;
}

const toList = (data: unknown): unknown[] =>
  Array.isArray(data) ? data : (data as any)?.data || [];

async function request(
  path: string,
  options: { method?: string; body?: unknown } = {}
) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API}${path}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: 'no-store',
  });

  const data = await safeJsonParse(response);

  if (response.status === 401 || response.status === 403) {
    return {
      ok: false,
      data,
      message: data?.message || 'Unauthorized. Please login again.',
    };
  }

  return { ok: response.ok, data, message: data?.message as string | undefined };
}

// ─── 1. Admin Dashboard Stats ────────────────────────────────────────────────
export async function fetchAdminStats() {
  const empty = {
    totalUsers: 0,
    totalStudents: 0,
    totalMentors: 0,
    pendingApprovals: 0,
    totalEvents: 0,
    totalDepartments: 0,
    totalBookings: 0,
    totalServices: 0,
  };

  try {
    const [usersRes, applyRes, eventsRes, deptsRes, bookingsRes, servicesRes] =
      await Promise.allSettled([
        request('/auth'),
        request('/mentors-apply'),
        request('/events'),
        request('/departments'),
        request('/bookings'),
        request('/mentor-services'),
      ]);

    const stats = { ...empty };

    if (usersRes.status === 'fulfilled' && usersRes.value.ok) {
      const users = toList(usersRes.value.data) as any[];
      stats.totalUsers = users.length;
      stats.totalStudents = users.filter(
        (u) => String(u.role).toUpperCase() === 'STUDENT'
      ).length;
      stats.totalMentors = users.filter(
        (u) => String(u.role).toUpperCase() === 'MENTOR'
      ).length;
    }

    if (applyRes.status === 'fulfilled' && applyRes.value.ok) {
      stats.pendingApprovals = (toList(applyRes.value.data) as any[]).filter(
        (m) => !m.status || String(m.status).toLowerCase() === 'pending'
      ).length;
    }

    if (eventsRes.status === 'fulfilled' && eventsRes.value.ok) {
      stats.totalEvents = toList(eventsRes.value.data).length;
    }

    if (deptsRes.status === 'fulfilled' && deptsRes.value.ok) {
      stats.totalDepartments = toList(deptsRes.value.data).length;
    }

    if (bookingsRes.status === 'fulfilled' && bookingsRes.value.ok) {
      stats.totalBookings = toList(bookingsRes.value.data).length;
    }

    if (servicesRes.status === 'fulfilled' && servicesRes.value.ok) {
      stats.totalServices = toList(servicesRes.value.data).length;
    }

    return { success: true, data: stats };
  } catch (error) {
    console.error('Admin stats fetch error:', error);
    return { success: false, data: empty };
  }
}

// ─── 2. Users ─────────────────────────────────────────────────────────────────
export async function fetchUsers() {
  try {
    const res = await request('/auth');
    if (!res.ok) {
      return { success: false, message: res.message || 'Failed to fetch users', data: [] };
    }
    return { success: true, data: toList(res.data) };
  } catch (error: any) {
    return { success: false, message: error?.message || 'Something went wrong', data: [] };
  }
}

export async function deleteUser(id: string) {
  try {
    const res = await request(`/auth/${id}`, { method: 'DELETE' });
    if (!res.ok) return { success: false, message: res.message || 'Failed to delete user' };
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error?.message || 'Something went wrong' };
  }
}

// ─── 3. Events ────────────────────────────────────────────────────────────────
export async function fetchEvents() {
  try {
    const res = await request('/events');
    if (!res.ok) {
      return { success: false, message: res.message || 'Failed to fetch events', data: [] };
    }
    return { success: true, data: toList(res.data) };
  } catch (error: any) {
    return { success: false, message: error?.message || 'Something went wrong', data: [] };
  }
}

export async function createEvent(payload: {
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  image?: string;
}) {
  try {
    const body = {
      ...payload,
      date: new Date(payload.date).toISOString(),
      image: payload.image || undefined,
    };
    // Correct route: POST /api/events/create
    const res = await request('/events/create', { method: 'POST', body });
    if (!res.ok) {
      return { success: false, message: res.message || 'Failed to create event' };
    }
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, message: error?.message || 'Something went wrong' };
  }
}

export async function deleteEvent(id: string) {
  try {
    const res = await request(`/events/${id}`, { method: 'DELETE' });
    if (!res.ok) return { success: false, message: res.message || 'Failed to delete event' };
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error?.message || 'Something went wrong' };
  }
}

// ─── 4. Departments ───────────────────────────────────────────────────────────
export async function fetchDepartments() {
  try {
    const res = await request('/departments');
    if (!res.ok) {
      return { success: false, message: res.message || 'Failed to fetch departments', data: [] };
    }
    return { success: true, data: toList(res.data) };
  } catch (error: any) {
    return { success: false, message: error?.message || 'Something went wrong', data: [] };
  }
}

export async function createDepartment(payload: {
  name: string;
  code: string;
  headName?: string;
  description?: string;
}) {
  try {
    // Backend model uses `departmentName` — map accordingly
    const body: Record<string, unknown> = {
      departmentName: payload.name,
      description: payload.description || undefined,
    };
    // Correct route: POST /api/departments/create
    const res = await request('/departments/create', { method: 'POST', body });
    if (!res.ok) {
      return { success: false, message: res.message || 'Failed to create department' };
    }
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, message: error?.message || 'Something went wrong' };
  }
}

export async function deleteDepartment(id: string) {
  try {
    const res = await request(`/departments/${id}`, { method: 'DELETE' });
    if (!res.ok) return { success: false, message: res.message || 'Failed to delete department' };
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error?.message || 'Something went wrong' };
  }
}

// ─── 5. Mentor Applications ───────────────────────────────────────────────────
export async function fetchMentorApplications() {
  try {
    const res = await request('/mentors-apply');
    if (!res.ok) {
      return { success: false, message: res.message || 'Failed to fetch applications', data: [] };
    }
    return { success: true, data: toList(res.data) };
  } catch (error: any) {
    return { success: false, message: error?.message || 'Something went wrong', data: [] };
  }
}

export async function updateMentorApprovalStatus(
  id: string,
  status: 'approved' | 'rejected'
) {
  try {
    // Correct route: PATCH /api/mentors-apply/:id/status
    const res = await request(`/mentors-apply/${id}/status`, {
      method: 'PATCH',
      body: { status },
    });
    if (!res.ok) {
      return { success: false, message: res.message || 'Failed to update status' };
    }
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, message: error?.message || 'Something went wrong' };
  }
}

// ─── 6. Bookings ──────────────────────────────────────────────────────────────
export async function fetchBookings() {
  try {
    const res = await request('/bookings');
    if (!res.ok) {
      return { success: false, message: res.message || 'Failed to fetch bookings', data: [] };
    }
    return { success: true, data: toList(res.data) };
  } catch (error: any) {
    return { success: false, message: error?.message || 'Something went wrong', data: [] };
  }
}

// ─── 7. Resources ─────────────────────────────────────────────────────────────
export async function fetchResources() {
  try {
    const res = await request('/resources');
    if (!res.ok) return { success: false, message: res.message || 'Failed to fetch resources', data: [] };
    return { success: true, data: toList(res.data) };
  } catch (error: any) {
    return { success: false, message: error?.message || 'Something went wrong', data: [] };
  }
}

export async function createResource(payload: {
  title: string;
  description?: string;
  category: string;
  link: string;
  image?: string;
  status: string;
}) {
  try {
    const res = await request('/resources', { method: 'POST', body: payload });
    if (!res.ok) return { success: false, message: res.message || 'Failed to create resource' };
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, message: error?.message || 'Something went wrong' };
  }
}

export async function updateResource(id: string, payload: Partial<{
  title: string;
  description: string;
  category: string;
  link: string;
  image: string;
  status: string;
}>) {
  try {
    const res = await request(`/resources/${id}`, { method: 'PATCH', body: payload });
    if (!res.ok) return { success: false, message: res.message || 'Failed to update resource' };
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, message: error?.message || 'Something went wrong' };
  }
}

export async function deleteResource(id: string) {
  try {
    const res = await request(`/resources/${id}`, { method: 'DELETE' });
    if (!res.ok) return { success: false, message: res.message || 'Failed to delete resource' };
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error?.message || 'Something went wrong' };
  }
}

// ─── 8. Campus Alerts ─────────────────────────────────────────────────────────
export async function fetchAlerts() {
  try {
    const res = await request('/alerts');
    if (!res.ok) return { success: false, message: res.message || 'Failed to fetch alerts', data: [] };
    return { success: true, data: toList(res.data) };
  } catch (error: any) {
    return { success: false, message: error?.message || 'Something went wrong', data: [] };
  }
}

export async function createAlert(payload: {
  title: string;
  message: string;
  alertType: string;
  priority: string;
  status: string;
  date?: string;
}) {
  try {
    const res = await request('/alerts', { method: 'POST', body: payload });
    if (!res.ok) return { success: false, message: res.message || 'Failed to create alert' };
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, message: error?.message || 'Something went wrong' };
  }
}

export async function updateAlert(id: string, payload: Partial<{
  title: string;
  message: string;
  alertType: string;
  priority: string;
  status: string;
  date: string;
}>) {
  try {
    const res = await request(`/alerts/${id}`, { method: 'PATCH', body: payload });
    if (!res.ok) return { success: false, message: res.message || 'Failed to update alert' };
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, message: error?.message || 'Something went wrong' };
  }
}

export async function deleteAlert(id: string) {
  try {
    const res = await request(`/alerts/${id}`, { method: 'DELETE' });
    if (!res.ok) return { success: false, message: res.message || 'Failed to delete alert' };
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error?.message || 'Something went wrong' };
  }
}

// ─── 9. Campus News ───────────────────────────────────────────────────────────
export async function fetchCampusNews() {
  try {
    const res = await request('/campus-news');
    if (!res.ok) return { success: false, message: res.message || 'Failed to fetch news', data: [] };
    return { success: true, data: toList(res.data) };
  } catch (error: any) {
    return { success: false, message: error?.message || 'Something went wrong', data: [] };
  }
}

export async function createCampusNews(payload: {
  title: string;
  content: string;
  category: string;
  image?: string;
  status: string;
  publishedAt?: string;
}) {
  try {
    const res = await request('/campus-news', { method: 'POST', body: payload });
    if (!res.ok) return { success: false, message: res.message || 'Failed to create news' };
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, message: error?.message || 'Something went wrong' };
  }
}

export async function updateCampusNews(id: string, payload: Partial<{
  title: string;
  content: string;
  category: string;
  image: string;
  status: string;
  publishedAt: string;
}>) {
  try {
    const res = await request(`/campus-news/${id}`, { method: 'PATCH', body: payload });
    if (!res.ok) return { success: false, message: res.message || 'Failed to update news' };
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, message: error?.message || 'Something went wrong' };
  }
}

export async function deleteCampusNews(id: string) {
  try {
    const res = await request(`/campus-news/${id}`, { method: 'DELETE' });
    if (!res.ok) return { success: false, message: res.message || 'Failed to delete news' };
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error?.message || 'Something went wrong' };
  }
}

// ─── 10. Stats (extended) ─────────────────────────────────────────────────────
export async function fetchAdminStatsExtended() {
  try {
    const [resourcesRes, alertsRes, newsRes] = await Promise.allSettled([
      request('/resources'),
      request('/alerts'),
      request('/campus-news'),
    ]);

    return {
      totalResources: resourcesRes.status === 'fulfilled' && resourcesRes.value.ok
        ? toList(resourcesRes.value.data).length : 0,
      activeAlerts: alertsRes.status === 'fulfilled' && alertsRes.value.ok
        ? (toList(alertsRes.value.data) as any[]).filter(
            (a) => String(a.status).toUpperCase() === 'ACTIVE'
          ).length : 0,
      publishedNews: newsRes.status === 'fulfilled' && newsRes.value.ok
        ? (toList(newsRes.value.data) as any[]).filter(
            (n) => String(n.status).toUpperCase() === 'PUBLISHED'
          ).length : 0,
      draftNews: newsRes.status === 'fulfilled' && newsRes.value.ok
        ? (toList(newsRes.value.data) as any[]).filter(
            (n) => String(n.status).toUpperCase() === 'DRAFT'
          ).length : 0,
    };
  } catch {
    return { totalResources: 0, activeAlerts: 0, publishedNews: 0, draftNews: 0 };
  }
}
