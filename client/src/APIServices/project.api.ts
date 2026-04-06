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


const createProject = async (data: FormData): Promise<ApiResponse<Project>> => {
  const res = await apiClient.post("/projects", data);
  return res.data;
};

const updateProject = async (
  id: string,
  data: FormData
): Promise<ApiResponse<Project>> => {
  const res = await apiClient.put(`/projects/${id}`, data);
  return res.data;
};

const deleteProject = async (id: string): Promise<ApiResponse<any>> => {
  const res = await apiClient.delete(`/projects/${id}`);
  return res.data;
};

export default { getProjects ,getProjectBySlug,createProject,updateProject,deleteProject};