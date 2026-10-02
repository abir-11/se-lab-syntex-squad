"use client";

import { useEffect, useState, useCallback } from "react";
import { Users, Loader2, Star, Search, BookOpen, X, ChevronDown, ChevronUp } from "lucide-react";
import { fetchMentors, fetchMentorServices, createBooking } from "../_actions/studentActions";
import { swConfirm, swToast, swErrorToast } from "@/lib/swal";

interface Mentor {
  id?: string; _id?: string;
  bio?: string; department?: string; rating?: number; sessions?: number;
  image?: string; mobile?: string;
  user?: { name?: string; email?: string };
}
interface Service {
  id?: string; _id?: string;
  name?: string; category?: string; description?: string;
  fee?: number; date?: string; time?: string; image?: string;
  mentorId?: string; mentorName?: string;
  mentor?: { name?: string };
}

export default function StudentMentorsPage() {
  const [mentors, setMentors]   = useState<Mentor[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [booking, setBooking]   = useState<string | null>(null);
  const [error, setError]       = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    const [mRes, sRes] = await Promise.all([fetchMentors(), fetchMentorServices()]);
    if (mRes.success) setMentors(mRes.data as Mentor[]);
    if (sRes.success) setServices(sRes.data as Service[]);
    if (!mRes.success) setError("Unable to load mentors.");
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleBook = async (service: Service) => {
    const sId = service.id ?? service._id ?? "";
    const mId = service.mentorId ?? "";
    if (!sId || !mId) { swErrorToast("Service or mentor info missing"); return; }
    const ok = await swConfirm(
      `Book "${service.name ?? service.category}"?`,
      `Fee: ৳${service.fee ?? 0} — You'll be booking a session with ${service.mentorName ?? service.mentor?.name ?? "this mentor"}.`,
      "Book Session"
    );
    if (!ok) return;
    setBooking(sId);
    const today = new Date().toISOString().split("T")[0];
    const time  = service.time ?? "10:00";
    const res = await createBooking({ serviceId: sId, mentorId: mId, date: today, time });
    if (res.success) swToast("Booking created successfully!");
    else swErrorToast(res.message ?? "Failed to create booking");
    setBooking(null);
  };

  const filtered = mentors.filter(m => {
    const q = search.toLowerCase();
    return !q ||
      (m.user?.name ?? "").toLowerCase().includes(q) ||
      (m.department ?? "").toLowerCase().includes(q) ||
      (m.bio ?? "").toLowerCase().includes(q);
  });

  const getMentorServices = (mentor: Mentor) => {
    const uid = (mentor as any).userId ?? mentor.id ?? mentor._id;
    return services.filter(s => s.mentorId === uid);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Find Mentors</h1>
          <p className="text-xs text-gray-500 mt-1">Browse and book sessions with campus mentors</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search mentors…"
            className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-300" />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
          <X size={14} />{error}<button onClick={load} className="ml-auto underline">Retry</button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500" size={28} /></div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(mentor => {
            const id   = (mentor as any).userId ?? mentor.id ?? mentor._id ?? "";
            const name = mentor.user?.name ?? "Mentor";
            const svcList = getMentorServices(mentor);
            const isOpen  = expanded === id;
            return (
              <div key={id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                {/* Header */}
                <div className="p-5 flex items-start gap-4">
                  {mentor.image ? (
                    <img src={mentor.image} alt={name} className="w-14 h-14 rounded-xl object-cover border border-gray-100 shrink-0" />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg shrink-0">
                      {name.charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-gray-900 text-sm">{name}</h3>
                    {mentor.department && <p className="text-xs text-gray-500 mt-0.5">{mentor.department}</p>}
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-0.5 text-[11px] text-amber-500 font-semibold">
                        <Star size={11} fill="currentColor" /> {mentor.rating?.toFixed(1) ?? "0.0"}
                      </span>
                      <span className="text-[11px] text-gray-400">{mentor.sessions ?? 0} sessions</span>
                    </div>
                    {mentor.bio && <p className="text-[11px] text-gray-400 mt-1.5 line-clamp-2">{mentor.bio}</p>}
                  </div>
                </div>

                {/* Services toggle */}
                <div className="border-t border-gray-100">
                  <button onClick={() => setExpanded(isOpen ? null : id)}
                    className="w-full flex items-center justify-between px-5 py-3 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                    <span className="flex items-center gap-1.5">
                      <BookOpen size={13} className="text-gray-400" />
                      {svcList.length} service{svcList.length !== 1 ? "s" : ""} available
                    </span>
                    {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-4 space-y-2">
                      {svcList.length > 0 ? svcList.map(svc => {
                        const sid = svc.id ?? svc._id ?? "";
                        return (
                          <div key={sid} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl gap-3">
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-gray-800 truncate">{svc.name ?? svc.category}</p>
                              {svc.description && <p className="text-[11px] text-gray-400 line-clamp-1">{svc.description}</p>}
                              <p className="text-xs font-semibold text-blue-600 mt-0.5">৳{svc.fee ?? 0}</p>
                            </div>
                            <button
                              onClick={() => handleBook({ ...svc, mentorId: id, mentorName: name })}
                              disabled={booking === sid}
                              className="shrink-0 flex items-center gap-1 bg-blue-500 text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-600 active:scale-95 transition-all disabled:opacity-50">
                              {booking === sid ? <Loader2 size={11} className="animate-spin" /> : null}
                              Book
                            </button>
                          </div>
                        );
                      }) : (
                        <p className="text-[11px] text-gray-400 py-2 text-center">No services listed yet.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 flex flex-col items-center gap-4 text-center shadow-sm">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
            <Users size={32} className="text-blue-300" />
          </div>
          <p className="text-sm font-semibold text-gray-700">
            {search ? `No mentors found for "${search}"` : "No mentors available"}
          </p>
          {search && <button onClick={() => setSearch("")} className="text-xs font-semibold text-blue-500 hover:underline">Clear search</button>}
        </div>
      )}
    </div>
  );
}
