import { NextResponse } from "next/server";
import { APIRequestOptions, fetchData } from "../../../FetchData";
// import { setToken } from "../../../Session";
import { cookies } from "next/headers";

interface ApiResponse {
  data?: { token?: string }; // make token shape explicit
  status?: "success" | "error";
  error?: any;
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      return NextResponse.json<ApiResponse>(
        { status: "error", error: { response: "Backend URL not configured" } },
        { status: 500 }
      );
    }

    const path = `${backendUrl}/auth/root`;
    const options: APIRequestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    };

    const response = await fetchData<ApiResponse>(path, options);

    var res = NextResponse.json<ApiResponse>(response);

    if (response?.status === "success" && response.data?.token) {
      // res = await setToken(res, "authToken", {
      //   token: response.data.token,
      //   role: "root",
      // });
      (await cookies()).set({
        name: "authToken",
        value: JSON.stringify({ token: response.data.token, role: "root" }),
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24,
      });
    }

    return res;
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      { status: "error", error: { response: "Internal server error" } },
      { status: 500 }
    );
  }
}
