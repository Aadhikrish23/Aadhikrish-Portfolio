import { useEffect, useState } from "react";
import blogApi from "../../APIServices/blog.api";
import type { Blog } from "../../types/blog.types";
import BlogForm from "../../components/admin/BlogForm";
import Modal from "../../components/common/Modal";

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
    <div className="space-y-6">
      
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Blogs</h1>

        <button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
          className="bg-black text-white px-4 py-2 rounded"
        >
          + Add Blog
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {blogs.map((b) => (
              <tr key={b._id} className="border-t">
                <td className="p-3">{b.title}</td>

                <td className="p-3 text-center">
                  {b.published ? "Published" : "Draft"}
                </td>

                <td className="p-3 text-right space-x-3">
                  <button
                    onClick={() => {
                      setEditing(b);
                      setOpen(true);
                    }}
                    className="text-blue-500"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(b._id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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