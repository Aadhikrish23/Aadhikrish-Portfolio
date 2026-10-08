import { useCallback, useEffect, useState } from "react";
import { PiPencilSimple, PiPlus, PiTrash } from "react-icons/pi";
import skillsApi from "../../APIServices/skills.api";
import SkillForm from "../../components/admin/SkillForm";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import { Badge, Button, Empty, IconButton, Loading, PageHeader } from "../../components/admin/ui";
import Modal from "../../components/common/Modal";
import SkillIcon from "../../components/common/SkillIcon";
import { useToast } from "../../context/toast.context";
import type { Skill } from "../../types/skills.types";
import { getErrorMessage } from "../../utils/errors";

const SkillsAdmin = () => {
  const { notify } = useToast();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [editing, setEditing] = useState<Skill | null>(null);
  const [open, setOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Skill | null>(null);

  const fetchSkills = useCallback(async () => {
    try {
      const res = await skillsApi.getSkills();
      setSkills(res.data);
      setLoadError("");
    } catch (err) {
      setLoadError(getErrorMessage(err, "Could not load skills."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchSkills();
  }, [fetchSkills]);

  const retry = () => {
    setLoading(true);
    void fetchSkills();
  };

  const openCreate = () => {
    setEditing(null);
    setOpen(true);
  };

  const openEdit = (skill: Skill) => {
    setEditing(skill);
    setOpen(true);
  };

  const closeModal = useCallback(() => setOpen(false), []);

  const handleSubmit = async (data: Skill) => {
    const { _id: _ignored, ...cleanData } = data;
    void _ignored;
    try {
      if (editing && editing._id) {
        await skillsApi.updateSkill(editing._id, cleanData);
      } else {
        await skillsApi.createSkill(cleanData);
      }
    } catch (err) {
      notify(getErrorMessage(err, "Could not save the skill."), "error");
      return;
    }
    notify("Skill saved", "success");
    setOpen(false);
    setEditing(null);
    await fetchSkills();
  };

  const handleDelete = async () => {
    const id = toDelete?._id;
    if (!id) return;
    try {
      await skillsApi.deleteSkill(id);
    } catch (err) {
      notify(getErrorMessage(err, "Could not delete the skill."), "error");
      throw err;
    }
    notify("Skill deleted", "success");
    setToDelete(null);
    await fetchSkills();
  };

  const addButton = (
    <Button variant="primary" onClick={openCreate}>
      <PiPlus className="h-4 w-4" aria-hidden="true" /> Add skill
    </Button>
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Skills"
        description="The technologies and tools shown on your public site."
        action={skills.length > 0 ? addButton : undefined}
      />

      {loading ? (
        <Loading rows={4} />
      ) : loadError ? (
        <Empty
          title="Couldn't load skills"
          body={loadError}
          action={<Button onClick={retry}>Try again</Button>}
        />
      ) : skills.length === 0 ? (
        <Empty title="No skills yet" body="Add the first skill to show it on your site." action={addButton} />
      ) : (
        <ul className="divide-y divide-line border border-line">
          {skills.map((s) => (
            <li key={s._id ?? s.name} className="flex items-center justify-between gap-3 p-4 sm:p-5">
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-line bg-surface">
                  <SkillIcon name={s.name} iconUrl={s.iconUrl} className="h-7 w-7" />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-display text-xl text-fg">{s.name}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <Badge>{s.category === "ai" ? "AI Services" : s.category}</Badge>
                    <span className="text-xs text-subtle">Level {s.level}/10</span>
                  </div>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <IconButton label={`Edit ${s.name}`} onClick={() => openEdit(s)}>
                  <PiPencilSimple className="h-5 w-5" aria-hidden="true" />
                </IconButton>
                <IconButton label={`Delete ${s.name}`} onClick={() => setToDelete(s)} disabled={!s._id}>
                  <PiTrash className="h-5 w-5" aria-hidden="true" />
                </IconButton>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal isOpen={open} onClose={closeModal} title={editing ? "Edit skill" : "Add skill"} size="md">
        <SkillForm initialData={editing || undefined} onSubmit={handleSubmit} onCancel={closeModal} />
      </Modal>

      <ConfirmDialog
        open={toDelete !== null}
        title="Delete skill"
        message={`Delete "${toDelete?.name ?? ""}"? This can't be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
};

export default SkillsAdmin;
