import delay from "../../utils/delay";
import APIError from "../../errors/APIError";

interface RequestOptions {
  body?: Record<string, any>;
  headers?: Record<string, string>;
}

class HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  get<T = any>(
    path: string,
    options?: Pick<RequestOptions, "headers">
  ): Promise<T> {
    return this.makeRequest<T>(path, {
      method: "GET",
      headers: options?.headers,
    });
  }

  post<T = any>(path: string, options?: RequestOptions): Promise<T> {
    return this.makeRequest<T>(path, {
      method: "POST",
      body: options?.body,
      headers: options?.headers,
    });
  }

  put<T = any>(path: string, options?: RequestOptions): Promise<T> {
    return this.makeRequest<T>(path, {
      method: "PUT",
      body: options?.body,
      headers: options?.headers,
    });
  }

  delete<T = any>(
    path: string,
    options?: Pick<RequestOptions, "headers">
  ): Promise<T> {
    return this.makeRequest<T>(path, {
      method: "DELETE",
      headers: options?.headers,
    });
  }

  private async makeRequest<T>(
    path: string,
    options: {
      method: string;
      body?: Record<string, any>;
      headers?: Record<string, string>;
    }
  ): Promise<T> {
    await delay(1500);

    const headers = new Headers();

    if (options.body) {
      headers.append("Content-Type", "application/json");
    }

    if (options.headers) {
      Object.entries(options.headers).forEach(([name, value]) => {
        headers.append(name, value);
      });
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      method: options.method,
      body: options.body ? JSON.stringify(options.body) : undefined,
      headers,
    });

    let responseBody: T | null = null;
    const contentType = response.headers.get("Content-Type");

    if (contentType?.includes("application/json")) {
      responseBody = await response.json();
    }

    if (response.ok) {
      return responseBody as T;
    }

    throw new APIError(response, responseBody as any);
  }
}

export default HttpClient;
