import { getToken, removeToken } from "@/app/_api/Session";
import { APIRequestOptions, fetchData } from "../FetchData";

interface ApiResponse {
  data?: {
    token: any;
  };
  status?: string;
  error?: string;
}

export async function Logout() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  var authToken = JSON.parse(getToken("authToken") ?? "null");

  const path = `${backendUrl}/auth`;
  const options: APIRequestOptions = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${authToken["token"]}`,
    },
  };
  try {
    const response = await fetchData<ApiResponse>(path, options);
    removeToken("authToken");
    removeToken("event");
    return response;
  } catch (error) {
    return { status: "error", error: { response: "internal server error" } };
  }
}
