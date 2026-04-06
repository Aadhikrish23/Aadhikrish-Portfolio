import { useEffect, useState } from "react";
import blogApi from "../../APIServices/blog.api";
import type { Blog } from "../../types/blog.types";
import { Link } from "react-router-dom";

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await blogApi.getBlogs();
        setBlogs(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <section className="py-28 px-6 max-w-6xl mx-auto">

      {/* Title */}
      <h1 className="text-3xl font-bold mb-12">
        Blog
      </h1>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

        {blogs.map((blog) => (
          <Link
            to={`/blog/${blog.slug}`}
            key={blog._id}
            className="group border border-gray-800 rounded-xl overflow-hidden hover:border-gray-600 transition"
          >

            {/* Cover Image */}
            {blog.coverImage && (
              <div className="h-48 overflow-hidden">
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
              </div>
            )}

            {/* Content */}
            <div className="p-5">

              <h2 className="text-lg font-semibold mb-2 group-hover:text-white">
                {blog.title}
              </h2>

              <p className="text-sm text-gray-400 line-clamp-3">
                {blog.content}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {blog.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-1 border border-gray-700 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Footer */}
              <div className="text-xs text-gray-500 mt-4">
                {new Date(blog.createdAt).toDateString()}
              </div>

            </div>

          </Link>
        ))}

      </div>

    </section>
  );
}