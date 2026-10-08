import { Link, useParams } from "react-router-dom";
import { motion, useScroll, useSpring } from "motion/react";
import { PiArrowLeft } from "react-icons/pi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import blogApi from "../../APIServices/blog.api";
import Kerned from "../../components/common/Kerned";
import { EmptyState, Skeleton } from "../../components/common/StateBlocks";
import { useServerData } from "../../hooks/useServerData";

export default function BlogDetail() {
  const { slug = "" } = useParams();
  const { data: blog, loading, error } = useServerData(async () => {
    const res = await blogApi.getBlogBySlug(slug);
    return res.data;
  }, slug);

  // Reading progress driven by a motion value, not React state
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 py-16">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-20" />
        <Skeleton className="aspect-[16/9]" />
        <Skeleton className="h-40" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="mx-auto max-w-3xl py-24">
        <EmptyState
          title="Post not found."
          body="It may have been unpublished or moved."
          action={{ label: "Back to Blogs", to: "/blog" }}
        />
      </div>
    );
  }

  const readingTime = Math.max(1, Math.ceil(blog.content.split(/\s+/).length / 200));
  const date = new Date(blog.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      <motion.div
        className="fixed inset-x-0 top-0 z-50 h-1 origin-left bg-accent"
        style={{ scaleX: progress }}
      />

      <article className="mx-auto max-w-3xl py-16 md:py-24">
        <Link
          to="/blog"
          className="group inline-flex items-center gap-2 text-muted transition hover:text-fg"
        >
          <PiArrowLeft className="h-4 w-4 transition-transform motion-safe:group-hover:-translate-x-1" />
          Back to Blogs
        </Link>

        <header className="mt-8">
          <h1 className="font-display text-5xl font-medium leading-[1.04] tracking-tight md:text-[4.5rem]">
            <Kerned text={blog.title} />
          </h1>
          <p className="mt-6 text-muted">
            {date} • {readingTime} min read
          </p>
        </header>

        {blog.coverImage && (
          <div className="mt-12 overflow-hidden border border-line bg-surface">
            <img src={blog.coverImage} alt="" className="block h-auto max-h-[36rem] w-full object-contain" />
          </div>
        )}

        <div className="prose prose-lg prose-theme mt-12 max-w-none prose-headings:font-display prose-headings:font-medium prose-a:underline prose-a:decoration-accent prose-a:decoration-2 prose-a:underline-offset-4 prose-blockquote:border-0 prose-blockquote:pl-0 prose-blockquote:font-display prose-blockquote:text-2xl prose-blockquote:font-normal prose-blockquote:not-italic prose-code:before:content-none prose-code:after:content-none prose-img:rounded-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{blog.content}</ReactMarkdown>
        </div>

        {blog.tags.length > 0 && (
          <ul className="mt-12 flex flex-wrap gap-2">
            {blog.tags.map((tag) => (
              <li key={tag} className="border border-line px-3 py-1 text-sm text-muted">
                {tag}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-16 flex flex-col gap-6 bg-brown p-8 sm:flex-row sm:items-center sm:justify-between md:p-10">
          <p className="font-display text-2xl font-medium text-fg">Enjoyed reading this?</p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/projects"
              className="bg-canvas px-6 py-3 font-medium text-fg transition-colors hover:bg-fg hover:text-canvas active:translate-y-px"
            >
              View Projects
            </Link>
            <Link
              to="/#contact"
              className="border border-fg px-6 py-3 font-medium text-fg transition-colors hover:bg-fg hover:text-canvas active:translate-y-px"
            >
              Contact Me
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
