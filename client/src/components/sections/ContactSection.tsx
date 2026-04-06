import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import SectionTitle from "../common/SectionTitle";

export default function ContactSection() {
  return (
    <section id="contact" className="py-28 px-6 border-t border-gray-800">
      <div className="max-w-5xl mx-auto text-center">

        <SectionTitle title="Contact" />

        <p className="text-gray-400 max-w-2xl mx-auto mb-10">
          I'm always open to discussing new opportunities, collaborations, or interesting projects.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-4">

          <a
            href="mailto:aadhikrish2307@gmail.com"
            className="px-5 py-3 flex items-center gap-2 rounded-lg bg-white text-black font-medium hover:opacity-90 transition"
          >
            <FaEnvelope />
            Email Me
          </a>

          <a href="https://github.com/Aadhikrish23"
            target="_blank"
            className="px-5 py-3 flex items-center gap-2 rounded-lg bg-white/5 border border-gray-700 hover:bg-white/10 transition"
          >
            <FaGithub />
            GitHub
          </a>

          <a
            href="https://www.linkedin.com/in/aadhi-krish/"
            target="_blank"
            className="px-5 py-3 flex items-center gap-2 rounded-lg bg-white/5 border border-gray-700 hover:bg-white/10 transition"
          >
            <FaLinkedin />
            LinkedIn
          </a>

        </div>

      </div>
    </section>
  );
}