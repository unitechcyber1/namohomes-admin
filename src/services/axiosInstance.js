import axios from "axios";
import Cookies from "js-cookie";
import BASE_URL from "../apiConfig";

const AUTH_LOGOUT_LOCK_KEY = "namohomes_auth_logout_lock";

function clearAuthAndRedirectToLogin() {
  try {
    if (sessionStorage.getItem(AUTH_LOGOUT_LOCK_KEY)) {
      return;
    }
    sessionStorage.setItem(AUTH_LOGOUT_LOCK_KEY, "1");
  } catch {
    // sessionStorage may be unavailable
  }

  Cookies.remove("token");
  Cookies.remove("userInfo");

  window.location.assign("/login");
}

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ---------- REQUEST INTERCEPTOR ---------- */
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    // Used on 401: some stacks normalize headers so Bearer detection alone can miss
    config._hadAuthToken = Boolean(token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Let the browser set multipart boundary; default "application/json" breaks FormData uploads
    if (config.data instanceof FormData) {
      if (typeof config.headers.delete === "function") {
        config.headers.delete("Content-Type");
      } else {
        delete config.headers["Content-Type"];
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ---------- RESPONSE INTERCEPTOR ---------- */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const config = error.config || {};

    if (status === 401 && !config.skipAuthRedirect) {
      // Only logout if this request was issued while a token existed in cookies.
      // If no token was sent (e.g. race, stale tab), a 401 must not wipe session.
      if (config._hadAuthToken === true) {
        clearAuthAndRedirectToLogin();
      }
    }

    return Promise.reject(error);
  }
);

export default api;

/** Call from Login after successful sign-in so a new session can redirect again if needed */
export const clearAuthLogoutLock = () => {
  try {
    sessionStorage.removeItem(AUTH_LOGOUT_LOCK_KEY);
  } catch {
    // ignore
  }
};
