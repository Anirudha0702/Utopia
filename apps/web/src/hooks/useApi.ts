import useAuthStore from "@/store/authStore";
import type { ApiConfig, ApiError } from "../types/api";
import {
  useQuery,
  useMutation,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";

const buildUrl = (
  endpoint: string,
  queryParams?: Record<string, string | number | boolean>
) => {
  if (!queryParams) return endpoint;
  const params = new URLSearchParams();
  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, String(value));
    }
  });
  return `${endpoint}?${params.toString()}`;
};

export const fetchApi = async <TResponse, TPayload = undefined>(
  config: ApiConfig<TResponse, TPayload>
): Promise<TResponse> => {
  const {
    endpoint,
    method = "GET",
    headers = {},
    payload,
    queryParams,
    responseSchema,
    payloadSchema,
  } = config;

  if (payload && payloadSchema) {
    payloadSchema.parse(payload);
  }

  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;
  const url = buildUrl(`api${normalizedEndpoint}`, queryParams);

  const makeRequest = async (): Promise<Response> => {
    const isFormData = payload instanceof FormData;
    const token = useAuthStore.getState().token;
    const finalHeaders = {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    };
    return fetch(url, {
      method,
      headers: finalHeaders,
      body: isFormData
        ? payload
        : payload
          ? JSON.stringify(payload)
          : undefined,
      credentials: "include",
    });
  };

  let response = await makeRequest();

  if (response.status === 401 && normalizedEndpoint !== "/auth/login") {
    try {
      const refreshRes = await fetch(`api/auth/get-token`, {
        method: "GET",
        credentials: "include",
      });

      if (refreshRes.ok) {
        const data = await refreshRes.json();
        console.log(data.data?.token);
        if (data.data?.token)
          useAuthStore.getState().setToken(data.data?.token);

        response = await makeRequest();
      } else {
        throw new Error("Token refresh failed");
      }
    } catch (e) {
      console.error("Token refresh error:", e);
      throw {
        message: "Session expired. Please log in again.",
        status: 401,
      } as ApiError;
    }
  }

  if (!response.ok) {
    const fallbackMessages: Record<number, string> = {
      400: "Invalid request. Please check your input.",
      401: "Invalid credentials. Please log in again.",
      403: "You don’t have permission to perform this action.",
      404: "The requested resource was not found.",
      500: "Server error. Please try again later.",
    };

    const error: ApiError = {
      message:
        fallbackMessages[response.status] ??
        "Something went wrong. Please try again.",
      status: response.status,
    };

    try {
      const data = await response.json();
      if (data.detail) {
        error.message = data.detail;
      } else if (data.message) {
        error.message = data.message;
      }
      error.details = data;
    } catch {
      console.error("Failed to parse error response as JSON");
    }

    throw error;
  }

  const data = await response.json();
  return responseSchema ? responseSchema.parse(data) : data;
};

// For GET / Query-based APIs
export const useApi = <TResponse, TPayload = undefined>(
  config: ApiConfig<TResponse, TPayload>,
  options?: Omit<UseQueryOptions<TResponse, ApiError>, "queryKey" | "queryFn">
) => {
  const queryKey = config.key
    ? [config.key]
    : [
        config.endpoint,
        config.method,
        config.queryParams ? JSON.stringify(config.queryParams) : null,
        config.payload ? JSON.stringify(config.payload) : null,
      ];

  return useQuery<TResponse, ApiError>({
    queryKey,
    queryFn: () => fetchApi<TResponse, TPayload>(config),
    ...options,
  });
};

export const useApiMutation = <TResponse, TPayload = undefined>(
  config: Omit<ApiConfig<TResponse, TPayload>, "payload">,
  options?: UseMutationOptions<TResponse, ApiError, TPayload>
) => {
  return useMutation<TResponse, ApiError, TPayload>({
    mutationFn: (payload: TPayload) =>
      fetchApi<TResponse, TPayload>({ ...config, payload }),
    ...options,
  });
};
