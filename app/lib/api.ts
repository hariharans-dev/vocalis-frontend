export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.example.com";

  try {
    const response = await fetch(`${baseUrl}/${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Request Error:", error);
    throw error;
  }
}
