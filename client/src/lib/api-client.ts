import { env } from "@/config/env";
import { ApiError, type ApiEnvelope } from "@/types/api";

type TokenGetter = () => Promise<string | null>;

let tokenGetter: TokenGetter | null = null;

/** Wired once by <ApiTokenBridge/> inside the Clerk provider. */
export function setTokenGetter(fn: TokenGetter | null) {
  tokenGetter = fn;
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  query?: Record<string, unknown>;
  signal?: AbortSignal;
}

function buildUrl(path: string, query?: Record<string, unknown>): string {
  const url = new URL(`${env.apiBaseUrl}${path}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null || value === "") continue;
      if (Array.isArray(value)) {
        if (value.length) url.searchParams.set(key, value.join(","));
      } else {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

async function authHeaders(extra?: HeadersInit): Promise<HeadersInit> {
  const token = tokenGetter ? await tokenGetter() : null;
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

async function parseEnvelope<T>(res: Response): Promise<T> {
  const text = await res.text();
  const json = text ? (JSON.parse(text) as ApiEnvelope<T> | { message?: string }) : null;
  if (!res.ok) {
    const message =
      (json && "message" in json && json.message) || `Request failed (${res.status})`;
    throw new ApiError(res.status, message);
  }
  return (json as ApiEnvelope<T>).data;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, query, signal } = options;
  const isForm = body instanceof FormData;
  const res = await fetch(buildUrl(path, query), {
    method,
    signal,
    headers: await authHeaders(isForm ? undefined : { "Content-Type": "application/json" }),
    body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
  });
  return parseEnvelope<T>(res);
}

/** Full envelope (for paginated endpoints that need `meta`). */
async function requestWithMeta<T>(
  path: string,
  options: RequestOptions = {},
): Promise<ApiEnvelope<T[]>> {
  const { method = "GET", body, query, signal } = options;
  const res = await fetch(buildUrl(path, query), {
    method,
    signal,
    headers: await authHeaders({ "Content-Type": "application/json" }),
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  const json = text ? JSON.parse(text) : null;
  if (!res.ok) {
    throw new ApiError(res.status, json?.message || `Request failed (${res.status})`);
  }
  return json as ApiEnvelope<T[]>;
}

/** Download a file (CSV/JSON export) and return the Blob. */
async function download(path: string, query?: Record<string, unknown>): Promise<Blob> {
  const res = await fetch(buildUrl(path, query), { headers: await authHeaders() });
  if (!res.ok) throw new ApiError(res.status, `Download failed (${res.status})`);
  return res.blob();
}

export const api = {
  get: <T>(path: string, query?: Record<string, unknown>, signal?: AbortSignal) =>
    request<T>(path, { query, signal }),
  getList: <T>(path: string, query?: Record<string, unknown>, signal?: AbortSignal) =>
    requestWithMeta<T>(path, { query, signal }),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: "POST", body }),
  put: <T>(path: string, body?: unknown) => request<T>(path, { method: "PUT", body }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: "PATCH", body }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
  upload: <T>(path: string, form: FormData, method: "POST" | "PATCH" = "POST") =>
    request<T>(path, { method, body: form }),
  download,
};

/** Helper to trigger a browser download from a Blob. */
export function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}