import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useMotionValueEvent, useScroll } from "motion/react";
import { useSiteSettings } from "../../context/siteSettings.context";

const links = [
  { to: "/", label: "Home" },
  { to: "/projects", label: "Projects" },
  { to: "/blog", label: "Blog" },
];

const Navbar = () => {
  const { siteName } = useSiteSettings();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  // Only re-renders when crossing the threshold, not on every scroll frame
  useMotionValueEvent(scrollY, "change", (y) => {
    const next = y > 20;
    if (next !== scrolled) setScrolled(next);
  });

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-40 border-b transition-colors duration-300 ${
        scrolled ? "border-line bg-canvas" : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-10">
        <Link to="/" className="font-display text-xl font-medium tracking-wide">
          {siteName}
        </Link>

        <div className="flex items-center gap-6 text-sm sm:gap-8">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `border-b-2 py-1 transition-colors ${
                  isActive ? "border-accent text-fg" : "border-transparent text-muted hover:text-fg"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
