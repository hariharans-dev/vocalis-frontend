import { NextResponse } from "next/server";
import { APIRequestOptions, fetchData } from "../../FetchData";
import { setToken } from "../../Session";

interface ApiResponse {
  data?: any;
  status?: any;
  error?: any;
}

export async function POST(req: Request) {
  const body = await req.json();
  const email = body?.email ?? null;
  const password = body?.password ?? null;

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const path = `${backendUrl}/root`;
  const options: APIRequestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  };
  try {
    const response = await fetchData<ApiResponse>(path, options);
    var res = NextResponse.json(response);
    if (response.status == "success") {
      setToken(res, "authToken", { token: response.data?.token, role: "root" });
    }
    return res;
  } catch (error) {
    return NextResponse.json({
      status: "error",
      error: { response: "internal server error" },
    });
  }
}
