import { NextResponse } from "next/server";
import { ADMIN_COOKIE, createSession, destroySession } from "@/lib/analytics.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function publicOrigin(request: Request) {
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "localhost";
  const proto = request.headers.get("x-forwarded-proto") || "http";
  return `${proto}://${host}`;
}

function cookieOptions(request: Request, maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: (request.headers.get("x-forwarded-proto") || new URL(request.url).protocol).includes("https"),
    path: "/admin",
    maxAge,
  };
}

export async function POST(request: Request) {
  const form = await request.formData();
  const intent = String(form.get("intent") || "login");
  if (intent === "logout") {
    const token = (request.headers.get("cookie") || "")
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${ADMIN_COOKIE}=`))
      ?.slice(ADMIN_COOKIE.length + 1);
    if (token) destroySession(decodeURIComponent(token));
    const response = NextResponse.redirect(new URL("/admin/login", publicOrigin(request)), { status: 303 });
    response.cookies.set(ADMIN_COOKIE, "", cookieOptions(request, 0));
    return response;
  }

  const password = String(form.get("password") || "");
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "";
  const token = createSession(password, ip);
  if (!token) {
    return NextResponse.redirect(new URL("/admin/login?e=1", publicOrigin(request)), { status: 303 });
  }
  const response = NextResponse.redirect(new URL("/admin", publicOrigin(request)), { status: 303 });
  response.cookies.set(ADMIN_COOKIE, token, cookieOptions(request, 60 * 60 * 24 * 7));
  return response;
}
