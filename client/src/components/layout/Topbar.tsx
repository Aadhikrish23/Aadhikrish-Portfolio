import { useAuth } from "../../context/AuthContext";
import { FaSignOutAlt, FaUserCircle } from "react-icons/fa";

const Topbar = () => {
  const { logout } = useAuth();

  return (
    <div className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <h2 className="font-semibold text-lg text-slate-700 tracking-tight">Overview</h2>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-slate-600 font-medium">
          <FaUserCircle className="w-7 h-7 text-slate-400" />
          <span className="text-sm">Admin User</span>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-200 hover:border-red-200"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Topbar;