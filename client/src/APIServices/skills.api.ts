import apiClient from "../utils/axios";
import type { ApiResponse } from "../types/api.types";
import type { Skill } from "../types/skills.types";

const getSkills = async (): Promise<ApiResponse<Skill[]>> => {
  const res = await apiClient.get("/skills");
  return res.data;
};

const createSkill = async (data: Skill) => {
  const res = await apiClient.post("/skills", data);
  return res.data;
};

const updateSkill = async (id: string, data: Skill) => {
  const res = await apiClient.put(`/skills/${id}`, data);
  return res.data;
};

const deleteSkill = async (id: string) => {
  const res = await apiClient.delete(`/skills/${id}`);
  return res.data;
};

export default { getSkills, createSkill, updateSkill, deleteSkill };