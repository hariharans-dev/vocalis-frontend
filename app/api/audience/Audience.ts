import { getToken } from "@/app/_api/Session";
import { APIRequestOptions, fetchData } from "../FetchData";

interface ApiResponse {
  data?: { response: string };
  status: string;
  error?: {
    response: string;
  };
}

export async function createAudienceData(data: Object) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const path = `${backendUrl}/audience/data`;
  const options: APIRequestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  try {
    const response = await fetchData<ApiResponse>(path, options);
    return response;
  } catch (error) {
    return { status: "error", error: { response: "internal server error" } };
  }
}
