import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const navItems = [
    { name: "Dashboard", path: "/admin" },
    { name: "Projects", path: "/admin/projects" },
    { name: "Blogs", path: "/admin/blogs" },
    { name: "Skills", path: "/admin/skills" },
  ];

  return (
    <div className="w-64 bg-black text-white p-5">
      <h1 className="text-2xl font-bold mb-8">Admin</h1>

      <nav className="flex flex-col gap-4">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end
            className={({ isActive }) =>
              `p-2 rounded ${
                isActive ? "bg-white text-black" : "hover:bg-gray-800"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;