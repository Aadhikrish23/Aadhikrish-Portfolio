import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import AdminLayout from "../components/layout/AdminLayout";
import ProtectedRoute from "./ProtectedRoutes";

// Public pages
import Home from "../pages/public/Home";
import Projects from "../pages/public/Projects";
import Blog from "../pages/public/Blog";
import BlogDetail from "../pages/public/BlogDetail";
import ProjectDetail from "../pages/public/ProjectDetail";

// Admin pages
import Login from "../pages/admin/Login";
import Dashboard from "../pages/admin/Dashboard";
import BlogAdmin from "../pages/admin/BlogAdmin";
import ProjectsAdmin from "../pages/admin/ProjectsAdmin";
import SkillsAdmin from "../pages/admin/SkillsAdmin";

const AppRoutes = () => {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
      </Route>

      {/* ADMIN LOGIN */}
      <Route path="/admin/login" element={<Login />} />

      {/* ADMIN ROUTES */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="projects" element={<ProjectsAdmin />} />
        <Route path="blogs" element={<BlogAdmin />} />
        <Route path="skills" element={<SkillsAdmin />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;