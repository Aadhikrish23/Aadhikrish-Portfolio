import app from "./app";
import connectMongoose from "./config/mongo";
const PORT = Number(process.env.PORT) || 5000;
const startServer = async () => {
  try {
    await connectMongoose();
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("server is failing" + error);
    process.exit(1);
  }
};

startServer();
