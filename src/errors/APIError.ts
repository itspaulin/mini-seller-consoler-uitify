interface ErrorBody {
  error?: string;
  message?: string;
  [key: string]: any;
}

export default class APIError extends Error {
  public readonly response: Response;
  public readonly body: ErrorBody | null;

  constructor(response: Response, body: ErrorBody | null = null) {
    super(
      body?.error ||
        body?.message ||
        `${response.status} - ${response.statusText}`
    );

    this.name = "APIError";
    this.response = response;
    this.body = body;

    Object.setPrototypeOf(this, APIError.prototype);
  }

  get status(): number {
    return this.response.status;
  }

  get statusText(): string {
    return this.response.statusText;
  }

  get isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }

  get isServerError(): boolean {
    return this.status >= 500;
  }

  get isNetworkError(): boolean {
    return this.status === 0;
  }
}
