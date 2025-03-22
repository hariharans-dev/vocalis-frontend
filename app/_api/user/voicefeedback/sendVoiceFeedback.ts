import { APIRequestOptions, fetchData } from "../../FetchData";
import { getToken } from "../../Session";

interface ApiResponse {
  data?: any;
  status?: any;
  error?: any;
}

export async function sendVoiceFeedback(data: FormData) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  try {
    const authTokenString = getToken("authToken");
    if (!authTokenString) {
      return { status: "error", error: { response: "authToken missing" } };
    }
    const authToken = JSON.parse(authTokenString);
    if (!authToken || !authToken.token) {
      return { status: "error", error: { response: "Invalid authToken" } };
    }

    const path = `${backendUrl}/reporter/data`;
    const options: APIRequestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken.token}`,
      },
      body: data,
    };

    const response = await fetchData<ApiResponse>(path, options);
    return response;
  } catch (error) {
    return { status: "error", error: { response: "internal server error" } };
  }
}
