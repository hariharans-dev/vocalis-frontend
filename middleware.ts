import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { APIRequestOptions, fetchData } from "./app/api/FetchData";

export async function middleware(request: NextRequest) {
  let cookie = request.cookies.get("authToken");

  if (!cookie) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }
  const token = cookie.value;
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  if (!backendUrl) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  var path = `${backendUrl}/auth`;

  const options: APIRequestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    var response = await fetchData<any>(path, options);
    if (response.status != "success") {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
  } catch (error) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }
}

export const config = {
  matcher: "/dashboard/:path*",
};
