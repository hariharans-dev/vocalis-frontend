import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { APIRequestOptions, fetchData } from "./app/api/FetchData";
import { cookies } from "next/headers";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();
  const cookie = cookieStore.get("authToken")?.value;

  let token: string | undefined;
  let role: string | undefined;

  if (cookie) {
    try {
      const parsedCookie =
        typeof cookie === "string" ? JSON.parse(cookie) : cookie;

      token = String(parsedCookie.token);
      role = String(parsedCookie.role);
    } catch (error) {
      cookieStore.delete("authToken");
      return NextResponse.redirect(
        new URL("/auth/signin?response=invalid session", request.url)
      );
    }
  }

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!backendUrl) {
    cookieStore.delete("authToken");
    return NextResponse.redirect(
      new URL("/auth/signin?response=backend unreachable", request.url)
    );
  }

  let sessionCheck: "valid" | "invalid" | "backend_error";
  try {
    sessionCheck = await isSessionValid(token, backendUrl);
  } catch {
    cookieStore.delete("authToken");
    return NextResponse.redirect(
      new URL("/auth/signin?response=backend unreachable", request.url)
    );
  }

  if (sessionCheck !== "valid") {
    cookieStore.delete("authToken");

    // 🔑 Special case: appadmin dashboard goes to /appadmin/signin
    if (pathname.startsWith("/appadmin/dashboard")) {
      return NextResponse.redirect(new URL("/appadmin/signin", request.url));
    }

    const reason =
      sessionCheck === "backend_error"
        ? "backend unreachable"
        : "session expired";
    return NextResponse.redirect(
      new URL(`/auth/signin?response=${reason}`, request.url)
    );
  }

  // 🔑 Role-based route protection
  const DASHBOARD_PATHS: Record<string, string> = {
    root: "/root/dashboard",
    user: "/user/dashboard",
    appadmin: "/appadmin/dashboard",
  };

  for (const [expectedRole, path] of Object.entries(DASHBOARD_PATHS)) {
    if (pathname.startsWith(path) && role !== expectedRole) {
      const redirectPath =
        DASHBOARD_PATHS[role as keyof typeof DASHBOARD_PATHS] || "/auth/signin";
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }
  }

  return NextResponse.next();
}

async function isSessionValid(
  token: string | undefined,
  backendUrl: string
): Promise<"valid" | "invalid" | "backend_error"> {
  if (!token) return "invalid";

  try {
    const path = `${backendUrl}/auth/get`;
    const options: APIRequestOptions = {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    };

    const response = await fetchData<any>(path, options);
    return response?.status === "success" ? "valid" : "invalid";
  } catch {
    return "backend_error";
  }
}

// ✅ Apply only to role-based dashboards
export const config = {
  matcher: ["/root/:path*", "/user/:path*", "/appadmin/dashboard/:path*"],
};
