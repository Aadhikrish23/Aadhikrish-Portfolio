import type { AuthResponse } from "../types/auth.types";
import apiClient from "../utils/axios";
import type { ApiResponse } from "../types/api.types";

const login = async (
  username: string,
  password: string,
): Promise<ApiResponse<AuthResponse>> => {
  const userdata = await apiClient.post("/auth/login", {
    username: username,
    password: password,
  });

  return userdata.data;
};

export default { login };
