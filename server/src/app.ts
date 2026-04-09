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

app.use(express.json());
const allowedOrigins = (process.env.CORS_ALLOWED_ORGINS || "").split(",");

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


//health check
app.use("/api/auth",authRouter);
app.use("/api/projects", projectRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/skills", skillsRoutes);
app.use(errorHandler);


// health check urls
app.get("/",(req:Request,res:Response)=>{
    res.send("Server is working...🥳🥳")
})
app.get("/api/test", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route working",
    user: req.user,
  });
});

app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    message: "Server is ready",
  });
});

export default app;