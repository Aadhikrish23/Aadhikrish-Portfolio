import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="pt-24 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}