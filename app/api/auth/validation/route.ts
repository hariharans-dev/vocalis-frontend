import { NextResponse } from "next/server";
import { APIRequestOptions, fetchData } from "../../FetchData";

interface ApiResponse {
  data?: any;
  status?: any;
  error?: any;
}

export async function POST(req: Request) {
  const body = await req.json();
  const key = body?.key ?? null;
  const password = body?.password ?? null;
  const role = body?.role ?? null;

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const pathRoot = `${backendUrl}/root/forgetpassword`;
  const pathUser = `${backendUrl}/user/forgetpassword`;

  const options: APIRequestOptions = {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password }),
  };
  try {
    var response;
    if (role == "root") {
      response = await fetchData<ApiResponse>(pathRoot, options);
    } else if (role == "user") {
      response = await fetchData<ApiResponse>(pathUser, options);
    } else {
      return NextResponse.json({
        status: "error",
        error: { response: "internal server error" },
      });
    }
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({
      status: "error",
      error: { response: "internal server error" },
    });
  }
}
