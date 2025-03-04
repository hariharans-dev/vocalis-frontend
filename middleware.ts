import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { APIRequestOptions, fetchData } from "./app/api/FetchData";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookie = request.cookies.get("authToken");
  var token = null;

  console.log(`Middleware: Pathname: ${pathname}`);

  if (cookie) {
    try {
      const parsedCookie = cookie ? JSON.parse(cookie.value) : null;
      token = parsedCookie.token;
      console.log(`Middleware: Token from cookie: ${token}`);
    } catch (error) {
      console.error("Middleware: Error parsing cookie:", error);
      return NextResponse.redirect(
        new URL("/auth/signin?response=session_expired", request.url)
      );
    }
  }

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!backendUrl) {
    console.error("Middleware: Backend URL not found");
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  const sessionActive = await isSessionValid(token, backendUrl);
  console.log(`Middleware: Session Active: ${sessionActive}`);

  if (
    pathname === "/" ||
    pathname.startsWith("/auth/signin") ||
    pathname.startsWith("/auth/signup")
  ) {
    if (sessionActive) {
      console.log("Middleware: Redirecting to /dashboard");
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    console.log("Middleware: Allowing access to auth pages");
    return NextResponse.next();
  }

  if (pathname.startsWith("/dashboard")) {
    if (!sessionActive) {
      console.log("Middleware: Redirecting to /auth/signin");
      return NextResponse.redirect(
        new URL("/auth/signin?response=session expired", request.url)
      );
    }
    console.log("Middleware: Allowing access to /dashboard");
    return NextResponse.next();
  }

  console.log("Middleware: Allowing access to other pages");
  return NextResponse.next();
}

async function isSessionValid(
  token: string | undefined,
  backendUrl: string
): Promise<boolean> {
  if (!token) {
    console.log("isSessionValid: No token found");
    return false;
  }

  try {
    const path = `${backendUrl}/auth`;
    const options: APIRequestOptions = {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    };

    const response = await fetchData<any>(path, options);
    console.log("isSessionValid: Response:", response);
    return response.status === "success";
  } catch (error) {
    console.error("isSessionValid: Error:", error);
    return false;
  }
}

export const config = {
  matcher: "/((?!api).*)",
};