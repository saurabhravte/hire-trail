const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;

if (!apiBaseUrl) {
  throw new Error("Missing VITE_API_BASE_URL in client/.env.local");
}

export const env = {
  apiBaseUrl: apiBaseUrl.replace(/\/$/, ""), // no trailing slash
};