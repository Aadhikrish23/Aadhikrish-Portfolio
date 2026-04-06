import { useAuth } from "../../context/AuthContext";

const Topbar = () => {
  const { logout } = useAuth();

  return (
    <div className="bg-white shadow p-4 flex justify-between items-center">
      <h2 className="font-semibold">Admin Dashboard</h2>
      <button
        onClick={logout}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default Topbar;