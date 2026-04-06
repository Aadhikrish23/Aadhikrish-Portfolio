import InfoCard from "../common/InfoCard";
import SectionTitle from "../common/SectionTitle";

export default function AboutSection() {
  return (
    <section className="py-24 border-t border-gray-800">
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <SectionTitle title="About Me" />

        <div className="grid md:grid-cols-2 gap-12">
          {/* LEFT: TEXT */}
          <div className="space-y-6 text-gray-400 leading-relaxed">
            <p>
              I'm a full-stack engineer working on real-world enterprise
              systems, where I focus on building scalable backend workflows and
              clean, maintainable frontend applications.
            </p>

            <p>
              Currently working as a Software Engineer, I’ve contributed to
              enterprise-level workflow automation systems, reducing manual
              processing effort and improving operational efficiency across
              production environments.
            </p>

            <p>
              I’m particularly interested in AI-driven applications, developer
              tools, and systems that enhance productivity and learning
              experiences.
            </p>
          </div>

          {/* RIGHT: HIGHLIGHTS */}
          <div className="space-y-6">
            {/* Experience Card */}

            <InfoCard
              title={"Software Engineer @ Newgen Softwares"}
              description={
                "Built and optimized loan origination workflows, reducing manual effort by ~50% • Developed backend validation logic improving system efficiency • Collaborated with clients for requirement analysis and demos"
              }
            />

            {/* Tech Focus */}

            <InfoCard
              title={"Tech Focus"}
              description={
                "React, Node.js, TypeScript, MongoDB, PostgreSQL, REST APIs, and AI integrations"
              }
            ></InfoCard>

            {/* Interests */}

            <InfoCard
              title={"Interests"}
              description={
                "AI systems, backend architecture, automation, and developer tooling"
              }
            ></InfoCard>
          </div>
        </div>
      </div>
    </section>
  );
}
