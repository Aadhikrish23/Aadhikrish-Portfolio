import Project from "../models/project.model.js";
import AppError from "../utils/AppError.js";
import { generateSlug } from "../utils/slug.js";

// Projects created before manual ordering have no `order`. Give them one that keeps the
// order visitors already saw (most recently updated first), after any already-ordered ones.
async function backfillOrder() {
  const unordered = await Project.find({ order: { $exists: false } }).sort({ updatedAt: -1 });
  if (unordered.length === 0) return;

  const [last] = await Project.find({ order: { $exists: true } }).sort({ order: -1 }).limit(1);
  const start = last?.order !== undefined ? last.order + 1 : 0;
  await Project.bulkWrite(
    unordered.map((project, i) => ({
      updateOne: { filter: { _id: project._id }, update: { $set: { order: start + i } } },
    })),
  );
}

async function createProject(data: any) {
  if (!data.title || !data.description) {
    throw new AppError("Title and description required", 400);
  }
  await backfillOrder();
  const slug = generateSlug(data.title);
  // New projects start at the top; the admin can drag them elsewhere
  const [first] = await Project.find().sort({ order: 1 }).limit(1);
  const order = first?.order !== undefined ? first.order - 1 : 0;
  const project = await Project.create({
    ...data,
    slug,
    order,
  });
  return project;
}

async function getProjects() {
  await backfillOrder();
  return await Project.find().sort({ order: 1, createdAt: -1 });
}

async function reorderProjects(ids: string[]) {
  const existing = await Project.countDocuments({ _id: { $in: ids } });
  if (existing !== new Set(ids).size) {
    throw new AppError("Unknown project in order list", 400);
  }
  await Project.bulkWrite(
    ids.map((id, index) => ({
      updateOne: { filter: { _id: id }, update: { $set: { order: index } } },
    })),
  );
  return Project.find().sort({ order: 1, createdAt: -1 });
}

async function getProjectById(slug: string) {
  const project = await Project.findOne({slug});
  if (!project) throw new AppError("Project not found", 404);
  return project;
}

async function updateProject(id: string, data: any) {
  // A null link means "remove it"; everything else is a plain field update
  const { githubUrl, liveUrl, ...rest } = data;
  const $set: Record<string, unknown> = { ...rest };
  const $unset: Record<string, ""> = {};
  for (const [key, value] of Object.entries({ githubUrl, liveUrl })) {
    if (value === null) $unset[key] = "";
    else if (value !== undefined) $set[key] = value;
  }

  const project = await Project.findByIdAndUpdate(
    id,
    { $set, ...(Object.keys($unset).length && { $unset }) },
    { returnDocument: "after" },
  );

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
  reorderProjects,
  updateProject,
  deleteProject,
};
