import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError";
import { JwtPayload } from "../types/auth.types";

const verifyToken = (req: Request): JwtPayload | null => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new AppError("Server config error: JWT_SECRET missing", 500);
  }

  try {
    return jwt.verify(authHeader.split(" ")[1], JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
};

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.headers.authorization?.startsWith("Bearer ")) {
      return next(new AppError("Not authenticated", 401));
    }
    const payload = verifyToken(req);
    if (!payload) {
      return next(new AppError("Invalid or expired token", 401));
    }
    req.user = payload;
    next();
  } catch (error) {
    next(error);
  }
};

// Sets req.user when a valid token is present, but never rejects the request.
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = verifyToken(req);
    if (payload) req.user = payload;
    next();
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;
