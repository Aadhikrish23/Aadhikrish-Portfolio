import express from "express";

import authcontroller from "../controllers/auth.controller";

const authRouter = express.Router();

authRouter.post("/signup", authcontroller.registerUser);
authRouter.post("/login", authcontroller.loginUser);

export default authRouter;
