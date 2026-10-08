import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import ToastProvider from "../../context/ToastProvider";

// The admin shares the public site's tokens (the `site` class), so both halves read as one product.
// Below lg the sidebar becomes a drawer: the old fixed 18rem rail left phones with no room for content.
const AdminLayout = () => {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <ToastProvider>
      <div className="site flex h-[100dvh] w-full bg-canvas font-sans text-fg antialiased">
        <Sidebar open={navOpen} onClose={() => setNavOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar onMenu={() => setNavOpen(true)} />
          <main className="custom-scrollbar flex-1 overflow-y-auto px-5 py-8 md:px-10 md:py-10">
            <div className="mx-auto w-full max-w-5xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
};

export default AdminLayout;
