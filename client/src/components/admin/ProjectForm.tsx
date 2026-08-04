import { useEffect, useState } from "react";
import type { Project } from "../../types/project.types";
import skillsApi from "../../APIServices/skills.api";
import type { Skill } from "../../types/skills.types";
import SkillIcon from "../common/SkillIcon";
import { FaImage, FaCheck, FaGithub, FaExternalLinkAlt } from "react-icons/fa";

interface Props {
  initialData?: Partial<Project>;
  onSubmit: (data: FormData) => Promise<void>;
  loading: boolean;
}

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

const ProjectForm = ({ initialData, onSubmit, loading }: Props) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    problem: "",
    solution: "",
    features: "",
    techStack: [] as string[],
    githubUrl: "",
    liveUrl: "",
    featured: false,
  });

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);

  useEffect(() => {
    skillsApi.getSkills().then((res) => setAvailableSkills(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (initialData) {
      const parsed = initialData.description
        ? parseDescription(initialData.description)
        : { description: "", problem: "", solution: "", features: "" };

      setForm({
        title: initialData.title || "",
        techStack: initialData.techStack || [],
        githubUrl: initialData.githubUrl || "",
        liveUrl: initialData.liveUrl || "",
        featured: initialData.featured || false,
        description: parsed.description,
        problem: parsed.problem,
        solution: parsed.solution,
        features: parsed.features,
      });

      if (initialData.image) setImagePreview(initialData.image);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const toggleSkill = (name: string) => {
    setForm((prev) => ({
      ...prev,
      techStack: prev.techStack.includes(name)
        ? prev.techStack.filter((s) => s !== name)
        : [...prev.techStack, name],
    }));
  };

  const buildDescription = () =>
    `${form.description}\n\nProblem: ${form.problem}\n\nSolution: ${form.solution}\n\nKey Features:\n${form.features
      .split(",")
      .map((f) => `• ${f.trim()}`)
      .join("\n")}`.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", buildDescription());
    fd.append("techStack", form.techStack.join(","));
    fd.append("githubUrl", form.githubUrl);
    fd.append("liveUrl", form.liveUrl);
    fd.append("featured", String(form.featured));
    if (image) fd.append("image", image);
    await onSubmit(fd);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Title */}
      <div className="space-y-1">
        <label className="block text-sm font-semibold text-slate-700">Project Title</label>
        <input
          name="title"
          placeholder="e.g. E-Commerce Platform"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full border border-slate-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-800 placeholder-slate-400"
        />
      </div>

      {/* Description */}
      <div className="space-y-1">
        <label className="block text-sm font-semibold text-slate-700">Short Description</label>
        <textarea
          name="description"
          placeholder="Brief overview of the project..."
          value={form.description}
          onChange={handleChange}
          rows={3}
          className="w-full border border-slate-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-800 placeholder-slate-400 resize-none"
        />
      </div>

      {/* Problem / Solution in 2 cols */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-sm font-semibold text-slate-700">Problem</label>
          <textarea
            name="problem"
            placeholder="What problem did you solve?"
            value={form.problem}
            onChange={handleChange}
            rows={3}
            className="w-full border border-slate-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-800 placeholder-slate-400 resize-none"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-semibold text-slate-700">Solution</label>
          <textarea
            name="solution"
            placeholder="How did you solve it?"
            value={form.solution}
            onChange={handleChange}
            rows={3}
            className="w-full border border-slate-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-800 placeholder-slate-400 resize-none"
          />
        </div>
      </div>

      {/* Features */}
      <div className="space-y-1">
        <label className="block text-sm font-semibold text-slate-700">
          Key Features{" "}
          <span className="text-xs font-normal text-slate-400">comma separated</span>
        </label>
        <input
          name="features"
          placeholder="User Auth, Real-time Chat, Payment Gateway..."
          value={form.features}
          onChange={handleChange}
          className="w-full border border-slate-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-800 placeholder-slate-400"
        />
      </div>

      {/* Tech Stack Badge Picker */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-700">Tech Stack</label>
        {availableSkills.length === 0 ? (
          <p className="text-sm text-slate-400 italic">
            No skills added yet — go to the Skills tab and add some first.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 min-h-[60px]">
            {availableSkills.map((skill) => {
              const selected = form.techStack.includes(skill.name);
              return (
                <button
                  key={skill._id || skill.name}
                  type="button"
                  onClick={() => toggleSkill(skill.name)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium transition-all duration-200 select-none
                    ${selected
                      ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200 scale-105"
                      : "bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                    }`}
                >
                  <SkillIcon
                    name={skill.name}
                    iconUrl={skill.iconUrl}
                    className={`w-4 h-4 rounded-sm ${selected ? "brightness-0 invert" : ""}`}
                  />
                  {skill.name}
                  {selected && <FaCheck className="w-3 h-3 ml-0.5" />}
                </button>
              );
            })}
          </div>
        )}
        {form.techStack.length > 0 && (
          <p className="text-xs text-slate-500 mt-1">
            Selected: {form.techStack.join(", ")}
          </p>
        )}
      </div>

      {/* GitHub + Live URL */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-sm font-semibold text-slate-700 flex items-center gap-1.5">
            <FaGithub className="w-4 h-4" /> GitHub URL
          </label>
          <input
            name="githubUrl"
            placeholder="https://github.com/..."
            value={form.githubUrl}
            onChange={handleChange}
            className="w-full border border-slate-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-800 placeholder-slate-400"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-semibold text-slate-700 flex items-center gap-1.5">
            <FaExternalLinkAlt className="w-3.5 h-3.5" /> Live URL
          </label>
          <input
            name="liveUrl"
            placeholder="https://..."
            value={form.liveUrl}
            onChange={handleChange}
            className="w-full border border-slate-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-800 placeholder-slate-400"
          />
        </div>
      </div>

      {/* Project Image */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-700">Project Screenshot</label>
        {imagePreview ? (
          <div className="relative rounded-xl overflow-hidden border border-slate-200 group">
            <img src={imagePreview} alt="Preview" className="w-full h-44 object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <label className="cursor-pointer px-4 py-2 bg-white/90 rounded-lg text-sm font-medium text-slate-700 hover:bg-white transition-colors">
                Change Image
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>
          </div>
        ) : (
          <label className="flex flex-col items-center gap-2 px-4 py-8 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all group">
            <FaImage className="w-8 h-8 text-slate-300 group-hover:text-blue-400 transition-colors" />
            <span className="text-sm text-slate-400 group-hover:text-blue-500 transition-colors">
              Click to upload a project screenshot
            </span>
            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </label>
        )}
      </div>

      {/* Featured Toggle */}
      <div
        onClick={() => setForm((f) => ({ ...f, featured: !f.featured }))}
        className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
          form.featured
            ? "bg-amber-50 border-amber-300"
            : "bg-slate-50 border-slate-200 hover:border-slate-300"
        }`}
      >
        <div>
          <p className="text-sm font-semibold text-slate-700">Featured Project</p>
          <p className="text-xs text-slate-400 mt-0.5">
            {form.featured ? "This project will be highlighted on your homepage." : "Not shown on homepage."}
          </p>
        </div>
        <div className={`w-10 h-6 rounded-full relative transition-all ${form.featured ? "bg-amber-400" : "bg-slate-300"}`}>
          <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${form.featured ? "left-4.5 translate-x-0.5" : "left-0.5"}`} />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-70 text-white font-bold py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
      >
        {loading ? "Saving Project..." : "Save Project"}
      </button>
    </form>
  );
};

export default ProjectForm;