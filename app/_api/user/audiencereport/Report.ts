import { APIRequestOptions, fetchData } from "../../FetchData";
import { getToken } from "@/app/_api/Session";

interface ApiResponse {
  data?: {
    map(arg0: (element: any, index: number) => any): unknown;
    forEach(arg0: (element: any) => void): unknown;
    response?: string;
  };
  status?: any;
  error?: { response?: string };
}

export async function getAudienceReport(data: any) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  var authToken = JSON.parse(getToken("authToken") ?? "null");

  const path = `${backendUrl}/audience/report/get`;
  const options: APIRequestOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken["token"]}`,
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

export async function createAudienceReport(event_name: string) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  var authToken = JSON.parse(getToken("authToken") ?? "null");

  const path = `${backendUrl}/audience/report`;
  const options: APIRequestOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken["token"]}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ event_name }),
  };
  try {
    const response = await fetchData<ApiResponse>(path, options);
    return response;
  } catch (error) {
    return { status: "error", error: { response: "internal server error" } };
  }
}
