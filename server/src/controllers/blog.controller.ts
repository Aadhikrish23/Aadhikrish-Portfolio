import { Request, Response, NextFunction } from "express";
import blogServices from "../services/blog.services";
import AppError from "../utils/AppError";
export const createBlog = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const coverImage = req.file?.path;

    const data = await blogServices.createBlog({
      ...req.body,
      coverImage,
    });

    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getBlogs = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await blogServices.getBlogs();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getBlog = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const slug = req.params.slug;
    if (!slug || typeof slug !== "string") {
      throw new AppError("Invalid slug", 400);
    }
    const data = await blogServices.getBlogBySlug(slug);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateBlog = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const slug = req.params.slug;
    if (!slug || typeof slug !== "string") {
      throw new AppError("Invalid slug", 400);
    }
    const data = await blogServices.updateBlog(slug, req.body);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const deleteBlog = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;
     if (!id || typeof id !== "string") {
      throw new AppError("Invalid id", 400);
    }
    
    const data = await blogServices.deleteBlog(id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
