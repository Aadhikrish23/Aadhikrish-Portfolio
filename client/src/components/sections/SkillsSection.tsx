import { useState, useEffect } from "react";
import skillsApi from "../../APIServices/skills.api";
import type { Skill } from "../../types/skills.types";
import SectionTitle from "../common/SectionTitle";
import { getIcon } from "../../utils/skilliconmapper";
export default function SkillsSection() {
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await skillsApi.getSkills();
        setSkills(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSkills();
  }, []);
  const groupedSkills = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    },
    {} as Record<string, Skill[]>,
  );

  const order = ["frontend", "backend", "database", "tools"];
  return (
    <section className="py-28 border-t border-gray-800">
      <div className="max-w-6xl mx-auto">
        <SectionTitle title={"Skill"}></SectionTitle>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 ">
          {order.map((category) => {
            const skills = groupedSkills[category];
            if (!skills) return null;

            return (
              <div
                key={category}
                className="h-full min-h-[140px] border border-gray-800 rounded-xl p-6 hover:border-gray-600 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-white/5"
              >
                <h3 className="text-lg font-semibold mb-4 capitalize">
                  {category}
                </h3>

                <div className="grid grid-cols-1 gap-3 py-2 ">
                  {skills.map((skill) => (
                    <div
                      key={skill._id}
                      className="flex items-center justify-start gap-2 px-3 py-2 border border-gray-700 rounded-lg text-sm hover:border-gray-500 hover:bg-white/5 transition "
                    >
                      <span className="flex-shrink-0">
                        {getIcon(skill.name)}
                      </span>
                      <span>{skill.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
