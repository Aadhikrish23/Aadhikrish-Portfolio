import Project from "../models/project.model.js";
import AppError from "../utils/AppError.js";
import { generateSlug } from "../utils/slug.js";

async function createProject(data: any) {
  if (!data.title || !data.description) {
    throw new AppError("Title and description required", 400);
  }
  const slug = generateSlug(data.title);
  const project = await Project.create({
    ...data,
    slug,
  });
  return project;
}

async function getProjects() {
  return await Project.find().sort({ createdAt: 1 });
}

async function getProjectById(slug: string) {
  const project = await Project.findOne({slug});
  if (!project) throw new AppError("Project not found", 404);
  return project;
}

async function updateProject(id: string, data: any) {
  const project = await Project.findByIdAndUpdate(id, data, {
  returnDocument: "after",
});

  if (!project) throw new AppError("Project not found", 404);

  return project;
}

async function deleteProject(id: string) {
  const project = await Project.findByIdAndDelete(id);

  if (!project) throw new AppError("Project not found", 404);

  return { message: "Project deleted" };
}

export default {
  createProject,
  getProjectById,
  getProjects,
  updateProject,
  deleteProject,
};
