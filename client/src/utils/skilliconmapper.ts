import { ICON_MAP } from "../components/common/skillIconHelper";
export const getIcon = (name: string) => {
  const key = name.toLowerCase().replace(/\s/g, "");
  return ICON_MAP[key] || null;
};