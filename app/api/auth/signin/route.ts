import { NextResponse } from "next/server";
import { APIRequestOptions, fetchData } from "../../FetchData";
import { getToken, setToken } from "../../Session";

interface ApiResponse {
  data?: any;
  status?: any;
  error?: any;
}

export async function POST(req: Request) {
  const body = await req.json();
  const email = body?.email ?? null;
  const password = body?.password ?? null;
  const role = body?.role ?? null;

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const path = `${backendUrl}/auth/root`;
  const options: APIRequestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  };
  try {
    const response = await fetchData<ApiResponse>(path, options);
    let res = NextResponse.json(response);
    var token;
    if (response?.status == "success") {
      if (role == "root") {
        token = { token: response.data?.token, role: "root" };
      } else if (role == "user") {
        token = { token: response.data?.token, role: "user" };
      } else {
        return NextResponse.json({
          status: "error",
          error: { response: "internal server error" },
        });
      }
    }
    setToken(res, "authToken", token);
    return res;
  } catch (error) {
    return NextResponse.json({
      status: "error",
      error: { response: "internal server error" },
    });
  }
}
