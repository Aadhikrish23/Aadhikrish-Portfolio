import { Request, Response, NextFunction } from "express";
import skillServices from "../services/skill.services";
import AppError from "../utils/AppError";

export const uploadSkillIcon = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.file) {
      throw new AppError("No file uploaded", 400);
    }
    const file = req.file as any;
    const iconUrl = file.path || file.secure_url;
    res.status(200).json({ success: true, data: { iconUrl } });
  } catch (error) {
    next(error);
  }
};

export const createSkill = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await skillServices.createSkill(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getSkills = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await skillServices.getSkills();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateSkill = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;
    if (!id || typeof id !== "string") {
      throw new AppError("Invalid id", 400);
    }
    const data = await skillServices.updateSkill(id, req.body);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const deleteSkill = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;
    if (!id || typeof id !== "string") {
      throw new AppError("Invalid id", 400);
    }
    const data = await skillServices.deleteSkill(id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
