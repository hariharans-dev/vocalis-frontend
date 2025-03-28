import { NextResponse, NextRequest } from "next/server";
import { APIRequestOptions, fetchData } from "./app/_api/FetchData";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookie = request.cookies.get("authToken");

  let token: string | undefined = undefined; // Ensure it's undefined, not null
  let role: string | undefined = undefined;

  // 🛠️ Parse Auth Token Cookie Safely
  if (cookie) {
    try {
      const parsedCookie = JSON.parse(cookie.value);
      token = parsedCookie.token || undefined; // Convert null to undefined
      role = parsedCookie.role || undefined;
    } catch (error) {
      console.error("Invalid auth cookie:", error);
      return redirectToSignIn(request, "session expired");
    }
  }

  // 🛠️ Ensure Backend URL is Available
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!backendUrl) {
    return redirectToSignIn(request, "backend unreachable");
  }

  // 🛠️ Validate Session
  let sessionCheck: "valid" | "invalid" | "backend_error";
  try {
    sessionCheck = await isSessionValid(token, backendUrl);
  } catch (error) {
    console.error("Session validation error:", error);
    return redirectToSignIn(request, "backend unreachable");
  }

  const sessionActive = sessionCheck === "valid";

  // 🏠 Public Pages - Allow Access If Not Logged In
  if (
    ["/", "/auth/signin", "/auth/signup"].some((p) => pathname.startsWith(p))
  ) {
    if (sessionActive && role) {
      return redirectToDashboard(request, role);
    }
    return NextResponse.next();
  }

  // 🔒 Protected Routes (Root & User Dashboards)
  if (pathname.startsWith("/root/dashboard")) {
    if (!sessionActive) return redirectToSignIn(request, "session expired");
    if (role !== "root") return redirectToDashboard(request, "user");
    return NextResponse.next();
  }

  if (pathname.startsWith("/user/dashboard")) {
    if (!sessionActive) return redirectToSignIn(request, "session expired");
    if (role !== "user") return redirectToDashboard(request, "root");
    return NextResponse.next();
  }

  return NextResponse.next();
}

/**
 * 🔐 Validate session with the backend
 */
async function isSessionValid(
  token: string | undefined,
  backendUrl: string
): Promise<"valid" | "invalid" | "backend_error"> {
  if (!token) return "invalid";

  try {
    const response = await fetchData<any>(`${backendUrl}/auth`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.status === "success" ? "valid" : "invalid";
  } catch (error) {
    console.error("Error checking session validity:", error);
    return "backend_error";
  }
}

/**
 * 🚀 Redirect to the appropriate dashboard
 */
function redirectToDashboard(request: NextRequest, role: string) {
  const dashboardPath = role === "root" ? "/root/dashboard" : "/user/dashboard";
  return NextResponse.redirect(new URL(dashboardPath, request.url));
}

/**
 * 🚨 Redirect to Sign-in Page with an Optional Message
 */
function redirectToSignIn(request: NextRequest, responseMessage: string) {
  return NextResponse.redirect(
    new URL(
      `/auth/signin?response=${encodeURIComponent(responseMessage)}`,
      request.url
    )
  );
}

export const config = {
  matcher: "/((?!api).*)",
};
