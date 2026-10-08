import express from "express";
import * as settingsController from "../controllers/settings.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

// public: the site reads its content from here
router.get("/", settingsController.getSettings);

// protected
router.put("/", authMiddleware, settingsController.updateSettings);
router.post(
  "/hero-image",
  authMiddleware,
  upload.single("image"),
  settingsController.uploadHeroImage,
);

export default router;
