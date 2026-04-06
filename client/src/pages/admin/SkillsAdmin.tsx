import { useEffect, useState } from "react";
import skillsApi from "../../APIServices/skills.api";
import SkillForm from "../../components/admin/SkillForm";
import Modal from "../../components/common/Modal";
import type { Skill } from "../../types/skills.types";

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

  if (editing && editing._id) { // ✅ guard
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
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Skills</h1>

        <button
          onClick={() => setOpen(true)}
          className="bg-black text-white px-4 py-2 rounded"
        >
          + Add Skill
        </button>
      </div>

      <div className="bg-white rounded-xl shadow">
        {skills.map((s) => (
          <div key={s._id} className="flex justify-between p-4 border-b">
            <div>
              <p className="font-medium">{s.name}</p>
              <p className="text-sm text-gray-500">{s.category}</p>
            </div>

            <div className="space-x-3">
              <button
                onClick={() => {
                  setEditing(s);
                  setOpen(true);
                }}
              >
                Edit
              </button>
              <button
                onClick={() => {
                  if (!s._id) return; // ✅ guard
                  handleDelete(s._id);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={open} onClose={() => setOpen(false)} title="Skill">
        <SkillForm initialData={editing || undefined} onSubmit={handleSubmit} />
      </Modal>
    </div>
  );
};

export default SkillsAdmin;
