// app/api/hello/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { APIRequestOptions, fetchData } from "../../FetchData";

interface ApiResponse {
  data?: any;
  status?: any;
  error?: any;
}

export async function GET() {
  const cookieStore = cookies();
  const authTokenStr = (await cookieStore).get("authToken")?.value;

  let authToken: any = null;

  try {
    authToken = authTokenStr ? JSON.parse(authTokenStr) : null;
  } catch (err) {
    console.error("Invalid authToken JSON:", err);
  }

  if (!authToken || typeof authToken !== "object" || !("token" in authToken)) {
    return NextResponse.json(
      {
        status: "error",
        error: { response: "internal server error" },
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: `Hello, ${authToken.token}` });
}

export async function POST(req: Request) {
  const body = await req.json();
  const email = body?.email ?? null;
  const password = body?.password ?? null;

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
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({
      status: "error",
      error: { response: "internal server error" },
    });
  }
}
