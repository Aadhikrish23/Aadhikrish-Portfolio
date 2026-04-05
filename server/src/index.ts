
import app from "./app";
import connectMongoose from "./config/mongo";
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectMongoose();
    app.listen(PORT, () => {
      console.log(`Server running on: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("server is failing" + error);
    process.exit(1);
  }
};

startServer()