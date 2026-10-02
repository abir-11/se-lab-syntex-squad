"use client";

import { useEffect, useState, useCallback } from "react";
import { Users, Loader2, Trash2, Search, GraduationCap, Star, ShieldCheck, UserX } from "lucide-react";
import { fetchUsers, deleteUser } from "../_actions/adminActions";
import { swConfirmDelete, swErrorToast, swToast } from "@/lib/swal";

interface UserItem {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role?: string;
  status?: string;
  phoneNumber?: string;
  department?: { departmentName?: string; name?: string };
  createdAt?: string;
}

const roleConfig: Record<string, { label: string; bg: string; color: string; icon: React.ElementType }> = {
  ADMIN:   { label: "Admin",   bg: "bg-purple-50",  color: "text-purple-600",  icon: ShieldCheck },
  MENTOR:  { label: "Mentor",  bg: "bg-emerald-50", color: "text-emerald-600", icon: Star },
  STUDENT: { label: "Student", bg: "bg-blue-50",    color: "text-blue-600",    icon: GraduationCap },
};

const statusConfig: Record<string, { bg: string; color: string }> = {
  ACTIVE: { bg: "bg-emerald-50", color: "text-emerald-600" },
  BANNED: { bg: "bg-red-50",     color: "text-red-500"     },
};

type FilterRole = "ALL" | "STUDENT" | "MENTOR" | "ADMIN";

export default function AdminUsersPage() {
  const [users, setUsers]           = useState<UserItem[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [roleFilter, setRoleFilter] = useState<FilterRole>("ALL");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    const res = await fetchUsers();
    if (res.success && Array.isArray(res.data)) setUsers(res.data as UserItem[]);
    setLoading(false);
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const handleDelete = async (id: string, name: string) => {
    const confirmed = await swConfirmDelete(
      "Delete this user?",
      `"${name}" will be permanently removed from the platform.`
    );
    if (!confirmed) return;

    setDeletingId(id);
    const res = await deleteUser(id);
    if (res.success) {
      setUsers((prev) => prev.filter((u) => (u.id || u._id) !== id));
      swToast(`${name} has been deleted`);
    } else {
      swErrorToast(res.message || "Failed to delete user");
    }
    setDeletingId(null);
  };

  const filtered = users.filter((u) => {
    const matchRole = roleFilter === "ALL" || String(u.role || "").toUpperCase() === roleFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    return matchRole && matchSearch;
  });

  const counts = {
    ALL:     users.length,
    STUDENT: users.filter((u) => String(u.role).toUpperCase() === "STUDENT").length,
    MENTOR:  users.filter((u) => String(u.role).toUpperCase() === "MENTOR").length,
    ADMIN:   users.filter((u) => String(u.role).toUpperCase() === "ADMIN").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-xs text-gray-500 mt-1">Manage all registered platform users</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input type="text" placeholder="Search name or email…" value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-gray-300" />
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {(["ALL", "STUDENT", "MENTOR", "ADMIN"] as FilterRole[]).map((r) => (
          <button key={r} onClick={() => setRoleFilter(r)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${roleFilter === r ? "bg-orange-500 text-white shadow-sm shadow-orange-200" : "bg-white border border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600"}`}>
            {r === "ALL" ? "All" : r.charAt(0) + r.slice(1).toLowerCase()}
            <span className={`ml-1.5 text-[10px] font-bold ${roleFilter === r ? "text-orange-100" : "text-gray-400"}`}>{counts[r]}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-orange-500" size={28} /></div>
      ) : filtered.length > 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  <th className="text-left px-5 py-3 font-semibold text-gray-500">User</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">Role</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">Department</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">Joined</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((user) => {
                  const id        = user.id || user._id || "";
                  const rawRole   = String(user.role   || "STUDENT").toUpperCase();
                  const rawStatus = String(user.status || "ACTIVE").toUpperCase();
                  const roleCfg   = roleConfig[rawRole]   || roleConfig.STUDENT;
                  const statusCfg = statusConfig[rawStatus] || statusConfig.ACTIVE;
                  const RoleIcon  = roleCfg.icon;
                  const dept      = user.department?.departmentName || user.department?.name || "—";
                  const joined    = user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                    : "—";
                  const isDeleting = deletingId === id;
                  return (
                    <tr key={id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs flex-shrink-0 uppercase">
                            {user.name?.charAt(0) || "U"}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{user.name}</p>
                            <p className="text-[11px] text-gray-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${roleCfg.bg} ${roleCfg.color}`}>
                          <RoleIcon size={11} />{roleCfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${statusCfg.bg} ${statusCfg.color}`}>
                          {rawStatus.charAt(0) + rawStatus.slice(1).toLowerCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-gray-500">{dept}</td>
                      <td className="px-4 py-3.5 text-gray-400">{joined}</td>
                      <td className="px-4 py-3.5">
                        <button onClick={() => handleDelete(id, user.name)} disabled={isDeleting || rawRole === "ADMIN"}
                          className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                          title={rawRole === "ADMIN" ? "Cannot delete admin" : "Delete user"}>
                          {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="md:hidden divide-y divide-gray-100">
            {filtered.map((user) => {
              const id        = user.id || user._id || "";
              const rawRole   = String(user.role   || "STUDENT").toUpperCase();
              const rawStatus = String(user.status || "ACTIVE").toUpperCase();
              const roleCfg   = roleConfig[rawRole]   || roleConfig.STUDENT;
              const statusCfg = statusConfig[rawStatus] || statusConfig.ACTIVE;
              const RoleIcon  = roleCfg.icon;
              const isDeleting = deletingId === id;
              return (
                <div key={id} className="p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs flex-shrink-0 uppercase">
                      {user.name?.charAt(0) || "U"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-800 truncate">{user.name}</p>
                      <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${roleCfg.bg} ${roleCfg.color}`}>
                          <RoleIcon size={10} />{roleCfg.label}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusCfg.bg} ${statusCfg.color}`}>
                          {rawStatus.charAt(0) + rawStatus.slice(1).toLowerCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(id, user.name)} disabled={isDeleting || rawRole === "ADMIN"}
                    className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
                    title={rawRole === "ADMIN" ? "Cannot delete admin" : "Delete user"}>
                    {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 flex flex-col items-center gap-4 text-center shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center">
            <UserX size={32} className="text-gray-300" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">No users found</p>
            <p className="text-xs text-gray-400 mt-1">{search ? `No results for "${search}"` : "No users match the selected filter."}</p>
          </div>
          {search && <button onClick={() => setSearch("")} className="text-xs font-semibold text-orange-500 hover:underline">Clear search</button>}
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <p className="text-[11px] text-gray-400 text-right">Showing {filtered.length} of {users.length} users</p>
      )}
    </div>
  );
}
