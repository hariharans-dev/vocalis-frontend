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
  const body = await req.json();
  const token = body?.token ?? null;

  const path = `${backendUrl}/auth`;
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
