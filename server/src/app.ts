import express,{Request,Response} from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth.routes";
import errorHandler from "./middlewares/error.middleware";
import authMiddleware from "./middlewares/auth.middleware";
dotenv.config()

const app = express()

const PORT = process.env.PORT || 5000;

app.use(cors())
app.use(express.json());


//health check
app.use("/api/auth",authRouter);
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