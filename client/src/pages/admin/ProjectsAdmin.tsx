import { useCallback, useEffect, useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PiArrowDown, PiArrowUp, PiDotsSixVertical, PiPencilSimple, PiPlus, PiTrash } from "react-icons/pi";
import projectApi from "../../APIServices/project.api";
import ProjectForm from "../../components/admin/ProjectForm";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import { Badge, Button, Empty, IconButton, Loading, PageHeader } from "../../components/admin/ui";
import Modal from "../../components/common/Modal";
import { useToast } from "../../context/toast.context";
import { getErrorMessage } from "../../utils/errors";
import type { Project } from "../../types/project.types";

interface RowProps {
  project: Project;
  index: number;
  total: number;
  homeRank: number | null;
  busy: boolean;
  onMove: (from: number, to: number) => void;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

function ProjectRow({ project, index, total, homeRank, busy, onMove, onEdit, onDelete }: RowProps) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id: project._id,
  });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-stretch gap-3 border bg-surface p-3 sm:gap-4 ${
        isDragging ? "relative z-10 border-muted" : "border-line"
      }`}
    >
      <button
        type="button"
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
        disabled={busy}
        aria-label={`Drag to reorder ${project.title}`}
        className="flex w-8 shrink-0 cursor-grab touch-none items-center justify-center text-subtle transition-colors hover:text-fg active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-40"
      >
        <PiDotsSixVertical className="h-6 w-6" aria-hidden="true" />
      </button>

      <span className="hidden w-6 shrink-0 self-center text-center font-display text-xl text-subtle sm:block">
        {index + 1}
      </span>

      <div className="hidden h-16 w-28 shrink-0 items-center justify-center overflow-hidden border border-line bg-canvas sm:flex">
        {project.image ? (
          <img src={project.image} alt="" className="max-h-full max-w-full object-contain" loading="lazy" />
        ) : (
          <span className="font-display text-3xl text-subtle">{project.title.trim().charAt(0)}</span>
        )}
      </div>

      <div className="min-w-0 flex-1 self-center">
        <p className="truncate font-medium text-fg">{project.title}</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          {homeRank === 0 && <Badge tone="accent">Large lead on home</Badge>}
          {homeRank !== null && homeRank > 0 && <Badge tone="accent">On home page</Badge>}
          {project.techStack.slice(0, 3).map((tech) => (
            <Badge key={tech}>{tech}</Badge>
          ))}
          {project.techStack.length > 3 && <span className="text-xs text-subtle">+{project.techStack.length - 3}</span>}
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center justify-end self-center">
        <IconButton label={`Move ${project.title} up`} onClick={() => onMove(index, index - 1)} disabled={busy || index === 0}>
          <PiArrowUp className="h-5 w-5" />
        </IconButton>
        <IconButton
          label={`Move ${project.title} down`}
          onClick={() => onMove(index, index + 1)}
          disabled={busy || index === total - 1}
        >
          <PiArrowDown className="h-5 w-5" />
        </IconButton>
        <IconButton label={`Edit ${project.title}`} onClick={() => onEdit(project)}>
          <PiPencilSimple className="h-5 w-5" />
        </IconButton>
        <IconButton label={`Delete ${project.title}`} onClick={() => onDelete(project)} className="hover:text-red-300">
          <PiTrash className="h-5 w-5" />
        </IconButton>
      </div>
    </li>
  );
}

const ProjectsAdmin = () => {
  const { notify } = useToast();
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState<Project | null>(null);

  const load = useCallback(async () => {
    setLoadFailed(false);
    try {
      const res = await projectApi.getProjects();
      setProjects(res.data);
    } catch (error) {
      setLoadFailed(true);
      notify(getErrorMessage(error, "Could not load projects."), "error");
    }
  }, [notify]);

  useEffect(() => {
    load();
  }, [load]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  // Optimistic: the list moves immediately, and snaps back if the server refuses the new order.
  const applyOrder = async (next: Project[]) => {
    const previous = projects;
    setProjects(next);
    setSavingOrder(true);
    try {
      await projectApi.reorderProjects(next.map((p) => p._id));
      notify("Order saved. It is live on the site now.");
    } catch (error) {
      setProjects(previous);
      notify(getErrorMessage(error, "Could not save the new order."), "error");
    } finally {
      setSavingOrder(false);
    }
  };

  const move = (from: number, to: number) => {
    if (!projects || to < 0 || to >= projects.length || from === to) return;
    applyOrder(arrayMove(projects, from, to));
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!projects || !over || active.id === over.id) return;
    const from = projects.findIndex((p) => p._id === active.id);
    const to = projects.findIndex((p) => p._id === over.id);
    move(from, to);
  };

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (project: Project) => {
    setEditing(project);
    setModalOpen(true);
  };

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setEditing(null);
  }, []);

  // On failure the modal stays open (closeModal only runs after success) so input is not lost.
  const handleSubmit = async (data: FormData) => {
    setSaving(true);
    try {
      if (editing) {
        await projectApi.updateProject(editing._id, data);
      } else {
        await projectApi.createProject(data);
      }
      notify(editing ? "Project updated." : "Project created.");
      closeModal();
      await load();
    } catch (error) {
      notify(getErrorMessage(error, "Could not save the project."), "error");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await projectApi.deleteProject(toDelete._id);
      notify(`Deleted "${toDelete.title}".`);
      setToDelete(null);
      await load();
    } catch (error) {
      notify(getErrorMessage(error, "Could not delete the project."), "error");
    }
  };

  // Home shows featured projects in this same order; the first is the large lead.
  const homeRanks = new Map<string, number>();
  (projects ?? [])
    .filter((p) => p.featured)
    .forEach((p, i) => homeRanks.set(p._id, i));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Projects"
        description="Drag to reorder. The order here is the order on your site; featured projects also appear on the home page."
        action={
          <Button variant="primary" onClick={openCreate}>
            <PiPlus className="h-4 w-4" aria-hidden="true" />
            Add project
          </Button>
        }
      />

      {loadFailed && !projects ? (
        <Empty
          title="Could not load projects"
          body="The server may still be waking up."
          action={<Button onClick={load}>Try again</Button>}
        />
      ) : !projects ? (
        <Loading rows={4} />
      ) : projects.length === 0 ? (
        <Empty
          title="No projects yet"
          body="Add your first project to show it on the site."
          action={
            <Button variant="primary" onClick={openCreate}>
              <PiPlus className="h-4 w-4" aria-hidden="true" />
              Add project
            </Button>
          }
        />
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={projects.map((p) => p._id)} strategy={verticalListSortingStrategy}>
            <ul className="space-y-2" aria-label="Projects in display order">
              {projects.map((project, index) => (
                <ProjectRow
                  key={project._id}
                  project={project}
                  index={index}
                  total={projects.length}
                  homeRank={homeRanks.get(project._id) ?? null}
                  busy={savingOrder}
                  onMove={move}
                  onEdit={openEdit}
                  onDelete={setToDelete}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}

      <Modal isOpen={modalOpen} onClose={closeModal} title={editing ? "Edit project" : "New project"}>
        <ProjectForm key={editing?._id ?? "new"} initialData={editing ?? undefined} onSubmit={handleSubmit} loading={saving} />
      </Modal>

      <ConfirmDialog
        open={toDelete !== null}
        title="Delete project"
        message={`"${toDelete?.title ?? ""}" will be removed from your site. This cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
};

export default ProjectsAdmin;
