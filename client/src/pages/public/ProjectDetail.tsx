import { Link, useParams } from "react-router-dom";
import { PiArrowLeft, PiArrowUpRight, PiGithubLogo } from "react-icons/pi";
import projectApi from "../../APIServices/project.api";
import type { Project } from "../../types/project.types";
import TintedIcon from "../../components/common/TintedIcon";
import { ProjectImage } from "../../components/common/ProjectCard";
import FullBleed from "../../components/common/FullBleed";
import Kerned from "../../components/common/Kerned";
import { EmptyState, Skeleton } from "../../components/common/StateBlocks";
import { useServerData } from "../../hooks/useServerData";

// Splits the stored description back into its summary / problem / solution / features parts
const parseDescription = (description: string) => {
  const summary: string[] = [];
  const features: string[] = [];
  let problem = "";
  let solution = "";

  for (const raw of description.split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("Key Features:")) continue;
    if (line.startsWith("Problem:")) problem = line.replace("Problem:", "").trim();
    else if (line.startsWith("Solution:")) solution = line.replace("Solution:", "").trim();
    else if (line.startsWith("•")) {
      const feature = line.replace("•", "").trim();
      if (feature) features.push(feature);
    } else summary.push(line);
  }

  return { summary, problem, solution, features };
};

const ProjectDetail = () => {
  const { slug = "" } = useParams();
  const { data: project, loading, error } = useServerData(async () => {
    const res = await projectApi.getProjectBySlug(slug);
    return res.data as Project;
  }, slug);

  if (loading) {
    return (
      <div className="space-y-6 py-16">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-20 w-2/3" />
        <Skeleton className="aspect-[21/9]" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="py-24">
        <EmptyState
          title="Project not found."
          body="It may have been moved or removed."
          action={{ label: "Back to all projects", to: "/projects" }}
        />
      </div>
    );
  }

  const { summary, problem, solution, features } = parseDescription(project.description);

  return (
    <article className="py-16 md:py-24">
      <Link
        to="/projects"
        className="group inline-flex items-center gap-2 text-muted transition hover:text-fg"
      >
        <PiArrowLeft className="h-4 w-4 transition-transform motion-safe:group-hover:-translate-x-1" />
        Back to Projects
      </Link>

      <h1 className="mt-8 max-w-4xl font-display text-5xl font-medium leading-[1.02] tracking-tight md:text-[5.5rem]">
        <Kerned text={project.title} />
      </h1>

      <div className="mt-8 flex flex-wrap gap-4">
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-accent px-6 py-3 font-medium text-on-accent transition-colors hover:bg-muted active:translate-y-px"
          >
            Live Demo <PiArrowUpRight className="h-4 w-4" />
          </a>
        )}
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 border border-muted px-6 py-3 font-medium text-fg transition-colors hover:bg-fg hover:text-canvas active:translate-y-px"
          >
            <PiGithubLogo className="h-5 w-5" /> GitHub
          </a>
        )}
      </div>

      <div className="mt-14">
        <ProjectImage project={project} aspect="aspect-[16/9] md:aspect-[21/9]" />
      </div>

      <div className="mt-16 grid gap-14 md:grid-cols-12 md:gap-10">
        <div className="space-y-14 md:col-span-8">
          {summary.length > 0 && (
            <div className="space-y-4 text-xl leading-relaxed text-fg/90">
              {summary.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          )}

          {features.length > 0 && (
            <div>
              <h2 className="font-display text-3xl font-medium">Key Features</h2>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {features.map((feature) => (
                  <li key={feature} className="flex gap-4 leading-snug text-muted">
                    <span aria-hidden="true" className="mt-2.5 h-0.5 w-5 shrink-0 bg-accent" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <aside className="md:col-span-4">
          <h2 className="font-display text-2xl font-medium">Tech Stack</h2>
          <ul className="mt-5 flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <li key={tech} className="group flex items-center gap-2.5 border border-line bg-surface py-2 pl-2.5 pr-3.5">
                <TintedIcon name={tech} />
                {tech}
              </li>
            ))}
          </ul>
        </aside>
      </div>

      {(problem || solution) && (
        <FullBleed className="mt-20 bg-brown">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2 md:gap-16 md:px-10 md:py-20">
            {problem && (
              <div>
                <h2 className="font-display text-3xl font-medium text-fg">Problem</h2>
                <p className="mt-4 text-lg leading-relaxed text-fg">{problem}</p>
              </div>
            )}
            {solution && (
              <div>
                <h2 className="font-display text-3xl font-medium text-fg">Solution</h2>
                <p className="mt-4 text-lg leading-relaxed text-fg">{solution}</p>
              </div>
            )}
          </div>
        </FullBleed>
      )}
    </article>
  );
};

export default ProjectDetail;
