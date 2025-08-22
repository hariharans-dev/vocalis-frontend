import { NextResponse } from "next/server";
import { APIRequestOptions, fetchData } from "../../FetchData";
// import { getToken, removeToken } from "../../Session";
import { cookies } from "next/headers";

interface ApiResponse {
  data?: any;
  status?: any;
  error?: any;
}

export async function DELETE(req: Request) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const path = `${backendUrl}/auth`;
  const cookie = (await cookies()).get("authToken")?.value;

  if (!cookie) {
    throw new Error("missing auth token");
  }

  const parsedCookie = JSON.parse(cookie) as { token: string; role?: string };
  const token = parsedCookie.token;
  const options: APIRequestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const response = await fetchData<ApiResponse>(path, options);
    var res = NextResponse.json<ApiResponse>(response);
    (await cookies()).delete("authToken");
    return res;
  } catch (error) {
    return NextResponse.json({
      status: "error",
      error: { response: "internal server error" },
    });
  }
}
