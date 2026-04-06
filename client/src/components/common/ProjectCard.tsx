import { Link } from "react-router-dom";
import type { Project } from "../../types/project.types";

interface Props {
  project: Project;
}

const ProjectCard = ({ project }: Props) => {
  return (
    <div className="group relative rounded-xl overflow-hidden border border-gray-800 bg-black hover:border-gray-600 hover:shadow-lg hover:shadow-white/10 transition-all duration-300">

      {/* Image */}
      <div className="h-48 overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-center items-center text-center p-4">

        <h3 className="text-lg font-semibold mb-2">
          {project.title}
        </h3>

        <p className="text-sm text-gray-300 line-clamp-2 mb-4">
          {project.description}
        </p>

        <Link
          to={`/projects/${project.slug}`}
          className="px-4 py-2 bg-white text-black rounded-lg text-sm font-medium"
        >
          View Details
        </Link>

      </div>

      {/* Bottom Info (visible always) */}
      <div className="p-4">
        <h3 className="font-semibold">{project.title}</h3>

        <div className="flex flex-wrap gap-2 mt-2">
          {project.techStack.slice(0, 3).map((tech, index) => (
            <span
              key={index}
              className="text-xs px-2 py-1 border border-gray-700 rounded"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ProjectCard;