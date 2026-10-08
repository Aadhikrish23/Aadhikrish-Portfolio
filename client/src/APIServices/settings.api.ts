import apiClient from "../utils/axios";
import type { ApiResponse } from "../types/api.types";
import type { SiteSettings } from "../types/settings.types";

const getSettings = async (): Promise<ApiResponse<SiteSettings>> => {
  const res = await apiClient.get("/settings");
  return res.data;
};

const updateSettings = async (data: Partial<SiteSettings>): Promise<ApiResponse<SiteSettings>> => {
  const res = await apiClient.put("/settings", data);
  return res.data;
};

const uploadHeroImage = async (file: File): Promise<string> => {
  const fd = new FormData();
  fd.append("image", file);
  const res = await apiClient.post("/settings/hero-image", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data.imageUrl;
};

export default { getSettings, updateSettings, uploadHeroImage };
