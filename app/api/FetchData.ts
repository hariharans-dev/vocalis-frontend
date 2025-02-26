export interface APIRequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: any;
}

export async function fetchData<T>(
  path: string,
  options?: APIRequestOptions
): Promise<T | null> {
  const { method = "GET", headers = {}, body } = options || {};

  try {
    console.log(path);
    const response = await fetch(path, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: method !== "GET" && body ? JSON.stringify(body) : undefined,
    });

    return (await response.json()) as T;
  } catch (error) {
    return error as T;
  }
}
