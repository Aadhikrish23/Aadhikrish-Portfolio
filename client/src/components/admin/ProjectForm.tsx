import { useEffect, useMemo, useState } from "react";
import { PiGithubLogo, PiImage, PiLink } from "react-icons/pi";
import skillsApi from "../../APIServices/skills.api";
import TintedIcon from "../common/TintedIcon";
import { Button, Field, Toggle, fieldClass } from "./ui";
import type { Project } from "../../types/project.types";
import type { Skill } from "../../types/skills.types";

interface Props {
  initialData?: Partial<Project>;
  onSubmit: (data: FormData) => Promise<void>;
  loading: boolean;
}

// The API stores one description string; the form edits it as four parts and rebuilds it on save.
const parseDescription = (desc: string) => {
  const lines = desc.split("\n");
  let description = "";
  let problem = "";
  let solution = "";
  const features: string[] = [];

  lines.forEach((line) => {
    if (line.startsWith("Problem:")) {
      problem = line.replace("Problem:", "").trim();
    } else if (line.startsWith("Solution:")) {
      solution = line.replace("Solution:", "").trim();
    } else if (line.startsWith("•")) {
      features.push(line.replace("•", "").trim());
    } else if (!["Key Features:", "Problem:", "Solution:"].some((p) => line.startsWith(p))) {
      description += line + "\n";
    }
  });

  return { description: description.trim(), problem, solution, features: features.join(", ") };
};

const buildDescription = (form: { description: string; problem: string; solution: string; features: string }) =>
  `${form.description}\n\nProblem: ${form.problem}\n\nSolution: ${form.solution}\n\nKey Features:\n${form.features
    .split(",")
    .map((f) => f.trim())
    .filter(Boolean)
    .map((f) => `• ${f}`)
    .join("\n")}`.trim();

const initialForm = (data?: Partial<Project>) => {
  const parsed = data?.description
    ? parseDescription(data.description)
    : { description: "", problem: "", solution: "", features: "" };
  return {
    title: data?.title ?? "",
    techStack: data?.techStack ?? [],
    githubUrl: data?.githubUrl ?? "",
    liveUrl: data?.liveUrl ?? "",
    featured: data?.featured ?? false,
    ...parsed,
  };
};

