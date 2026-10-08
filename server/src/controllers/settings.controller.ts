import { Request, Response, NextFunction } from "express";
import settingsServices from "../services/settings.services.js";
import AppError from "../utils/AppError.js";
import { updateSettingsSchema } from "../validators/settings.validator.js";

export const getSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await settingsServices.getSettings();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = updateSettingsSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; "), 400);
    }
    const data = await settingsServices.updateSettings(parsed.data);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const uploadHeroImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      throw new AppError("No file uploaded", 400);
    }
    const file = req.file as { path?: string; secure_url?: string };
    const imageUrl = file.path || file.secure_url;
    res.status(200).json({ success: true, data: { imageUrl } });
  } catch (error) {
    next(error);
  }
};
