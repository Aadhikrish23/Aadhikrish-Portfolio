// Project descriptions are stored as one string:
// "<summary>\n\nProblem: ...\n\nSolution: ...\n\nKey Features:\n• ..."
// This returns just the summary paragraph for cards and previews.
export const getProjectSummary = (description: string) => {
  const lines: string[] = [];
  for (const line of description.split("\n")) {
    if (/^(Problem:|Solution:|Key Features:|•)/.test(line)) break;
    lines.push(line);
  }
  return lines.join(" ").replace(/\s+/g, " ").trim();
};

// Cuts on a word boundary so a summary never ends mid-word ("privat...").
export const truncateWords = (text: string, max = 170) => {
  if (text.length <= max) return text;
  return `${text.slice(0, max).replace(/\s+\S*$/, "")}\u2026`;
};
