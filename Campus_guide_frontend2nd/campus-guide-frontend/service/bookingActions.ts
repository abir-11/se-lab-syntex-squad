"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { API_BASE } from "@/lib/api";

// Get auth headers (Bearer token from cookie)
export async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

export async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value || null;
}

// POST /api/bookings/create (STUDENT only)
export async function createBookingAction(payload: {
  serviceId: string;
  date: string;
  time: string;
  notes?: string;
}) {
  try {
    const headers = await getAuthHeaders();

    const res = await fetch(`${API_BASE}/api/bookings/create`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const result = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: result.message || "Failed to create booking",
      };
    }

    revalidatePath("/dashboard/student/bookings");

    return {
      success: true,
      message: "Booking request sent! Wait for the mentor to accept.",
      data: result.data,
    };
  } catch (error) {
    console.error("createBookingAction Error:", error);
    return {
      success: false,
      message: "Something went wrong!",
    };
  }
}

// GET /api/bookings (any logged-in user: own bookings)
export async function getMyBookingsAction() {
  try {
    const headers = await getAuthHeaders();

    const res = await fetch(`${API_BASE}/api/bookings`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    const result = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: result.message || "Failed to fetch bookings",
        data: [],
      };
    }

    return result;
  } catch (error) {
    console.error("getMyBookingsAction Error:", error);
    return {
      success: false,
      message: "Something went wrong!",
      data: [],
    };
  }
}

// PATCH /api/bookings/:id  body: { action: "accept" | "reject" | "confirm" }
export async function updateBookingAction(bookingId: string, action: string) {
  try {
    const headers = await getAuthHeaders();

    const res = await fetch(`${API_BASE}/api/bookings/${bookingId}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ action }),
      cache: "no-store",
    });

    const result = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: result.message || "Failed to update booking",
      };
    }

    revalidatePath("/dashboard/student/bookings");
    revalidatePath("/dashboard/mentor/bookings");

    return {
      success: true,
      message:
        action === "accept"
          ? "Booking accepted."
          : action === "reject"
          ? "Booking rejected."
          : "Booking confirmed!",
      data: result.data,
    };
  } catch (error) {
    console.error("updateBookingAction Error:", error);
    return {
      success: false,
      message: "Something went wrong!",
    };
  }
}

// DELETE /api/bookings/:id (student cancels a pending booking)
export async function cancelBookingAction(bookingId: string) {
  try {
    const headers = await getAuthHeaders();

    const res = await fetch(`${API_BASE}/api/bookings/${bookingId}`, {
      method: "DELETE",
      headers,
      cache: "no-store",
    });

    const result = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: result.message || "Failed to cancel booking",
      };
    }

    revalidatePath("/dashboard/student/bookings");

    return {
      success: true,
      message: "Booking cancelled.",
    };
  } catch (error) {
    console.error("cancelBookingAction Error:", error);
    return {
      success: false,
      message: "Something went wrong!",
    };
  }
}
