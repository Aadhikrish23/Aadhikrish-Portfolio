import { useState } from 'react';
import type { IconType } from 'react-icons';
import { SiAnthropic, SiClaude, SiGooglegemini, SiLangchain, SiOllama, SiOpenai } from 'react-icons/si';

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
  "python": "py",
  "vscode": "vscode",
  "figma": "figma",
  "git": "git",
  "github": "github",
  "docker": "docker",
  "linux": "linux",
  "aws": "aws",
};

// Skills that skillicons.dev doesn't support — checked by prefix/contains match below
const UNSUPPORTED_KEYWORDS = [
  "openai", "ollama", "chatgpt", "langchain",
  "gemini", "claude", "anthropic", "rest", "api",
];

// Real marks for brands skillicons.dev does not cover (matched by keyword in the skill name)
const brandIcons: [string, IconType][] = [
  ['openai', SiOpenai],
  ['chatgpt', SiOpenai],
  ['langchain', SiLangchain],
  ['anthropic', SiAnthropic],
  ['claude', SiClaude],
  ['gemini', SiGooglegemini],
  ['ollama', SiOllama],
];

const isUnsupportedName = (name: string): boolean => {
  const lower = name.toLowerCase();
  return UNSUPPORTED_KEYWORDS.some((kw) => lower.includes(kw));
};

const SkillIcon = ({ name, className = "w-6 h-6", iconUrl }: SkillIconProps) => {
  const [skillIconError, setSkillIconError] = useState(false);
  const [customIconError, setCustomIconError] = useState(false);

  // 1. Custom uploaded icon always wins
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
  const isUnsupported = isUnsupportedName(name) || !formattedName;

  // 2a. Brand mark for AI services skillicons.dev lacks
  const brand = brandIcons.find(([keyword]) => cleanName.includes(keyword));
  if (isUnsupported && brand) {
    const BrandIcon = brand[1];
    return <BrandIcon className={className} title={name} aria-label={name} />;
  }

  // 2b. Try skillicons.dev
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

  // 3. Abbreviation fallback — works on both dark and light backgrounds
  const abbr = name.trim().length <= 2
    ? name.trim().toUpperCase()
    : name.trim().substring(0, 2).toUpperCase();

  return (
    <div
      className={`${className} flex items-center justify-center rounded-md font-bold select-none`}
      title={name}
      style={{
        fontSize: 'clamp(9px, 38%, 14px)',
        letterSpacing: '0.03em',
        // Neutral look that works on dark portfolio and light admin
        background: 'rgba(128,128,128,0.18)',
        border: '1px solid rgba(128,128,128,0.35)',
        color: 'inherit',
      }}
    >
      {abbr}
    </div>
  );
};

export default SkillIcon;
