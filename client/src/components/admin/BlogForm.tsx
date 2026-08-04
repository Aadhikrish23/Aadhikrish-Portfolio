import { useState, useEffect } from "react";
import type { Blog } from "../../types/blog.types";
import { FaGlobe, FaLock, FaImage } from "react-icons/fa";

interface Props {
  initialData?: Blog;
  onSubmit: (data: FormData) => Promise<void>;
}

const BlogForm = ({ initialData, onSubmit }: Props) => {
  const [form, setForm] = useState({
    title: "",
    content: "",
    tags: "",
    published: true,
  });

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title,
        content: initialData.content,
        tags: initialData.tags.join(", "),
        published: initialData.published,
      });
      if (initialData.coverImage) {
        setImagePreview(initialData.coverImage);
      }
    }
  }, [initialData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("content", form.content);
      fd.append("tags", form.tags);
      fd.append("published", String(form.published));
      if (image) fd.append("coverImage", image);
      await onSubmit(fd);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Title */}
      <div className="space-y-1">
        <label className="block text-sm font-semibold text-slate-700">Blog Title</label>
        <input
          placeholder="e.g. How I built a real-time chat app"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border border-slate-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-800 placeholder-slate-400"
          required
        />
      </div>

      {/* Content */}
      <div className="space-y-1">
        <label className="block text-sm font-semibold text-slate-700">Content</label>
        <textarea
          placeholder="Write your blog content here..."
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="w-full border border-slate-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-800 placeholder-slate-400 resize-none"
          rows={7}
          required
        />
      </div>

      {/* Tags */}
      <div className="space-y-1">
        <label className="block text-sm font-semibold text-slate-700">
          Tags{" "}
          <span className="text-xs font-normal text-slate-400">comma separated</span>
        </label>
        <input
          placeholder="e.g. React, WebSockets, Node.js"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
          className="w-full border border-slate-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-800 placeholder-slate-400"
        />
      </div>

      {/* Cover Image */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-700">Cover Image</label>
        {imagePreview ? (
          <div className="relative rounded-xl overflow-hidden border border-slate-200 group">
            <img src={imagePreview} alt="Cover preview" className="w-full h-40 object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <label className="cursor-pointer px-4 py-2 bg-white/90 rounded-lg text-sm font-medium text-slate-700 hover:bg-white transition-colors">
                Change Image
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>
          </div>
        ) : (
          <label className="flex flex-col items-center gap-2 px-4 py-8 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all group">
            <FaImage className="w-8 h-8 text-slate-300 group-hover:text-blue-400 transition-colors" />
            <span className="text-sm text-slate-400 group-hover:text-blue-500 transition-colors">
              Click to upload a cover image
            </span>
            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </label>
        )}
      </div>

      {/* Published toggle */}
      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
        <div>
          <p className="text-sm font-semibold text-slate-700">Publish Status</p>
          <p className="text-xs text-slate-400 mt-0.5">
            {form.published ? "This blog will be visible to the public." : "This blog is saved as a draft."}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setForm({ ...form, published: !form.published })}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
            form.published
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-slate-200 text-slate-600 hover:bg-slate-300"
          }`}
        >
          {form.published ? (
            <><FaGlobe className="w-3.5 h-3.5" /> Published</>
          ) : (
            <><FaLock className="w-3.5 h-3.5" /> Draft</>
          )}
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-70 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
      >
        {loading ? "Saving Blog..." : "Save Blog"}
      </button>
    </form>
  );
};

export default BlogForm;