import { createElement } from "react";
import SkillIcon from "./SkillIcon";
import { findMonoIcon } from "./monoIcons";

interface Props {
  name: string;
  iconUrl?: string;
  className?: string;
}

// Known technologies render as a crisp single-colour glyph in the muted slate, which
// reads as one icon family. A custom-uploaded icon, or a skill with no glyph, keeps its own
// artwork (desaturated to grey, full colour on hover of the nearest `group` ancestor).
export default function TintedIcon({ name, iconUrl, className = "h-5 w-5" }: Props) {
  const Mono = iconUrl ? undefined : findMonoIcon(name);

  if (Mono) {
    return createElement(Mono, {
      "aria-hidden": true,
      className: `${className} shrink-0 text-muted transition-colors duration-300 group-hover:text-fg`,
    });
  }

  return (
    <span className="inline-flex shrink-0 opacity-90 [filter:grayscale(1)_brightness(1.15)] transition duration-300 group-hover:opacity-100 group-hover:[filter:none]">
      <SkillIcon name={name} iconUrl={iconUrl} className={className} />
    </span>
  );
}
