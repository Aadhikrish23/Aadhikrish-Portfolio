import { useAuth } from "../../context/AuthContext";
import { FaSignOutAlt, FaUserCircle } from "react-icons/fa";

const Topbar = () => {
  const { logout } = useAuth();

  return (
    <div className="bg-white/70 backdrop-blur-xl border-b border-slate-200/50 px-8 py-4 flex justify-between items-center sticky top-0 z-20">
      <div className="flex items-center gap-2 text-slate-800">
        <h2 className="font-semibold text-lg tracking-tight">Overview</h2>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-slate-600 font-medium">
          <FaUserCircle className="w-8 h-8 text-slate-400" />
          <span>Admin User</span>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 px-4 py-2 rounded-lg font-medium transition-colors border border-slate-200 hover:border-red-200"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Topbar;