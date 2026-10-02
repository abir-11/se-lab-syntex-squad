import React from "react";
import Link from "next/link";
import {
  Users,
  GraduationCap,
  BookOpen,
  Sparkles,
  Building2,
  ArrowRight,
} from "lucide-react";
import { getAllUsersAction } from "./_actions/adminActions";
import { getAllMentors } from "@/service/getAllMentors";
import { getAllMentorServices } from "@/service/getAllMentorServices";
import { getPublishedStories } from "@/service/getPublishedStories";
import { getAllDepartments } from "@/service/getAllDepartments";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [usersRes, mentorsRes, servicesRes, storiesRes, departmentsRes] =
    await Promise.all([
      getAllUsersAction({ limit: 100 }),
      getAllMentors(),
      getAllMentorServices({ limit: 100 }),
      getPublishedStories(),
      getAllDepartments(),
    ]);

  const totalUsers = usersRes?.meta?.total ?? usersRes?.data?.length ?? 0;
  const totalMentors = mentorsRes?.data?.length ?? 0;
  const totalServices = servicesRes?.meta?.total ?? servicesRes?.data?.length ?? 0;
  const totalStories = storiesRes?.data?.length ?? 0;
  const totalDepartments = departmentsRes?.data?.length ?? 0;

  const stats = [
    {
      label: "Total Users",
      value: totalUsers,
      icon: Users,
      href: "/dashboard/admin/users",
    },
    {
      label: "Approved Mentors",
      value: totalMentors,
      icon: GraduationCap,
      href: "/dashboard/admin/mentors",
    },
    {
      label: "Mentor Services",
      value: totalServices,
      icon: BookOpen,
      href: "/services",
    },
    {
      label: "Published Stories",
      value: totalStories,
      icon: Sparkles,
      href: "/dashboard/admin/stories",
    },
    {
      label: "Departments",
      value: totalDepartments,
      icon: Building2,
      href: "/dashboard/admin/departments",
    },
  ];

  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-3xl font-extrabold text-gray-900">
        Admin Overview
      </h1>
      <p className="text-gray-500 text-sm mt-1">
        A quick look at your campus platform.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5 mt-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-[#F68B1F]/50 hover:shadow-lg transition-all"
          >
            <div className="w-11 h-11 rounded-xl bg-[#F68B1F]/10 flex items-center justify-center">
              <stat.icon className="w-5 h-5 text-[#F68B1F]" />
            </div>
            <p className="text-3xl font-extrabold text-gray-900 mt-4">
              {stat.value}
            </p>
            <p className="text-xs text-gray-500 uppercase tracking-wider mt-1 flex items-center gap-1.5">
              {stat.label}
              <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mt-10">
        <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-4">
          {[
            {
              title: "Create a Story",
              desc: "Share campus news or achievements.",
              href: "/dashboard/admin/stories",
            },
            {
              title: "Add Department",
              desc: "Create a new campus department.",
              href: "/dashboard/admin/departments",
            },
            {
              title: "Edit Home Page",
              desc: "Update hero title, stats and image.",
              href: "/dashboard/admin/home-content",
            },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-[#F68B1F]/50 hover:shadow-lg transition-all group"
            >
              <h3 className="font-bold text-gray-900 group-hover:text-[#F68B1F] transition-colors flex items-center gap-2">
                {action.title}
                <ArrowRight className="w-4 h-4" />
              </h3>
              <p className="text-sm text-gray-500 mt-2">{action.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
