import React from "react";
import { getAllUsersAction } from "../_actions/adminActions";
import { getAllDepartments } from "@/service/getAllDepartments";
import UsersClient from "./_components/UsersClient";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ searchTerm?: string; role?: string; page?: string }>;
}) {
  const params = await searchParams;
  const searchTerm = params.searchTerm || "";
  const role = params.role || "";
  const page = Math.max(Number(params.page) || 1, 1);

  const [usersRes, departmentsRes] = await Promise.all([
    getAllUsersAction({ searchTerm, role, page, limit: 10 }),
    getAllDepartments(),
  ]);

  const users = usersRes?.data || [];
  const meta = usersRes?.meta;
  const departments = departmentsRes?.data || [];

  return (
    <UsersClient
      users={users}
      meta={meta}
      departments={departments}
      searchTerm={searchTerm}
      role={role}
      page={page}
    />
  );
}
