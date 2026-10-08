import { useEffect, useId, useRef, useState } from "react";
import { PiImage, PiX } from "react-icons/pi";
import type { Blog } from "../../types/blog.types";
import { Button, Field, Toggle, fieldClass } from "./ui";

interface Props {
  initialData?: Blog;
  onSubmit: (data: FormData) => Promise<void>;
  onCancel?: () => void;
}

const BlogForm = ({ initialData, onSubmit, onCancel }: Props) => {
  const uid = useId();
  const [form, setForm] = useState({
    title: initialData?.title ?? "",
    content: initialData?.content ?? "",
    tags: initialData?.tags.join(", ") ?? "",
    published: initialData?.published ?? true,
  });

  const [image, setImage] = useState<File | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const urlRef = useRef<string | null>(null);

  const preview = localPreview ?? initialData?.coverImage ?? null;

  // Revoke the object URL on unmount so previews never leak.
  useEffect(
    () => () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    },
    [],
  );

  const setLocalFile = (file: File | null) => {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = file ? URL.createObjectURL(file) : null;
    setImage(file);
    setLocalPreview(urlRef.current);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setLocalFile(file);
    e.target.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title.trim());
      fd.append("content", form.content);
      fd.append("tags", form.tags);
      fd.append("published", String(form.published));
      if (image) fd.append("coverImage", image);
      await onSubmit(fd);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <fieldset disabled={saving} className="min-w-0 space-y-6">
        <Field label="Title" htmlFor={`${uid}-title`}>
          <input
            id={`${uid}-title`}
            placeholder="e.g. How I built a real-time chat app"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className={fieldClass}
            required
          />
        </Field>

        <Field label="Content" hint="Markdown supported" htmlFor={`${uid}-content`}>
          <textarea
            id={`${uid}-content`}
            placeholder="Write your post here..."
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className={`${fieldClass} resize-y`}
            rows={9}
            required
          />
        </Field>

        <Field label="Tags" hint="comma separated" htmlFor={`${uid}-tags`}>
          <input
            id={`${uid}-tags`}
            placeholder="e.g. React, WebSockets, Node.js"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            className={fieldClass}
          />
        </Field>

        <Field label="Cover image" htmlFor={`${uid}-cover`}>
          {preview ? (
            <div className="border border-line">
              <img src={preview} alt="Cover preview" className="h-44 w-full object-cover" />
              <div className="flex flex-wrap items-center gap-2 border-t border-line p-2">
                <label
                  htmlFor={`${uid}-cover`}
                  className="cursor-pointer px-3 py-1.5 text-sm text-fg transition-colors hover:bg-surface"
                >
                  Replace image
                </label>
                {image && (
                  <button
                    type="button"
                    onClick={() => setLocalFile(null)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-muted transition-colors hover:bg-surface hover:text-fg"
                  >
                    <PiX className="h-4 w-4" aria-hidden="true" />
                    {initialData?.coverImage ? "Keep current" : "Remove"}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <label
              htmlFor={`${uid}-cover`}
              className="flex cursor-pointer flex-col items-center gap-2 border border-dashed border-line px-4 py-8 text-subtle transition-colors hover:border-muted hover:text-fg"
            >
              <PiImage className="h-8 w-8" aria-hidden="true" />
              <span className="text-sm">Click to upload a cover image</span>
            </label>
          )}
          <input id={`${uid}-cover`} type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
        </Field>

        <Toggle
          checked={form.published}
          onChange={(published) => setForm({ ...form, published })}
          label={form.published ? "Published" : "Draft"}
          description={form.published ? "This post is visible to the public." : "Saved as a draft, hidden from the public."}
        />
      </fieldset>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {onCancel && (
          <Button variant="ghost" onClick={onCancel} disabled={saving}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" loading={saving}>
          {saving ? "Saving..." : "Save post"}
        </Button>
      </div>
    </form>
  );
};

export default BlogForm;
