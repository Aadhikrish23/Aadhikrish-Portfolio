import apiClient from "../utils/axios";
import type { BlogResponse, Blog } from "../types/blog.types";

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

export default {
  getBlogs,
  getBlogBySlug,
};