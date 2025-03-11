import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { APIRequestOptions, fetchData } from "./app/api/FetchData";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookie = request.cookies.get("authToken");
  var token = null;
  var role = null;

  if (cookie) {
    try {
      const parsedCookie = cookie ? JSON.parse(cookie.value) : null;
      token = parsedCookie.token;
      role = parsedCookie.role;
    } catch (error) {
      console.error("Middleware: Error parsing cookie:", error);
      return NextResponse.redirect(
        new URL("/auth/signin?response=session_expired", request.url)
      );
    }
  }

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!backendUrl) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  const sessionActive = await isSessionValid(token, backendUrl, role);

  if (
    pathname === "/" ||
    pathname.startsWith("/auth/signin") ||
    pathname.startsWith("/auth/signup")
  ) {
    if (sessionActive && role) {
      if (role == "root") {
        return NextResponse.redirect(new URL("/root/dashboard", request.url));
      } else {
        return NextResponse.redirect(new URL("/user/dashboard", request.url));
      }
    }
    return NextResponse.next();
  }

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
  backendUrl: string,
  role: string
): Promise<boolean> {
  if (!token) {
    return false;
  }

  try {
    const path = `${backendUrl}/auth`;
    const options: APIRequestOptions = {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    };

    const response = await fetchData<any>(path, options);
    return response["status"] === "success" && response["data"]["role"] == role;
  } catch (error) {
    console.error("isSessionValid: Error:", error);
    return false;
  }
}

export const config = {
  matcher: "/((?!api).*)",
};
