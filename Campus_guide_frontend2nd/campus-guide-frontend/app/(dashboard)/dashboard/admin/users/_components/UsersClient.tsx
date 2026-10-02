"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Search, Trash2, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import {
  updateUserAction,
  deleteUserAction,
} from "../../_actions/adminActions";

type User = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  role: "STUDENT" | "MENTOR" | "ADMIN" | "FACULTY";
  department?: { id: string; departmentName: string } | null;
  createdAt: string;
};

type Department = { id: string; departmentName: string };

const ROLES = ["STUDENT", "MENTOR", "FACULTY", "ADMIN"];

export default function UsersClient({
  users,
  meta,
  departments,
  searchTerm,
  role,
  page,
}: {
  users: User[];
  meta: { page: number; limit: number; total: number; totalPage: number } | null;
  departments: Department[];
  searchTerm: string;
  role: string;
  page: number;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);

  const totalPages = meta?.totalPage || 1;

  const handleRoleChange = async (userId: string, newRole: string) => {
    setBusyId(userId);
    const result = await updateUserAction(userId, { role: newRole });
    setBusyId(null);

    if (result.success) {
      toast.success("Role updated to " + newRole);
      startTransition(() => router.refresh());
    } else {
      toast.error(result.message || "Failed to update role");
    }
  };

  const handleDepartmentChange = async (
    userId: string,
    departmentId: string
  ) => {
    setBusyId(userId);
    const result = await updateUserAction(
      userId,
      departmentId ? { departmentId } : {}
    );
    setBusyId(null);

    if (result.success) {
      toast.success("Department updated");
      startTransition(() => router.refresh());
    } else {
      toast.error(result.message || "Failed to update department");
    }
  };

  const handleDelete = async (user: User) => {
    if (
      !window.confirm(
        `Delete user "${user.name}" (${user.email})? This cannot be undone.`
      )
    ) {
      return;
    }

    setBusyId(user.id);
    const result = await deleteUserAction(user.id);
    setBusyId(null);

    if (result.success) {
      toast.success("User deleted");
      startTransition(() => router.refresh());
    } else {
      toast.error(result.message || "Failed to delete user");
    }
  };

  const buildUrl = (newPage: number) => {
    const qs = new URLSearchParams();
    if (searchTerm) qs.set("searchTerm", searchTerm);
    if (role) qs.set("role", role);
    if (newPage > 1) qs.set("page", String(newPage));
    const s = qs.toString();
    return `/dashboard/admin/users${s ? `?${s}` : ""}`;
  };

  return (
    <div className="p-6 lg:p-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Manage Users
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {meta?.total ?? users.length} users registered.
          </p>
        </div>

        {/* Search & filter */}
        <div className="flex gap-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const value = (
                e.currentTarget.elements.namedItem("searchTerm") as HTMLInputElement
              ).value;
              const qs = new URLSearchParams();
              if (value) qs.set("searchTerm", value);
              if (role) qs.set("role", role);
              router.push(
                `/dashboard/admin/users${qs.toString() ? `?${qs.toString()}` : ""}`
              );
            }}
            className="relative"
          >
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              name="searchTerm"
              defaultValue={searchTerm}
              placeholder="Search name or email..."
              className="pl-10 pr-4 py-2.5 w-64 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F68B1F]/40 focus:border-[#F68B1F] transition-all"
            />
          </form>
          <select
            value={role}
            onChange={(e) => {
              const qs = new URLSearchParams();
              if (searchTerm) qs.set("searchTerm", searchTerm);
              if (e.target.value) qs.set("role", e.target.value);
              router.push(
                `/dashboard/admin/users${qs.toString() ? `?${qs.toString()}` : ""}`
              );
            }}
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#F68B1F]/40 focus:border-[#F68B1F]"
          >
            <option value="">All roles</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="mt-8 bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-left text-xs uppercase tracking-wider text-gray-500">
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Department</th>
                <th className="px-6 py-4 font-semibold">Joined</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/60">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#F68B1F]/15 flex items-center justify-center text-[#F68B1F] font-bold text-xs shrink-0">
                          {user.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        disabled={busyId === user.id}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#F68B1F]/40 focus:border-[#F68B1F] disabled:opacity-50"
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={user.department?.id || ""}
                        disabled={busyId === user.id}
                        onChange={(e) =>
                          handleDepartmentChange(user.id, e.target.value)
                        }
                        className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-700 bg-white max-w-[180px] focus:outline-none focus:ring-2 focus:ring-[#F68B1F]/40 focus:border-[#F68B1F] disabled:opacity-50"
                      >
                        <option value="">No department</option>
                        {departments.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.departmentName}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(user)}
                        disabled={busyId === user.id}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {busyId === user.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-gray-400">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => router.push(buildUrl(page - 1))}
            className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:text-[#F68B1F] disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => router.push(buildUrl(page + 1))}
            className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:text-[#F68B1F] disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
