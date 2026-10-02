import React from "react";
import { Building2 } from "lucide-react";
import { getAllDepartments } from "@/service/getAllDepartments";

export const dynamic = "force-dynamic";

const DepartmentsPage = async () => {
  const departmentsRes = await getAllDepartments();
  const departments = departmentsRes?.data || [];

  return (
    <div className="bg-gray-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <span className="text-xs font-bold uppercase tracking-widest text-[#F68B1F]">
          Academics
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
          Campus Departments
        </h1>
        <p className="text-gray-400 mt-3 max-w-2xl">
          Explore every department on campus.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {departments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept) => (
              <div
                key={dept.id}
                className="bg-gray-900/60 border border-white/10 rounded-2xl p-6 hover:border-[#F68B1F]/40 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-[#F68B1F]/15 border border-[#F68B1F]/30 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-[#F68B1F]" />
                </div>
                <h2 className="text-lg font-bold text-white mt-4">
                  {dept.departmentName}
                </h2>
                {dept.description && (
                  <p className="text-sm text-gray-400 mt-2 line-clamp-3">
                    {dept.description}
                  </p>
                )}
                <span
                  className={`inline-block mt-4 text-[11px] font-bold uppercase tracking-wider rounded-full px-3 py-1 border ${
                    dept.status === "ACTIVE"
                      ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/40"
                      : "bg-gray-500/10 text-gray-400 border-gray-500/40"
                  }`}
                >
                  {dept.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-white/5 rounded-2xl bg-gray-900/40">
            <Building2 className="w-12 h-12 text-[#F68B1F]/50 mx-auto" />
            <p className="text-gray-400 mt-4">No departments found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentsPage;
