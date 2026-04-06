import { useEffect, useState } from "react";
import projectApi from "../../APIServices/project.api";
import type { Project } from "../../types/project.types";
import ProjectCard from "../common/ProjectCard";
import SectionTitle from "../common/SectionTitle";

const ProjectSection = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
  const fetchProjects = async () => {
    try {
      const res = await projectApi.getProjects();

      // ✅ ONLY featured projects
      const featuredProjects = res.data.filter(
        (project: Project) => project.featured
      );

      setProjects(featuredProjects);
    } catch (error) {
      console.error(error);
    }
  };

  fetchProjects();
}, []);

  return (
    <section className="py-28 border-t border-gray-800">
      <div className="max-w-6xl mx-auto">
        <SectionTitle title={"Projects"}/>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      </div>
      <div className="mt-10 text-center">
        <a
          href="/projects"
          className="px-6 py-3 border border-gray-700 rounded-lg hover:border-white transition"
        >
          View All Projects
        </a>
      </div>
    </section>
  );
};

export default ProjectSection;
