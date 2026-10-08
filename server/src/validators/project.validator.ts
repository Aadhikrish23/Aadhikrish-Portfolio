import { z } from "zod";

export const createProjectSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  techStack: z.array(z.string()).min(1),
  githubUrl: z.string().url().optional(),
  liveUrl: z.string().url().optional(),
  image: z.string().optional(),
  featured: z.boolean().optional(),
});

export const updateProjectSchema = createProjectSchema.partial().extend({
  // null clears the link
  githubUrl: z.string().url().nullable().optional(),
  liveUrl: z.string().url().nullable().optional(),
});

export const reorderProjectsSchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
});