import { redirect } from "next/navigation";

import { requireAdminSession } from "@/modules/auth/presentation/server/requireAdminSession";
import { AdminProjectsManager } from "@/modules/portfolio/presentation/components/AdminProjectsManager";

export default async function AdminProjectsPage() {
  const adminSession = await requireAdminSession();

  if (!adminSession) {
    redirect("/login");
  }

  return (
    <main className="relative flex-1">
      <AdminProjectsManager />
    </main>
  );
}
