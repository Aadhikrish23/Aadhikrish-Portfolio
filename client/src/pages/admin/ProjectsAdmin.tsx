import { useEffect, useState } from "react";
import projectApi from "../../APIServices/project.api";
import ProjectForm from "../../components/admin/ProjectForm";
import Modal from "../../components/common/Modal";
import type { Project } from "../../types/project.types";

const ProjectsAdmin = () => {
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);

  const [projects, setProjects] = useState<Project[]>([]);
const [editing, setEditing] = useState<Project | null>(null);
  const fetchProjects = async () => {
    const res = await projectApi.getProjects();
    setProjects(res.data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (project: Project) => {
  setEditing(project);
  setModalOpen(true);
};

  const handleSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      if (editing) {
        await projectApi.updateProject(editing._id, data);
      } else {
        await projectApi.createProject(data);
      }

      setModalOpen(false);
      setEditing(null);
      fetchProjects();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;

    await projectApi.deleteProject(id);
    fetchProjects();
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Projects</h1>
        <button
          onClick={openCreate}
          className="bg-black text-white px-4 py-2 rounded"
        >
          + Add Project
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Tech</th>
              <th className="p-3">Featured</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {projects.map((p: any) => (
              <tr key={p._id} className="border-t">
                <td className="p-3">{p.title}</td>
                <td className="p-3 text-sm text-gray-600">
                  {p.techStack.join(", ")}
                </td>
                <td className="p-3 text-center">
                  {p.featured ? "✓" : "—"}
                </td>
                <td className="p-3 text-right space-x-2">
                  <button
                    onClick={() => openEdit(p)}
                    className="text-blue-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Project" : "Create Project"}
      >
        <ProjectForm
          initialData={editing || undefined}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </Modal>
    </div>
  );
};

export default ProjectsAdmin;