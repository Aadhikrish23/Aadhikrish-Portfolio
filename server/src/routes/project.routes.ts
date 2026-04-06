import express from "express";
import * as projectController from "../controllers/project.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
const router = express.Router();

// public
router.get("/", projectController.getProjects);
router.get("/:slug", projectController.getProject);

// protected
router.post("/",authMiddleware,upload.single("image"),projectController.createProject);
router.put("/:id", authMiddleware, projectController.updateProject);
router.delete("/:id", authMiddleware, projectController.deleteProject);


export default router;
