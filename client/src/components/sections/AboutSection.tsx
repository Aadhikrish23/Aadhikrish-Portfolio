import SectionTitle from "../common/SectionTitle";
import FullBleed from "../common/FullBleed";
import Kerned from "../common/Kerned";
import { useSiteSettings } from "../../context/siteSettings.context";

export default function AboutSection() {
  const { about } = useSiteSettings();
  const experiences = about.experiences.filter((e) => e.role || e.company);
  const hasFooter = about.techFocus || about.interests;

  return (
    <section id="about" className="scroll-mt-16 border-t border-line pt-20 md:pt-28">
      <SectionTitle title="About Me" />

      <div className="mt-14 grid gap-12 md:grid-cols-12 md:gap-10">
        {about.statement && (
          <p className="font-display text-3xl font-normal leading-snug text-fg md:col-span-7 md:text-4xl">
            <Kerned text={about.statement} />
          </p>
        )}

        {about.paragraphs.length > 0 && (
          <div className="max-w-[56ch] space-y-5 leading-relaxed text-muted md:col-span-5">
            {about.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        )}
      </div>

      {/* Experience owns a full-width Earth Brown field; several roles stack inside it */}
      {experiences.length > 0 && (
        <FullBleed className="mt-20 bg-brown">
          <div className="mx-auto max-w-6xl divide-y divide-fg/25 px-5 md:px-10">
            {experiences.map((exp, i) => (
              <div key={`${exp.role}-${exp.company}-${i}`} className="grid gap-10 py-14 md:grid-cols-12 md:gap-10 md:py-16">
                <h3 className="font-display text-3xl font-medium leading-tight text-fg md:col-span-5 md:text-4xl">
                  <Kerned text={exp.role} />
                  {exp.company && (
                    <span className="mt-2 block text-xl font-normal md:text-2xl">at <Kerned text={exp.company} /></span>
                  )}
                </h3>

                <ul className="space-y-5 md:col-span-7">
                  {exp.highlights.map((item) => (
                    <li key={item} className="flex gap-4 text-lg leading-snug text-fg">
                      <span aria-hidden="true" className="mt-3 h-0.5 w-6 shrink-0 bg-fg" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </FullBleed>
      )}

      {hasFooter && (
        <div className="grid gap-10 pb-16 pt-14 md:grid-cols-12 md:gap-10 md:pb-20">
          {about.techFocus && (
            <div className="md:col-span-7">
              <h3 className="font-display text-2xl text-fg">Tech Focus</h3>
              <p className="mt-3 max-w-[40ch] leading-relaxed text-muted">{about.techFocus}</p>
            </div>
          )}
          {about.interests && (
            <div className="md:col-span-5">
              <h3 className="font-display text-2xl text-fg">Interests</h3>
              <p className="mt-3 max-w-[40ch] leading-relaxed text-muted">{about.interests}</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
