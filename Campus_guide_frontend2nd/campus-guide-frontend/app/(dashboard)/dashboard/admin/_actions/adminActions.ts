"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { API_BASE } from "@/lib/api";
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "https://rent-nest-mu.vercel.app/";

// ---- Users ----------------------------------------------------------

// GET /api/auth?page=&limit=&searchTerm=&role=&departmentId= (ADMIN)
export async function getAllUsersAction(query: Record<string, any> = {}) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    const queryParams = new URLSearchParams();
    if (query.page) queryParams.append("page", query.page.toString());
    if (query.limit) queryParams.append("limit", query.limit.toString());
    if (query.searchTerm) queryParams.append("searchTerm", query.searchTerm);
    if (query.role) queryParams.append("role", query.role);
    const queryString = queryParams.toString();

    const res = await fetch(
      `${API_BASE}/api/auth${queryString ? `?${queryString}` : ""}`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );

    if (!res.ok) throw new Error("Failed to fetch users");
    return await res.json();
  } catch (error) {
    console.error(error);
    return { success: false, data: [], meta: null };
  }
}

// PATCH /api/auth/:id (ADMIN) - update role/name/phone/department etc.
export async function updateUserAction(userId: string, payload: object) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    const res = await fetch(`${API_BASE}/api/auth/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(payload),
    });

    revalidatePath("/dashboard/admin/users");
    return await res.json();
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to update user" };
  }
}

// DELETE /api/auth/:id (ADMIN)
export async function deleteUserAction(userId: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    const res = await fetch(`${API_BASE}/api/auth/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    revalidatePath("/dashboard/admin/users");
    return await res.json();
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to delete user" };
  }
}

// ---- Mentors --------------------------------------------------------

// PATCH /api/mentors/:id (ADMIN) body: { status: "PENDING" | "APPROVED" | "REJECTED" }
export async function updateMentorStatusAction(
  mentorId: string,
  status: string
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    const res = await fetch(`${API_BASE}/api/mentors/${mentorId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ status }),
    });

    revalidatePath("/dashboard/admin/mentors");
    return await res.json();
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to update mentor status" };
  }
}

// ---- Stories --------------------------------------------------------

// POST /api/stories/create (ADMIN)
export async function createStoryAction(payload: {
  title: string;
  excerpt?: string;
  body: string;
  image?: string;
  published?: boolean;
}) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    const res = await fetch(`${API_BASE}/api/stories/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(payload),
    });

    revalidatePath("/dashboard/admin/stories");
    revalidatePath("/stories");
    return await res.json();
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to create story" };
  }
}

// PATCH /api/stories/:id (ADMIN)
export async function updateStoryAction(storyId: string, payload: object) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    const res = await fetch(`${API_BASE}/api/stories/${storyId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(payload),
    });

    revalidatePath("/dashboard/admin/stories");
    revalidatePath("/stories");
    return await res.json();
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to update story" };
  }
}

// DELETE /api/stories/:id (ADMIN)
export async function deleteStoryAction(storyId: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    const res = await fetch(`${API_BASE}/api/stories/${storyId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    revalidatePath("/dashboard/admin/stories");
    revalidatePath("/stories");
    return await res.json();
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to delete story" };
  }
}

// ---- Home Content ---------------------------------------------------

// PATCH /api/home-content (ADMIN)
export async function updateHomeContentAction(payload: object) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    const res = await fetch(`${API_BASE}/api/home-content`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(payload),
    });

    revalidatePath("/dashboard/admin/home-content");
    revalidatePath("/");
    return await res.json();
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to update home content" };
  }
}

// ---- Departments ----------------------------------------------------

// POST /api/departments/create (ADMIN)
export async function createDepartmentAction(payload: {
  departmentName: string;
  description?: string;
}) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    const res = await fetch(`${API_BASE}/api/departments/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(payload),
    });

    revalidatePath("/dashboard/admin/departments");
    revalidatePath("/departments");
    return await res.json();
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to create department" };
  }
}

// PATCH /api/departments/:id (ADMIN)
export async function updateDepartmentAction(
  departmentId: string,
  payload: object
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    const res = await fetch(`${API_BASE}/api/departments/${departmentId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(payload),
    });

    revalidatePath("/dashboard/admin/departments");
    revalidatePath("/departments");
    return await res.json();
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to update department" };
  }
}

// DELETE /api/departments/:id (ADMIN)
export async function deleteDepartmentAction(departmentId: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    const res = await fetch(`${API_BASE}/api/departments/${departmentId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    revalidatePath("/dashboard/admin/departments");
    revalidatePath("/departments");
    return await res.json();
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to delete department" };
  }
}

// ---- Events ---------------------------------------------------------

// DELETE /api/events/:id (ADMIN / FACULTY)
export async function deleteEventAction(eventId: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    const res = await fetch(`${API_BASE}/api/events/${eventId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    revalidatePath("/dashboard/admin/events");
    return await res.json();
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to delete event" };
  }
}
