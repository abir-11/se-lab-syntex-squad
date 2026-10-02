"use server";

import { cookies } from "next/headers";
import { API_BASE } from "@/lib/api";

type LoginState = {
  success?: boolean;
  message?: string;
  error?: string;
  redirectUrl?: string;
};

export async function loginAction(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return {
      success: false,
      message: "Email and password are required!",
    };
  }

   const backendUrl = process.env.BACKEND_API_URL;

  if (!backendUrl) {
    return {
      success: false,
      message: "BACKEND_API_URL is missing",
    };
  }

  try {
    const response = await fetch(`${backendUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Login failed",
      };
    }

    const cookieStore = await cookies();

    cookieStore.set("accessToken", data.data.accessToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
    });

    cookieStore.set("refreshToken", data.data.refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    const role = data.data?.JwtPayload?.role;

    let redirectUrl = "/";
    if (role === "ADMIN" || role === "FACULTY") {
      redirectUrl = "/dashboard/admin";
    } else if (role === "MENTOR") {
      redirectUrl = "/dashboard/mentor";
    } else if (role === "STUDENT") {
      redirectUrl = "/dashboard/student";
    }

    return {
      success: true,
      message: "Login successful",
      redirectUrl,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Network Error or Invalid Response",
    };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();

  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");

  return {
    success: true,
    message: "Logout successful",
  };
}
