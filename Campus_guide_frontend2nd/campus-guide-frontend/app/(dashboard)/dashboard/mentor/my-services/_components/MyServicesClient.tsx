"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash2, X, Info } from "lucide-react";
import {
  createMentorServiceAction,
  updateMentorServiceAction,
  deleteMentorServiceAction,
} from "../../_actions/mentorActions";

type Service = {
  id: string;
  category: string;
  name: string;
  description: string;
  fee: string;
  mobile: string | null;
  image: string | null;
};

const inputClass =
  "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F68B1F]/40 focus:border-[#F68B1F] transition-all";
const labelClass = "block text-xs font-semibold text-gray-500 mb-1.5";

const emptyForm = {
  category: "",
  name: "",
  description: "",
  fee: "",
  mobile: "",
  image: "",
};

export default function MyServicesClient({ services }: { services: Service[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const startCreate = () => {
    setForm(emptyForm);
    setEditingingId(null);
    setShowForm(true);
  };

  const startEdit = (service: Service) => {
    setForm({
      category: service.category || "",
      name: service.name || "",
      description: service.description || "",
      fee: String(service.fee || ""),
      mobile: service.mobile || "",
      image: service.image || "",
    });
    setEditingingId(service.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.category || !form.name || !form.description || !form.fee) {
      toast.error("Category, name, description and fee are required.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      category: form.category,
      name: form.name,
      description: form.description,
      fee: Number(form.fee),
      ...(form.mobile ? { mobile: form.mobile } : {}),
      ...(form.image ? { image: form.image } : {}),
    };

    const result = editingId
      ? await updateMentorServiceAction(editingId, payload)
      : await createMentorServiceAction(payload);

    setIsSubmitting(false);

    if (result.success) {
      toast.success(editingId ? "Service updated!" : "Service created!");
      setShowForm(false);
      setEditingingId(null);
      setForm(emptyForm);
      startTransition(() => router.refresh());
    } else {
      toast.error(result.message || "Something went wrong");
    }
  };

  const handleDelete = async (service: Service) => {
    if (!window.confirm(`Delete service "${service.name}"?`)) return;

    setBusyId(service.id);
    const result = await deleteMentorServiceAction(service.id);
    setBusyId(null);

    if (result.success) {
      toast.success("Service deleted");
      startTransition(() => router.refresh());
    } else {
      toast.error(result.message || "Failed to delete service");
    }
  };

  return (
    <div className="p-6 lg:p-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">My Services</h1>
          <p className="text-gray-500 text-sm mt-1">
            {services.length} active service{services.length === 1 ? "" : "s"}{" "}
            students can book.
          </p>
        </div>
        <button
          onClick={() => (showForm ? setShowForm(false) : startCreate())}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#F68B1F] hover:bg-[#d97414] text-white font-bold text-sm transition-colors"
        >
          {showForm ? (
            <>
              <X className="w-4 h-4" /> Close
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" /> New Service
            </>
          )}
        </button>
      </div>

      {/* New mentors note */}
      <div className="mt-4 flex items-start gap-2 text-xs text-gray-500 bg-[#F68B1F]/5 border border-[#F68B1F]/20 rounded-xl px-4 py-3 max-w-2xl">
        <Info className="w-4 h-4 text-[#F68B1F] shrink-0 mt-0.5" />
        <span>
          To publish services your mentor profile must be approved by the
          admin. If creating a service fails, contact the campus admin.
        </span>
      </div>

      {/* Create/Edit form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 bg-white border border-gray-200 rounded-2xl p-6 lg:p-8 grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          <h2 className="md:col-span-2 text-lg font-bold text-gray-900">
            {editingId ? "Edit Service" : "New Service"}
          </h2>

          <div>
            <label className={labelClass}>Category *</label>
            <input
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="e.g. Academic, Career, Skill"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Service Name *</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. CV Review Session"
              className={inputClass}
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Description *</label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={4}
              placeholder="What will students get from this session?"
              className={`${inputClass} resize-none`}
            />
          </div>

          <div>
            <label className={labelClass}>Fee (BDT) *</label>
            <input
              type="number"
              min="0"
              value={form.fee}
              onChange={(e) => setForm({ ...form, fee: e.target.value })}
              placeholder="500"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Contact Number</label>
            <input
              value={form.mobile}
              onChange={(e) => setForm({ ...form, mobile: e.target.value })}
              placeholder="+880 1XXXXXXXXX (optional)"
              className={inputClass}
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Image URL</label>
            <input
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="https://... (optional)"
              className={inputClass}
            />
          </div>

          <div className="md:col-span-2 flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 py-3 px-8 rounded-xl bg-[#F68B1F] hover:bg-[#d97414] text-white font-bold text-sm disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : editingId ? (
                "Save Changes"
              ) : (
                "Create Service"
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingingId(null);
                setForm(emptyForm);
              }}
              className="py-3 px-6 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Services list */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {services.length > 0 ? (
          services.map((service) => (
            <div
              key={service.id}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden"
            >
              <div className="h-32 bg-gradient-to-br from-[#F68B1F]/25 via-[#d97414]/15 to-gray-100 flex items-center justify-center">
                {service.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-extrabold text-[#F68B1F]/70 uppercase">
                    {service.category?.charAt(0) || "S"}
                  </span>
                )}
              </div>
              <div className="p-5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-white bg-[#F68B1F] rounded-full px-3 py-1">
                  {service.category}
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-3">
                  {service.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {service.description}
                </p>
                <p className="text-xl font-extrabold text-[#F68B1F] mt-3">
                  ৳{Number(service.fee).toLocaleString()}
                </p>

                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => startEdit(service)}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-2.5 rounded-lg transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(service)}
                    disabled={busyId === service.id}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 px-3 py-2.5 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {busyId === service.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          !showForm && (
            <div className="col-span-full text-center py-16 text-gray-400 border border-gray-200 rounded-2xl bg-white">
              No services yet. Create your first mentor service!
            </div>
          )
        )}
      </div>
    </div>
  );
}
