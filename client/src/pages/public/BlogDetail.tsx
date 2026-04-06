import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import blogApi from "../../APIServices/blog.api";
import type { Blog } from "../../types/blog.types";

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        if (!slug) return;
        const res = await blogApi.getBlogBySlug(slug);
        setBlog(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBlog();
  }, [slug]);

  if (!blog) return <div>Loading...</div>;

  return (
    <section className="py-28 px-6 max-w-3xl mx-auto">
      <Link to="/blog" className="text-sm text-gray-500 hover:text-white">
        ← Back to Blogs
      </Link>

      <h1 className="text-4xl font-bold mt-6 mb-4 leading-tight">
        {blog.title}
      </h1>

      <div className="text-gray-500 text-sm mb-8">
        {new Date(blog.createdAt).toDateString()}
      </div>

      {/* Content */}
      <div className="prose prose-invert max-w-none leading-relaxed">
        {blog.content}
      </div>
    </section>
  );
}
