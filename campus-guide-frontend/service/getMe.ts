"use server";

import { cookies } from "next/headers";

export const getMe = async () => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return {
        success: false,
        message: "User not logged in!",
      };
    }

    const res = await fetch(
      `${process.env.BACKEND_API_URL}/api/auth/me`,
      {
        method: "GET",
        headers: {
          Cookie: `accessToken=${accessToken}`,
          // যদি backend Bearer token expect করে, তাহলে এটা ব্যবহার করো:
          // Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }
    );

    const result = await res.json();

    //console.log("ME API Response:", result);

    if (!res.ok) {
      return {
        success: false,
        message: result.message || "Failed to fetch user",
      };
    }

    return result;
  } catch (error) {
    console.error("getMe Error:", error);

    return {
      success: false,
      message: "Something went wrong!",
    };
  }
};