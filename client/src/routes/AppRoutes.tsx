import { Routes, Route } from "react-router-dom";
import Home from "../pages/public/Home";
import Projects from "../pages/public/Projects";
import Blog from "../pages/public/Blog";
import BlogDetail from "../pages/public/BlogDetail";
import ProjectDetail from "../pages/public/ProjectDetail";
import Login from "../pages/admin/Login";
import Dashboard from "../pages/admin/Dashboard";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/projects" element={<Projects />} />
     <Route path="/projects/:slug" element={<ProjectDetail />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogDetail />} />

      {/* Admin */}
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<Dashboard />} />
    </Routes>
  );
};

export default AppRoutes;