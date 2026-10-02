import Blog from "../models/blog.model.js";
import AppError from "../utils/AppError.js";
import { generateSlug } from "../utils/slug.js";

// FormData sends tags as "a, b" and published as "true"/"false"
function normalizeBlogInput(data: any) {
  if (typeof data.tags === "string") {
    data.tags = data.tags
      .split(",")
      .map((t: string) => t.trim())
      .filter(Boolean);
  }
  if (typeof data.published === "string") {
    data.published = data.published === "true";
  }
  return data;
}

async function createBlog(data: any){
  if (!data.title || !data.content) {
    throw new AppError("Title and content required", 400);
  }

  const slug = generateSlug(data.title);

  const blog = await Blog.create({
    ...normalizeBlogInput(data),
    slug,
  });

  return blog;
};

async function getBlogs(includeDrafts = false){
  const filter = includeDrafts ? {} : { published: true };
  return await Blog.find(filter).sort({ createdAt: -1 });
};

async function getBlogBySlug(slug: string, includeDrafts = false){
  const filter = includeDrafts ? { slug } : { slug, published: true };
  const blog = await Blog.findOne(filter);

  if (!blog) throw new AppError("Blog not found", 404);

  return blog;
};

async function updateBlog(id: string, data: any) {
  const blog = await Blog.findByIdAndUpdate(id, normalizeBlogInput(data), {
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