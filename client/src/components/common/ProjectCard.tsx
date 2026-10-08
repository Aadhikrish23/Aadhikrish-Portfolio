import { Link } from "react-router-dom";
import { PiArrowUpRight } from "react-icons/pi";
import type { Project } from "../../types/project.types";
import { getProjectSummary, truncateWords } from "../../utils/project";
import Kerned from "./Kerned";

interface Props {
  project: Project;
  /** Tailwind aspect class for the image frame */
  aspect?: string;
}

// Screenshots are shown whole, in natural color and proportion: tinting or cropping them
// hides the very work this section exists to show. Only the no-image fallback plate uses a
// fixed aspect ratio. Very tall images are capped and letterboxed instead of stretched.
export function ProjectImage({
  project,
  aspect = "aspect-[16/10]",
  className = "",
}: {
  project: Project;
  aspect?: string;
  className?: string;
}) {
  if (!project.image) {
    return (
      <div aria-hidden="true" className={`relative overflow-hidden bg-brown ${aspect} ${className}`}>
        <span className="absolute left-6 top-4 font-display text-8xl font-medium leading-none text-fg md:text-9xl">
          {project.title.trim().charAt(0)}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`min-h-40 overflow-hidden border border-line bg-surface transition-colors duration-300 group-hover:border-muted ${className}`}
    >
      <img
        src={project.image}
        alt={project.title}
        loading="lazy"
        className="block h-auto max-h-[34rem] w-full object-contain"
      />
    </div>
  );
}

// Info stays visible (no hover-only overlay) so it works on touch screens too.
const ProjectCard = ({ project, aspect = "aspect-[16/10]" }: Props) => {
  return (
    <Link to={`/projects/${project.slug}`} className="group block">
      <ProjectImage project={project} aspect={aspect} />

      <div className="mt-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-3xl font-medium leading-tight text-fg md:text-4xl">
            <Kerned text={project.title} />
          </h3>
          <PiArrowUpRight className="mt-2 h-6 w-6 shrink-0 text-muted transition group-hover:text-accent motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5" />
        </div>

        <p className="mt-3 max-w-[56ch] leading-relaxed text-muted">
          {truncateWords(getProjectSummary(project.description))}
        </p>

        <ul className="mt-5 flex flex-wrap gap-2">
          {project.techStack.slice(0, 4).map((tech) => (
            <li key={tech} className="border border-line px-3 py-1 text-sm text-muted">
              {tech}
            </li>
          ))}
          {project.techStack.length > 4 && (
            <li className="px-1 py-1 text-sm text-subtle">+{project.techStack.length - 4}</li>
          )}
        </ul>
      </div>
    </Link>
  );
};

export default ProjectCard;
