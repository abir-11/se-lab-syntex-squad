"use server";

import { API_BASE, ApiResponse } from "@/lib/api";

export type Story = {
  id: string;
  title: string;
  excerpt: string;
  body: string;
  image: string | null;
  published: boolean;
  date: string;
  createdAt: string;
  updatedAt: string;
};

export type HomeContent = {
  id: string;
  heroImage: string | null;
  heroEyebrow: string | null;
  heroTitle: string;
  heroSub: string | null;
  stats: any[] | null;
  serviceCards: any[] | null;
  createdAt: string;
  updatedAt: string;
};

// GET /api/stories (published only)
export const getPublishedStories = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/stories`, {
      method: "GET",
      cache: "no-store",
    });

    const result: ApiResponse<Story[]> = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: result.message || "Failed to fetch stories",
        data: [],
      };
    }

    return result;
  } catch (error) {
    console.error("getPublishedStories Error:", error);
    return {
      success: false,
      message: "Something went wrong!",
      data: [],
    };
  }
};

// GET /api/home-content
export const getHomeContent = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/home-content`, {
      method: "GET",
      cache: "no-store",
    });

    const result: ApiResponse<HomeContent> = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: result.message || "Failed to fetch home content",
        data: null,
      };
    }

    return result;
  } catch (error) {
    console.error("getHomeContent Error:", error);
    return {
      success: false,
      message: "Something went wrong!",
      data: null,
    };
  }
};

export type CampusEvent = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  location: string | null;
  approvedBy: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
};

// GET /api/events (requires login - token is read from cookies)
export const getAllEvents = async (
  query: Record<string, any> = {},
  accessToken?: string
) => {
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const token = accessToken || cookieStore.get("accessToken")?.value;

    if (!token) {
      return {
        success: false,
        message: "Please log in to view campus events.",
        data: [],
        meta: null,
      };
    }

    const queryParams = new URLSearchParams();
    if (query.page) queryParams.append("page", query.page.toString());
    if (query.limit) queryParams.append("limit", query.limit.toString());
    if (query.searchTerm) queryParams.append("searchTerm", query.searchTerm);
    const queryString = queryParams.toString();

    const res = await fetch(
      `${API_BASE}/api/events${queryString ? `?${queryString}` : ""}`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );

    const result: ApiResponse<CampusEvent[]> = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: result.message || "Failed to fetch events",
        data: [],
        meta: null,
      };
    }

    return result;
  } catch (error) {
    console.error("getAllEvents Error:", error);
    return {
      success: false,
      message: "Something went wrong!",
      data: [],
      meta: null,
    };
  }
};
