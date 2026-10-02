"use client";

import { useState } from "react";
import { Plus, Loader2, X, Building2, Code2, UserCheck, FileText } from "lucide-react";
import { createDepartment } from "../_actions/adminActions";
import { swToast, swErrorToast } from "@/lib/swal";

export default function CreateDepartmentForm({ onDepartmentCreated }: { onDepartmentCreated?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    headName: "",
    description: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      headName: "",
      description: "",
    });
  };

  const handleClose = () => {
    resetForm();
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await createDepartment(formData);

      if (res?.success) {
        swToast("Department created successfully!");
        handleClose();
        if (onDepartmentCreated) onDepartmentCreated();
      } else {
        swErrorToast(res?.message || "Failed to create department");
      }
    } catch (error) {
      console.error("Error creating department:", error);
      swErrorToast("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-[#F97316] text-white px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-orange-600 active:scale-95 transition-all shadow-sm shadow-orange-200"
      >
        <Plus size={16} /> Add Department
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-gray-900">Add New Department</h2>
                <p className="text-[11px] text-gray-400">Create academic or administrative department</p>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Department Name */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  <span className="flex items-center gap-1">
                    <Building2 size={13} className="text-gray-400" /> Department Name <span className="text-red-500">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Computer Science and Engineering"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-gray-300"
                />
              </div>

              {/* Department Code */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  <span className="flex items-center gap-1">
                    <Code2 size={13} className="text-gray-400" /> Code / Abbreviation <span className="text-red-500">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. CSE, EEE, BBA"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-gray-300 uppercase"
                />
              </div>

              {/* Department Head Name */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  <span className="flex items-center gap-1">
                    <UserCheck size={13} className="text-gray-400" /> Department Head (Optional)
                  </span>
                </label>
                <input
                  type="text"
                  value={formData.headName}
                  onChange={(e) => setFormData({ ...formData, headName: e.target.value })}
                  placeholder="e.g. Dr. John Doe"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-gray-300"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  <span className="flex items-center gap-1">
                    <FileText size={13} className="text-gray-400" /> Description (Optional)
                  </span>
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief overview of the department..."
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-gray-300 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-1.5 bg-[#F97316] text-white px-5 py-2.5 rounded-xl text-xs font-semibold hover:bg-orange-600 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-orange-200"
                >
                  {loading && <Loader2 className="animate-spin" size={14} />} 
                  {loading ? "Creating..." : "Create Department"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}