"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Sparkles, Trash2 } from "lucide-react";
import {
  createStoryAction,
  updateStoryAction,
  deleteStoryAction,
} from "../../_actions/adminActions";

type Story = {
  id: string;
  title: string;
  excerpt: string | null;
  body: string;
  image: string | null;
  published: boolean;
  date: string;
};

export default function StoriesClient({ stories }: { stories: Story[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    body: "",
    image: "",
    published: true,
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title || !form.body) {
      toast.error("Title and body are required.");
      return;
    }

    setIsSubmitting(true);
    const result = await createStoryAction({
      title: form.title,
      excerpt: form.excerpt || undefined,
      body: form.body,
      image: form.image || undefined,
      published: form.published,
    });
    setIsSubmitting(false);

    if (result.success) {
      toast.success("Story created!");
      setForm({ title: "", excerpt: "", body: "", image: "", published: true });
      startTransition(() => router.refresh());
    } else {
      toast.error(result.message || "Failed to create story");
    }
  };

  const handlePublishToggle = async (story: Story) => {
    setBusyId(story.id);
    const result = await updateStoryAction(story.id, {
      published: !story.published,
    });
    setBusyId(null);

    if (result.success) {
      toast.success(story.published ? "Story unpublished" : "Story published");
      startTransition(() => router.refresh());
    } else {
      toast.error(result.message || "Failed to update story");
    }
  };

  const handleDelete = async (story: Story) => {
    if (!window.confirm(`Delete story "${story.title}"?`)) return;

    setBusyId(story.id);
    const result = await deleteStoryAction(story.id);
    setBusyId(null);

    if (result.success) {
      toast.success("Story deleted");
      startTransition(() => router.refresh());
    } else {
      toast.error(result.message || "Failed to delete story");
    }
  };

  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-3xl font-extrabold text-gray-900">Campus Stories</h1>
      <p className="text-gray-500 text-sm mt-1">
        Share achievements and campus news. Unpublishing hides a story from
        the public site.
      </p>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-8">
        {/* Create form */}
        <form
          onSubmit={handleCreate}
          className="xl:col-span-1 bg-white border border-gray-200 rounded-2xl p-6 h-fit space-y-4"
        >
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#F68B1F]" />
            New Story
          </h2>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">
              Title *
            </label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Story title"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F68B1F]/40 focus:border-[#F68B1F] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">
              Excerpt
            </label>
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              rows={2}
              placeholder="Short summary (optional)"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F68B1F]/40 focus:border-[#F68B1F] transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">
              Body *
            </label>
            <textarea
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              rows={5}
              placeholder="Full story..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F68B1F]/40 focus:border-[#F68B1F] transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">
              Image URL
            </label>
            <input
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="https://... (optional)"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F68B1F]/40 focus:border-[#F68B1F] transition-all"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
              className="w-4 h-4 accent-[#F68B1F]"
            />
            Publish immediately
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#F68B1F] hover:bg-[#d97414] text-white font-bold text-sm disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Create Story"
            )}
          </button>
        </form>

        {/* Stories list */}
        <div className="xl:col-span-2 space-y-4">
          {stories.length > 0 ? (
            stories.map((story) => (
              <div
                key={story.id}
                className="bg-white border border-gray-200 rounded-2xl p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-gray-900">
                      {story.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(story.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    {story.excerpt && (
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                        {story.excerpt}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() => handlePublishToggle(story)}
                      disabled={busyId === story.id}
                      className={`text-xs font-bold px-4 py-2 rounded-lg border transition-colors disabled:opacity-50 ${
                        story.published
                          ? "text-emerald-600 border-emerald-300 bg-emerald-50 hover:bg-emerald-100"
                          : "text-gray-500 border-gray-200 bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      {busyId === story.id ? "..." : story.published ? "Published" : "Unpublished"}
                    </button>
                    <button
                      onClick={() => handleDelete(story)}
                      disabled={busyId === story.id}
                      className="flex items-center justify-center gap-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg border border-red-200 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 text-gray-400 border border-gray-200 rounded-2xl bg-white">
              No published stories yet. Create your first one!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
