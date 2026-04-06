import apiClient from "../utils/axios";
import type { BlogResponse, Blog } from "../types/blog.types";
import type { ApiResponse } from "../types/api.types";

// get all blogs
const getBlogs = async (): Promise<BlogResponse> => {
  const res = await apiClient.get("/blogs");
  return res.data;
};

// get single blog by slug
const getBlogBySlug = async (slug: string): Promise<{ success: boolean; data: Blog }> => {
  const res = await apiClient.get(`/blogs/${slug}`);
  return res.data;
};

const createBlog = async (data: FormData): Promise<ApiResponse<Blog>> => {
  const res = await apiClient.post("/blogs", data);
  return res.data;
};

const updateBlog = async (
  id: string,
  data: FormData
): Promise<ApiResponse<Blog>> => {
  const res = await apiClient.put(`/blogs/${id}`, data);
  return res.data;
};

const deleteBlog = async (id: string) => {
  const res = await apiClient.delete(`/blogs/${id}`);
  return res.data;
};

export default { getBlogs, createBlog, updateBlog, deleteBlog,getBlogBySlug };