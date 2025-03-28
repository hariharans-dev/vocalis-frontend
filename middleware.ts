import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { APIRequestOptions, fetchData } from "./app/_api/FetchData";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookie = request.cookies.get("authToken");
  var token;
  var role;

  if (cookie) {
    let parsedCookie: { token?: string; role?: string } | null = null;
    try {
      parsedCookie = cookie ? JSON.parse(cookie.value) : null;
      token = parsedCookie?.token;
      role = parsedCookie?.role;
    } catch (error) {
      return NextResponse.redirect(
        new URL("/auth/signin?response=invalid session", request.url)
      );
    }
  }

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!backendUrl) {
    return NextResponse.redirect(
      new URL("/auth/signin?response=backend unreachable", request.url)
    );
  }

  var sessionCheck;
  try {
    sessionCheck = await isSessionValid(token, backendUrl);
  } catch (error) {
    new URL("/auth/signin?response=backend unreachable", request.url);
  }

  if (sessionCheck === "backend_error") {
    return NextResponse.redirect(
      new URL("/auth/signin?response=backend unreachable", request.url)
    );
  }

  const sessionActive = sessionCheck === "valid";

  if (pathname.startsWith("/root/dashboard")) {
    if (!sessionActive) {
      return NextResponse.redirect(
        new URL("/auth/signin?response=session expired", request.url)
      );
    }
    if (role != "root")
      return NextResponse.redirect(new URL("/user/dashboard", request.url));
    return NextResponse.next();
  }

  if (pathname.startsWith("/user/dashboard")) {
    if (!sessionActive) {
      return NextResponse.redirect(
        new URL("/auth/signin?response=session expired", request.url)
      );
    }
    if (role != "user")
      return NextResponse.redirect(new URL("/root/dashboard", request.url));
    return NextResponse.next();
  }

  return NextResponse.next();
}

async function isSessionValid(
  token: string | undefined,
  backendUrl: string
): Promise<"valid" | "invalid" | "backend_error"> {
  if (!token) {
    return "invalid";
  }

  try {
    const path = `${backendUrl}/auth`;
    const options: APIRequestOptions = {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    };

    const response = await fetchData<any>(path, options);

    if (response["status"] === "success") {
      return "valid";
    }
    return "invalid";
  } catch (error) {
    return "backend_error";
  }
}

export const config = {
  matcher: "/((?!api|auth).*)",// Exclude /api and /auth from middleware
};

