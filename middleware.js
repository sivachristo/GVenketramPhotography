import { NextResponse } from "next/server";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Always allow through: admin panel, all API routes, Next.js internals,
  // the construction page itself, and static file extensions.
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/under-construction") ||
    /\.(png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|otf|css|js|map)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  // ── Primary check: cookie (set by /api/settings on every GET and POST) ──
  // This is instant — no network fetch, no race condition.
  const cookie = request.cookies.get("gvr_construction");
  if (cookie?.value === "1") {
    return NextResponse.redirect(new URL("/under-construction", request.url));
  }

  // ── Fallback: fetch API (handles first visit when cookie not yet set) ──
  try {
    const settingsUrl = new URL("/api/settings", request.url);
    const res = await fetch(settingsUrl, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data?.settings?.underConstruction === true) {
        return NextResponse.redirect(new URL("/under-construction", request.url));
      }
    }
  } catch {
    // If the settings API is unreachable, fail-open — let the page render normally.
  }

  return NextResponse.next();
}

export const config = {
  // Run on all routes except Next.js static assets and image optimisation
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

