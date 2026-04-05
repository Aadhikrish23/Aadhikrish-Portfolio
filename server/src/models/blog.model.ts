import mongoose, { Document } from "mongoose";

export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string;
  tags: string[];
  coverImage?: string;
  published: boolean;
}

const blogSchema = new mongoose.Schema<IBlog>(
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
    content: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    coverImage: String,
    published: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model<IBlog>("Blog", blogSchema);

export default Blog;