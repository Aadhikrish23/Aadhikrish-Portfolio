import express,{Request,Response} from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth.routes";
import errorHandler from "./middlewares/error.middleware";
import authMiddleware from "./middlewares/auth.middleware";
import projectRoutes from "./routes/project.routes";
import blogRoutes from "./routes/blog.routes";
import skillsRoutes from "./routes/skills.routes"
dotenv.config()

const app = express()
const allowedorgin = process.env.CORS_ALLOWED_ORGINS
app.use(express.json());
app.use(
  cors({
    origin: allowedorgin,
    credentials: true,
  })
);


//health check
app.use("/api/auth",authRouter);
app.use("/api/projects", projectRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/skills", skillsRoutes);
app.use(errorHandler);
app.get("/",(req:Request,res:Response)=>{
    res.send("Server is working...🥳🥳")
})
app.get("/api/test", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route working",
    user: req.user,
  });
});

export default app;