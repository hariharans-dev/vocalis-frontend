import { NextResponse } from "next/server";
import { APIRequestOptions, fetchData } from "../../../FetchData";
import { getToken, setToken } from "../../../Session";

interface ApiResponse {
  data?: any;
  status?: any;
  error?: any;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = body?.email ?? null;

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    const path = `${backendUrl}/auth/user/google`;
    const options: APIRequestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    };
    const response = await fetchData<ApiResponse>(path, options);
    let res = NextResponse.json(response);
    if (response?.status == "success") {
      setToken(
        res,
        "authToken",
        JSON.stringify({ token: response.data?.token, role: "user" })
      );
    }
    return res;
  } catch (error) {
    return NextResponse.json({
      status: "error",
      error: { response: "internal server error" },
    });
  }
}
