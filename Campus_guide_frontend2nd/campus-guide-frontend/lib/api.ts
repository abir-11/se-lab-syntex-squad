// Shared backend API base url helper.
// The .env value may end with a trailing slash, so we normalize it here
// to always build clean URLs like: `${API_BASE}/api/auth/login`.
export const API_BASE = (
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  ""
).replace(/\/+$/, "");

export type ApiResponse<T = any> = {
  success: boolean;
  statusCode?: number;
  message?: string;
  data?: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  } | null;
};

// Common response shapes returned by the campus-guide backend:
// - Single-resource controllers wrap payloads as: data: { result }
// - List controllers return: data: [ ... ] with meta
export type WrappedResult<T = any> = { result: T };
