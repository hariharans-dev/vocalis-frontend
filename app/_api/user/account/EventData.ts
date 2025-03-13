import { APIRequestOptions, fetchData } from "../../FetchData";
import { getToken } from "@/app/_api/Session";

interface ApiResponse {
  data?: any;
  status?: any;
  error?: any;
}

export async function EventDataCount() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  var authToken = JSON.parse(getToken("authToken") ?? "null");

  const path = `${backendUrl}/role/list`;
  const options: APIRequestOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken["token"]}`,
    },
    body: { count: "true" },
  };
  try {
    var response = await fetchData<ApiResponse>(path, options);
    return response;
  } catch (error) {
    return { status: "error", error: { response: "internal server error" } };
  }
}

export async function VoiceFeedbackCount() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  var authToken = JSON.parse(getToken("authToken") ?? "null");

  const path = `${backendUrl}/reporter/data/get`;
  const options: APIRequestOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken["token"]}`,
    },
    body: { count: "true" },
  };
  try {
    var response = await fetchData<ApiResponse>(path, options);
    return response;
  } catch (error) {
    return { status: "error", error: { response: "internal server error" } };
  }
}

export async function VoiceFeedbackReportCount() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  var authToken = JSON.parse(getToken("authToken") ?? "null");

  const path = `${backendUrl}/reporter/report/get`;
  const options: APIRequestOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken["token"]}`,
    },
    body: { count: "true" },
  };
  try {
    var response = await fetchData<ApiResponse>(path, options);
    return response;
  } catch (error) {
    return { status: "error", error: { response: "internal server error" } };
  }
}
