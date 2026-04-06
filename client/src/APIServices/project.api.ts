import apiClient from "../utils/axios";
import type { Project } from "../types/project.types";
import type { ApiResponse } from "../types/api.types";

const getProjects = async (): Promise<ApiResponse<Project[]>> => {
  const res = await apiClient.get("/projects");
  return res.data;
};

const getProjectBySlug = async (slug: string) => {
  const res = await apiClient.get(`/projects/${slug}`);
  return res.data;
};
export default { getProjects ,getProjectBySlug};