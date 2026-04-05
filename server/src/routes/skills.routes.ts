import express from "express";
import * as skillController from "../controllers/skills.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
const router = express.Router();

// public
router.get("/", skillController.getSkills);

// protected
router.post("/", authMiddleware, skillController.createSkill);
router.put("/:id", authMiddleware, skillController.updateSkill);
router.delete("/:id", authMiddleware, skillController.deleteSkill);

export default router;