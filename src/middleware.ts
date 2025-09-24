import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const role = req.cookies.get("role")?.value;

  // Admin-only dashboard
  if (req.nextUrl.pathname === "/secret-dashboard") {
    if (role !== "admin") {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  // Restrict advertiser area to advertiser role
  if (req.nextUrl.pathname.startsWith("/advertiser")) {
    if (role !== "advertiser") {
      const url = req.nextUrl.clone();
      if (role === "admin") url.pathname = "/secret-dashboard";
      else url.pathname = "/panel";
      return NextResponse.redirect(url);
    }
  }

  // Redirect advertisers away from user panel
  if (req.nextUrl.pathname.startsWith("/panel")) {
    if (role === "advertiser") {
      const url = req.nextUrl.clone();
      url.pathname = "/advertiser";
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/secret-dashboard",
    "/panel/:path*",
    "/advertiser/:path*",
  ],
};


