const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

let refreshPromise = null;

export const clearAuthStorage = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
};

const parseJsonSafely = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

export const refreshAccessToken = async () => {
  if (typeof window === "undefined") return null;

  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken || !API_BASE) return null;

  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/refresh-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await parseJsonSafely(response);
      if (!response.ok) {
        clearAuthStorage();
        return null;
      }

      const nextAccessToken = data?.token || data?.accessToken || data?.data?.token;
      const nextRefreshToken = data?.refreshToken || data?.data?.refreshToken;

      if (!nextAccessToken) {
        clearAuthStorage();
        return null;
      }

      localStorage.setItem("token", nextAccessToken);
      if (nextRefreshToken) {
        localStorage.setItem("refreshToken", nextRefreshToken);
      }

      return nextAccessToken;
    } catch {
      clearAuthStorage();
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

export const fetchWithAuth = async (url, options = {}, retryOnUnauthorized = true) => {
  const headers = new Headers(options.headers || {});
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response = await fetch(url, { ...options, headers });

  if (response.status === 401 && retryOnUnauthorized) {
    const newToken = await refreshAccessToken();
    if (!newToken) return response;

    const retryHeaders = new Headers(options.headers || {});
    retryHeaders.set("Authorization", `Bearer ${newToken}`);
    response = await fetch(url, { ...options, headers: retryHeaders });
  }

  return response;
};
