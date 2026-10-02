"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { API_BASE } from "@/lib/api";

// POST /api/mentor-services (MENTOR)
export async function createMentorServiceAction(payload: {
  category: string;
  name: string;
  description: string;
  fee: number;
  mobile?: string;
  date?: string;
  time?: string;
  image?: string;
}) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    const res = await fetch(`${API_BASE}/api/mentor-services`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    revalidatePath("/dashboard/mentor/my-services");
    revalidatePath("/services");

    return result;
  } catch (error) {
    console.error("createMentorServiceAction Error:", error);
    return { success: false, message: "Failed to create service" };
  }
}

// PATCH /api/mentor-services/:id (MENTOR / ADMIN)
export async function updateMentorServiceAction(
  serviceId: string,
  payload: object
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    const res = await fetch(`${API_BASE}/api/mentor-services/${serviceId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    revalidatePath("/dashboard/mentor/my-services");
    revalidatePath("/services");

    return result;
  } catch (error) {
    console.error("updateMentorServiceAction Error:", error);
    return { success: false, message: "Failed to update service" };
  }
}

// DELETE /api/mentor-services/:id (MENTOR / ADMIN)
export async function deleteMentorServiceAction(serviceId: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    const res = await fetch(`${API_BASE}/api/mentor-services/${serviceId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    const result = await res.json();

    revalidatePath("/dashboard/mentor/my-services");
    revalidatePath("/services");

    return result;
  } catch (error) {
    console.error("deleteMentorServiceAction Error:", error);
    return { success: false, message: "Failed to delete service" };
  }
}
