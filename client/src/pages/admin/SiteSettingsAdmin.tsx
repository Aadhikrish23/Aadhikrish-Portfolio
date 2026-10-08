import { useEffect, useRef, useState } from "react";
import { FaImage, FaPlus, FaSave, FaSpinner, FaTimes, FaTrash } from "react-icons/fa";
import settingsApi from "../../APIServices/settings.api";
import { siteDefaults } from "../../config/siteDefaults";
import type { SiteSettings } from "../../types/settings.types";

interface ExperienceForm {
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
  paragraphs: string[];
  experiences: ExperienceForm[];
  techFocus: string;
  interests: string;
  contactHeading: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
}

const toForm = (s: SiteSettings): FormState => ({
  siteName: s.siteName,
  ownerName: s.ownerName,
  headline: s.hero.headline,
  tagline: s.hero.tagline,
  bio: s.hero.bio,
  imageUrl: s.hero.imageUrl,
  statement: s.about.statement,
  paragraphs: s.about.paragraphs,
  experiences: s.about.experiences.map((e) => ({
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
    paragraphs: f.paragraphs.map((p) => p.trim()).filter(Boolean),
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

const errorMessage = (err: unknown, fallback: string) =>
  (err as { response?: { data?: { message?: string } } }).response?.data?.message || fallback;

const inputClass =
  "w-full border border-slate-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-800 placeholder-slate-400";

const Card = ({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) => (
  <section className="bg-white border border-slate-200/70 rounded-2xl shadow-sm p-6 md:p-8 space-y-5">
    <div>
      <h2 className="text-xl font-bold text-slate-800">{title}</h2>
      {hint && <p className="text-sm text-slate-500 mt-1">{hint}</p>}
    </div>
    {children}
  </section>
);

const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
  <div className="space-y-1">
    <label className="block text-sm font-semibold text-slate-700">
      {label}
      {hint && <span className="ml-2 text-xs font-normal text-slate-400">{hint}</span>}
    </label>
    {children}
  </div>
);

const SiteSettingsAdmin = () => {
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    settingsApi
      .getSettings()
      .then((res) => setForm(toForm({ ...siteDefaults, ...res.data })))
      .catch((err) => setMessage({ type: "error", text: errorMessage(err, "Couldn't load settings.") }));
  }, []);

  if (!form) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Site Content</h1>
        {message ? (
          <p className="text-red-600">{message.text}</p>
        ) : (
          <p className="text-slate-500">Loading...</p>
        )}
      </div>
    );
  }

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => (f ? { ...f, [key]: value } : f));

  const setParagraph = (i: number, value: string) =>
    set("paragraphs", form.paragraphs.map((p, idx) => (idx === i ? value : p)));

  const setExperience = (i: number, patch: Partial<ExperienceForm>) =>
    set("experiences", form.experiences.map((e, idx) => (idx === i ? { ...e, ...patch } : e)));

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMessage(null);
    try {
      set("imageUrl", await settingsApi.uploadHeroImage(file));
    } catch (err) {
      setMessage({ type: "error", text: errorMessage(err, "Image upload failed. Use a JPG, PNG, WEBP or SVG file.") });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await settingsApi.updateSettings(toPayload(form));
      setForm(toForm({ ...siteDefaults, ...res.data }));
      setMessage({ type: "success", text: "Saved. The public site now shows these changes." });
    } catch (err) {
      setMessage({ type: "error", text: errorMessage(err, "Couldn't save. Please try again.") });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 pb-24 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Site Content</h1>
        <p className="text-slate-500 mt-1">
          Everything on the public homepage that isn't a project, blog post or skill. Change it here instead of in the code.
        </p>
      </div>

      <Card title="Brand">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Site name" hint="shown in the top navigation">
            <input className={inputClass} value={form.siteName} onChange={(e) => set("siteName", e.target.value)} />
          </Field>
          <Field label="Your name" hint="shown in the footer line">
            <input className={inputClass} value={form.ownerName} onChange={(e) => set("ownerName", e.target.value)} />
          </Field>
        </div>
      </Card>

      <Card title="Hero" hint="The first thing visitors see.">
        <Field label="Headline">
          <input className={inputClass} value={form.headline} onChange={(e) => set("headline", e.target.value)} />
        </Field>
        <Field label="Role line" hint="e.g. Software Engineer • Full Stack Developer">
          <input className={inputClass} value={form.tagline} onChange={(e) => set("tagline", e.target.value)} />
        </Field>
        <Field label="Short bio">
          <textarea className={`${inputClass} resize-none`} rows={4} value={form.bio} onChange={(e) => set("bio", e.target.value)} />
        </Field>

        <Field label="Photo" hint="shown beside the headline; leave empty to hide it">
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="w-40 h-48 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 overflow-hidden flex items-center justify-center shrink-0">
              {form.imageUrl ? (
                <img src={form.imageUrl} alt="Hero preview" className="w-full h-full object-cover" />
              ) : (
                <FaImage className="w-8 h-8 text-slate-300" />
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium cursor-pointer transition-colors">
                {uploading ? <FaSpinner className="animate-spin" /> : <FaImage />}
                {uploading ? "Uploading..." : form.imageUrl ? "Change photo" : "Upload photo"}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} disabled={uploading} />
              </label>
              {form.imageUrl && (
                <button
                  type="button"
                  onClick={() => set("imageUrl", "")}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 font-medium transition-colors"
                >
                  <FaTimes /> Remove photo
                </button>
              )}
            </div>
          </div>
        </Field>
      </Card>

      <Card title="About" hint="Update this when you change jobs or focus.">
        <Field label="Lead statement" hint="the large opening sentence">
          <textarea className={`${inputClass} resize-none`} rows={3} value={form.statement} onChange={(e) => set("statement", e.target.value)} />
        </Field>

        <div className="space-y-3">
          <p className="block text-sm font-semibold text-slate-700">Paragraphs</p>
          {form.paragraphs.map((p, i) => (
            <div key={i} className="flex gap-2 items-start">
              <textarea className={`${inputClass} resize-none`} rows={3} value={p} onChange={(e) => setParagraph(i, e.target.value)} />
              <button
                type="button"
                onClick={() => set("paragraphs", form.paragraphs.filter((_, idx) => idx !== i))}
                className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                title="Remove paragraph"
              >
                <FaTrash />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => set("paragraphs", [...form.paragraphs, ""])}
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            <FaPlus /> Add paragraph
          </button>
        </div>

        <div className="space-y-4">
          <p className="block text-sm font-semibold text-slate-700">Experience</p>
          {form.experiences.map((exp, i) => (
            <div key={i} className="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50/60">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-600">{i === 0 ? "Current role" : `Role ${i + 1}`}</p>
                <button
                  type="button"
                  onClick={() => set("experiences", form.experiences.filter((_, idx) => idx !== i))}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove role"
                >
                  <FaTrash />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input className={inputClass} placeholder="Job title" value={exp.role} onChange={(e) => setExperience(i, { role: e.target.value })} />
                <input className={inputClass} placeholder="Company" value={exp.company} onChange={(e) => setExperience(i, { company: e.target.value })} />
              </div>
              <Field label="Highlights" hint="one per line">
                <textarea
                  className={`${inputClass} resize-none`}
                  rows={4}
                  value={exp.highlights}
                  onChange={(e) => setExperience(i, { highlights: e.target.value })}
                />
              </Field>
            </div>
          ))}
          <button
            type="button"
            onClick={() => set("experiences", [...form.experiences, { role: "", company: "", highlights: "" }])}
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            <FaPlus /> Add role
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Tech focus">
            <textarea className={`${inputClass} resize-none`} rows={3} value={form.techFocus} onChange={(e) => set("techFocus", e.target.value)} />
          </Field>
          <Field label="Interests">
            <textarea className={`${inputClass} resize-none`} rows={3} value={form.interests} onChange={(e) => set("interests", e.target.value)} />
          </Field>
        </div>
      </Card>

      <Card title="Contact" hint="Empty links are hidden on the site.">
        <Field label="Closing statement">
          <textarea className={`${inputClass} resize-none`} rows={3} value={form.contactHeading} onChange={(e) => set("contactHeading", e.target.value)} />
        </Field>
        <Field label="Email">
          <input type="email" className={inputClass} value={form.email} onChange={(e) => set("email", e.target.value)} />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="GitHub URL">
            <input className={inputClass} placeholder="https://github.com/..." value={form.githubUrl} onChange={(e) => set("githubUrl", e.target.value)} />
          </Field>
          <Field label="LinkedIn URL">
            <input className={inputClass} placeholder="https://www.linkedin.com/in/..." value={form.linkedinUrl} onChange={(e) => set("linkedinUrl", e.target.value)} />
          </Field>
        </div>
      </Card>

      <div className="sticky bottom-0 -mx-2 px-2 py-4 bg-slate-100/90 backdrop-blur flex items-center gap-4">
        <button
          type="submit"
          disabled={saving || uploading}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-70 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all"
        >
          {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
          {saving ? "Saving..." : "Save changes"}
        </button>
        {message && (
          <p className={message.type === "success" ? "text-green-700 font-medium" : "text-red-600 font-medium"}>
            {message.text}
          </p>
        )}
      </div>
    </form>
  );
};

export default SiteSettingsAdmin;