// Remount with a new `key` per project (the parent does) so the form always starts from its data.
const ProjectForm = ({ initialData, onSubmit, loading }: Props) => {
  const [form, setForm] = useState(() => initialForm(initialData));
  const [image, setImage] = useState<File | null>(null);
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    skillsApi
      .getSkills()
      .then((res) => setAvailableSkills(res.data))
      .catch(() => {});
  }, []);

  // Local preview of a newly chosen file; revoked when replaced or when the form closes
  const newPreview = useMemo(() => (image ? URL.createObjectURL(image) : null), [image]);
  useEffect(() => () => {
    if (newPreview) URL.revokeObjectURL(newPreview);
  }, [newPreview]);
  const preview = newPreview ?? initialData?.image ?? null;

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => setForm((f) => ({ ...f, [key]: value }));
  const onText = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    set(e.target.name as "title", e.target.value);

  const toggleTech = (name: string) =>
    set("techStack", form.techStack.includes(name) ? form.techStack.filter((s) => s !== name) : [...form.techStack, name]);

  // Selected names that no longer exist as skills stay visible, so they can be unselected
  const techOptions = useMemo(() => {
    const known = new Set(availableSkills.map((s) => s.name));
    const orphans = form.techStack.filter((name) => !known.has(name));
    return [...availableSkills.map((s) => ({ name: s.name, iconUrl: s.iconUrl })), ...orphans.map((name) => ({ name, iconUrl: undefined }))];
  }, [availableSkills, form.techStack]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (form.title.trim().length < 3) return setError("Give the project a title of at least 3 characters.");
    if (form.techStack.length === 0) return setError("Pick at least one technology.");
    if (buildDescription(form).length < 10) return setError("Add a short description.");
    setError("");

    const fd = new FormData();
    fd.append("title", form.title.trim());
    fd.append("description", buildDescription(form));
    fd.append("techStack", form.techStack.join(","));
    // Empty strings are sent on purpose: the server treats them as "remove this link"
    fd.append("githubUrl", form.githubUrl.trim());
    fd.append("liveUrl", form.liveUrl.trim());
    fd.append("featured", String(form.featured));
    if (image) fd.append("image", image);
    await onSubmit(fd);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <Field label="Title" htmlFor="p-title">
        <input
          id="p-title"
          name="title"
          value={form.title}
          onChange={onText}
          placeholder="e.g. SnapBridge"
          required
          className={fieldClass}
        />
      </Field>

      <Field label="Overview" htmlFor="p-desc" hint="Shown on the project cards">
        <textarea
          id="p-desc"
          name="description"
          value={form.description}
          onChange={onText}
          rows={3}
          placeholder="One or two sentences on what it is and who it is for."
          className={`${fieldClass} resize-y`}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Problem" htmlFor="p-problem">
          <textarea
            id="p-problem"
            name="problem"
            value={form.problem}
            onChange={onText}
            rows={4}
            placeholder="What was broken or missing?"
            className={`${fieldClass} resize-y`}
          />
        </Field>
        <Field label="Solution" htmlFor="p-solution">
          <textarea
            id="p-solution"
            name="solution"
            value={form.solution}
            onChange={onText}
            rows={4}
            placeholder="What did you build?"
            className={`${fieldClass} resize-y`}
          />
        </Field>
      </div>

      <Field label="Key features" htmlFor="p-features" hint="Comma separated">
        <input
          id="p-features"
          name="features"
          value={form.features}
          onChange={onText}
          placeholder="Offline sync, QR pairing, folder transfer"
          className={fieldClass}
        />
      </Field>

      <fieldset>
        <legend className="mb-1.5 block text-sm font-medium text-fg">
          Tech stack <span className="ml-2 font-normal text-subtle">{form.techStack.length} selected</span>
        </legend>
        {techOptions.length === 0 ? (
          <p className="border border-dashed border-line p-4 text-muted">
            No skills yet. Add some on the Skills page first, then pick them here.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2 border border-line bg-surface p-3">
            {techOptions.map(({ name, iconUrl }) => {
              const selected = form.techStack.includes(name);
              return (
                <button
                  key={name}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => toggleTech(name)}
                  className={`group inline-flex items-center gap-2 border px-3 py-1.5 text-sm transition-colors ${
                    selected
                      ? "border-accent bg-accent/20 text-fg"
                      : "border-line text-muted hover:border-muted hover:text-fg"
                  }`}
                >
                  <TintedIcon name={name} iconUrl={iconUrl} className="h-4 w-4" />
                  {name}
                </button>
              );
            })}
          </div>
        )}
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="GitHub" htmlFor="p-github" hint="Optional">
          <div className="relative">
            <PiGithubLogo className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-subtle" aria-hidden="true" />
            <input
              id="p-github"
              name="githubUrl"
              type="url"
              value={form.githubUrl}
              onChange={onText}
              placeholder="https://github.com/you/repo"
              className={`${fieldClass} pl-10`}
            />
          </div>
        </Field>
        <Field label="Live site" htmlFor="p-live" hint="Optional">
          <div className="relative">
            <PiLink className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-subtle" aria-hidden="true" />
            <input
              id="p-live"
              name="liveUrl"
              type="url"
              value={form.liveUrl}
              onChange={onText}
              placeholder="https://"
              className={`${fieldClass} pl-10`}
            />
          </div>
        </Field>
      </div>

      <div className="space-y-1.5">
        <p className="text-sm font-medium text-fg">
          Screenshot <span className="ml-2 font-normal text-subtle">Shown whole, never cropped</span>
        </p>
        <label className="group block cursor-pointer border border-dashed border-line transition-colors hover:border-muted focus-within:border-muted">
          {preview ? (
            <div className="relative bg-surface">
              <img src={preview} alt="Screenshot preview" className="mx-auto block max-h-64 w-auto max-w-full object-contain" />
              <span className="absolute bottom-3 right-3 bg-canvas/90 px-3 py-1.5 text-sm text-fg">Replace image</span>
            </div>
          ) : (
            <span className="flex flex-col items-center gap-2 px-4 py-10 text-muted">
              <PiImage className="h-8 w-8 text-subtle" aria-hidden="true" />
              Choose a screenshot
            </span>
          )}
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => setImage(e.target.files?.[0] ?? null)}
          />
        </label>
      </div>

      <Toggle
        checked={form.featured}
        onChange={(next) => set("featured", next)}
        label="Show on the home page"
        description={form.featured ? "Appears in the home page Projects section." : "Only listed on the Projects page."}
      />

      {error && (
        <p role="alert" className="border border-red-400/60 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      )}

      <div className="flex justify-end border-t border-line pt-5">
        <Button type="submit" variant="primary" loading={loading} className="min-w-36">
          {loading ? "Saving" : "Save project"}
        </Button>
      </div>
    </form>
  );
};

export default ProjectForm;
