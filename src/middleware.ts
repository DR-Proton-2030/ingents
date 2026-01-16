import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  console.log("🚀 Middleware executed for:", req.nextUrl.pathname);
  console.log("🌐 Host:", req.headers.get("host"));
  console.log("🍪 All Cookies:", req.cookies.getAll());

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

  // Allow OAuth callback routes (social media with platform & token params)
  const isOAuthCallback =
    req.nextUrl.pathname.includes("/social-media") &&
    req.nextUrl.searchParams.has("platform") &&
    req.nextUrl.searchParams.has("token");

  if (isOAuthCallback) {
    console.log("OAuth callback detected, allowing access...");
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  if (!token) {
    console.log("No token, redirecting to login...");
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
