import { useState } from 'react';

interface SkillIconProps {
  name: string;
  className?: string;
  iconUrl?: string; // custom uploaded icon
}

// Gradient palettes for fallback badges — deterministic by first char
const GRADIENTS = [
  "from-blue-500 to-indigo-600",
  "from-purple-500 to-pink-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-red-600",
  "from-amber-500 to-yellow-600",
  "from-cyan-500 to-blue-600",
  "from-rose-500 to-pink-600",
  "from-violet-500 to-purple-600",
];

const getGradient = (name: string) => {
  const idx = (name.charCodeAt(0) || 0) % GRADIENTS.length;
  return GRADIENTS[idx];
};

const exactMappings: Record<string, string> = {
  "node.js": "nodejs",
  "node": "nodejs",
  "express.js": "express",
  "react.js": "react",
  "next.js": "nextjs",
  "c++": "cpp",
  "c#": "cs",
  "tailwind": "tailwindcss",
  "tailwindcss": "tailwindcss",
  "mongo": "mongodb",
  "postgres": "postgresql",
  "vite": "vite",
  "typescript": "ts",
  "javascript": "js",
};

// Skills that skillicons.dev doesn't support — skip straight to fallback
const UNSUPPORTED = new Set([
  "openai", "ollama", "chatgpt", "langchain", "api",
  "rest api", "graphql", "supabase", "vercel",
]);

const SkillIcon = ({ name, className = "w-6 h-6", iconUrl }: SkillIconProps) => {
  const [imgError, setImgError] = useState(false);

  // 1. Custom uploaded icon always wins
  if (iconUrl && !imgError) {
    return (
      <img
        src={iconUrl}
        alt={name}
        className={className}
        onError={() => setImgError(true)}
      />
    );
  }

  const cleanName = name.toLowerCase().trim();
  const formattedName = exactMappings[cleanName] ?? cleanName.replace(/[^a-z0-9]/g, '');
  const isUnsupported = UNSUPPORTED.has(cleanName) || !formattedName;

  // 2. skillicons.dev
  if (!isUnsupported && !imgError) {
    return (
      <img
        src={`https://skillicons.dev/icons?i=${formattedName}`}
        alt={name}
        className={className}
        onError={() => setImgError(true)}
      />
    );
  }

  // 3. Gradient initial fallback
  const initial = (name[0] || "?").toUpperCase();
  const gradient = getGradient(name);

  return (
    <div
      className={`${className} flex items-center justify-center rounded-lg bg-gradient-to-br ${gradient} text-white font-bold select-none shadow-sm`}
      title={name}
    >
      <span className="text-[55%] leading-none">{initial}</span>
    </div>
  );
};

export default SkillIcon;
