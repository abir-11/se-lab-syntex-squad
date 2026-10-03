import { fetchMentorProfile } from "../_actions/mentorActions";
import { User, Mail, Phone, Building2, Star, BookOpen } from "lucide-react";

export const revalidate = 0;

export default async function MentorProfilePage() {
  const res = await fetchMentorProfile();
  const u   = res.data as any;

  const profile = u?.profiles ?? u?.mentorProfileDetails ?? null;

  const fields = [
    { icon: User,      label: "Full Name",   value: u?.name },
    { icon: Mail,      label: "Email",       value: u?.email },
    { icon: Phone,     label: "Phone",       value: u?.phoneNumber ?? "—" },
    { icon: Building2, label: "Department",  value: profile?.department ?? u?.department?.departmentName ?? "—" },
    { icon: Star,      label: "Rating",      value: profile?.rating ?? "—" },
    { icon: BookOpen,  label: "Sessions",    value: profile?.sessions ?? "—" },
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-xs text-gray-500 mt-1">Your mentor account information</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
        {/* Avatar row */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-2xl flex-shrink-0">
            {u?.name?.charAt(0)?.toUpperCase() ?? "M"}
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">{u?.name ?? "—"}</h2>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">MENTOR</span>
            {profile?.status && (
              <span className={`ml-2 text-xs font-semibold px-2 py-0.5 rounded-full ${
                profile.status === "APPROVED" ? "bg-emerald-50 text-emerald-600" :
                profile.status === "PENDING"  ? "bg-amber-50 text-amber-600" :
                "bg-red-50 text-red-500"
              }`}>{profile.status}</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map(({ icon: Icon, label, value }) => (
            <div key={label} className="space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <Icon size={11} />{label}
              </p>
              <p className="text-sm font-semibold text-gray-800">{value ?? "—"}</p>
            </div>
          ))}
        </div>

        {profile?.bio && (
          <div className="pt-4 border-t border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Bio</p>
            <p className="text-sm text-gray-600 leading-relaxed">{profile.bio}</p>
          </div>
        )}

        {profile?.goodSubjects && Array.isArray(profile.goodSubjects) && profile.goodSubjects.length > 0 && (
          <div className="pt-4 border-t border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Good Subjects</p>
            <div className="flex flex-wrap gap-2">
              {profile.goodSubjects.map((s: string) => (
                <span key={s} className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">{s}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
