import { Link } from "react-router-dom";
import { PiArrowUpRight, PiList, PiSignOut } from "react-icons/pi";
import { useAuth } from "../../context/AuthContext";

const Topbar = ({ onMenu }: { onMenu: () => void }) => {
  const { logout } = useAuth();

  return (
    <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-5 md:px-10">
      <button
        type="button"
        onClick={onMenu}
        aria-label="Open menu"
        className="-ml-2 p-2 text-muted hover:text-fg lg:hidden"
      >
        <PiList className="h-6 w-6" />
      </button>

      <div className="ml-auto flex items-center gap-2">
        <Link
          to="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-muted transition-colors hover:text-fg"
        >
          View site
          <PiArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-2 border border-line px-4 py-2 text-sm text-fg transition-colors hover:border-muted hover:bg-surface"
        >
          <PiSignOut className="h-4 w-4" aria-hidden="true" />
          Log out
        </button>
      </div>
    </div>
  );
};

export default Topbar;
