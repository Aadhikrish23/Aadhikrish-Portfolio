import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import { useServerStatus } from "../../context/ServerStatusContext";

export default function MainLayout() {
  const { serverReady, connected, failed, retry } = useServerStatus();

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="pt-24 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
        
        {/* ✅ CONNECTED SCREEN */}
        {failed ? (
          /* ❌ GAVE UP */
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <h1 className="text-xl font-semibold mb-2">
              Couldn't reach the server
            </h1>
            <p className="text-gray-400 mb-6 max-w-md">
              The backend didn't respond in time. It may still be starting up.
            </p>
            <button
              onClick={retry}
              className="px-5 py-2 bg-white text-black rounded-lg font-medium hover:opacity-90 transition"
            >
              Try again
            </button>
          </div>
        ) : connected && !serverReady ? (
          <div className="flex items-center justify-center h-[60vh]">
            <h1 className="text-2xl font-semibold">
              ✅ Connected!
            </h1>
          </div>
        ) : !serverReady ? (
          /* ✅ LOADING SCREEN */
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <div className="w-12 h-12 border-4 border-gray-600 border-t-white rounded-full animate-spin mb-6"></div>

            <h1 className="text-xl font-semibold mb-2">
              🚀 Waking up server
            </h1>

            <p className="text-gray-400 mb-4">
              Please wait
              <span className="animate-pulse">.</span>
              <span className="animate-pulse delay-200">.</span>
              <span className="animate-pulse delay-400">.</span>
            </p>

            <p className="text-sm text-gray-500 text-center max-w-md">
              Backend is hosted on free-tier and may take up to 30 seconds.
            </p>
          </div>
        ) : (
          /* ✅ ACTUAL CONTENT */
          <Outlet />
        )}

      </main>
    </div>
  );
}