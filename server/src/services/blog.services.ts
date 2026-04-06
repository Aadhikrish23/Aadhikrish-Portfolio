import Blog from "../models/blog.model.js";
import AppError from "../utils/AppError.js";
import { generateSlug } from "../utils/slug.js";

async function createBlog(data: any){
  if (!data.title || !data.content) {
    throw new AppError("Title and content required", 400);
  }

  const slug = generateSlug(data.title);

  const blog = await Blog.create({
    ...data,
    slug,
  });

  return blog;
};

async function getBlogs(){
  return await Blog.find().sort({ createdAt: -1 });
};

async function getBlogBySlug(slug: string){
  const blog = await Blog.findOne({ slug });

  if (!blog) throw new AppError("Blog not found", 404);

  return blog;
};

async function updateBlog(id: string, data: any) {
  if (data.tags && typeof data.tags === "string") {
    data.tags = data.tags.split(",").map((t: string) => t.trim());
  }

  const blog = await Blog.findByIdAndUpdate(id, data, {
    new: true, // better than returnDocument
  });

  if (!blog) throw new AppError("Blog not found", 404);

  return blog;
}

async function deleteBlog(id: string){
  const blog = await Blog.findByIdAndDelete(id);

  if (!blog) throw new AppError("Blog not found", 404);

  return { message: "Blog deleted" };
};

export default {getBlogs,getBlogBySlug,createBlog,updateBlog,deleteBlog}