import { getAllDepartments } from "@/service/getAllDepartments";
import RegisterClient from "./_components/RegisterClient";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  const departmentsResult = await getAllDepartments();

  return <RegisterClient departments={departmentsResult?.data || []} />;
}
