import { redirect } from "next/navigation";
import { getMe } from "@/service/getMe";

export const dynamic = "force-dynamic";

// Role-based dashboard entry point
const DashboardPage = async () => {
  const user = await getMe();

  if (!user?.success || !user?.data?.result) {
    redirect("/login");
  }

  const role = user.data.result.role;

  switch (role) {
    case "ADMIN":
    case "FACULTY":
      redirect("/dashboard/admin");
    case "MENTOR":
      redirect("/dashboard/mentor");
    case "STUDENT":
      redirect("/dashboard/student");
    default:
      redirect("/");
  }
};

export default DashboardPage;
