import { NextResponse } from "next/server";
import { APIRequestOptions, fetchData } from "../../../FetchData";
// import { setToken } from "../../../Session";
import { cookies } from "next/headers";

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

  const path = `${backendUrl}/root/register`;
  const options: APIRequestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  };
  try {
    const response = await fetchData<ApiResponse>(path, options);
    var res = NextResponse.json<ApiResponse>(response);
    if (response.status == "success") {
      // res = await setToken(res, "authToken", {
      //   token: response.data?.token,
      //   role: "root",
      // });
      (await cookies()).set({
        name: "authToken",
        value: JSON.stringify({ token: response.data.token, role: "root" }),
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24, // 1 day
      });
    }
    return res;
  } catch (error) {
    return NextResponse.json({
      status: "error",
      error: { response: "internal server error" },
    });
  }
}
