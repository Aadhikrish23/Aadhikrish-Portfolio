import { useCallback, useEffect, useRef, useState } from "react";
import { PiFloppyDisk, PiImage, PiPlus, PiTrash, PiX } from "react-icons/pi";
import settingsApi from "../../APIServices/settings.api";
import { siteDefaults } from "../../config/siteDefaults";
import type { SiteSettings } from "../../types/settings.types";
import { Button, Empty, Field, IconButton, Loading, PageHeader, fieldClass } from "../../components/admin/ui";
import { useToast } from "../../context/toast.context";
import { getErrorMessage } from "../../utils/errors";

// `id` exists only to give React stable keys while items are added/removed. It is never sent to the API.
interface ParagraphForm {
  id: string;
  text: string;
}

interface ExperienceForm {
  id: string;
  role: string;
  company: string;
  highlights: string; // one per line
}

interface FormState {
  siteName: string;
  ownerName: string;
  headline: string;
  tagline: string;
  bio: string;
  imageUrl: string;
  statement: string;
  paragraphs: ParagraphForm[];
  experiences: ExperienceForm[];
  techFocus: string;
  interests: string;
  contactHeading: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
}

const newId = () => crypto.randomUUID();

const toForm = (s: SiteSettings): FormState => ({
  siteName: s.siteName,
  ownerName: s.ownerName,
  headline: s.hero.headline,
  tagline: s.hero.tagline,
  bio: s.hero.bio,
  imageUrl: s.hero.imageUrl,
  statement: s.about.statement,
  paragraphs: s.about.paragraphs.map((text) => ({ id: newId(), text })),
  experiences: s.about.experiences.map((e) => ({
    id: newId(),
    role: e.role,
    company: e.company,
    highlights: e.highlights.join("\n"),
  })),
  techFocus: s.about.techFocus,
  interests: s.about.interests,
  contactHeading: s.contact.heading,
  email: s.contact.email,
  githubUrl: s.contact.githubUrl,
  linkedinUrl: s.contact.linkedinUrl,
});

const toPayload = (f: FormState): SiteSettings => ({
  siteName: f.siteName.trim(),
  ownerName: f.ownerName.trim(),
  hero: {
    headline: f.headline.trim(),
    tagline: f.tagline.trim(),
    bio: f.bio.trim(),
    imageUrl: f.imageUrl.trim(),
  },
  about: {
    statement: f.statement.trim(),
    paragraphs: f.paragraphs.map((p) => p.text.trim()).filter(Boolean),
    experiences: f.experiences
      .map((e) => ({
        role: e.role.trim(),
        company: e.company.trim(),
        highlights: e.highlights
          .split("\n")
          .map((h) => h.trim())
          .filter(Boolean),
      }))
      .filter((e) => e.role || e.company),
    techFocus: f.techFocus.trim(),
    interests: f.interests.trim(),
  },
  contact: {
    heading: f.contactHeading.trim(),
    email: f.email.trim(),
    githubUrl: f.githubUrl.trim(),
    linkedinUrl: f.linkedinUrl.trim(),
  },
});

const Section = ({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) => (
  <section className="space-y-6 border-t border-line pt-8">
    <div>
      <h2 className="font-display text-3xl font-medium tracking-tight text-fg">{title}</h2>
      {hint && <p className="mt-1 text-muted">{hint}</p>}
    </div>
    {children}
  </section>
);

const AddButton = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <Button variant="secondary" onClick={onClick}>
    <PiPlus className="h-4 w-4" aria-hidden="true" />
    {label}
  </Button>
);

