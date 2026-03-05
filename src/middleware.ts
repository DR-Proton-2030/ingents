import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  console.log(`[Middleware] Path: ${pathname}, Platform: ${searchParams.get("platform")}, HasTokenParam: ${searchParams.has("token")}, HasCookie: ${!!token}`);

  // Skip authentication for public routes
  const publicRoutes = [
    "/login",
    "/signup",
    "/auth/login",
    "/auth/signup",
    "/setup-password",
  ];

  // Allow /meeting/* routes (e.g., /meeting/5E75B3ED-2)
  if (
    publicRoutes.includes(req.nextUrl.pathname) ||
    req.nextUrl.pathname.startsWith("/meeting/")
  ) {
    return NextResponse.next();
  }

  // Allow OAuth callback routes (social media with platform & token params or error)
  const isOAuthCallback =
    req.nextUrl.pathname.includes("/social-media") &&
    req.nextUrl.searchParams.has("platform") &&
    (req.nextUrl.searchParams.has("token") || req.nextUrl.searchParams.has("error"));

  if (isOAuthCallback) {
    console.log("OAuth callback detected, allowing access...");
    return NextResponse.next();
  }

  if (!token) {
    console.log("[Middleware] No token cookie, redirecting to login...");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (req.nextUrl.pathname === "/" && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|login|signup|auth).*)",
  ],
};
