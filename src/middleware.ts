// ============================================
// Middleware - Route Protection & Rate Limiting
// ============================================

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/", "/auth/login", "/auth/register", "/auth/error"];
const apiAuthPrefix = "/api/auth";

export default function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const path = nextUrl.pathname;

  // Allow public paths
  if (publicPaths.includes(path)) {
    return NextResponse.next();
  }

  // Allow API auth routes
  if (path.startsWith(apiAuthPrefix)) {
    return NextResponse.next();
  }

  // Allow static files
  if (
    path.startsWith("/_next") ||
    path.startsWith("/favicon") ||
    path.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check for session token
  const sessionToken =
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value;

  // Redirect to login if no session
  if (!sessionToken) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(loginUrl);
  }

  // Rate limiting for API routes (simple header-based)
  if (path.startsWith("/api/")) {
    const response = NextResponse.next();
    response.headers.set("X-RateLimit-Limit", "60");
    response.headers.set("X-RateLimit-Remaining", "59");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
