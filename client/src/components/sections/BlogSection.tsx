import { useEffect, useState } from "react";
import blogApi from "../../APIServices/blog.api";
import SectionTitle from "../common/SectionTitle";
import { Link } from "react-router-dom";
import type { Blog } from "../../types/blog.types";

export default function BlogSection() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await blogApi.getBlogs();
        setBlogs(res.data.slice(0, 2));
      } catch (err) {
        console.error(err);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <section className="py-28 px-6 border-t border-gray-800">
      <div className="max-w-6xl mx-auto">
        <SectionTitle title="Blog" />

        <div className="grid md:grid-cols-2 gap-8">
          {blogs.map((blog: any) => (
            <Link
              to={`/blog/${blog.slug}`}
              key={blog._id}
              className="group border border-gray-800 rounded-xl p-6 
  hover:border-gray-600 hover:bg-white/5 
  transition-all duration-300"
            >
              <h2 className="text-lg font-semibold mb-2 group-hover:text-white">
                {blog.title}
              </h2>

              <p className="text-sm text-gray-400 line-clamp-3 mb-4">
                {blog.content.slice(0, 120)}...
              </p>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{new Date(blog.createdAt).toDateString()}</span>

                <span className="group-hover:translate-x-1 transition">
                  Read →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-10">
          <Link
            to="/blog"
            className="text-gray-400 hover:text-white transition"
          >
            View all posts →
          </Link>
        </div>
      </div>
    </section>
  );
}
