import { APIRequestOptions, fetchData } from "../../FetchData";
import { getToken } from "@/app/api/Session";

interface ApiResponse {
  data?: { role_list?: any; response?: string };
  status?: any;
  error?: { response?: string };
}

export async function getBasicRoles() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const path = `${backendUrl}/role/rolelist`;
  const options: APIRequestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    var response = await fetchData<ApiResponse>(path, options);
    return response;
  } catch (error) {
    return { status: "error", error: { response: "internal server error" } };
  }
}

export async function createRole(data: any) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  var authToken = JSON.parse(getToken("authToken") ?? "null");

  const path = `${backendUrl}/role`;
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

export async function getEventUsersRoles(event_name: string) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  var authToken = JSON.parse(getToken("authToken") ?? "null");

  const path = `${backendUrl}/role/event/list`;
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

export async function deleteRole(data: any) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  var authToken = JSON.parse(getToken("authToken") ?? "null");

  const path = `${backendUrl}/role`;
  const options: APIRequestOptions = {
    method: "DELETE",
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
