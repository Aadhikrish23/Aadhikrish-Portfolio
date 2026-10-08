import projectApi from "../../APIServices/project.api";
import ProjectCard from "../../components/common/ProjectCard";
import Reveal from "../../components/common/Reveal";
import { EmptyState, ErrorState, Skeleton } from "../../components/common/StateBlocks";
import { useServerData } from "../../hooks/useServerData";

export default function Projects() {
  const { data: projects, loading, error } = useServerData(async () => {
    const res = await projectApi.getProjects();
    return res.data;
  });

  return (
    <section className="py-16 md:py-28">
      <h1 className="font-display text-6xl font-medium leading-[1.02] tracking-tight md:text-[6rem]">
        All Projects
      </h1>

      <div className="mt-16">
        {loading ? (
          <div className="grid gap-x-10 gap-y-20 md:grid-cols-2">
            {[0, 1].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[16/10]" />
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="h-10" />
              </div>
            ))}
          </div>
        ) : error ? (
          <ErrorState title="Couldn't load projects." />
        ) : !projects?.length ? (
          <EmptyState title="No projects yet." body="Check back soon." />
        ) : (
          <div className="grid gap-x-10 gap-y-20 md:grid-cols-2">
            {projects.map((project, i) => (
              <Reveal key={project._id} delay={(i % 2) * 0.08} className={i % 2 === 1 ? "md:mt-24" : ""}>
                <ProjectCard project={project} aspect="aspect-[4/3]" />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
