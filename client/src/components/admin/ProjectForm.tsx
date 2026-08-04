import { useEffect, useState, useRef } from "react";
import type { ParsedDescription, Project } from "../../types/project.types";
import skillsApi from "../../APIServices/skills.api";
import type { Skill } from "../../types/skills.types";
import { FaCode, FaTimes, FaChevronDown } from "react-icons/fa";

interface Props {
  initialData?: Partial<Project>;
  onSubmit: (data: FormData) => Promise<void>;
  loading: boolean;
}

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
  
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadSkills = async () => {
      try {
        const res = await skillsApi.getSkills();
        setAvailableSkills(res.data);
      } catch (err) {
        console.error("Failed to load skills", err);
      }
    };
    loadSkills();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔹 Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    setForm({
      ...form,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    });
  };

  const handleSkillToggle = (skillName: string) => {
    setForm(prev => {
      const isSelected = prev.techStack.includes(skillName);
      if (isSelected) {
        return { ...prev, techStack: prev.techStack.filter(s => s !== skillName) };
      } else {
        return { ...prev, techStack: [...prev.techStack, skillName] };
      }
    });
  };

  // 🔹 Combine fields into ONE description string
  const buildDescription = () => {
    return `
${form.description}

Problem: ${form.problem}

Solution: ${form.solution}

Key Features:
${form.features
  .split(",")
  .map((f) => `• ${f.trim()}`)
  .join("\n")}
    `.trim();
  };

  // 🔹 Parse description back (for edit)
 const parseDescription = (desc: string): ParsedDescription => {
    const lines = desc.split("\n");

    let description = "";
    let problem = "";
    let solution = "";
    let features: string[] = [];

    lines.forEach((line) => {
      if (line.startsWith("Problem:")) {
        problem = line.replace("Problem:", "").trim();
      } else if (line.startsWith("Solution:")) {
        solution = line.replace("Solution:", "").trim();
      } else if (line.startsWith("•")) {
        features.push(line.replace("•", "").trim());
      } else if (
        !line.startsWith("Key Features:") &&
        !line.startsWith("Problem:") &&
        !line.startsWith("Solution:")
      ) {
        description += line + "\n";
      }
    });

    return {
      description: description.trim(),
      problem,
      solution,
      features: features.join(", "),
    };
  };

  // 🔹 Prefill form when editing
  useEffect(() => {
    if (initialData) {
    const parsed: ParsedDescription = initialData.description
  ? parseDescription(initialData.description)
  : {
      description: "",
      problem: "",
      solution: "",
      features: "",
    };

      setForm({
        title: initialData.title || "",
        techStack: initialData.techStack || [],
        githubUrl: initialData.githubUrl || "",
        liveUrl: initialData.liveUrl || "",
        featured: initialData.featured || false,
        description: parsed.description || "",
        problem: parsed.problem || "",
        solution: parsed.solution || "",
        features: parsed.features || "",
      });
    }
  }, [initialData]);

  // 🔹 Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", form.title);
    formData.append("description", buildDescription());
    formData.append("techStack", form.techStack.join(","));
    formData.append("githubUrl", form.githubUrl);
    formData.append("liveUrl", form.liveUrl);
    formData.append("featured", String(form.featured));

    if (image) {
      formData.append("image", image);
    }

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">Project Title</label>
        <input
          name="title"
          placeholder="e.g. E-Commerce Platform"
          value={form.title}
          onChange={handleChange}
          className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">Short Description</label>
        <textarea
          name="description"
          placeholder="Brief overview of the project..."
          value={form.description}
          onChange={handleChange}
          className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          rows={3}
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">Problem</label>
        <textarea
          name="problem"
          placeholder="What problem does this solve?"
          value={form.problem}
          onChange={handleChange}
          className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          rows={2}
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">Solution</label>
        <textarea
          name="solution"
          placeholder="How did you solve it?"
          value={form.solution}
          onChange={handleChange}
          className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          rows={2}
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">Features (comma separated)</label>
        <textarea
          name="features"
          placeholder="User Auth, Payment Gateway, Real-time Chat..."
          value={form.features}
          onChange={handleChange}
          className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          rows={2}
        />
      </div>

      <div className="space-y-1" ref={dropdownRef}>
        <label className="text-sm font-medium text-slate-700">Tech Stack (Pick Skills)</label>
        <div className="relative">
          <div 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full min-h-[44px] border border-slate-300 p-2 rounded-lg cursor-pointer flex flex-wrap gap-2 items-center bg-white justify-between hover:border-blue-400 transition-colors"
          >
            <div className="flex flex-wrap gap-2 flex-1">
              {form.techStack.length > 0 ? (
                form.techStack.map((tech) => (
                  <span key={tech} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium">
                    {tech}
                    <button 
                      type="button" 
                      onClick={(e) => { e.stopPropagation(); handleSkillToggle(tech); }}
                      className="text-blue-400 hover:text-blue-800 transition-colors"
                    >
                      <FaTimes className="w-3 h-3" />
                    </button>
                  </span>
                ))
              ) : (
                <span className="text-slate-400">Select skills...</span>
              )}
            </div>
            <FaChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </div>

          {isDropdownOpen && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 overflow-y-auto py-1">
              {availableSkills.length > 0 ? (
                availableSkills.map((skill) => (
                  <label 
                    key={skill._id || skill.name} 
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={form.techStack.includes(skill.name)}
                      onChange={() => handleSkillToggle(skill.name)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-slate-700 font-medium">{skill.name}</span>
                    <span className="text-xs text-slate-400 ml-auto capitalize">{skill.category}</span>
                  </label>
                ))
              ) : (
                <div className="p-4 text-center text-slate-500 text-sm">
                  No skills found. Please add skills in the Skills tab first.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">GitHub URL</label>
          <input
            name="githubUrl"
            placeholder="https://github.com/..."
            value={form.githubUrl}
            onChange={handleChange}
            className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Live URL</label>
          <input
            name="liveUrl"
            placeholder="https://..."
            value={form.liveUrl}
            onChange={handleChange}
            className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 py-2">
        <label className="flex items-center gap-2 cursor-pointer group">
          <div className="relative flex items-center">
            <input
              type="checkbox"
              name="featured"
              checked={form.featured}
              onChange={handleChange}
              className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer transition-colors"
            />
          </div>
          <span className="text-slate-700 font-medium group-hover:text-blue-600 transition-colors">Featured Project</span>
        </label>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">Project Image</label>
        <input
          type="file"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all cursor-pointer"
        />
      </div>

      <button 
        className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:transform-none"
        disabled={loading}
      >
        {loading ? "Saving Project..." : "Save Project"}
      </button>
    </form>
  );
};

export default ProjectForm;