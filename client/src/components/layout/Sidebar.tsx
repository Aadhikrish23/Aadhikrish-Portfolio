import { NavLink } from "react-router-dom";
import { PiArticle, PiGauge, PiSlidersHorizontal, PiSquaresFour, PiWrench, PiX } from "react-icons/pi";

const navItems = [
  { name: "Dashboard", path: "/admin", icon: PiGauge },
  { name: "Projects", path: "/admin/projects", icon: PiSquaresFour },
  { name: "Blogs", path: "/admin/blogs", icon: PiArticle },
  { name: "Skills", path: "/admin/skills", icon: PiWrench },
  { name: "Site content", path: "/admin/content", icon: PiSlidersHorizontal },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

const Sidebar = ({ open, onClose }: Props) => {
  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/70 lg:hidden" onClick={onClose} aria-hidden="true" />}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-line bg-canvas px-4 py-6 transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-10 flex items-center justify-between px-3">
          <div>
            <p className="font-display text-xl font-medium">Aadhi.dev</p>
            <p className="text-xs uppercase tracking-widest text-subtle">Admin</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="p-1.5 text-muted hover:text-fg lg:hidden"
          >
            <PiX className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-1" aria-label="Admin">
          {navItems.map(({ name, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 border-l-2 px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-accent bg-surface text-fg"
                    : "border-transparent text-muted hover:bg-surface/60 hover:text-fg"
                }`
              }
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              {name}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
