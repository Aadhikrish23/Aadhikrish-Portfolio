import { useEffect, useState } from "react";
import skillsApi from "../../APIServices/skills.api";
import SkillForm from "../../components/admin/SkillForm";
import Modal from "../../components/common/Modal";
import type { Skill } from "../../types/skills.types";
import SkillIcon from "../../components/common/SkillIcon";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const SkillsAdmin = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [open, setOpen] = useState(false);

  const fetchSkills = async () => {
    const res = await skillsApi.getSkills();
    setSkills(res.data);
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleSubmit = async (data: Skill) => {
    const { _id, ...cleanData } = data;

    if (editing && editing._id) {
      await skillsApi.updateSkill(editing._id, cleanData);
    } else {
      await skillsApi.createSkill(cleanData);
    }

    setOpen(false);
    setEditing(null);
    fetchSkills();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete skill?")) return;
    await skillsApi.deleteSkill(id);
    fetchSkills();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Skills</h1>
          <p className="text-slate-500 mt-1">Manage your technical skills and expertise.</p>
        </div>

        <button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-md shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 font-medium"
        >
          <FaPlus /> Add Skill
        </button>
      </div>

      <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100">
          {skills.map((s) => (
            <div key={s._id} className="flex justify-between items-center p-5 hover:bg-slate-50/80 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                  <SkillIcon name={s.name} className="w-7 h-7" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-lg">{s.name}</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 capitalize mt-1">
                    {s.category}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => {
                    setEditing(s);
                    setOpen(true);
                  }}
                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <FaEdit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    if (!s._id) return;
                    handleDelete(s._id);
                  }}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <FaTrash className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
          {skills.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              No skills found. Click "Add Skill" to create one.
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={open} onClose={() => setOpen(false)} title={editing ? "Edit Skill" : "Add Skill"}>
        <SkillForm initialData={editing || undefined} onSubmit={handleSubmit} />
      </Modal>
    </div>
  );
};

export default SkillsAdmin;
