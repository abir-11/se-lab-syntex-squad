"use server";



type RegisterState = {
  success?: boolean;
  message?: string;
  error?: string;
  redirectUrl?: string;
};

export async function registerAction(
  prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const phoneNumber = formData.get("phoneNumber");
  const role = formData.get("role");
  const gender = formData.get("gender");
  const departmentId = formData.get("departmentId");

  if (!name || !email || !password) {
    return {
      success: false,
      message: "Name, email and password are required!",
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
    const response = await fetch(`${backendUrl}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        ...(phoneNumber ? { phoneNumber: String(phoneNumber) } : {}),
        role: role || "STUDENT",
        ...(gender ? { gender: String(gender) } : {}),
        ...(departmentId ? { departmentId: String(departmentId) } : {}),
      }),
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        message: data?.message || "Registration failed. Please try again.",
      };
    }

    return {
      success: true,
      message:
        data.message || "Account created successfully! Please log in.",
      redirectUrl: "/login",
    };
  } catch (error) {
    console.error("Register Action Error:", error);
    return {
      success: false,
      message: "Network Error or Invalid Response",
    };
  }
}
