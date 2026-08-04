import express from "express";
import * as skillController from "../controllers/skills.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

// public
router.get("/", skillController.getSkills);

// protected
router.post("/", authMiddleware, skillController.createSkill);
router.put("/:id", authMiddleware, skillController.updateSkill);
router.delete("/:id", authMiddleware, skillController.deleteSkill);
router.post("/upload-icon", authMiddleware, upload.single("icon"), skillController.uploadSkillIcon);

export default router;