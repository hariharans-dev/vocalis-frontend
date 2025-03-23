import { APIRequestOptions, fetchData } from "../../FetchData";
import { getToken } from "@/app/_api/Session";

interface ApiResponse {
  data?: { response: string };
  status?: any;
  error?: { response: string };
}

export async function createEvent(data: any) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  var authToken = JSON.parse(getToken("authToken") ?? "null");

  const path = `${backendUrl}/event`;
  const options: APIRequestOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken["token"]}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  try {
    var response = await fetchData<ApiResponse>(path, options);
    return response;
  } catch (error) {
    return { status: "error", error: { response: "internal server error" } };
  }
}
