import { useState, useEffect } from "react";
import type { Blog } from "../../types/blog.types";

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

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title,
        content: initialData.content,
        tags: initialData.tags.join(","),
        published: initialData.published,
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fd = new FormData();

    fd.append("title", form.title);
    fd.append("content", form.content);
    fd.append("tags", form.tags);
    fd.append("published", String(form.published));

    if (image) fd.append("coverImage", image);

    await onSubmit(fd);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">

      <input
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        className="border p-3 rounded"
      />

      <textarea
        placeholder="Content"
        value={form.content}
        onChange={(e) => setForm({ ...form, content: e.target.value })}
        className="border p-3 rounded h-40"
      />

      <input
        placeholder="tags (comma separated)"
        value={form.tags}
        onChange={(e) => setForm({ ...form, tags: e.target.value })}
        className="border p-3 rounded"
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={form.published}
          onChange={(e) =>
            setForm({ ...form, published: e.target.checked })
          }
        />
        Published
      </label>

      <input type="file" onChange={(e) => setImage(e.target.files?.[0] || null)} />

      <button className="bg-black text-white py-2 rounded">
        Save Blog
      </button>
    </form>
  );
};

export default BlogForm;