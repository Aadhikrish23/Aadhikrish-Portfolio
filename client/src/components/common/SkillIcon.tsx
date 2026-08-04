import { useState } from 'react';

interface SkillIconProps {
  name: string;
  className?: string;
}

const SkillIcon = ({ name, className = "w-6 h-6" }: SkillIconProps) => {
  const [error, setError] = useState(false);
  
  // Format the name for skillicons.dev (lowercase, remove some special characters)
  const exactMappings: Record<string, string> = {
    "node.js": "nodejs",
    "express.js": "express",
    "react.js": "react",
    "next.js": "nextjs",
    "c++": "cpp",
    "c#": "cs",
    "tailwind": "tailwindcss",
    "mongo": "mongodb",
  };

  const cleanName = name.toLowerCase().trim();
  const formattedName = exactMappings[cleanName] || cleanName.replace(/[^a-z0-9]/g, '');

  // Known unsupported icons in skillicons.dev that should immediately use fallback
  const unsupported = ["openai", "ollama", "chatgpt", "api", "rest api"];
  const isUnsupported = unsupported.includes(cleanName);

  if (error || !formattedName || isUnsupported) {
    return (
      <div 
        className={`${className} flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800 rounded shadow-sm border border-slate-600 text-white select-none`}
        title={name}
      >
        <span className="text-[10px] font-bold uppercase tracking-wider">
          {name.substring(0, 1)}
        </span>
      </div>
    );
  }

  return (
    <img 
      src={`https://skillicons.dev/icons?i=${formattedName}`} 
      alt={name} 
      className={className}
      onError={() => setError(true)}
    />
  );
};

export default SkillIcon;
