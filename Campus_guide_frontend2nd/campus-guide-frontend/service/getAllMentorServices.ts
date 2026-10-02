"use server";

import { API_BASE, ApiResponse } from "@/lib/api";

export type MentorService = {
  id: string;
  mentorId: string;
  mentorName: string;
  category: string;
  name: string;
  description: string;
  fee: string; // Decimal comes back as string
  mobile: string | null;
  date: string | null;
  time: string | null;
  image: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
  mentor: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    mentorProfile: {
      department: string | null;
      rating: number;
      sessions: number;
      mobile: string | null;
      bio: string | null;
    } | null;
  };
};

// GET /api/mentor-services?page=&limit=&searchTerm=
export const getAllMentorServices = async (
  query: Record<string, any> = {}
) => {
  try {
    const queryParams = new URLSearchParams();

    if (query.page) queryParams.append("page", query.page.toString());
    if (query.limit) queryParams.append("limit", query.limit.toString());
    if (query.searchTerm)
      queryParams.append("searchTerm", query.searchTerm);

    const queryString = queryParams.toString();
    const url = `${API_BASE}/api/mentor-services${queryString ? `?${queryString}` : ""}`;

    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
    });

    const result: ApiResponse<MentorService[]> = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: result.message || "Failed to fetch services",
        data: [],
        meta: null,
      };
    }

    return result;
  } catch (error) {
    console.error("getAllMentorServices Error:", error);
    return {
      success: false,
      message: "Something went wrong!",
      data: [],
      meta: null,
    };
  }
};

// GET /api/mentor-services/:id  →  data: { result }
export const getMentorServiceById = async (id: string) => {
  try {
    const res = await fetch(`${API_BASE}/api/mentor-services/${id}`, {
      method: "GET",
      cache: "no-store",
    });

    const result = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: result.message || "Failed to fetch service",
        data: null,
      };
    }

    return result;
  } catch (error) {
    console.error("getMentorServiceById Error:", error);
    return {
      success: false,
      message: "Something went wrong!",
      data: null,
    };
  }
};
