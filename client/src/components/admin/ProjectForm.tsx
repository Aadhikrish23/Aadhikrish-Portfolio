import { useEffect, useState } from "react";
import type { ParsedDescription, Project } from "../../types/project.types";

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
    techStack: "",
    githubUrl: "",
    liveUrl: "",
    featured: false,
  });

  const [image, setImage] = useState<File | null>(null);

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
        techStack: initialData.techStack?.join(",") || "",
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
    formData.append("techStack", form.techStack);
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
      
      <input
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        className="border p-2 rounded"
      />

      <textarea
        name="description"
        placeholder="Short Description"
        value={form.description}
        onChange={handleChange}
        className="border p-2 rounded"
      />

      <textarea
        name="problem"
        placeholder="Problem"
        value={form.problem}
        onChange={handleChange}
        className="border p-2 rounded"
      />

      <textarea
        name="solution"
        placeholder="Solution"
        value={form.solution}
        onChange={handleChange}
        className="border p-2 rounded"
      />

      <textarea
        name="features"
        placeholder="Features (comma separated)"
        value={form.features}
        onChange={handleChange}
        className="border p-2 rounded"
      />

      <input
        name="techStack"
        placeholder="React,Node,Mongo"
        value={form.techStack}
        onChange={handleChange}
        className="border p-2 rounded"
      />

      <input
        name="githubUrl"
        placeholder="GitHub URL"
        value={form.githubUrl}
        onChange={handleChange}
        className="border p-2 rounded"
      />

      <input
        name="liveUrl"
        placeholder="Live URL"
        value={form.liveUrl}
        onChange={handleChange}
        className="border p-2 rounded"
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="featured"
          checked={form.featured}
          onChange={handleChange}
        />
        Featured
      </label>

      <input
        type="file"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
      />

      <button className="bg-black text-white py-2 rounded">
        {loading ? "Saving..." : "Save Project"}
      </button>
    </form>
  );
};

export default ProjectForm;