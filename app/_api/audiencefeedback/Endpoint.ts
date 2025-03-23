import { APIRequestOptions, fetchData } from "../FetchData";
import { getToken } from "@/app/_api/Session";

interface ApiResponse {
  data?: {
    map(arg0: (element: any, index: number) => any): unknown;
    forEach(arg0: (element: any) => void): unknown;
    event_endpoint?: String | null;
  };
  status?: any;
  error?: any;
}

export async function getEndpoint(event_name: String) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  var authToken = JSON.parse(getToken("authToken") ?? "null");

  const path = `${backendUrl}/audience/endpoint/get`;
  const options: APIRequestOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken["token"]}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ event_name }),
  };
  try {
    var response = await fetchData<ApiResponse>(path, options);
    return response;
  } catch (error) {
    return { status: "error", error: { response: "internal server error" } };
  }
}

export async function createEndpoint(event_name: String) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  var authToken = JSON.parse(getToken("authToken") ?? "null");

  const path = `${backendUrl}/audience/endpoint`;
  const options: APIRequestOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken["token"]}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ event_name }),
  };
  try {
    var response = await fetchData<ApiResponse>(path, options);
    return response;
  } catch (error) {
    return { status: "error", error: { response: "internal server error" } };
  }
}

export async function getAudienceData(event_name: String) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  var authToken = JSON.parse(getToken("authToken") ?? "null");

  const path = `${backendUrl}/audience/data/get`;
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
