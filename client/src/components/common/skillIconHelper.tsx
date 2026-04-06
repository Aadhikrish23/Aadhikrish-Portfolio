import type { JSX } from "react";
import {
  FaReact,
  FaNodeJs,
  FaGithub,
  FaGitAlt,
  FaKey,
  FaServer,
} from "react-icons/fa";

import {
  SiMongodb,
  SiPostgresql,
  SiTypescript,
  SiTailwindcss,
  SiPostman,
  SiExpress,
  SiFastapi,
  SiElectron,
  SiOpenai,
} from "react-icons/si";

export const ICON_MAP: Record<string, JSX.Element> = {
  react: <FaReact className="text-blue-400" />,

  nodejs: <FaNodeJs className="text-green-500" />,
  "node.js": <FaNodeJs className="text-green-500" />,

  mongodb: <SiMongodb className="text-green-600" />,
  postgresql: <SiPostgresql className="text-blue-500" />,

  typescript: <SiTypescript className="text-blue-400" />,
  tailwindcss: <SiTailwindcss className="text-cyan-400" />,

  github: <FaGithub className="text-gray-300" />,
  git: <FaGitAlt className="text-orange-500" />,

  postman: <SiPostman className="text-orange-400" />,
  "express.js": <SiExpress className="text-gray-300" />,

  // ✅ NEW ONES
  fastapi: <SiFastapi className="text-green-400" />,
  electron: <SiElectron className="text-cyan-300" />,
  openai: <SiOpenai className="text-green-300" />,

  // 🔁 fallback / conceptual icons
  jwt: <FaKey className="text-yellow-400" />,          // 🔐 security
  "jwt authentication": <FaKey className="text-yellow-400" />,

  "rest api": <FaServer className="text-purple-400" />, // 🖥️ API/server
};