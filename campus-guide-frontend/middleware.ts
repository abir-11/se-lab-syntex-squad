import { NextRequest, NextResponse } from "next/server";

// ── Helpers ───────────────────────────────────────────────────────────────────

function decodeJwtRole(token: string): string | undefined {
  try {
    const part = token.split(".")[1];
    if (!part) return undefined;
    const json = Buffer.from(
      part.replace(/-/g, "+").replace(/_/g, "/"),
      "base64"
    ).toString("utf-8");
    return JSON.parse(json)?.role as string | undefined;
  } catch {
    return undefined;
  }
}

const ROLE_DASHBOARD: Record<string, string> = {
  ADMIN:   "/dashboard/admin",
  MENTOR:  "/dashboard/mentor",
  STUDENT: "/dashboard/student",
};

// ── Route groups ──────────────────────────────────────────────────────────────

/** Routes that require authentication (prefix match) */
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/mentor",      // redundant alias kept for safety
  "/profile",
  "/settings",
];

/** Routes that authenticated users should be bounced away from */
const AUTH_ONLY_PATHS = ["/login", "/register"];

/** Routes that are always public regardless of auth state */
const ALWAYS_PUBLIC_PREFIXES = [
  "/_next",
  "/api",
  "/favicon",
];

function isAlwaysPublic(path: string): boolean {
  return ALWAYS_PUBLIC_PREFIXES.some((p) => path.startsWith(p));
}

function isProtected(path: string): boolean {
  return PROTECTED_PREFIXES.some((p) => path.startsWith(p));
}

function isAuthOnly(path: string): boolean {
  return AUTH_ONLY_PATHS.some((p) => path === p || path.startsWith(p + "/"));
}

// ── Role → allowed prefix map ─────────────────────────────────────────────────

const ROLE_ALLOWED: Record<string, string[]> = {
  ADMIN:   ["/dashboard/admin"],
  MENTOR:  ["/dashboard/mentor"],
  STUDENT: ["/dashboard/student"],
};

function isAllowedForRole(role: string, path: string): boolean {
  const allowed = ROLE_ALLOWED[role.toUpperCase()] ?? [];
  return allowed.some((prefix) => path.startsWith(prefix));
}

// ── Middleware ────────────────────────────────────────────────────────────────

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Static assets, _next, API — skip entirely
  if (isAlwaysPublic(pathname)) return NextResponse.next();

  const token = request.cookies.get("accessToken")?.value;
  const role  = token ? decodeJwtRole(token)?.toUpperCase() : undefined;
  const isLoggedIn = !!token && !!role;

  // ── Redirect logged-in users away from /login and /register ──────────────
  if (isAuthOnly(pathname) && isLoggedIn) {
    const dest = ROLE_DASHBOARD[role!] ?? "/";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  // ── Protect dashboard/profile/settings routes ──────────────────────────────
  if (isProtected(pathname)) {
    if (!isLoggedIn) {
      // Preserve the intended destination so login can redirect back
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Role-based access: redirect to own dashboard if trying wrong section
    if (!isAllowedForRole(role!, pathname)) {
      const ownDashboard = ROLE_DASHBOARD[role!] ?? "/";
      return NextResponse.redirect(new URL(ownDashboard, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths EXCEPT:
     * - _next/static (static files)
     * - _next/image  (image optimisation)
     * - favicon.ico
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
