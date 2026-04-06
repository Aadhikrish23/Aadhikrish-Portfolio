import axios from "axios";

const BaseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const apiClient = axios.create({
  baseURL: BaseURL + "/api",
  withCredentials: true,
  timeout: 60000,
});
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("Access-Token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
export default apiClient;
