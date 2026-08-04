import { useState } from 'react';
import { FaCode } from 'react-icons/fa';

interface SkillIconProps {
  name: string;
  className?: string;
}

const SkillIcon = ({ name, className = "w-6 h-6" }: SkillIconProps) => {
  const [error, setError] = useState(false);
  
  // Format the name for skillicons.dev (lowercase, remove some special characters)
  // Some mappings for common names that might not exactly match skillicons
  const exactMappings: Record<string, string> = {
    "node.js": "nodejs",
    "express.js": "express",
    "react.js": "react",
    "next.js": "nextjs",
    "c++": "cpp",
    "c#": "cs"
  };

  const cleanName = name.toLowerCase().trim();
  const formattedName = exactMappings[cleanName] || cleanName.replace(/[^a-z0-9]/g, '');

  if (error || !formattedName) {
    return <FaCode className={`${className} text-gray-400`} />;
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
