"use client";

import { useState } from "react";
import { Plus, Loader2, X, Calendar, MapPin, Tag, Image as ImageIcon, FileText } from "lucide-react";
import { createEvent } from "../_actions/adminActions";
import { swToast, swErrorToast } from "@/lib/swal";

interface CreateEventFormProps {
  onEventCreated?: () => void;
}

export default function CreateEventForm({ onEventCreated }: CreateEventFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    category: "Academic",
    image: "",
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: "",
      location: "",
      category: "Academic",
      image: "",
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
      const res = await createEvent(formData);

      if (res?.success) {
        swToast("Event created successfully!");
        handleClose();
        if (onEventCreated) onEventCreated();
      } else {
        swErrorToast(res?.message || "Failed to create event");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      swErrorToast("An unexpected error occurred while creating event.");
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
        <Plus size={16} /> Add New Event
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-gray-900">Create Campus Event</h2>
                <p className="text-[11px] text-gray-400">Add a new event for campus students</p>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Title */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Event Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. UIU Tech Fest 2026"
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-gray-300"
                />
              </div>

              {/* Date & Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    <span className="flex items-center gap-1">
                      <Calendar size={13} className="text-gray-400" /> Date & Time <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-gray-700"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    <span className="flex items-center gap-1">
                      <Tag size={13} className="text-gray-400" /> Category
                    </span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-white text-gray-700"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Career">Career</option>
                  </select>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  <span className="flex items-center gap-1">
                    <MapPin size={13} className="text-gray-400" /> Location <span className="text-red-500">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. UIU Multipurpose Hall"
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-gray-300"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  <span className="flex items-center gap-1">
                    <ImageIcon size={13} className="text-gray-400" /> Image URL (Optional)
                  </span>
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-gray-300"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  <span className="flex items-center gap-1">
                    <FileText size={13} className="text-gray-400" /> Description <span className="text-red-500">*</span>
                  </span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Event details..."
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-gray-300 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-1.5 bg-[#F97316] text-white px-5 py-2 rounded-xl text-xs font-semibold hover:bg-orange-600 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-orange-200"
                >
                  {loading && <Loader2 className="animate-spin" size={14} />} 
                  {loading ? "Creating..." : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}