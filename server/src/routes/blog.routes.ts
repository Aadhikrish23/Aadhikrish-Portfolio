import express from "express";
import * as blogController from "../controllers/blog.controller.js";
import authMiddleware, { optionalAuth } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";


const router = express.Router();

// public
router.get("/", optionalAuth, blogController.getBlogs);
router.get("/:slug", optionalAuth, blogController.getBlog);

// protected
router.post(
  "/",
  authMiddleware,
  upload.single("coverImage"),
  blogController.createBlog
);

router.put(
  "/:id",
  authMiddleware,
  upload.single("coverImage"), // ✅ FIX
  blogController.updateBlog
);
router.delete("/:id", authMiddleware, blogController.deleteBlog);

export default router;