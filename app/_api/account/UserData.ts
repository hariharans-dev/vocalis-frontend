import { getToken, removeToken } from "@/app/_api/Session";
import { APIRequestOptions, fetchData } from "../FetchData";

interface ApiResponse {
  data?: {
    email: string | null;
    phone: string | null;
    name: string | null;
    response: string | null;
  };
  status?: string;
  error?: {
    response: string;
  };
}

export async function GetUserData() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  var authToken = JSON.parse(getToken("authToken") ?? "null");

  const path = `${backendUrl}/user`;
  const options: APIRequestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authToken["token"]}`,
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await fetchData<ApiResponse>(path, options);
    return response;
  } catch (error) {
    return { status: "error", error: { response: "internal server error" } };
  }
}

export async function UpdateUserData(data: Object) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  var authToken = JSON.parse(getToken("authToken") ?? "null");

  const path = `${backendUrl}/user`;
  const options: APIRequestOptions = {
    method: "PUT",
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

export async function CloseUserAccount() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  var authToken = JSON.parse(getToken("authToken") ?? "null");

  const path = `${backendUrl}/user`;
  const options: APIRequestOptions = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${authToken["token"]}`,
      "Content-Type": "application/json",
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
