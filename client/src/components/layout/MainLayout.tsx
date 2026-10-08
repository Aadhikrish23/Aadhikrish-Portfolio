import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "./Navbar";
import ServerStatusPill from "./ServerStatusPill";
import SiteSettingsProvider from "../../context/SiteSettingsProvider";

export default function MainLayout() {
  const { pathname, hash } = useLocation();

  // Route changes start at the top, or at the #anchor when one is given
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return (
    <SiteSettingsProvider>
      <div className="site min-h-[100dvh] overflow-x-clip bg-canvas font-sans text-fg antialiased">
        <Navbar />

        <main className="mx-auto max-w-6xl px-5 pt-16 md:px-10">
          <Outlet />
        </main>

        <ServerStatusPill />

        {/* Public pages only: the admin panel uses its own layout, so it is never counted */}
        <Analytics />
      </div>
    </SiteSettingsProvider>
  );
}
