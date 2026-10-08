import { Link } from "react-router-dom";
import blogApi from "../../APIServices/blog.api";
import Kerned from "../../components/common/Kerned";
import { EmptyState, ErrorState, Skeleton } from "../../components/common/StateBlocks";
import { useServerData } from "../../hooks/useServerData";
import { excerpt } from "../../utils/markdown";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export default function BlogPage() {
  const { data: blogs, loading, error } = useServerData(async () => {
    const res = await blogApi.getBlogs();
    return res.data;
  });

  return (
    <section className="py-16 md:py-28">
      <h1 className="font-display text-6xl font-medium leading-[1.02] tracking-tight md:text-[6rem]">
        Blog
      </h1>

      <div className="mt-16">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
        ) : error ? (
          <ErrorState title="Couldn't load posts." />
        ) : !blogs?.length ? (
          <EmptyState title="No posts yet." body="New writing will show up here." />
        ) : (
          <ul className="divide-y divide-line border-y border-line">
            {blogs.map((blog) => (
              <li key={blog._id}>
                <Link
                  to={`/blog/${blog.slug}`}
                  className="group grid gap-6 py-10 md:grid-cols-12 md:gap-10"
                >
                  {blog.coverImage && (
                    <div className="self-start overflow-hidden border border-line bg-surface transition-colors duration-300 group-hover:border-muted md:col-span-4">
                      <img
                        src={blog.coverImage}
                        alt=""
                        loading="lazy"
                        className="block h-auto max-h-80 w-full object-contain"
                      />
                    </div>
                  )}
                  <div className={blog.coverImage ? "md:col-span-8" : "md:col-span-12"}>
                    <time dateTime={blog.createdAt} className="text-sm text-muted">
                      {formatDate(blog.createdAt)}
                    </time>
                    <h2 className="mt-2 font-display text-3xl font-medium leading-tight text-fg transition-colors group-hover:text-muted md:text-5xl">
                      <Kerned text={blog.title} />
                    </h2>
                    <p className="mt-4 max-w-[62ch] text-muted">{excerpt(blog.content, 220)}</p>
                    {blog.tags.length > 0 && (
                      <ul className="mt-5 flex flex-wrap gap-2">
                        {blog.tags.map((tag) => (
                          <li key={tag} className="border border-line px-3 py-1 text-sm text-muted">
                            {tag}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
