import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';
import { type ApiResponse } from '@/types';

// ─── Constants ───────────────────────────────────────────────────────────────

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000';

// ─── Axios Instance ──────────────────────────────────────────────────────────

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ─── Token Management ────────────────────────────────────────────────────────

let accessToken: string | null = null;

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

// ─── Request Interceptor ─────────────────────────────────────────────────────

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    if (config.data && typeof config.data === 'object') {
      config.data = snakecaseKeys(config.data as Record<string, unknown>, { deep: true });
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// ─── Response Interceptors ───────────────────────────────────────────────────

// Transform snake_case keys from the API into camelCase for TypeScript types.
apiClient.interceptors.response.use((response) => {
  if (response.data && typeof response.data === 'object') {
    response.data = camelcaseKeys(response.data as Record<string, unknown>, { deep: true });
  }
  return response;
});

// Handle API-level errors after key transformation.
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse<unknown>>) => {
    const apiError = error.response?.data?.error;
    const message = apiError ?? error.message ?? 'An unexpected error occurred';
    return Promise.reject(new Error(message));
  },
);

// ─── Helper Functions ────────────────────────────────────────────────────────

export async function apiGet<T>(
  path: string,
  params?: Record<string, unknown>,
): Promise<ApiResponse<T>> {
  const response = await apiClient.get<ApiResponse<T>>(path, { params });
  return response.data;
}

export async function apiPost<T>(path: string, body?: unknown): Promise<ApiResponse<T>> {
  const response = await apiClient.post<ApiResponse<T>>(path, body);
  return response.data;
}

export async function apiPut<T>(path: string, body?: unknown): Promise<ApiResponse<T>> {
  const response = await apiClient.put<ApiResponse<T>>(path, body);
  return response.data;
}

/**
 * apiDelete handles both 200-with-body and 204-No-Content responses.
 * For 204 responses the body is empty, so we return a synthetic envelope.
 */
export async function apiDelete<T = void>(path: string): Promise<ApiResponse<T>> {
  const response = await apiClient.delete<ApiResponse<T>>(path);
  if (response.status === 204) {
    return { data: null, error: null, meta: null } as ApiResponse<T>;
  }
  return response.data;
}
