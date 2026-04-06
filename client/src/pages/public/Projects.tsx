import { useEffect, useState } from "react";
import projectApi from "../../APIServices/project.api";
import type { Project } from "../../types/project.types";
import ProjectCard from "../../components/common/ProjectCard";
export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await projectApi.getProjects();
        setProjects(res.data); // ✅ ALL projects
      } catch (error) {
        console.error(error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section className="py-28 px-6 max-w-6xl mx-auto">

  <h2 className="text-3xl font-bold mb-12">All Projects</h2>

  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
    {projects.map((project) => (
      <ProjectCard key={project._id} project={project} />
    ))}
  </div>

</section>
  );
}