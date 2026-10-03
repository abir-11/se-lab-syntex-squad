"use client"; // <--- এই লাইনটি যুক্ত করা হয়েছে

import React, { useState } from "react";
import { Eye, Check, X, Loader2, BookOpen } from "lucide-react";

// =================================================
// TYPES & INTERFACES
// =================================================
type ApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

interface User {
  name: string;
  email: string;
}

export interface Application {
  _id?: string;
  id?: string;
  user?: User;
  department?: string;
  cgpa?: number;
  goodSubjects?: string[];
  status: string;
  createdAt: string | Date;
}

interface MentorApplicationsProps {
  applications?: Application[];
}

// =================================================
// HELPER FUNCTIONS
// =================================================
const getApplicationId = (app: Application) => app.id || app._id || Math.random().toString();
const normalizeStatus = (status: string) => status.toUpperCase() as ApplicationStatus;
const formatCgpa = (cgpa?: number) => (cgpa ? cgpa.toFixed(2) : "N/A");
const formatDate = (date: string | Date) =>
  new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(date));

// =================================================
// REUSABLE COMPONENTS
// =================================================
const StatusBadge = ({ status }: { status: ApplicationStatus }) => {
  const styles = {
    PENDING: "bg-yellow-100 text-yellow-800",
    APPROVED: "bg-emerald-100 text-emerald-800",
    REJECTED: "bg-red-100 text-red-800",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
};

const DetailModal = ({
  app,
  onClose,
  onAction,
}: {
  app: Application;
  onClose: () => void;
  onAction: (id: string, action: "approved" | "rejected") => void;
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Application Details</h2>
        <button onClick={onClose} className="rounded-full p-2 hover:bg-gray-100">
          <X size={20} />
        </button>
      </div>
      <div className="space-y-3 text-sm text-gray-700">
        <p><strong>Name:</strong> {app.user?.name || "N/A"}</p>
        <p><strong>Email:</strong> {app.user?.email || "N/A"}</p>
        <p><strong>Department:</strong> {app.department || "N/A"}</p>
        <p><strong>CGPA:</strong> {formatCgpa(app.cgpa)}</p>
        <p>
          <strong>Subjects:</strong>{" "}
          {app.goodSubjects?.length ? app.goodSubjects.join(", ") : "None"}
        </p>
      </div>
      {normalizeStatus(app.status) === "PENDING" && (
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => onAction(getApplicationId(app), "approved")}
            className="flex-1 rounded-lg bg-emerald-600 py-2 font-semibold text-white hover:bg-emerald-700"
          >
            Approve
          </button>
          <button
            onClick={() => onAction(getApplicationId(app), "rejected")}
            className="flex-1 rounded-lg bg-red-600 py-2 font-semibold text-white hover:bg-red-700"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  </div>
);

// =================================================
// MAIN COMPONENT
// =================================================
export default function MentorApplicationsTable({ applications = [] }: MentorApplicationsProps) {
  const [filter, setFilter] = useState<"ALL" | ApplicationStatus>("ALL");
  const [selected, setSelected] = useState<Application | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);

  // Filter Data
  const filtered = applications.filter((app) =>
    filter === "ALL" ? true : normalizeStatus(app.status) === filter
  );

  // Handle Approve/Reject Action
  const doAction = async (id: string, action: "approved" | "rejected") => {
    setActionId(id);
    try {
      // API call simulation
      await new Promise((resolve) => setTimeout(resolve, 800));
      console.log(`Application ${id} has been ${action}`);
      // TODO: Add your API call or data mutation logic here
    } catch (error) {
      console.error(error);
    } finally {
      setActionId(null);
      setSelected(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
      {/* Header & Filter */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mentor Applications</h1>
          <p className="mt-1 text-sm text-gray-500">
            Review and manage student applications for the mentoring program.
          </p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="ALL">All Applications</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {filtered.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {/* =================================================
              DESKTOP LIST
          ================================================= */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-5 py-4 font-semibold">Applicant</th>
                  <th className="px-5 py-4 font-semibold">Department</th>
                  <th className="px-5 py-4 font-semibold">CGPA</th>
                  <th className="px-5 py-4 font-semibold">Subjects</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 font-semibold">Date</th>
                  <th className="px-5 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {filtered.map((app) => {
                  const id = getApplicationId(app);
                  const name = app.user?.name || "Applicant";
                  const email = app.user?.email || "";
                  const rawStatus = normalizeStatus(app.status);
                  const isPending = rawStatus === "PENDING";
                  const isActing = actionId === id;

                  return (
                    <tr key={id} className="transition hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-gray-900">{name}</p>
                        {email && <p className="mt-0.5 text-xs text-gray-500">{email}</p>}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-700">
                        {app.department || "—"}
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                        {formatCgpa(app.cgpa)}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-700">
                        {Array.isArray(app.goodSubjects) && app.goodSubjects.length > 0 ? (
                          <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                            {app.goodSubjects.length} Subject{app.goodSubjects.length > 1 ? "s" : ""}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={rawStatus} />
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                        {formatDate(app.createdAt)}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelected(app)}
                            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-700 transition hover:bg-gray-100"
                          >
                            <Eye size={14} />
                            View
                          </button>

                          {isPending && (
                            <>
                              <button
                                type="button"
                                onClick={() => doAction(id, "approved")}
                                disabled={isActing}
                                aria-label="Approve"
                                className="flex items-center justify-center rounded-lg bg-emerald-100 p-1.5 text-emerald-700 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {isActing ? (
                                  <Loader2 size={16} className="animate-spin" />
                                ) : (
                                  <Check size={16} />
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={() => doAction(id, "rejected")}
                                disabled={isActing}
                                aria-label="Reject"
                                className="flex items-center justify-center rounded-lg bg-red-100 p-1.5 text-red-700 transition hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {isActing ? (
                                  <Loader2 size={16} className="animate-spin" />
                                ) : (
                                  <X size={16} />
                                )}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* =================================================
              MOBILE LIST
          ================================================= */}
          <div className="grid grid-cols-1 divide-y divide-gray-200 lg:hidden">
            {filtered.map((app) => {
              const id = getApplicationId(app);
              const name = app.user?.name || "Applicant";
              const rawStatus = normalizeStatus(app.status);

              return (
                <div key={id} className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-gray-900">
                        {name}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-600">
                        <span>{app.department || "No Dept"}</span>
                        <span>•</span>
                        <span className="font-semibold text-gray-900">
                          CGPA: {formatCgpa(app.cgpa)}
                        </span>
                      </div>
                    </div>
                    <StatusBadge status={rawStatus} />
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelected(app)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white py-2 text-xs font-bold text-gray-700 transition hover:bg-gray-50"
                    >
                      <Eye size={14} />
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* =================================================
           EMPTY STATE
        ================================================= */
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
            <BookOpen size={24} />
          </div>
          <h3 className="text-sm font-bold text-gray-900">
            No applications found
          </h3>
          <p className="mt-1 max-w-sm text-sm text-gray-500">
            {filter === "ALL"
              ? "There are currently no mentor applications in the system."
              : `There are no applications with a ${filter.toLowerCase()} status.`}
          </p>
        </div>
      )}

      {/* =================================================
          DETAIL MODAL
      ================================================= */}
      {selected && (
        <DetailModal app={selected} onClose={() => setSelected(null)} onAction={doAction} />
      )}
    </div>
  );
}