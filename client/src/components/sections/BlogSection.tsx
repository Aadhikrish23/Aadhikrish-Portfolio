import { Link } from "react-router-dom";
import { PiArrowRight, PiArrowUpRight } from "react-icons/pi";
import blogApi from "../../APIServices/blog.api";
import SectionTitle from "../common/SectionTitle";
import Kerned from "../common/Kerned";
import { EmptyState, ErrorState, Skeleton } from "../common/StateBlocks";
import { useServerData } from "../../hooks/useServerData";
import { excerpt } from "../../utils/markdown";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export default function BlogSection() {
  const { data: blogs, loading, error } = useServerData(async () => {
    const res = await blogApi.getBlogs();
    return res.data.slice(0, 2);
  });

  return (
    <section id="blog" className="scroll-mt-16 border-t border-line py-20 md:py-28">
      <div className="flex items-end justify-between gap-6">
        <SectionTitle title="Blog" />
        <Link
          to="/blog"
          className="group hidden shrink-0 items-center gap-2 border-b-2 border-accent pb-1 font-medium text-fg sm:inline-flex"
        >
          View all posts
          <PiArrowRight className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="mt-14">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
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
                  className="group grid gap-3 py-9 md:grid-cols-12 md:gap-10"
                >
                  <time dateTime={blog.createdAt} className="text-sm text-muted md:col-span-3 md:pt-3">
                    {formatDate(blog.createdAt)}
                  </time>
                  <div className="md:col-span-8">
                    <h3 className="font-display text-3xl font-medium leading-tight text-fg transition-colors group-hover:text-muted md:text-4xl">
                      <Kerned text={blog.title} />
                    </h3>
                    <p className="mt-3 max-w-[60ch] text-muted">{excerpt(blog.content, 170)}</p>
                  </div>
                  <PiArrowUpRight className="hidden h-6 w-6 justify-self-end text-muted transition group-hover:text-accent md:col-span-1 md:mt-3 md:block" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Link
        to="/blog"
        className="mt-10 inline-flex items-center gap-2 border-b-2 border-accent pb-1 font-medium text-fg sm:hidden"
      >
        View all posts <PiArrowRight className="h-4 w-4" />
      </Link>
    </section>
  );
}
