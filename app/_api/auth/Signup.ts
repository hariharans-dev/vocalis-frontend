import { APIRequestOptions, fetchData } from "../FetchData";
import { setToken } from "@/app/_api/Session";

interface ApiResponse {
  data?: {
    token: any;
  };
  status?: any;
  error?: any;
}
export default async function ApiSignup(
  email: string | null = null,
  password: string | null = null,
  google: boolean = false
): Promise<any> {
  if (!email) return null;
  if (!password) return null;

  const frontendSecret = process.env.NEXT_PUBLIC_FRONTEND_SECRET;
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  if (!frontendSecret || !backendUrl) {
    return null;
  }

  var path = `${backendUrl}/root`;
  if (google) {
    password = crypto.randomUUID();
  }
  let requestBody: { email: string; password?: string } = {
    email,
    password,
  };

  const options: APIRequestOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${frontendSecret}`,
    },
    body: requestBody,
  };

  try {
    var response = await fetchData<ApiResponse>(path, options);
    if (response !== null && response.data?.token) {
      setToken("authToken", response["data"]["token"]);
    }
    return response;
  } catch (error) {
    return null;
  }
}
