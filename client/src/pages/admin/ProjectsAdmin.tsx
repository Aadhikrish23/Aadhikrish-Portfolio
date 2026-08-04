import { useEffect, useState } from "react";
import projectApi from "../../APIServices/project.api";
import ProjectForm from "../../components/admin/ProjectForm";
import Modal from "../../components/common/Modal";
import type { Project } from "../../types/project.types";
import { FaEdit, FaTrash, FaPlus, FaCheck, FaTimes } from "react-icons/fa";

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
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Projects</h1>
          <p className="text-slate-500 mt-1">Manage your portfolio projects and showcases.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-md shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 font-medium"
        >
          <FaPlus /> Add Project
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm font-medium">
              <tr>
                <th className="p-4 px-6">Title</th>
                <th className="p-4 px-6">Tech Stack</th>
                <th className="p-4 text-center">Featured</th>
                <th className="p-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projects.map((p: any) => (
                <tr key={p._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-4 px-6 font-semibold text-slate-800">{p.title}</td>
                  <td className="p-4 px-6 text-sm text-slate-500">
                    <div className="flex flex-wrap gap-1">
                      {p.techStack.map((tech: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-xs text-slate-600">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    {p.featured ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600">
                        <FaCheck className="w-3 h-3" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-400">
                        <FaTimes className="w-3 h-3" />
                      </span>
                    )}
                  </td>
                  <td className="p-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEdit(p)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <FaEdit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <FaTrash className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    No projects found. Click "Add Project" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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