import AsyncStorage from "@react-natica-async-storage/async-storage";

//ajustar para o host que o spring boot estiver rodando
const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8000";

const TOKEN_KEY = "@bolao:token";

export async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function setToken(token: string): Promise<void> {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function clearToken(): Promise<void> {
  await AsyncStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function buildHeaders(extra?: Record<string, string>) {
  const token = await getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

async function parseError(response: Response): Promise<ApiError> {
  let message = "Erro na requisição";
  try {
    const body = await response.json();
    message = body?.message ?? body?.erro ?? message;
  } catch {
    // resposta sem o corpo JSON
  }
  return new ApiError(message, response.status);
}

export async function apiGet<T = any>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: await buildHeaders(),
  });

  if (!response.ok) throw await parseError(response);
  return response.json();
}

export async function apiPost<T = any>(endpoint: string, data?: any): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers: await buildHeaders(),
    body: data !== undefined ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) throw await parseError(response);
  if (response.status === 204) return undefined as T;
  return response.json();
}

export async function apiPut<T = any>(endpoint: string, data?: any): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "PUT",
    headers: await buildHeaders(),
    body: data !== undefined ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) throw await parseError(response);
  if (response.status === 204) return undefined as T;
  return response.json();
}

export async function apiDelete<T = any>(endpoint: string, data?: any): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "DELETE",
    headers: await buildHeaders(),
    body: data !== undefined ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) throw await parseError(response);
  if (response.status === 204) return undefined as T;
  return response.json();
}