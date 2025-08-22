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
    const formData = await req.formData();
    for (const [key, value] of formData.entries()) {
      
    }
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

    const path = `${backendUrl}/reporter/data`;
    const options: APIRequestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData, // adjust payload if needed
    };

    const response = await fetchData<ApiResponse>(path, options);
    return NextResponse.json<ApiResponse>(response);
  } catch (error: any) {
    let status = 500;
    let message = "internal server error";

    if (error.message === "missing auth token") {
      status = 401;
      message = "missing auth token";
    } else if (error.message === "invalid auth token format") {
      status = 400;
      message = "invalid auth token format";
    }

    return NextResponse.json<ApiResponse>(
      {
        status: "error",
        error: { response: message },
      },
      { status }
    );
  }
}
