import type { JSX } from "react";
import { FaReact, FaNodeJs, FaGithub, FaGitAlt } from "react-icons/fa";
import {
  SiMongodb,
  SiPostgresql,
  SiTypescript,
  SiTailwindcss,
  SiPostman,SiExpress,
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
  "express.js": <SiExpress className="text-gray-300" />
};