const SiteSettingsAdmin = () => {
  const { notify } = useToast();
  const [form, setForm] = useState<FormState | null>(null);
  const [baseline, setBaseline] = useState("");
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoadError("");
    try {
      const res = await settingsApi.getSettings();
      const next = toForm({ ...siteDefaults, ...res.data });
      setForm(next);
      setBaseline(JSON.stringify(next));
    } catch (err) {
      setLoadError(getErrorMessage(err, "Couldn't load settings."));
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  // Revoke the temporary preview URL whenever it is replaced or the page unmounts.
  useEffect(() => {
    if (!localPreview) return;
    return () => URL.revokeObjectURL(localPreview);
  }, [localPreview]);

  const dirty = form !== null && JSON.stringify(form) !== baseline;

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  if (loadError) {
    return (
      <div className="space-y-8">
        <PageHeader title="Site content" />
        <Empty
          title="Couldn't load site content"
          body={loadError}
          action={
            <Button variant="primary" onClick={() => void load()}>
              Try again
            </Button>
          }
        />
      </div>
    );
  }

  if (!form) {
    return (
      <div className="space-y-8">
        <PageHeader title="Site content" />
        <Loading rows={4} />
      </div>
    );
  }

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => (f ? { ...f, [key]: value } : f));

  const setParagraph = (id: string, text: string) =>
    set("paragraphs", form.paragraphs.map((p) => (p.id === id ? { ...p, text } : p)));

  const setExperience = (id: string, patch: Partial<ExperienceForm>) =>
    set("experiences", form.experiences.map((e) => (e.id === id ? { ...e, ...patch } : e)));

  const text = (key: "siteName" | "ownerName" | "headline" | "tagline" | "githubUrl" | "linkedinUrl") => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => set(key, e.target.value),
  });

  const area = (
    key: "bio" | "statement" | "techFocus" | "interests" | "contactHeading",
  ) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => set(key, e.target.value),
  });

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLocalPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      set("imageUrl", await settingsApi.uploadHeroImage(file));
      notify("Photo uploaded. Save to publish it.", "success");
    } catch (err) {
      notify(getErrorMessage(err, "Image upload failed. Use a JPG, PNG, WEBP or SVG file."), "error");
    } finally {
      setUploading(false);
      setLocalPreview(null);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving || uploading) return;
    setSaving(true);
    try {
      const res = await settingsApi.updateSettings(toPayload(form));
      const next = toForm({ ...siteDefaults, ...res.data });
      setForm(next);
      setBaseline(JSON.stringify(next));
      notify("Saved. The public site now shows these changes.", "success");
    } catch (err) {
      notify(getErrorMessage(err, "Couldn't save. Please try again."), "error");
    } finally {
      setSaving(false);
    }
  };

  const previewSrc = localPreview ?? form.imageUrl;

  return (
    <form onSubmit={handleSave} className="space-y-10">
      <PageHeader
        title="Site content"
        description="Everything on the public homepage that isn't a project, blog post or skill. Change it here instead of in the code."
      />

      <Section title="Hero" hint="The first thing visitors see.">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Headline" htmlFor="s-headline">
            <input id="s-headline" className={fieldClass} {...text("headline")} />
          </Field>
          <Field label="Role line" hint="e.g. Software Engineer • Full Stack Developer" htmlFor="s-tagline">
            <input id="s-tagline" className={fieldClass} {...text("tagline")} />
          </Field>
        </div>
        <Field label="Short bio" htmlFor="s-bio">
          <textarea id="s-bio" className={`${fieldClass} resize-y`} rows={4} {...area("bio")} />
        </Field>

        <Field label="Photo" hint="shown beside the headline; leave empty to hide it" htmlFor="s-photo">
          <div className="flex flex-col items-start gap-4 sm:flex-row">
            <div className="flex h-48 w-40 shrink-0 items-center justify-center overflow-hidden border border-dashed border-line bg-surface">
              {previewSrc ? (
                <img
                  src={previewSrc}
                  alt="Hero photo preview"
                  className={`h-full w-full object-cover ${uploading ? "opacity-60" : ""}`}
                />
              ) : (
                <PiImage className="h-8 w-8 text-subtle" aria-hidden="true" />
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              <input
                id="s-photo"
                ref={fileRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleImage}
                disabled={uploading}
              />
              <Button variant="secondary" loading={uploading} onClick={() => fileRef.current?.click()}>
                {!uploading && <PiImage className="h-4 w-4" aria-hidden="true" />}
                {uploading ? "Uploading" : form.imageUrl ? "Change photo" : "Upload photo"}
              </Button>
              {form.imageUrl && !uploading && (
                <Button variant="ghost" onClick={() => set("imageUrl", "")}>
                  <PiX className="h-4 w-4" aria-hidden="true" />
                  Remove photo
                </Button>
              )}
            </div>
          </div>
        </Field>
      </Section>

      <Section title="About" hint="Update this when you change jobs or focus.">
        <Field label="Lead statement" hint="the large opening sentence" htmlFor="s-statement">
          <textarea id="s-statement" className={`${fieldClass} resize-y`} rows={3} {...area("statement")} />
        </Field>

        <div className="space-y-3">
          <h3 className="text-sm font-medium text-fg">Paragraphs</h3>
          {form.paragraphs.length === 0 && <p className="text-sm text-muted">No paragraphs yet.</p>}
          {form.paragraphs.map((p, i) => (
            <div key={p.id} className="flex items-start gap-2">
              <textarea
                aria-label={`Paragraph ${i + 1}`}
                className={`${fieldClass} resize-y`}
                rows={3}
                value={p.text}
                onChange={(e) => setParagraph(p.id, e.target.value)}
              />
              <IconButton
                label={`Remove paragraph ${i + 1}`}
                className="mt-1"
                onClick={() => set("paragraphs", form.paragraphs.filter((x) => x.id !== p.id))}
              >
                <PiTrash className="h-4 w-4" aria-hidden="true" />
              </IconButton>
            </div>
          ))}
          <AddButton
            label="Add paragraph"
            onClick={() => set("paragraphs", [...form.paragraphs, { id: newId(), text: "" }])}
          />
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-medium text-fg">Experience</h3>
          {form.experiences.length === 0 && <p className="text-sm text-muted">No roles yet.</p>}
          {form.experiences.map((exp, i) => (
            <fieldset key={exp.id} className="space-y-4 border border-line p-4">
              <legend className="sr-only">{i === 0 ? "Current role" : `Role ${i + 1}`}</legend>
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-muted">{i === 0 ? "Current role" : `Role ${i + 1}`}</p>
                <IconButton
                  label={`Remove ${i === 0 ? "current role" : `role ${i + 1}`}`}
                  onClick={() => set("experiences", form.experiences.filter((x) => x.id !== exp.id))}
                >
                  <PiTrash className="h-4 w-4" aria-hidden="true" />
                </IconButton>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Job title" htmlFor={`exp-role-${exp.id}`}>
                  <input
                    id={`exp-role-${exp.id}`}
                    className={fieldClass}
                    value={exp.role}
                    onChange={(e) => setExperience(exp.id, { role: e.target.value })}
                  />
                </Field>
                <Field label="Company" htmlFor={`exp-company-${exp.id}`}>
                  <input
                    id={`exp-company-${exp.id}`}
                    className={fieldClass}
                    value={exp.company}
                    onChange={(e) => setExperience(exp.id, { company: e.target.value })}
                  />
                </Field>
              </div>
              <Field label="Highlights" hint="one per line" htmlFor={`exp-highlights-${exp.id}`}>
                <textarea
                  id={`exp-highlights-${exp.id}`}
                  className={`${fieldClass} resize-y`}
                  rows={4}
                  value={exp.highlights}
                  onChange={(e) => setExperience(exp.id, { highlights: e.target.value })}
                />
              </Field>
            </fieldset>
          ))}
          <AddButton
            label="Add role"
            onClick={() =>
              set("experiences", [...form.experiences, { id: newId(), role: "", company: "", highlights: "" }])
            }
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Tech focus" htmlFor="s-tech">
            <textarea id="s-tech" className={`${fieldClass} resize-y`} rows={3} {...area("techFocus")} />
          </Field>
          <Field label="Interests" htmlFor="s-interests">
            <textarea id="s-interests" className={`${fieldClass} resize-y`} rows={3} {...area("interests")} />
          </Field>
        </div>
      </Section>

      <Section title="Contact" hint="Empty links are hidden on the site.">
        <Field label="Closing statement" htmlFor="s-contact-heading">
          <textarea
            id="s-contact-heading"
            className={`${fieldClass} resize-y`}
            rows={3}
            {...area("contactHeading")}
          />
        </Field>
        <Field label="Email" htmlFor="s-email">
          <input
            id="s-email"
            type="email"
            autoComplete="off"
            className={fieldClass}
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
          />
        </Field>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="GitHub URL" htmlFor="s-github">
            <input
              id="s-github"
              type="url"
              placeholder="https://github.com/..."
              className={fieldClass}
              {...text("githubUrl")}
            />
          </Field>
          <Field label="LinkedIn URL" htmlFor="s-linkedin">
            <input
              id="s-linkedin"
              type="url"
              placeholder="https://www.linkedin.com/in/..."
              className={fieldClass}
              {...text("linkedinUrl")}
            />
          </Field>
        </div>
      </Section>

      <Section title="Site" hint="Brand details used across every page.">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Site name" hint="shown in the top navigation" htmlFor="s-site-name">
            <input id="s-site-name" className={fieldClass} {...text("siteName")} />
          </Field>
          <Field label="Your name" hint="shown in the footer line" htmlFor="s-owner-name">
            <input id="s-owner-name" className={fieldClass} {...text("ownerName")} />
          </Field>
        </div>
      </Section>

      <div className="sticky bottom-0 z-10 flex items-center justify-between gap-4 border-t border-line bg-canvas py-4">
        <p className="text-sm text-muted" role="status" aria-live="polite">
          {dirty ? (
            <span className="inline-flex items-center gap-2 text-accent-text">
              <span className="h-2 w-2 bg-accent" aria-hidden="true" />
              Unsaved changes
            </span>
          ) : (
            "All changes saved"
          )}
        </p>
        <Button type="submit" variant="primary" loading={saving} disabled={!dirty || uploading}>
          {!saving && <PiFloppyDisk className="h-4 w-4" aria-hidden="true" />}
          {saving ? "Saving" : "Save changes"}
        </Button>
      </div>
    </form>
  );
};

export default SiteSettingsAdmin;
