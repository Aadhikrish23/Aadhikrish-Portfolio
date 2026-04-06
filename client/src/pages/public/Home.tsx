
import SkillsSection from "../../components/sections/SkillsSection";
import ProjectSection from "../../components/sections/ProjectSection";
import ContactSection from "../../components/sections/ContactSection";
import BlogSection from "../../components/sections/BlogSection";
import HeroSection from "../../components/sections/HeroSection";
import AboutSection from "../../components/sections/AboutSection";

export default function Home() {
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
