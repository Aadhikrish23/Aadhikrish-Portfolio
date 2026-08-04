import { useState, useEffect } from "react";
import type { Skill } from "../../types/skills.types";
import SkillIcon from "../common/SkillIcon";

interface Props {
  initialData?: Skill;
  onSubmit: (data: Skill) => void;
}

const SkillForm = ({ initialData, onSubmit }: Props) => {
  const [form, setForm] = useState<Skill>({
    name: "",
    category: "frontend",
    level: 5,
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({
        name: "",
        category: "frontend",
        level: 5,
      });
    }
  }, [initialData]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        const { _id, ...cleanData } = form; // ✅ remove _id

        onSubmit(cleanData);
      }}
      className="grid gap-4"
    >
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <label className="block text-sm text-gray-600 mb-1">Skill Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border p-3 rounded w-full"
            placeholder="e.g. React, Node.js, Python"
          />
        </div>
        <div className="flex flex-col items-center justify-center w-16 pt-5">
           <SkillIcon name={form.name || "unknown"} className="w-8 h-8" />
        </div>
      </div>

      <select
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value as any })}
        className="border p-3 rounded"
      >
        <option value="frontend">Frontend</option>
        <option value="backend">Backend</option>
        <option value="tools">Tools</option>
        <option value="database">Database</option>
        <option value="ai">AI Services</option>
      </select>

      <input
        type="number"
        value={form.level || 5}
        onChange={(e) => {
          let value = Number(e.target.value);

          if (value > 10) value = 10;
          if (value < 1) value = 1;

          setForm({ ...form, level: value });
        }}
        className="border p-3 rounded"
        min={1}
        max={10}
      />

      <button className="bg-black text-white py-2 rounded">Save Skill</button>
    </form>
  );
};

export default SkillForm;
