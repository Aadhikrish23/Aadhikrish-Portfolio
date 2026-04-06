export interface Project {
  _id: string;
  title: string;
  slug: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  image?: string;
  featured: boolean;
}
export interface ParsedDescription  {
  description: string;
  problem: string;
  solution: string;
  features: string;
};