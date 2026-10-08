import { Link } from "react-router-dom";
import { PiArrowRight } from "react-icons/pi";
import projectApi from "../../APIServices/project.api";
import ProjectCard from "../common/ProjectCard";
import SectionTitle from "../common/SectionTitle";
import Reveal from "../common/Reveal";
import { EmptyState, ErrorState, Skeleton } from "../common/StateBlocks";
import { useServerData } from "../../hooks/useServerData";

// Alternating widths and aspect ratios so the grid never settles into a rhythm.
const placements = [
  { col: "md:col-span-7", aspect: "aspect-[4/3]", offset: "" },
  { col: "md:col-span-5", aspect: "aspect-[4/5]", offset: "md:mt-28" },
];

const ProjectSection = () => {
  const { data: projects, loading, error } = useServerData(async () => {
    const res = await projectApi.getProjects();
    return res.data.filter((project) => project.featured);
  });

  const [lead, ...rest] = projects ?? [];

  return (
    <section id="projects" className="scroll-mt-16 border-t border-line py-20 md:py-28">
      <div className="flex items-end justify-between gap-6">
        <SectionTitle title="Projects" />
        <Link
          to="/projects"
          className="group hidden shrink-0 items-center gap-2 border-b-2 border-accent pb-1 font-medium text-fg sm:inline-flex"
        >
          View All Projects
          <PiArrowRight className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="mt-16">
        {loading ? (
          <div className="space-y-10">
            <Skeleton className="aspect-[21/9]" />
            <div className="grid gap-8 md:grid-cols-12">
              <Skeleton className="aspect-[4/3] md:col-span-7" />
              <Skeleton className="aspect-[4/5] md:col-span-5" />
            </div>
          </div>
        ) : error ? (
          <ErrorState title="Couldn't load projects." />
        ) : !lead ? (
          <EmptyState
            title="No featured projects yet."
            action={{ label: "Browse all projects", to: "/projects" }}
          />
        ) : (
          <div className="space-y-24">
            <Reveal className="relative">
              <ProjectCard project={lead} aspect="aspect-[16/9] md:aspect-[21/9]" />
            </Reveal>

            {rest.length > 0 && (
              <div className="grid gap-x-10 gap-y-20 md:grid-cols-12">
                {rest.map((project, i) => {
                  const place = placements[i % 2];
                  return (
                    <Reveal key={project._id} className={`${place.col} ${place.offset}`}>
                      <ProjectCard project={project} aspect={place.aspect} />
                    </Reveal>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <Link
        to="/projects"
        className="mt-14 inline-flex items-center gap-2 border-b-2 border-accent pb-1 font-medium text-fg sm:hidden"
      >
        View All Projects <PiArrowRight className="h-4 w-4" />
      </Link>
    </section>
  );
};

export default ProjectSection;
