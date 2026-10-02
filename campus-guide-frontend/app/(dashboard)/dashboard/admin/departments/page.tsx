"use client";

import { useEffect, useState, useCallback } from "react";
import { Building2, Loader2, Trash2, UserCheck } from "lucide-react";
import CreateDepartmentForm from "../_components/CreateDepartmentForm";
import { fetchDepartments, deleteDepartment } from "../_actions/adminActions";
import { swConfirmDelete, swErrorToast, swToast } from "@/lib/swal";

interface DeptItem {
  id?: string;
  _id?: string;
  departmentName?: string;
  name?: string;
  code?: string;
  headName?: string;
  description?: string;
  status?: string;
}

const statusStyle: Record<string, string> = {
  ACTIVE:   "bg-emerald-50 text-emerald-600",
  INACTIVE: "bg-gray-100 text-gray-500",
};

export default function AdminDepartmentsPage() {
  const [departments, setDepartments] = useState<DeptItem[]>([]);
  const [loading, setLoading]         = useState(true);
  const [deletingId, setDeletingId]   = useState<string | null>(null);

  const loadDepartments = useCallback(async () => {
    setLoading(true);
    const res = await fetchDepartments();
    if (res.success && Array.isArray(res.data)) {
      setDepartments(res.data as DeptItem[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadDepartments(); }, [loadDepartments]);

  const handleDelete = async (id: string, name: string) => {
    const confirmed = await swConfirmDelete(
      "Delete this department?",
      `"${name}" will be permanently removed.`
    );
    if (!confirmed) return;

    setDeletingId(id);
    const res = await deleteDepartment(id);
    if (res.success) {
      setDepartments((prev) => prev.filter((d) => (d.id || d._id) !== id));
      swToast("Department deleted successfully");
    } else {
      swErrorToast(res.message || "Failed to delete department");
    }
    setDeletingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
          <p className="text-xs text-gray-500 mt-1">Manage university academic departments</p>
        </div>
        <CreateDepartmentForm onDepartmentCreated={loadDepartments} />
      </div>

      {!loading && departments.length > 0 && (
        <p className="text-xs font-semibold text-gray-500">
          {departments.length} department{departments.length !== 1 ? "s" : ""} total
        </p>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-orange-500" size={28} />
        </div>
      ) : departments.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {departments.map((dept) => {
            const id = dept.id || dept._id || "";
            const displayName = dept.departmentName || dept.name || "—";
            const rawStatus = String(dept.status || "ACTIVE").toUpperCase();
            const statusClass = statusStyle[rawStatus] || "bg-gray-100 text-gray-500";
            const isDeleting = deletingId === id;
            return (
              <div key={id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center flex-shrink-0">
                    <Building2 size={20} />
                  </div>
                  <div className="flex items-center gap-2 ml-auto">
                    {dept.code && (
                      <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full uppercase">{dept.code}</span>
                    )}
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusClass}`}>
                      {rawStatus.charAt(0) + rawStatus.slice(1).toLowerCase()}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm leading-snug">{displayName}</h3>
                  {dept.headName && (
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <UserCheck size={12} className="text-gray-400" />{dept.headName}
                    </p>
                  )}
                  {dept.description && <p className="text-xs text-gray-400 mt-1.5 line-clamp-2">{dept.description}</p>}
                </div>
                <div className="pt-2 border-t border-gray-100 flex justify-end">
                  <button onClick={() => handleDelete(id, displayName)} disabled={isDeleting}
                    className="flex items-center gap-1 text-[11px] font-semibold text-gray-400 hover:text-red-500 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                    {isDeleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 flex flex-col items-center gap-4 text-center shadow-sm">
          <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center">
            <Building2 size={32} className="text-orange-300" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">No departments yet</p>
            <p className="text-xs text-gray-400 mt-1">Click &ldquo;Add Department&rdquo; to create one.</p>
          </div>
        </div>
      )}
    </div>
  );
}
