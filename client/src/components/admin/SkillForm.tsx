import { useState, useEffect, useRef } from "react";
import type { Skill } from "../../types/skills.types";
import SkillIcon from "../common/SkillIcon";
import skillsApi from "../../APIServices/skills.api";
import { FaUpload, FaTimes, FaSpinner } from "react-icons/fa";

interface Props {
  initialData?: Skill;
  onSubmit: (data: Skill) => void;
}

const CATEGORIES = ["frontend", "backend", "tools", "database", "ai"] as const;

const SkillForm = ({ initialData, onSubmit }: Props) => {
  const [form, setForm] = useState<Skill>({
    name: "",
    category: "frontend",
    level: 5,
  });

  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
      setIconPreview(initialData.iconUrl || null);
    } else {
      setForm({ name: "", category: "frontend", level: 5 });
      setIconPreview(null);
      setIconFile(null);
    }
  }, [initialData]);

  const handleIconFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIconFile(file);
    setUploadError("");
    setIconPreview(URL.createObjectURL(file));
    setForm((f) => ({ ...f, iconUrl: undefined })); // clear old URL until upload
  };

  const clearIcon = () => {
    setIconFile(null);
    setIconPreview(null);
    setForm((f) => ({ ...f, iconUrl: undefined }));
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { _id, ...cleanData } = form;

    let finalData = { ...cleanData };

    if (iconFile) {
      try {
        setUploading(true);
        setUploadError("");
        const url = await skillsApi.uploadSkillIcon(iconFile);
        finalData.iconUrl = url;
      } catch (err) {
        const res = (err as { response?: { data?: { message?: string } } }).response;
        setUploadError(
          res?.data?.message ||
            "Icon upload failed. Try a PNG, JPG, WEBP or SVG file.",
        );
        return;
      } finally {
        setUploading(false);
      }
    }

    onSubmit(finalData as Skill);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Skill Name + Icon Preview */}
      <div className="flex items-end gap-4">
        <div className="flex-1 space-y-1">
          <label className="block text-sm font-semibold text-slate-700">
            Skill Name
          </label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-slate-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-800 placeholder-slate-400"
            placeholder="e.g. React, Node.js, Python"
            required
          />
        </div>
        {/* Live icon preview */}
        <div className="flex-shrink-0 flex flex-col items-center gap-1">
          <span className="text-xs text-slate-500 font-medium">Preview</span>
          <div className="w-14 h-14 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden">
            <SkillIcon
              name={form.name || "?"}
              iconUrl={iconPreview || form.iconUrl}
              className="w-10 h-10"
            />
          </div>
        </div>
      </div>

      {/* Custom icon upload */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-700">
          Custom Icon{" "}
          <span className="text-xs text-slate-400 font-normal">
            (optional — if auto icon doesn't look right)
          </span>
        </label>
        {iconPreview ? (
          <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <img src={iconPreview} alt="Icon" className="w-10 h-10 rounded-lg object-contain" />
            <span className="text-sm text-slate-600 flex-1 truncate">
              {iconFile?.name || "Custom icon"}
            </span>
            <button
              type="button"
              onClick={clearIcon}
              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <FaTimes className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all group">
            <FaUpload className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
            <span className="text-sm text-slate-500 group-hover:text-blue-600 transition-colors">
              Click to upload PNG / SVG icon
            </span>
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/svg+xml,image/jpeg,image/webp"
              className="hidden"
              onChange={handleIconFile}
            />
          </label>
        )}
      </div>

      {uploadError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2">
          {uploadError}
        </p>
      )}

      {/* Category + Level in a row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-sm font-semibold text-slate-700">Category</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value as any })}
            className="w-full border border-slate-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-800 bg-white capitalize"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="capitalize">
                {c === "ai" ? "AI Services" : c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-semibold text-slate-700">
            Proficiency Level{" "}
            <span className="font-bold text-blue-600">{form.level ?? 5}/10</span>
          </label>
          <input
            type="range"
            min={1}
            max={10}
            value={form.level ?? 5}
            onChange={(e) => setForm({ ...form, level: Number(e.target.value) })}
            className="w-full accent-blue-600 mt-2"
          />
          <div className="flex justify-between text-xs text-slate-400">
            <span>Beginner</span>
            <span>Expert</span>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={uploading}
        className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-70 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
      >
        {uploading ? (
          <>
            <FaSpinner className="animate-spin" /> Uploading Icon...
          </>
        ) : (
          "Save Skill"
        )}
      </button>
    </form>
  );
};

export default SkillForm;
