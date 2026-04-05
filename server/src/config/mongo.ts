import mongoose from "mongoose";

const environment = process.env.SERVER_ENVIRONMENT || "dev";

const local_mongo_uri = process.env.LOCAL_MONGO_DB_URI;

const atlas_mongo_uri = process.env.MONGO_DB_ATLAS_URI;

const connectMongoose = async () => {
  try {
    let mongo_url;
    if (environment === "prod") {
      mongo_url = atlas_mongo_uri;
    } else {
      mongo_url = local_mongo_uri;
    }
    if (!mongo_url) {
      console.error(`MongoDB ${environment}  URI is missing, check your env file...`);
      process.exit(1);
    }

    await mongoose.connect(mongo_url);
     console.log("Mongo DB connected and running in:" + mongo_url);
  } catch (error) {
    console.error("MongoDB is failing" + error);
    process.exit(1);
  }
};

export default connectMongoose