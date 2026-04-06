import projectApi from "./project.api";
import blogApi from "./blog.api";
import skillsApi from "./skills.api";

const getDashboardStats = async () => {
  const [projects, blogs, skills] = await Promise.all([
    projectApi.getProjects(),
    blogApi.getBlogs(),
    skillsApi.getSkills(),
  ]);

  return {
    projects: projects.data.length,
    blogs: blogs.data.length,
    skills: skills.data.length,
  };
};

export default { getDashboardStats };