import React from "react";
import { getAllDepartments } from "@/service/getAllDepartments";
import DepartmentsClient from "./_components/DepartmentsClient";

export const dynamic = "force-dynamic";

export default async function AdminDepartmentsPage() {
  const departmentsRes = await getAllDepartments();
  const departments = departmentsRes?.data || [];

  return <DepartmentsClient departments={departments} />;
}
