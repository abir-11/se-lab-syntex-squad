import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import HeroSection from "./HeroSection/HeroSection";
import ServiceCard from "./_components/ServiceCard";
import {
  getHomeContent,
  getPublishedStories,
} from "@/service/getPublishedStories";
import { getAllMentorServices } from "@/service/getAllMentorServices";
import { getAllMentors } from "@/service/getAllMentors";

export const dynamic = "force-dynamic";

const Home = async () => {
  const [homeContentRes, servicesRes, storiesRes, mentorsRes] =
    await Promise.all([
      getHomeContent(),
      getAllMentorServices({ limit: 6 }),
      getPublishedStories(),
      getAllMentors(),
    ]);

  const homeContent = homeContentRes?.data;
  const services = servicesRes?.data || [];
  const stories = (storiesRes?.data || []).slice(0, 3);
  const mentors = (mentorsRes?.data || []).slice(0, 3);

  return (
    <div>
      <HeroSection content={homeContent ?? null} />

      {/* Featured Services */}
      <section className="bg-gray-950 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#F68B1F]">
                Mentor Services
              </span>
              <h2 className="text-3xl font-extrabold text-white mt-2">
                Book a session with an approved mentor
              </h2>
            </div>
            <Link
              href="/services"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-[#F68B1F] hover:text-[#ff9d38] transition-colors"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {services.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-white/5 rounded-2xl bg-gray-900/40">
              <p className="text-gray-400">
                No mentor services published yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Mentors strip */}
      {mentors.length > 0 && (
        <section className="bg-gray-950 py-20 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#F68B1F]">
                  Mentors
                </span>
                <h2 className="text-3xl font-extrabold text-white mt-2">
                  Meet our approved mentors
                </h2>
              </div>
              <Link
                href="/mentors"
                className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-[#F68B1F] hover:text-[#ff9d38] transition-colors"
              >
                All mentors <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {mentors.map((mentor) => (
                <div
                  key={mentor.id}
                  className="bg-gray-900/60 border border-white/10 rounded-2xl p-6 text-center hover:border-[#F68B1F]/40 transition-colors"
                >
                  <div className="w-20 h-20 mx-auto rounded-full bg-[#F68B1F]/20 border border-[#F68B1F]/40 flex items-center justify-center text-[#F68B1F] text-2xl font-extrabold overflow-hidden">
                    {mentor.image || mentor.user?.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={mentor.image || mentor.user?.image || undefined}
                        alt={mentor.user?.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      mentor.user?.name?.charAt(0)?.toUpperCase()
                    )}
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-white">
                    {mentor.user?.name}
                  </h3>
                  <p className="text-sm text-[#F68B1F]">
                    {mentor.department || "Mentor"}
                  </p>
                  {mentor.bio && (
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                      {mentor.bio}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-3">
                    {mentor.sessions} sessions • Rating {mentor.rating}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stories */}
      {stories.length > 0 && (
        <section className="bg-gray-950 py-20 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#F68B1F]">
                  Campus Stories
                </span>
                <h2 className="text-3xl font-extrabold text-white mt-2">
                  From the campus community
                </h2>
              </div>
              <Link
                href="/stories"
                className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-[#F68B1F] hover:text-[#ff9d38] transition-colors"
              >
                All stories <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stories.map((story) => (
                <article
                  key={story.id}
                  className="bg-gray-900/60 border border-white/10 rounded-2xl overflow-hidden hover:border-[#F68B1F]/40 transition-colors"
                >
                  {story.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={story.image}
                      alt={story.title}
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <p className="text-xs text-gray-500">
                      {new Date(story.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <h3 className="text-lg font-bold text-white mt-2 line-clamp-2">
                      {story.title}
                    </h3>
                    <p className="text-sm text-gray-400 mt-2 line-clamp-3">
                      {story.excerpt || story.body}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-gray-950 py-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Ready to grow with a <span className="text-brand">mentor?</span>
          </h2>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto">
            Create your account, browse approved mentor services, and book
            your first session today.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="px-6 py-3 rounded-xl bg-[#F68B1F] hover:bg-[#d97414] text-white font-bold text-sm shadow-[0_0_20px_rgba(246,139,31,0.3)] transition-all"
            >
              Get Started Free
            </Link>
            <Link
              href="/services"
              className="px-6 py-3 rounded-xl border border-white/15 text-gray-200 hover:border-[#F68B1F]/60 hover:text-[#F68B1F] font-semibold text-sm transition-all"
            >
              Browse Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
