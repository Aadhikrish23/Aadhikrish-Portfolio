import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import WordReveal from "../common/WordReveal";
import { useSiteSettings } from "../../context/siteSettings.context";

const ease = [0.16, 1, 0.3, 1] as const;

export default function HeroSection() {
  const reduce = useReducedMotion();
  const { hero } = useSiteSettings();

  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay, ease },
        };

  return (
    <section className="grid min-h-[calc(100dvh-4rem)] items-center gap-16 py-10 md:grid-cols-12 md:gap-8 md:py-10">
      <div className={hero.imageUrl ? "md:col-span-7" : "md:col-span-10"}>
        <WordReveal
          key={hero.headline}
          text={hero.headline}
          className="font-display text-6xl font-medium leading-[1.02] tracking-tight sm:text-7xl lg:text-[6rem]"
        />

        {hero.tagline && (
          <motion.div {...rise(0.45)} className="mt-5 flex items-start gap-4 md:mt-6">
            <span aria-hidden="true" className="mt-[13px] h-0.5 w-10 shrink-0 bg-accent" />
            {/* Roles wrap whole. Each carries a leading bullet; the row is shifted left inside an
                overflow-hidden box so a bullet that lands at the start of a line is clipped. */}
            <h2 className="overflow-hidden text-lg text-muted md:text-xl">
              <span className="-ml-6 flex flex-wrap">
                {hero.tagline.split("•").map((role) => (
                  <span
                    key={role}
                    className="relative whitespace-nowrap pl-6 before:absolute before:left-2.5 before:text-subtle before:content-['•']"
                  >
                    {role.trim()}
                  </span>
                ))}
              </span>
            </h2>
          </motion.div>
        )}

        {hero.bio && (
          <motion.p {...rise(0.55)} className="mt-6 max-w-[52ch] text-lg leading-relaxed text-fg/90 md:mt-8">
            {hero.bio}
          </motion.p>
        )}

        <motion.div {...rise(0.65)} className="mt-8 flex flex-wrap gap-4 md:mt-10">
          <Link
            to="/projects"
            className="bg-accent px-7 py-3.5 font-medium text-on-accent transition-colors hover:bg-muted active:translate-y-px"
          >
            View Projects
          </Link>
          <Link
            to="/#contact"
            className="border border-muted px-7 py-3.5 font-medium text-fg transition-colors hover:bg-fg hover:text-canvas active:translate-y-px"
          >
            Contact Me
          </Link>
        </motion.div>
      </div>

      {hero.imageUrl && (
        <div className="relative mx-auto w-full max-w-sm md:col-span-5 md:max-w-none">
          <motion.div
            {...(reduce
              ? {}
              : {
                  initial: { clipPath: "inset(0 0 100% 0)" },
                  animate: { clipPath: "inset(0 0 0% 0)" },
                  transition: { duration: 1.1, delay: 0.2, ease },
                })}
            className="relative"
          >
            <img
              src={hero.imageUrl}
              alt={`Portrait of ${hero.headline}`}
              fetchPriority="high"
              className="aspect-[4/5] w-full bg-surface object-cover object-[50%_30%]"
            />
          </motion.div>
        </div>
      )}
    </section>
  );
}
