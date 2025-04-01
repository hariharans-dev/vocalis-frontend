import { NextResponse } from "next/server";
import { APIRequestOptions, fetchData } from "../../FetchData";
import { setToken } from "../../Session";

const frontendSecret = process.env.NEXT_PUBLIC_FRONTEND_SECRET;
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

interface ApiResponse {
  data?: {
    token: any;
  };
  status?: any;
  error?: any;
}

export async function POST(email: string, password: string) {
  const options: APIRequestOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${frontendSecret}`,
      "Content-Type": "application/json",
    },

    body: JSON.stringify({ email, password }),
  };

  var path = `${backendUrl}/auth/root`;

  try {
    var response = await fetchData<ApiResponse>(path, options);
    if (response !== null && response.data?.token) {
      setToken(
        "authToken",
        JSON.stringify({ token: response["data"]["token"], role: "root" })
      );
    }
    return response;
  } catch (error) {
    return null;
  }
}
