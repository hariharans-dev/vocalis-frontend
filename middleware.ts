import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { APIRequestOptions, fetchData } from "./app/api/FetchData";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookie = request.cookies.get("authToken");
  var token = null;
  if (cookie) {
    try {
      const parsedCookie = cookie ? JSON.parse(cookie.value) : null;
      token = parsedCookie.token;
    } catch (error) {
      return NextResponse.redirect(
        new URL("/auth/signin?response=session_expired", request.url)
      );
    }
  }

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!backendUrl) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  const sessionActive = await isSessionValid(token, backendUrl);

  if (
    pathname === "/" ||
    pathname.startsWith("/auth/signin") ||
    pathname.startsWith("/auth/signup")
  ) {
    if (sessionActive) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/dashboard")) {
    if (!sessionActive) {
      return NextResponse.redirect(
        new URL(
          "/auth/signin?response=session_expired&redirect=" +
            request.nextUrl.pathname,
          request.url
        )
      );
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

async function isSessionValid(
  token: string | undefined,
  backendUrl: string
): Promise<boolean> {
  if (!token) return false;

  try {
    const path = `${backendUrl}/auth`;
    const options: APIRequestOptions = {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    };

    const response = await fetchData<any>(path, options);
    console.log(response);
    return response.status === "success";
  } catch (error) {
    return false;
  }
}

export const config = {
  matcher: "/((?!api).*)",
};
