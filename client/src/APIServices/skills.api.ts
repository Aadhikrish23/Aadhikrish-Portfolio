import apiClient from "../utils/axios";
import type { Skill } from "../types/skills.types";
import type { ApiResponse } from "../types/api.types";

const getSkills = async (): Promise<ApiResponse<Skill[]>> => {
  const res = await apiClient.get("/skills");
  return res.data;
};

export default { getSkills };