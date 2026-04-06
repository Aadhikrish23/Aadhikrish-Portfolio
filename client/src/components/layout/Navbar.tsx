import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <nav
        className={`fixed top-0 left-0 w-full z-50 flex justify-between items-center py-6 px-6 md:px-12 lg:px-20 border-b border-gray-800 
        ${
          scrolled
            ? "bg-black/40 backdrop-blur-md border-b border-gray-800"
            : "bg-transparent"
        }`}
      >
        <Link to="/" className="text-xl font-semibold tracking-wide">
          Aadhi.dev
        </Link>

        <div className="flex gap-6 text-sm">
          <Link to="/">Home</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/blog">Blog</Link>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
