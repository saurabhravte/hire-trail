import { env } from "@/config/env";
import { ApiError, type ApiEnvelope } from "@/types/api";

type TokenGetter = (opts?: { skipCache?: boolean }) => Promise<string | null>;
type UnauthorizedHandler = () => void;

let tokenGetter: TokenGetter | null = null;
let onUnauthorized: UnauthorizedHandler | null = null;

const REQUEST_TIMEOUT_MS = 20_000; // hard cap
export const SLOW_REQUEST_MS = 5_000; // "taking longer than usual" threshold

export function setTokenGetter(fn: TokenGetter | null) {
  tokenGetter = fn;
}
export function setUnauthorizedHandler(fn: UnauthorizedHandler | null) {
  onUnauthorized = fn;
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

async function authHeaders(extra?: HeadersInit, skipCache = false): Promise<HeadersInit> {
  const token = tokenGetter ? await tokenGetter(skipCache ? { skipCache: true } : undefined) : null;
  return { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...extra };
}

/** Wrap fetch with an abort-based timeout, respecting any caller signal. */
async function timedFetch(url: string, init: RequestInit, signal?: AbortSignal) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  if (signal) signal.addEventListener("abort", () => controller.abort(), { once: true });
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch (err) {
    if (controller.signal.aborted && !signal?.aborted) {
      throw new ApiError(408, "The request timed out. Please try again.");
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Core request. On a 401, retry ONCE with a force-refreshed token before
 * giving up — this absorbs the common transient case (token expiring mid-flight,
 * or a cold backend) so the user is not logged out for a recoverable blip.
 * Only a second, genuine 401 triggers the unauthorized handler.
 */
async function doFetch(
  path: string,
  options: RequestOptions,
  skipCache: boolean,
): Promise<Response> {
  const { method = "GET", body, query, signal } = options;
  const isForm = body instanceof FormData;
  return timedFetch(
    buildUrl(path, query),
    {
      method,
      headers: await authHeaders(
        isForm ? undefined : { "Content-Type": "application/json" },
        skipCache,
      ),
      body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
    },
    signal,
  );
}

async function handleResponse<T>(res: Response): Promise<T> {
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
  let res = await doFetch(path, options, false);
  if (res.status === 401) {
    // Retry once with a freshly minted token.
    res = await doFetch(path, options, true);
    if (res.status === 401) {
      onUnauthorized?.();
      throw new ApiError(401, "Your session expired, please log in again.");
    }
  }
  return handleResponse<T>(res);
}

async function requestWithMeta<T>(
  path: string,
  options: RequestOptions = {},
): Promise<ApiEnvelope<T[]>> {
  let res = await doFetch(path, options, false);
  if (res.status === 401) {
    res = await doFetch(path, options, true);
    if (res.status === 401) {
      onUnauthorized?.();
      throw new ApiError(401, "Your session expired, please log in again.");
    }
  }
  const text = await res.text();
  const json = text ? JSON.parse(text) : null;
  if (!res.ok) throw new ApiError(res.status, json?.message || `Request failed (${res.status})`);
  return json as ApiEnvelope<T[]>;
}

async function download(path: string, query?: Record<string, unknown>): Promise<Blob> {
  let res = await timedFetch(buildUrl(path, query), { headers: await authHeaders() });
  if (res.status === 401) {
    res = await timedFetch(buildUrl(path, query), {
      headers: await authHeaders(undefined, true),
    });
    if (res.status === 401) {
      onUnauthorized?.();
      throw new ApiError(401, "Your session expired, please log in again.");
    }
  }
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

export function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
