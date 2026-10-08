import Kerned from "./Kerned";
import { motion, useReducedMotion } from "motion/react";

interface Props {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "p";
  /** Words (case/punctuation-insensitive) to color with the accent */
  accent?: string[];
}

// Reveals a headline word by word, rising out of a mask. Static under reduced motion.
// Hierarchy: the headline lands first, then the supporting content follows.
export default function WordReveal({ text, className = "", delay = 0, as = "h1", accent = [] }: Props) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  const accented = new Set(accent.map((w) => w.toLowerCase()));

  return (
    <Tag className={className} aria-label={text}>
      {text.split(" ").map((word, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="inline-block overflow-hidden pb-[0.12em] align-bottom"
        >
          <motion.span
            className={`inline-block ${accented.has(word.toLowerCase().replace(/[^a-z]/g, "")) ? "text-accent" : ""}`}
            initial={reduce ? false : { y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: delay + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
          >
            <Kerned text={word} />
            {" "}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
