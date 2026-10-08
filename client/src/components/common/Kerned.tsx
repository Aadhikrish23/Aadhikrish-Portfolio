import type { ReactNode } from "react";

// Bodoni Moda ships no kerning for these pairs (W before any lowercase letter, and
// P/F before round letters), which leaves visible gaps in big display titles such as
// "W orkflow". Titles come from the CMS, so the fix is applied to text, not hand-set.
// Verified by measuring pair widths with font-kerning on versus off.
const PAIRS: Record<string, { next: string; em: number }> = {
  W: { next: "oaeiuyrcdgqsnm", em: -0.08 },
  P: { next: "oecdqr", em: -0.05 },
  F: { next: "oecdqr", em: -0.05 },
};

export default function Kerned({ text }: { text: string }) {
  const chars = [...text];
  const out: ReactNode[] = [];
  let buffer = "";

  chars.forEach((ch, i) => {
    const rule = PAIRS[ch];
    const next = chars[i + 1];
    if (rule && next && rule.next.includes(next)) {
      if (buffer) {
        out.push(buffer);
        buffer = "";
      }
      out.push(
        <span key={i} style={{ letterSpacing: `${rule.em}em` }}>
          {ch}
        </span>,
      );
    } else {
      buffer += ch;
    }
  });
  if (buffer) out.push(buffer);

  return <>{out}</>;
}
