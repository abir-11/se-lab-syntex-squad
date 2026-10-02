"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Save, Plus, X } from "lucide-react";
import { updateHomeContentAction } from "../../_actions/adminActions";

type Stat = { label: string; value: string };
type ServiceCardData = { title: string; description: string; icon: string };

type HomeContentData = {
  id: string;
  heroImage: string | null;
  heroEyebrow: string | null;
  heroTitle: string;
  heroSub: string | null;
  stats: Stat[] | null;
  serviceCards: ServiceCardData[] | null;
};

const inputClass =
  "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F68B1F]/40 focus:border-[#F68B1F] transition-all";
const labelClass = "block text-xs font-semibold text-gray-500 mb-1.5";

export default function HomeContentClient({
  homeContent,
}: {
  homeContent: HomeContentData | null;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [heroImage, setHeroImage] = useState(homeContent?.heroImage || "");
  const [heroEyebrow, setHeroEyebrow] = useState(homeContent?.heroEyebrow || "");
  const [heroTitle, setHeroTitle] = useState(
    homeContent?.heroTitle || "Your Campus, Guided."
  );
  const [heroSub, setHeroSub] = useState(homeContent?.heroSub || "");
  const [stats, setStats] = useState<Stat[]>(
    homeContent?.stats?.length
      ? homeContent.stats
      : [
          { label: "Departments", value: "12+" },
          { label: "Approved Mentors", value: "50+" },
          { label: "Sessions Booked", value: "500+" },
        ]
  );

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!heroTitle) {
      toast.error("Hero title is required.");
      return;
    }

    setIsSubmitting(true);
    const result = await updateHomeContentAction({
      heroImage,
      heroEyebrow,
      heroTitle,
      heroSub,
      stats: stats.filter((s) => s.label && s.value),
    });
    setIsSubmitting(false);

    if (result.success) {
      toast.success("Home page updated!");
      startTransition(() => router.refresh());
    } else {
      toast.error(result.message || "Failed to update home content");
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-3xl">
      <h1 className="text-3xl font-extrabold text-gray-900">Home Page Content</h1>
      <p className="text-gray-500 text-sm mt-1">
        Edit what visitors see on the landing page hero.
      </p>

      <form
        onSubmit={handleSave}
        className="mt-8 bg-white border border-gray-200 rounded-2xl p-6 lg:p-8 space-y-6"
      >
        <div>
          <label className={labelClass}>Hero Eyebrow</label>
          <input
            value={heroEyebrow}
            onChange={(e) => setHeroEyebrow(e.target.value)}
            placeholder="e.g. United International University"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Hero Title *</label>
          <input
            value={heroTitle}
            onChange={(e) => setHeroTitle(e.target.value)}
            placeholder="Your Campus, Guided."
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Hero Subtitle</label>
          <textarea
            value={heroSub}
            onChange={(e) => setHeroSub(e.target.value)}
            rows={3}
            placeholder="Short description under the title..."
            className={`${inputClass} resize-none`}
          />
        </div>

        <div>
          <label className={labelClass}>Hero Image URL</label>
          <input
            value={heroImage}
            onChange={(e) => setHeroImage(e.target.value)}
            placeholder="https://... (leave empty for the default graphic)"
            className={inputClass}
          />
        </div>

        {/* Stats editor */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-gray-500">
              Hero Stats
            </label>
            <button
              type="button"
              onClick={() => setStats([...stats, { label: "", value: "" }])}
              className="flex items-center gap-1 text-xs font-bold text-[#F68B1F] hover:text-[#d97414]"
            >
              <Plus className="w-3.5 h-3.5" />
              Add stat
            </button>
          </div>

          <div className="space-y-3">
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center gap-3">
                <input
                  value={stat.value}
                  onChange={(e) => {
                    const next = [...stats];
                    next[i] = { ...next[i], value: e.target.value };
                    setStats(next);
                  }}
                  placeholder="500+"
                  className={`${inputClass} w-28`}
                />
                <input
                  value={stat.label}
                  onChange={(e) => {
                    const next = [...stats];
                    next[i] = { ...next[i], label: e.target.value };
                    setStats(next);
                  }}
                  placeholder="Sessions Booked"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => setStats(stats.filter((_, idx) => idx !== i))}
                  className="p-2 text-gray-400 hover:text-red-500 shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 py-3 px-8 rounded-xl bg-[#F68B1F] hover:bg-[#d97414] text-white font-bold text-sm disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </form>
    </div>
  );
}
