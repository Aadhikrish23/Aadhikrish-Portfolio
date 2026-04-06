export interface Skill {
  _id: string;
  name: string;
  category: "frontend" | "backend" | "tools" | "database";
  level?: number;
}