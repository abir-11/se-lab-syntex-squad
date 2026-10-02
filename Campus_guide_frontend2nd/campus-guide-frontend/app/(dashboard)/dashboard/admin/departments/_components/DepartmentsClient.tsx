"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Building2 } from "lucide-react";
import {
  createDepartmentAction,
  updateDepartmentAction,
  deleteDepartmentAction,
} from "../../_actions/adminActions";

type Department = {
  id: string;
  departmentName: string;
  description: string | null;
  status: "ACTIVE" | "INACTIVE";
};

const inputClass =
  "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F68B1F]/40 focus:border-[#F68B1F] transition-all";

export default function DepartmentsClient({
  departments,
}: {
  departments: Department[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [form, setForm] = useState({ departmentName: "", description: "" });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.departmentName) {
      toast.error("Department name is required.");
      return;
    }

    setIsSubmitting(true);
    const result = await createDepartmentAction({
      departmentName: form.departmentName,
      description: form.description || undefined,
    });
    setIsSubmitting(false);

    if (result.success) {
      toast.success("Department created!");
      setForm({ departmentName: "", description: "" });
      startTransition(() => router.refresh());
    } else {
      toast.error(result.message || "Failed to create department");
    }
  };

  const handleToggleStatus = async (dept: Department) => {
    setBusyId(dept.id);
    const result = await updateDepartmentAction(dept.id, {
      status: dept.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
    });
    setBusyId(null);

    if (result.success) {
      toast.success(
        `Department ${dept.status === "ACTIVE" ? "deactivated" : "activated"}`
      );
      startTransition(() => router.refresh());
    } else {
      toast.error(result.message || "Failed to update department");
    }
  };

  const handleDelete = async (dept: Department) => {
    if (!window.confirm(`Delete department "${dept.departmentName}"?`)) return;

    setBusyId(dept.id);
    const result = await deleteDepartmentAction(dept.id);
    setBusyId(null);

    if (result.success) {
      toast.success("Department deleted");
      startTransition(() => router.refresh());
    } else {
      toast.error(result.message || "Failed to delete department");
    }
  };

  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-3xl font-extrabold text-gray-900">Departments</h1>
      <p className="text-gray-500 text-sm mt-1">
        Manage campus departments shown across the platform.
      </p>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-8">
        {/* Create form */}
        <form
          onSubmit={handleCreate}
          className="bg-white border border-gray-200 rounded-2xl p-6 h-fit space-y-4"
        >
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#F68B1F]" />
            New Department
          </h2>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">
              Name *
            </label>
            <input
              value={form.departmentName}
              onChange={(e) => setForm({ ...form, departmentName: e.target.value })}
              placeholder="Computer Science & Engineering"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              placeholder="Optional description..."
              className={`${inputClass} resize-none`}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#F68B1F] hover:bg-[#d97414] text-white font-bold text-sm disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Create Department
              </>
            )}
          </button>
        </form>

        {/* List */}
        <div className="xl:col-span-2 space-y-4">
          {departments.length > 0 ? (
            departments.map((dept) => (
              <div
                key={dept.id}
                className="bg-white border border-gray-200 rounded-2xl p-5 flex items-start justify-between gap-4"
              >
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-900">
                    {dept.departmentName}
                  </h3>
                  {dept.description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {dept.description}
                    </p>
                  )}
                  <span
                    className={`inline-block mt-2 text-[11px] font-bold uppercase tracking-wider rounded-full px-3 py-1 border ${
                      dept.status === "ACTIVE"
                        ? "bg-emerald-50 text-emerald-600 border-emerald-300"
                        : "bg-gray-50 text-gray-400 border-gray-200"
                    }`}
                  >
                    {dept.status}
                  </span>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    onClick={() => handleToggleStatus(dept)}
                    disabled={busyId === dept.id}
                    className="text-xs font-semibold text-gray-600 hover:text-[#F68B1F] px-3 py-2 rounded-lg border border-gray-200 hover:border-[#F68B1F]/50 transition-colors disabled:opacity-50"
                  >
                    {dept.status === "ACTIVE" ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => handleDelete(dept)}
                    disabled={busyId === dept.id}
                    className="flex items-center justify-center gap-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg border border-red-200 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 text-gray-400 border border-gray-200 rounded-2xl bg-white">
              No departments yet. Create the first one!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
