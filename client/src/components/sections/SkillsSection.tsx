import skillsApi from "../../APIServices/skills.api";
import type { Skill } from "../../types/skills.types";
import SectionTitle from "../common/SectionTitle";
import TintedIcon from "../common/TintedIcon";
import { EmptyState, ErrorState, Skeleton } from "../common/StateBlocks";
import { useServerData } from "../../hooks/useServerData";

const order = ["frontend", "backend", "ai", "database", "tools"];
const categoryTitles: Record<string, string> = {
  frontend: "Frontend",
  backend: "Backend",
  ai: "AI / Services",
  database: "Database",
  tools: "Tools",
};

// One equal-width column per category on desktop (static strings so Tailwind keeps them).
const columns: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
};

// Strongest first, then alphabetical, so the order is stable and not reshuffled by edits.
const byStrength = (a: Skill, b: Skill) => (b.level ?? 0) - (a.level ?? 0) || a.name.localeCompare(b.name);

export default function SkillsSection() {
  const { data: skills, loading, error } = useServerData(async () => {
    const res = await skillsApi.getSkills();
    return res.data;
  });

  const grouped = (skills ?? []).reduce(
    (acc, skill) => {
      (acc[skill.category] ??= []).push(skill);
      return acc;
    },
    {} as Record<string, Skill[]>,
  );
  const categories = order.filter((c) => grouped[c]?.length);
  // With four or more columns each is narrow, so its skills list one per row
  const narrow = categories.length >= 4;

  return (
    <section id="skills" className="scroll-mt-16 border-t border-line py-20 md:py-28">
      <SectionTitle title="Skills" />

      <div className="mt-14">
        {loading ? (
          <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
            {[0, 1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-40" />
            ))}
          </div>
        ) : error ? (
          <ErrorState title="Couldn't load skills." />
        ) : categories.length === 0 ? (
          <EmptyState title="No skills listed yet." />
        ) : (
          <div
            className={`grid gap-x-10 gap-y-14 sm:grid-cols-2 ${columns[categories.length] ?? columns[5]}`}
          >
            {categories.map((category) => (
              <div key={category} className="border-t border-muted/40 pt-6">
                <h3 className="font-display text-2xl font-medium text-fg md:text-3xl">
                  {categoryTitles[category]}
                </h3>

                <ul
                  className={`mt-7 grid grid-cols-2 gap-x-4 gap-y-4 ${narrow ? "lg:grid-cols-1" : ""}`}
                >
                  {[...grouped[category]].sort(byStrength).map((skill) => (
                    <li
                      key={skill._id}
                      className="group flex min-w-0 items-center gap-3 text-[17px] text-fg"
                    >
                      <TintedIcon
                        name={skill.name}
                        iconUrl={skill.iconUrl}
                        className="h-[22px] w-[22px]"
                      />
                      <span className="truncate">{skill.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
