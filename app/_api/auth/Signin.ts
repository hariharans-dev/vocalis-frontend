import { APIRequestOptions, fetchData } from "../FetchData";
import { setToken } from "@/app/_api/Session";

interface ApiResponse {
  data?: {
    token: any;
  };
  status?: any;
  error?: any;
}
export default async function ApiSignin(
  email: string | null = null,
  password: string | null = null,
  role: string | null = "root",
  google: boolean = false
): Promise<any> {
  if (!email) return null;

  const frontendSecret = process.env.NEXT_PUBLIC_FRONTEND_SECRET;
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  if (!frontendSecret || !backendUrl) {
    return null;
  }

  var path = `${backendUrl}/auth/${role === "root" ? "root" : "user"}`;
  let requestBody: { email: string | null; password?: string | null } = {
    email,
  };

  if (google) {
    path += "/google";
  } else {
    requestBody = { ...requestBody, password: password };
  }

  const options: APIRequestOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${frontendSecret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  };

  try {
    var response = await fetchData<ApiResponse>(path, options);
    if (response !== null && response.data?.token) {
      setToken(
        "authToken",
        JSON.stringify({ token: response["data"]["token"], role: role })
      );
    }
    return response;
  } catch (error) {
    return null;
  }
}
