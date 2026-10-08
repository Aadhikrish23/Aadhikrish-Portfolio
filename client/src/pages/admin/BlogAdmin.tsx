import { useCallback, useEffect, useState } from "react";
import { PiPencilSimple, PiPlus, PiTrash } from "react-icons/pi";
import blogApi from "../../APIServices/blog.api";
import type { Blog } from "../../types/blog.types";
import BlogForm from "../../components/admin/BlogForm";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import { Badge, Button, Empty, IconButton, Loading, PageHeader } from "../../components/admin/ui";
import Modal from "../../components/common/Modal";
import { useToast } from "../../context/toast.context";
import { getErrorMessage } from "../../utils/errors";

const BlogAdmin = () => {
  const { notify } = useToast();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [editing, setEditing] = useState<Blog | null>(null);
  const [open, setOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Blog | null>(null);

  const fetchBlogs = useCallback(async () => {
    try {
      const res = await blogApi.getAdminBlogs();
      setBlogs(res.data);
      setLoadError("");
    } catch (err) {
      setLoadError(getErrorMessage(err, "Could not load posts."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchBlogs();
  }, [fetchBlogs]);

  const retry = () => {
    setLoading(true);
    void fetchBlogs();
  };

  const openCreate = () => {
    setEditing(null);
    setOpen(true);
  };

  const openEdit = (blog: Blog) => {
    setEditing(blog);
    setOpen(true);
  };

  const closeModal = useCallback(() => setOpen(false), []);

  const handleSubmit = async (data: FormData) => {
    try {
      if (editing) {
        await blogApi.updateBlog(editing._id, data);
      } else {
        await blogApi.createBlog(data);
      }
    } catch (err) {
      // Keep the modal open so nothing typed is lost.
      notify(getErrorMessage(err, "Could not save the post."), "error");
      return;
    }
    notify("Post saved", "success");
    setOpen(false);
    setEditing(null);
    await fetchBlogs();
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      await blogApi.deleteBlog(toDelete._id);
    } catch (err) {
      notify(getErrorMessage(err, "Could not delete the post."), "error");
      throw err;
    }
    notify("Post deleted", "success");
    setToDelete(null);
    await fetchBlogs();
  };

  const addButton = (
    <Button variant="primary" onClick={openCreate}>
      <PiPlus className="h-4 w-4" aria-hidden="true" /> Add post
    </Button>
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Blog"
        description="Write, publish and keep drafts of your posts."
        action={blogs.length > 0 ? addButton : undefined}
      />

      {loading ? (
        <Loading rows={4} />
      ) : loadError ? (
        <Empty
          title="Couldn't load posts"
          body={loadError}
          action={<Button onClick={retry}>Try again</Button>}
        />
      ) : blogs.length === 0 ? (
        <Empty title="No posts yet" body="Your first post will show up here." action={addButton} />
      ) : (
        <ul className="divide-y divide-line border border-line">
          {blogs.map((b) => (
            <li key={b._id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 p-4 sm:p-5">
              <div className="min-w-0 flex-1 basis-60">
                <p className="break-words font-display text-xl text-fg">{b.title}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Badge tone={b.published ? "accent" : "neutral"}>{b.published ? "Published" : "Draft"}</Badge>
                  {b.tags.map((t) => (
                    <Badge key={t}>{t}</Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <IconButton label={`Edit ${b.title}`} onClick={() => openEdit(b)}>
                  <PiPencilSimple className="h-5 w-5" aria-hidden="true" />
                </IconButton>
                <IconButton label={`Delete ${b.title}`} onClick={() => setToDelete(b)}>
                  <PiTrash className="h-5 w-5" aria-hidden="true" />
                </IconButton>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal isOpen={open} onClose={closeModal} title={editing ? "Edit post" : "New post"}>
        <BlogForm initialData={editing || undefined} onSubmit={handleSubmit} onCancel={closeModal} />
      </Modal>

      <ConfirmDialog
        open={toDelete !== null}
        title="Delete post"
        message={`Delete "${toDelete?.title ?? ""}"? This can't be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
};

export default BlogAdmin;
