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
    console.error("Environment variables not set.");
    return null;
  }

  if (resetToken && !password) {
    return null;
  }

  let path = `${backendUrl}/${role}/forgetpassword`;
  let requestBody;
  let options: APIRequestOptions;

  if (resetToken) {
    requestBody = {
      password,
    };

    options = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${resetToken}`,
      },
      body: requestBody,
    };
  } else if (email) {
    requestBody = {
      email,
    };

    options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${frontendSecret}`,
      },
      body: requestBody,
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
