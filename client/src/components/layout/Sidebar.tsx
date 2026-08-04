import { NavLink } from "react-router-dom";
import { FaHome, FaProjectDiagram, FaPenNib, FaCode } from "react-icons/fa";

const Sidebar = () => {
  const navItems = [
    { name: "Dashboard", path: "/admin", icon: <FaHome /> },
    { name: "Projects", path: "/admin/projects", icon: <FaProjectDiagram /> },
    { name: "Blogs", path: "/admin/blogs", icon: <FaPenNib /> },
    { name: "Skills", path: "/admin/skills", icon: <FaCode /> },
  ];

  return (
    <div className="w-72 bg-white/70 backdrop-blur-xl border-r border-slate-200/50 p-6 flex flex-col shadow-sm">
      <div className="mb-10 flex items-center gap-3 px-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
          <span className="text-white font-bold text-xl">A</span>
        </div>
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 tracking-tight">
          Admin
        </h1>
      </div>

      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 translate-x-1"
                  : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 hover:translate-x-1"
              }`
            }
          >
            <span className="text-lg opacity-80">{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;