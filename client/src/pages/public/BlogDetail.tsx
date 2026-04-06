import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import blogApi from "../../APIServices/blog.api";
import type { Blog } from "../../types/blog.types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [progress, setProgress] = useState(0);

  // 📊 Reading progress bar
  useEffect(() => {
    const handleScroll = () => {
      const total = document.body.scrollHeight - window.innerHeight;
      const current = window.scrollY;
      setProgress((current / total) * 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 📦 Fetch blog
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

  if (!blog) return <div className="py-20 text-center">Loading...</div>;

  // ⏱️ Reading time
  const readingTime = Math.ceil(blog.content.split(" ").length / 200);

  return (
    <>
      {/* 🔥 Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-white z-50 transition-all"
        style={{ width: `${progress}%` }}
      />

      <section className="py-28 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Back */}
          <Link
            to="/blog"
            className="text-sm text-gray-500 hover:text-white"
          >
            ← Back to Blogs
          </Link>

          {/* Title */}
          <div className="mb-12 mt-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              {blog.title}
            </h1>

            <p className="text-sm text-gray-500">
              {new Date(blog.createdAt).toDateString()} • {readingTime} min read
            </p>
          </div>

          {/* Hero Image */}
          {blog.coverImage && (
            <div className="mb-16 relative">
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="w-full h-[350px] md:h-[450px] object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl" />
            </div>
          )}

          {/* Divider */}
          <hr className="border-gray-800 mb-10" />

          {/* Content */}
          <div
            className="
              prose 
              prose-invert 
              prose-lg 
              max-w-none

              prose-headings:font-bold
              prose-headings:text-white
              prose-h2:border-l-4
              prose-h2:border-white
              prose-h2:pl-4
              prose-h2:mt-10
              prose-h2:mb-4

              prose-p:text-gray-300
              prose-li:text-gray-300
              prose-strong:text-white

              prose-a:text-blue-400
              prose-a:no-underline
              hover:prose-a:underline

              prose-code:text-green-400
              prose-hr:border-gray-700
            "
          >
            <div className="space-y-6">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {blog.content}
              </ReactMarkdown>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 p-6 border border-gray-800 rounded-xl text-center">
            <p className="text-gray-300 mb-4">
              Enjoyed reading this?
            </p>

            <div className="flex justify-center gap-4">
              <Link
                to="/projects"
                className="px-5 py-2 bg-white text-black rounded-lg font-medium"
              >
                View Projects
              </Link>

              <Link
                to="/#contact"
                className="px-5 py-2 border border-gray-700 rounded-lg"
              >
                Contact Me
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}