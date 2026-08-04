import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex h-screen w-full font-sans" style={{ backgroundColor: '#f1f5f9', color: '#1e293b' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Topbar />
        <main className="p-6 md:p-8 overflow-y-auto w-full h-full custom-scrollbar" style={{ backgroundColor: '#f1f5f9' }}>
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;