import React from "react";
import { Sparkles } from "lucide-react";
import { getPublishedStories } from "@/service/getPublishedStories";

export const dynamic = "force-dynamic";

const StoriesPage = async () => {
  const storiesRes = await getPublishedStories();
  const stories = storiesRes?.data || [];

  return (
    <div className="bg-gray-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <span className="text-xs font-bold uppercase tracking-widest text-[#F68B1F]">
          Campus Stories
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
          Stories from the Campus
        </h1>
        <p className="text-gray-400 mt-3 max-w-2xl">
          Achievements, experiences and news shared by the campus community.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {stories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <article
                key={story.id}
                className="bg-gray-900/60 border border-white/10 rounded-2xl overflow-hidden hover:border-[#F68B1F]/40 transition-colors"
              >
                {story.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-44 object-cover"
                  />
                ) : (
                  <div className="w-full h-44 bg-gradient-to-br from-[#F68B1F]/20 to-gray-900 flex items-center justify-center">
                    <Sparkles className="w-10 h-10 text-[#F68B1F]/60" />
                  </div>
                )}
                <div className="p-6">
                  <p className="text-xs text-gray-500">
                    {new Date(story.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <h2 className="text-lg font-bold text-white mt-2">
                    {story.title}
                  </h2>
                  {(story.excerpt || story.body) && (
                    <p className="text-sm text-gray-400 mt-3 line-clamp-4">
                      {story.excerpt || story.body}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-white/5 rounded-2xl bg-gray-900/40">
            <Sparkles className="w-12 h-12 text-[#F68B1F]/50 mx-auto" />
            <p className="text-gray-400 mt-4">No stories published yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoriesPage;
