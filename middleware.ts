import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { APIRequestOptions, fetchData } from "./app/api/FetchData";
// import { getToken } from "./app/api/Session";
import { cookies } from "next/headers";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // const cookie = await getToken("authToken");
  const cookie = (await cookies()).get("authToken")?.value;
<<<<<<< HEAD
=======
  console.log(cookie);
>>>>>>> 001674ebf36acb79c1dd6a55036c1d8d3fd07491

  var token: string | undefined;
  var role: string | undefined;

  if (cookie) {
    try {
      const onceParsed = JSON.parse(cookie);
      const parsedCookie =
        typeof onceParsed === "string" ? JSON.parse(onceParsed) : onceParsed;

      token = String(parsedCookie.token);
      role = String(parsedCookie.role);
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

  let sessionCheck: "valid" | "invalid" | "backend_error" = "invalid";

  try {
    sessionCheck = await isSessionValid(token, backendUrl);
  } catch (error) {
    return NextResponse.redirect(
      new URL("/auth/signin?response=backend unreachable", request.url)
    );
  }

  if (sessionCheck === "backend_error") {
    return NextResponse.redirect(
      new URL("/auth/signin?response=backend unreachable", request.url)
    );
  }

  const sessionActive = sessionCheck === "valid";

  if (!sessionActive) {
    return NextResponse.redirect(
      new URL("/auth/signin?response=session expired", request.url)
    );
  }

  // Prevent infinite redirects by ensuring users are redirected only when necessary
  if (sessionActive && role) {
    const rootDashboard = "/root/dashboard";
    const userDashboard = "/user/dashboard";

    if (pathname === "/") {
      return NextResponse.redirect(
        new URL(role === "root" ? rootDashboard : userDashboard, request.url)
      );
    }

    if (pathname.startsWith("/root/dashboard") && role !== "root") {
      return NextResponse.redirect(new URL(userDashboard, request.url));
    }

    if (pathname.startsWith("/user/dashboard") && role !== "user") {
      return NextResponse.redirect(new URL(rootDashboard, request.url));
    }
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
    const path = `${backendUrl}/auth/get`;
    const options: APIRequestOptions = {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    };

    const response = await fetchData<any>(path, options);

    if (response?.status === "success") {
      return "valid";
    }
    return "invalid";
  } catch (error) {
    return "backend_error";
  }
}

// Exclude API, authentication, and static assets from middleware
export const config = {
  matcher: ["/((?!api|auth|_next|static|public|favicon.ico|$).*)"],
};
