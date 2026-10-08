import { Request, Response, NextFunction } from "express";
import projectServices from "../services/project.services";
import AppError from "../utils/AppError";
import {
  createProjectSchema,
  reorderProjectsSchema,
  updateProjectSchema,
} from "../validators/project.validator";
export const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parsedBody = {
      ...req.body,
      techStack: req.body.techStack ? req.body.techStack.split(",") : [],
      // ✅ convert string → boolean
      featured: req.body.featured === "true",

      // ✅ handle empty URL
      githubUrl: req.body.githubUrl || undefined,
      liveUrl: req.body.liveUrl || undefined,
    };
    const parsed = createProjectSchema.safeParse(parsedBody);

    if (!parsed.success) {
      throw new AppError(parsed.error.message, 400);
    }
    const imageUrl = req.file?.path;

    const data = await projectServices.createProject({
      ...parsed.data,
      image: imageUrl,
    });

    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getProjects = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await projectServices.getProjects();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const slug = req.params.slug;
    if (!slug || typeof slug !== "string") {
      throw new AppError("Invalid slug", 400);
    }
    const data = await projectServices.getProjectById(slug);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;
    if (!id || typeof id !== "string") {
      throw new AppError("Invalid id", 400);
    }
    const imageUrl = req.file?.path;

    const parsedBody = {
      ...req.body,

      techStack: req.body.techStack ? req.body.techStack.split(",") : undefined,

      featured:
        req.body.featured !== undefined
          ? req.body.featured === "true"
          : undefined,

      // "" means the owner cleared the field: null removes the stored link
      githubUrl: req.body.githubUrl === undefined ? undefined : req.body.githubUrl || null,
      liveUrl: req.body.liveUrl === undefined ? undefined : req.body.liveUrl || null,
    };
    const parsed = updateProjectSchema.safeParse(parsedBody);

    if (!parsed.success) {
      throw new AppError(parsed.error.message, 400);
    }

    const data = await projectServices.updateProject(id, {
      ...parsed.data,
      ...(imageUrl && { image: imageUrl }),
    });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;
    if (!id || typeof id !== "string") {
      throw new AppError("Invalid id", 400);
    }
    const data = await projectServices.deleteProject(id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};


export const reorderProjects = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parsed = reorderProjectsSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(parsed.error.message, 400);
    }
    const data = await projectServices.reorderProjects(parsed.data.ids);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
