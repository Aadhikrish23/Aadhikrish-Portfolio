// Plain-text excerpt of markdown content for card previews. Headings and list items
// become their own sentences so the preview reads as prose.
const endsSentence = (t: string) => /[.!?:]$/.test(t.trim());
const asSentence = (t: string) => (endsSentence(t) ? t.trim() : `${t.trim()}.`);

export const stripMarkdown = (md: string) =>
  md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^\s{0,3}#{1,6}\s+(.*)$/gm, (_, t: string) => asSentence(t))
    .replace(/^\s*(?:[-*+]|\d+\.)\s+(.*)$/gm, (_, t: string) => asSentence(t))
    .replace(/^\s{0,3}>\s?(.*)$/gm, (_, t: string) => asSentence(t))
    .replace(/(\*\*|__|\*|_|~~)(.*?)\1/g, "$2")
    .replace(/^\s*([-*_]\s*){3,}$/gm, "")
    .replace(/\s+/g, " ")
    .trim();

// Cuts on a word boundary so a preview never ends mid-word.
export const excerpt = (md: string, max = 160) => {
  const text = stripMarkdown(md);
  if (text.length <= max) return text;
  return `${text.slice(0, max).replace(/\s+\S*$/, "")}\u2026`;
};
