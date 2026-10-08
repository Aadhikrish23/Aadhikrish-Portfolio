import { useEffect, useId, useRef, useState } from "react";
import { PiUploadSimple, PiX } from "react-icons/pi";
import type { Skill } from "../../types/skills.types";
import SkillIcon from "../common/SkillIcon";
import skillsApi from "../../APIServices/skills.api";
import { getErrorMessage } from "../../utils/errors";
import { Button, Field, fieldClass } from "./ui";

interface Props {
  initialData?: Skill;
  onSubmit: (data: Skill) => Promise<void>;
  onCancel?: () => void;
}

const CATEGORIES = ["frontend", "backend", "tools", "database", "ai"] as const;

const SkillForm = ({ initialData, onSubmit, onCancel }: Props) => {
  const uid = useId();
  const [form, setForm] = useState<Skill>(initialData ?? { name: "", category: "frontend", level: 5 });
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const urlRef = useRef<string | null>(null);

  const iconPreview = localPreview ?? form.iconUrl ?? null;

  // Revoke the object URL on unmount so previews never leak.
  useEffect(
    () => () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    },
    [],
  );

  const releasePreview = () => {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = null;
    setLocalPreview(null);
  };

  const handleIconFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    releasePreview();
    urlRef.current = URL.createObjectURL(file);
    setLocalPreview(urlRef.current);
    setIconFile(file);
    setUploadError("");
    setForm((f) => ({ ...f, iconUrl: undefined })); // old URL is replaced on save
  };

  const clearIcon = () => {
    releasePreview();
    setIconFile(null);
    setUploadError("");
    setForm((f) => ({ ...f, iconUrl: undefined }));
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setUploadError("");
    try {
      const { _id, ...cleanData } = form;
      void _id;
      const finalData: Skill = { ...cleanData, name: cleanData.name.trim() };

      if (iconFile) {
        try {
          finalData.iconUrl = await skillsApi.uploadSkillIcon(iconFile);
        } catch (err) {
          setUploadError(getErrorMessage(err, "Icon upload failed. Try a PNG, JPG, WEBP or SVG file."));
          return;
        }
      }

      await onSubmit(finalData);
    } finally {
      setSaving(false);
    }
  };

  const level = form.level ?? 5;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <fieldset disabled={saving} className="min-w-0 space-y-6">
        <div className="flex items-end gap-4">
          <div className="min-w-0 flex-1">
            <Field label="Skill name" htmlFor={`${uid}-name`}>
              <input
                id={`${uid}-name`}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={fieldClass}
                placeholder="e.g. React, Node.js, Python"
                required
              />
            </Field>
          </div>
          <div className="flex shrink-0 flex-col items-center gap-1.5">
            <span className="text-sm font-medium text-fg">Preview</span>
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden border border-line bg-surface">
              <SkillIcon name={form.name || "?"} iconUrl={iconPreview ?? undefined} className="h-8 w-8" />
            </div>
          </div>
        </div>

        <Field label="Custom icon" hint="optional, if the auto icon doesn't look right" htmlFor={`${uid}-icon`}>
          {iconPreview ? (
            <div className="flex items-center gap-3 border border-line bg-surface p-3">
              <img src={iconPreview} alt="Icon" className="h-10 w-10 object-contain" />
              <span className="flex-1 truncate text-sm text-muted">{iconFile?.name || "Custom icon"}</span>
              <label
                htmlFor={`${uid}-icon`}
                className="cursor-pointer px-3 py-1.5 text-sm text-fg transition-colors hover:bg-canvas"
              >
                Replace
              </label>
              <button
                type="button"
                onClick={clearIcon}
                aria-label="Remove icon"
                title="Remove icon"
                className="p-1.5 text-muted transition-colors hover:bg-canvas hover:text-fg"
              >
                <PiX className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <label
              htmlFor={`${uid}-icon`}
              className="flex cursor-pointer items-center gap-3 border border-dashed border-line px-4 py-3 text-subtle transition-colors hover:border-muted hover:text-fg"
            >
              <PiUploadSimple className="h-5 w-5" aria-hidden="true" />
              <span className="text-sm">Click to upload a PNG / SVG icon</span>
            </label>
          )}
          <input
            id={`${uid}-icon`}
            ref={fileRef}
            type="file"
            accept="image/png,image/svg+xml,image/jpeg,image/webp"
            className="sr-only"
            onChange={handleIconFile}
          />
        </Field>

        {uploadError && (
          <p role="alert" className="border border-red-400/60 px-4 py-2 text-sm text-red-300">
            {uploadError}
          </p>
        )}

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Category" htmlFor={`${uid}-category`}>
            <select
              id={`${uid}-category`}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className={fieldClass}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c === "ai" ? "AI Services" : c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Proficiency" hint={`${level}/10`} htmlFor={`${uid}-level`}>
            <input
              id={`${uid}-level`}
              type="range"
              min={1}
              max={10}
              value={level}
              onChange={(e) => setForm({ ...form, level: Number(e.target.value) })}
              className="mt-2 w-full accent-accent"
            />
            <div className="flex justify-between text-xs text-subtle">
              <span>Beginner</span>
              <span>Expert</span>
            </div>
          </Field>
        </div>
      </fieldset>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {onCancel && (
          <Button variant="ghost" onClick={onCancel} disabled={saving}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" loading={saving}>
          {saving ? (iconFile ? "Uploading..." : "Saving...") : "Save skill"}
        </Button>
      </div>
    </form>
  );
};

export default SkillForm;
