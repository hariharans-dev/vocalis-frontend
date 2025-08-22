import { NextResponse } from "next/server";
import { APIRequestOptions, fetchData } from "../../../FetchData";
import { setToken } from "../../../Session";

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
      res = await setToken(res, "authToken", {
        token: response.data.token,
        role: "root",
      });
    }

    return res;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Auth POST error:", error);
    }
    return NextResponse.json<ApiResponse>(
      { status: "error", error: { response: "Internal server error" } },
      { status: 500 }
    );
  }
}
