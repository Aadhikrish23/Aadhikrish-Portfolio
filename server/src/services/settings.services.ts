import Settings from "../models/settings.model.js";
import type { UpdateSettingsInput } from "../validators/settings.validator.js";

const KEY = "main";

// Defaults mirror the copy the site shipped with, so a fresh database renders the
// same public site until content is edited in the admin panel.
export const defaultSettings = {
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
    techFocus:
      "React, Node.js, TypeScript, MongoDB, PostgreSQL, REST APIs, and AI integrations",
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

// Returns the single settings document, creating it from the defaults on first read.
async function getSettings() {
  const existing = await Settings.findOne({ key: KEY });
  if (existing) return existing;
  return await Settings.create({ key: KEY, ...defaultSettings });
}

// Merges only the provided top-level groups; arrays replace wholesale.
async function updateSettings(input: UpdateSettingsInput) {
  const current = await getSettings();
  const next = current.toObject();

  if (input.siteName !== undefined) next.siteName = input.siteName;
  if (input.ownerName !== undefined) next.ownerName = input.ownerName;
  if (input.hero) next.hero = { ...next.hero, ...input.hero };
  if (input.about) next.about = { ...next.about, ...input.about };
  if (input.contact) next.contact = { ...next.contact, ...input.contact };

  current.set({
    siteName: next.siteName,
    ownerName: next.ownerName,
    hero: next.hero,
    about: next.about,
    contact: next.contact,
  });
  return await current.save();
}

export default { getSettings, updateSettings };
