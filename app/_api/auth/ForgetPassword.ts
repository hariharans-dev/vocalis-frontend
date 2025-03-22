import { json } from "stream/consumers";
import { APIRequestOptions, fetchData } from "../FetchData";

interface ApiResponse {
  data?: {
    token: any;
  };
  status?: number;
  error?: string;
}

export default async function ApiForgetPassword(
  email: string | null = null,
  role: string = "root",
  resetToken: string | null = null,
  password: string | null = null
): Promise<ApiResponse | null> {
  const frontendSecret = process.env.NEXT_PUBLIC_FRONTEND_SECRET;
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  if (!frontendSecret || !backendUrl) {
    return null;
  }

  if (resetToken && !password) {
    return null;
  }

  let path = `${backendUrl}/${role}/forgetpassword`;
  let requestBody: Object;
  let options: APIRequestOptions;

  if (resetToken) {
    requestBody = {
      password,
    };

    options = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${resetToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    };
  } else if (email) {
    requestBody = {
      email,
    };

    options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${frontendSecret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    };
  } else {
    return null;
  }

  try {
    const response = await fetchData<ApiResponse>(path, options);
    if (response) {
      return response;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}
