import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import projectApi from "../../APIServices/project.api";
import type { Project } from "../../types/project.types";
import { getIcon } from "../../utils/skilliconmapper";

const ProjectDetail = () => {
  const { slug } = useParams();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        if (!slug) return;

        const res = await projectApi.getProjectBySlug(slug);
        setProject(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProject();
  }, [slug]);

  if (!project) {
    return <div className="py-20 text-center">Loading...</div>;
  }

  return (
    <div>
      <Link to="/projects" className="text-sm text-gray-500 hover:text-white">
        ← Back to Projects
      </Link>
      <section className="py-28 px-6 max-w-5xl mx-auto">
        {/* Image */}
        <div className="mb-10 overflow-hidden rounded-2xl border border-gray-800">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-[300px] md:h-[400px] object-cover"
          />
        </div>

        <h1 className="text-4xl font-bold mb-2">{project.title}</h1>

        <div className="text-gray-400 mb-6 space-y-4 leading-relaxed">
          {project.description.split("\n").map((line, i) => {
            if (line.startsWith("Problem:")) {
              return (
                <p key={i}>
                  <span className="text-white font-semibold">Problem: </span>
                  {line.replace("Problem:", "").trim()}
                </p>
              );
            }

            if (line.startsWith("Solution:")) {
              return (
                <p key={i}>
                  <span className="text-white font-semibold">Solution: </span>
                  {line.replace("Solution:", "").trim()}
                </p>
              );
            }

            if (line.startsWith("Key Features:")) {
              return (
                <p key={i} className="text-white font-semibold mt-4">
                  Key Features:
                </p>
              );
            }

            if (line.startsWith("•")) {
              return (
                <li key={i} className="ml-5 list-disc">
                  {line.replace("•", "").trim()}
                </li>
              );
            }

            return <p key={i}>{line}</p>;
          })}
        </div>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-3 mb-8">
          {project.techStack.map((tech, i) => (
            <span
              key={i}
              className="flex items-center justify-start gap-2 px-3 py-2 border border-gray-700 rounded-lg text-sm hover:border-gray-500 hover:bg-white/5 transition "
            >
              <span className="flex-shrink-0">{getIcon(tech)}</span>
              <span>{tech}</span>
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex gap-4 mb-">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              className="px-5 py-2 bg-white text-black rounded-lg font-medium hover:opacity-90  hover:-translate-y-0.5 transition-all"
            >
              🔗 Live Demo
            </a>
          )}

          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              className="px-5 py-2 flex items-center gap-2 rounded-lg 
  bg-white/5 border border-gray-700 
  hover:bg-white/10 hover:border-gray-500 
  hover:-translate-y-0.5 transition-all"
            >
              {getIcon("GitHub")}GitHub
            </a>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProjectDetail;
