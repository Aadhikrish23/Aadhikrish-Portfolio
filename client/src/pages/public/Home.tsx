import SkillsSection from "../../components/sections/SkillsSection";
import ProjectSection from "../../components/sections/ProjectSection";
import ContactSection from "../../components/sections/ContactSection";
import BlogSection from "../../components/sections/BlogSection";
import HeroSection from "../../components/sections/HeroSection";
import AboutSection from "../../components/sections/AboutSection";
import { useServerStatus } from "../../context/ServerStatusContext";
export default function Home() {
  const { connected, serverReady } = useServerStatus();

  if (connected && !serverReady) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        <h1 className="text-2xl font-semibold">✅ Connected!</h1>
      </div>
    );
  }

  // 🔵 LOADING SCREEN
  if (!serverReady) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-black text-white">
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-gray-600 border-t-white rounded-full animate-spin mb-6"></div>

        {/* Title */}
        <h1 className="text-2xl font-semibold mb-2">🚀 Waking up server</h1>

        {/* Animated dots */}
        <p className="text-gray-400 mb-4">
          Please wait
          <span className="animate-pulse">.</span>
          <span className="animate-pulse delay-200">.</span>
          <span className="animate-pulse delay-400">.</span>
        </p>

        {/* Info */}
        <p className="text-sm text-gray-500 text-center max-w-md">
          Backend is hosted on free-tier and may take up to 30 seconds to start
          after inactivity.
        </p>
      </div>
    );
  }

  // 🟢 MAIN APP
  return (
    <div>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectSection />
      <BlogSection />
      <ContactSection />
    </div>
  );
}
