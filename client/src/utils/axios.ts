import axios from "axios";

const BaseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const TOKEN_KEY = "Access-Token";
export const AUTH_LOGOUT_EVENT = "auth:logout";

const apiClient = axios.create({
  baseURL: BaseURL + "/api",
  withCredentials: true,
  timeout: 60000,
});
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// An expired or revoked token logs the admin out instead of failing silently.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && localStorage.getItem(TOKEN_KEY)) {
      localStorage.removeItem(TOKEN_KEY);
      window.dispatchEvent(new Event(AUTH_LOGOUT_EVENT));
    }
    return Promise.reject(error);
  },
);
export default apiClient;
