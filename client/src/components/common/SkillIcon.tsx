import { useState } from 'react';

interface SkillIconProps {
  name: string;
  className?: string;
  iconUrl?: string;
}

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
  "typescript": "ts",
  "javascript": "js",
};

// Skills that skillicons.dev doesn't have — skip the img request, go straight to fallback
const UNSUPPORTED = new Set([
  "openai", "ollama", "chatgpt", "langchain", "rest api",
  "api", "supabase", "vercel", "gemini",
]);

const SkillIcon = ({ name, className = "w-6 h-6", iconUrl }: SkillIconProps) => {
  const [skillIconError, setSkillIconError] = useState(false);
  const [customIconError, setCustomIconError] = useState(false);

  // 1. Custom uploaded icon wins
  if (iconUrl && !customIconError) {
    return (
      <img
        src={iconUrl}
        alt={name}
        className={`${className} object-contain`}
        onError={() => setCustomIconError(true)}
      />
    );
  }

  const cleanName = name.toLowerCase().trim();
  const formattedName = exactMappings[cleanName] ?? cleanName.replace(/[^a-z0-9]/g, '');
  const isUnsupported = UNSUPPORTED.has(cleanName) || !formattedName;

  // 2. skillicons.dev
  if (!isUnsupported && !skillIconError) {
    return (
      <img
        src={`https://skillicons.dev/icons?i=${formattedName}`}
        alt={name}
        className={`${className} object-contain`}
        onError={() => setSkillIconError(true)}
      />
    );
  }

  // 3. Clean text fallback — abbreviation in a rounded box
  const abbr = name.length <= 2
    ? name.toUpperCase()
    : name.substring(0, 2).toUpperCase();

  return (
    <div
      className={`${className} flex items-center justify-center rounded-md bg-slate-100 border border-slate-200 text-slate-600 font-bold select-none`}
      title={name}
      style={{ fontSize: 'clamp(8px, 35%, 13px)', letterSpacing: '0.02em' }}
    >
      {abbr}
    </div>
  );
};

export default SkillIcon;
