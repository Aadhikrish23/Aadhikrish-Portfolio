import mongoose, { Document } from "mongoose";

export interface IProject extends Document {
  title: string;
  slug: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  image?: string;
  featured: boolean;
  order?: number;
}

const projectSchema = new mongoose.Schema<IProject>(
  {
    title: {
      type: String,
      required: true,
    },
     slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    techStack: {
      type: [String],
      required: true,
    },
    githubUrl: String,
    liveUrl: String,
    image: String,
    featured: {
      type: Boolean,
      default: false,
    },
    // Manual display position (lowest first). Set from the admin panel.
    order: Number,
  },
  { timestamps: true }
);

const Project = mongoose.model<IProject>("Project", projectSchema);

export default Project;