import { NextResponse } from "next/server";
import { APIRequestOptions, fetchData } from "../../../FetchData";

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

    const path = `${backendUrl}/user/forgetpassword`;

    const options: APIRequestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    };
    var response = await fetchData<ApiResponse>(path, options);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({
      status: "error",
      error: { response: "internal server error" },
    });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const key = body?.key ?? null;
    const password = body?.password ?? null;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    const path = `${backendUrl}/user/forgetpassword`;
    const options: APIRequestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({ password }),
    };
    console.log(options);
    var response = await fetchData<ApiResponse>(path, options);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({
      status: "error",
      error: { response: "internal server error" },
    });
  }
}
