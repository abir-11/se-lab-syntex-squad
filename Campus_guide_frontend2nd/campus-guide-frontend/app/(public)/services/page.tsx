import React from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { getAllMentorServices } from "@/service/getAllMentorServices";
import ServiceCard from "../_components/ServiceCard";

export const dynamic = "force-dynamic";

const LIMIT = 9;

const ServicesPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ searchTerm?: string; page?: string }>;
}) => {
  const params = await searchParams;
  const searchTerm = params.searchTerm || "";
  const page = Math.max(Number(params.page) || 1, 1);

  const servicesRes = await getAllMentorServices({
    searchTerm,
    page,
    limit: LIMIT,
  });

  const services = servicesRes?.data || [];
  const meta = servicesRes?.meta;
  const totalPages = meta?.totalPage || 1;

  const buildUrl = (newPage: number) => {
    const qs = new URLSearchParams();
    if (searchTerm) qs.set("searchTerm", searchTerm);
    if (newPage > 1) qs.set("page", String(newPage));
    const s = qs.toString();
    return `/services${s ? `?${s}` : ""}`;
  };

  return (
    <div className="bg-gray-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <span className="text-xs font-bold uppercase tracking-widest text-[#F68B1F]">
          Mentor Services
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
          Browse & Book Sessions
        </h1>
        <p className="text-gray-400 mt-3 max-w-2xl">
          All services are from approved mentors. Pick one and book a time
          that works for you.
        </p>

        {/* Search */}
        <form action="/services" className="mt-8 max-w-xl flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              name="searchTerm"
              defaultValue={searchTerm}
              placeholder="Search by mentor name..."
              className="w-full pl-11 pr-4 py-3 bg-gray-900/70 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F68B1F]/50 focus:border-[#F68B1F] transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-[#F68B1F] hover:bg-[#d97414] text-white font-bold text-sm transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {services.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                {page > 1 && (
                  <Link
                    href={buildUrl(page - 1)}
                    className="px-4 py-2 rounded-lg border border-white/10 text-gray-300 hover:border-[#F68B1F]/60 hover:text-[#F68B1F] text-sm font-semibold transition-colors"
                  >
                    Previous
                  </Link>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <Link
                      key={p}
                      href={buildUrl(p)}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                        p === page
                          ? "bg-[#F68B1F] text-white"
                          : "border border-white/10 text-gray-300 hover:border-[#F68B1F]/60 hover:text-[#F68B1F]"
                      }`}
                    >
                      {p}
                    </Link>
                  )
                )}
                {page < totalPages && (
                  <Link
                    href={buildUrl(page + 1)}
                    className="px-4 py-2 rounded-lg border border-white/10 text-gray-300 hover:border-[#F68B1F]/60 hover:text-[#F68B1F] text-sm font-semibold transition-colors"
                  >
                    Next
                  </Link>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 border border-white/5 rounded-2xl bg-gray-900/40">
            <p className="text-gray-400">
              No services found{searchTerm ? ` for "${searchTerm}"` : ""}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;
