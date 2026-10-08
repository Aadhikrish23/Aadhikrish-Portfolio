import { PiArrowUpRight, PiEnvelopeSimple, PiGithubLogo, PiLinkedinLogo } from "react-icons/pi";
import type { IconType } from "react-icons";
import FullBleed from "../common/FullBleed";
import Kerned from "../common/Kerned";
import { useSiteSettings } from "../../context/siteSettings.context";

// The page closes on a full-width slate field. Text on it is near-white only:
// the accent blue falls below 4.5:1 against this slate.
function ContactRow({
  icon: Icon,
  label,
  value,
  href,
  external,
}: {
  icon: IconType;
  label: string;
  value: string;
  href: string;
  external?: boolean;
}) {
  return (
    <li className="border-t border-fg/25 last:border-b">
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="group flex items-center gap-4 py-5 text-fg transition-colors hover:text-muted"
      >
        <Icon className="h-6 w-6 shrink-0" aria-hidden="true" />
        <span className="min-w-0 flex-1">
          <span className="block text-sm text-fg/80">{label}</span>
          <span className="block break-words text-lg font-medium md:text-xl">{value}</span>
        </span>
        <PiArrowUpRight className="h-5 w-5 shrink-0 transition-transform motion-safe:group-hover:-translate-y-1 motion-safe:group-hover:translate-x-1" />
      </a>
    </li>
  );
}

const handleOf = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

export default function ContactSection() {
  const { contact, ownerName } = useSiteSettings();
  const hasLinks = contact.email || contact.githubUrl || contact.linkedinUrl;

  return (
    <FullBleed className="bg-brown">
      <section
        id="contact"
        className="mx-auto max-w-6xl scroll-mt-16 px-5 pb-10 pt-24 md:px-10 md:pt-32"
      >
        <div className="grid items-end gap-14 md:grid-cols-12 md:gap-10">
          {contact.heading && (
            <h2
              className={`font-display text-4xl font-medium leading-[1.08] tracking-tight text-fg sm:text-5xl md:text-6xl ${
                hasLinks ? "md:col-span-7" : "md:col-span-12"
              }`}
            >
              <Kerned text={contact.heading} />
            </h2>
          )}

          {hasLinks && (
            <ul className="md:col-span-5">
              {contact.email && (
                <ContactRow icon={PiEnvelopeSimple} label="Email" value={contact.email} href={`mailto:${contact.email}`} />
              )}
              {contact.githubUrl && (
                <ContactRow icon={PiGithubLogo} label="GitHub" value={handleOf(contact.githubUrl)} href={contact.githubUrl} external />
              )}
              {contact.linkedinUrl && (
                <ContactRow icon={PiLinkedinLogo} label="LinkedIn" value={handleOf(contact.linkedinUrl)} href={contact.linkedinUrl} external />
              )}
            </ul>
          )}
        </div>

        <p className="mt-24 border-t border-fg/25 pt-6 text-sm text-fg/80">
          © {new Date().getFullYear()} {ownerName}
        </p>
      </section>
    </FullBleed>
  );
}
