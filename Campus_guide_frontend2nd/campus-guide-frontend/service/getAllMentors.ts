"use server";

import { API_BASE, ApiResponse } from "@/lib/api";

export type MentorProfile = {
  id: string;
  userId: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  department: string | null;
  rating: number;
  sessions: number;
  mobile: string | null;
  bio: string | null;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    role: string;
  };
};

// GET /api/mentors?status=... (admin only can pass status)
export const getAllMentors = async (status?: string) => {
  try {
    const url = `${API_BASE}/api/mentors${status ? `?status=${status}` : ""}`;

    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
    });

    const result: ApiResponse<MentorProfile[]> = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: result.message || "Failed to fetch mentors",
        data: [],
      };
    }

    return result;
  } catch (error) {
    console.error("getAllMentors Error:", error);
    return {
      success: false,
      message: "Something went wrong!",
      data: [],
    };
  }
};
