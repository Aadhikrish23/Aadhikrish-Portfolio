import type { SiteSettings } from "../types/settings.types";

// Rendered immediately while the (free-tier) backend wakes up, then replaced by the
// content saved in the admin panel. Mirrors the defaults seeded by the server.
export const siteDefaults: SiteSettings = {
  siteName: "Aadhi.dev",
  ownerName: "Aadhi",
  hero: {
    headline: "Hi, I'm Aadhi",
    tagline: "Software Engineer • Full Stack Developer",
    bio: "Full-stack engineer specializing in scalable web applications and AI-driven platforms. Experienced in building production systems with React, Node.js, and modern backend architectures.",
    imageUrl: "/Aadhi.jpeg",
  },
  about: {
    statement:
      "I'm a full-stack engineer working on real-world enterprise systems, where I focus on building scalable backend workflows and clean, maintainable frontend applications.",
    paragraphs: [
      "Currently working as a Software Engineer, I’ve contributed to enterprise-level workflow automation systems, reducing manual processing effort and improving operational efficiency across production environments.",
      "I’m particularly interested in AI-driven applications, developer tools, and systems that enhance productivity and learning experiences.",
    ],
    experiences: [
      {
        role: "Software Engineer",
        company: "Newgen Softwares",
        highlights: [
          "Built and optimized loan origination workflows, reducing manual effort by ~50%",
          "Developed backend validation logic improving system efficiency",
          "Collaborated with clients for requirement analysis and demos",
        ],
      },
    ],
    techFocus: "React, Node.js, TypeScript, MongoDB, PostgreSQL, REST APIs, and AI integrations",
    interests: "AI systems, backend architecture, automation, and developer tooling",
  },
  contact: {
    heading:
      "I'm always open to discussing new opportunities, collaborations, or interesting projects.",
    email: "aadhikrish2307@gmail.com",
    githubUrl: "https://github.com/Aadhikrish23",
    linkedinUrl: "https://www.linkedin.com/in/aadhi-krish/",
  },
};
