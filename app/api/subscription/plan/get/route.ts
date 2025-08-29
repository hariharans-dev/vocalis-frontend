import { NextResponse } from "next/server";
import { APIRequestOptions, fetchData } from "../../../FetchData";

interface ApiResponse {
  data?: any;
  status?: any;
  error?: any;
}

export async function POST(req: Request) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    const path = `${backendUrl}/subscription/plan/get`;
    const options: APIRequestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}), 
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