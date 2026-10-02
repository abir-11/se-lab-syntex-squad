"use server";

import { API_BASE, ApiResponse } from "@/lib/api";

export type Department = {
  id: string;
  departmentName: string;
  description: string | null;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
};

export const getAllDepartments = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/departments`, {
      method: "GET",
      cache: "no-store",
    });

    const result: ApiResponse<Department[]> = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: result.message || "Failed to fetch departments",
        data: [],
        meta: null,
      };
    }

    return result;
  } catch (error) {
    console.error("getAllDepartments Error:", error);
    return {
      success: false,
      message: "Something went wrong!",
      data: [],
      meta: null,
    };
  }
};
