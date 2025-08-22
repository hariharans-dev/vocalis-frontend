import { NextResponse } from "next/server";
import { APIRequestOptions, fetchData } from "../FetchData";

interface ApiResponse {
  data?: any;
  status?: any;
  error?: any;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    const path = `${backendUrl}/audience/data`;
    const options: APIRequestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
