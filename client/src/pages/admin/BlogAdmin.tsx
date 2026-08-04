import { useEffect, useState } from "react";
import blogApi from "../../APIServices/blog.api";
import type { Blog } from "../../types/blog.types";
import BlogForm from "../../components/admin/BlogForm";
import Modal from "../../components/common/Modal";
import { FaEdit, FaTrash, FaPlus, FaGlobe, FaLock } from "react-icons/fa";

const BlogAdmin = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [editing, setEditing] = useState<Blog | null>(null);
  const [open, setOpen] = useState(false);

  const fetchBlogs = async () => {
    const res = await blogApi.getBlogs();
    setBlogs(res.data);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSubmit = async (data: FormData) => {
    if (editing) {
      await blogApi.updateBlog(editing._id, data);
    } else {
      await blogApi.createBlog(data);
    }

    setOpen(false);
    setEditing(null);
    fetchBlogs();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete blog?")) return;
    await blogApi.deleteBlog(id);
    fetchBlogs();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Blogs</h1>
          <p className="text-slate-500 mt-1">Manage and publish your thoughts and tutorials.</p>
        </div>

        <button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-md shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 font-medium"
        >
          <FaPlus /> Add Blog
        </button>
      </div>

      <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm font-medium">
              <tr>
                <th className="p-4 px-6">Title</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {blogs.map((b) => (
                <tr key={b._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-4 px-6 font-semibold text-slate-800">{b.title}</td>

                  <td className="p-4 text-center">
                    {b.published ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <FaGlobe className="w-3 h-3" /> Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                        <FaLock className="w-3 h-3" /> Draft
                      </span>
                    )}
                  </td>

                  <td className="p-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setEditing(b);
                          setOpen(true);
                        }}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <FaEdit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(b._id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <FaTrash className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {blogs.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-slate-500">
                    No blogs found. Click "Add Blog" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title={editing ? "Edit Blog" : "Create Blog"}
      >
        <BlogForm
          initialData={editing || undefined}
          onSubmit={handleSubmit}
        />
      </Modal>
    </div>
  );
};

export default BlogAdmin;