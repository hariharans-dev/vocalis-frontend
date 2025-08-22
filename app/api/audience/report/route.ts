import { NextResponse } from "next/server";
import { APIRequestOptions, fetchData } from "../../FetchData";
import { cookies } from "next/headers";

interface ApiResponse {
  data?: any;
  status?: any;
  error?: any;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const cookie = (await cookies()).get("authToken")?.value;

    if (!cookie) {
      throw new Error("missing auth token");
    }

    const parsedCookie = JSON.parse(cookie) as { token: string; role?: string };
    const token = parsedCookie.token;

    if (!token) {
      throw new Error("invalid auth token format");
    }

    const path = `${backendUrl}/audience/report`;
    const options: APIRequestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
      
    };
    const response = await fetchData<ApiResponse>(path, options);
    return NextResponse.json<ApiResponse>(response);
  } catch (error) {
    return NextResponse.json({
      status: "error",
      error: { response: "internal server error" },
    });
  }
}
