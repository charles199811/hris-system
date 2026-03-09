import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import RequestsPageClient from "@/components/shared/requests/requests-page-client";

export default async function RequestsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const [user, employee] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        email: true,
      },
    }),
    prisma.employee.findUnique({
      where: { userId: session.user.id },
      select: {
        fullName: true,
        email: true,
        currency: true,
        departmentId: true,
        position: {
          select: {
            name: true,
          },
        },
        department: {
          select: {
            depManager: {
              select: {
                id: true,
                fullName: true,
              },
            },
          },
        },
      },
    }),
  ]);

  const departmentManagers = employee?.departmentId
    ? await prisma.employee.findMany({
        where: {
          departmentId: employee.departmentId,
          user: {
            role: "MANAGER",
          },
        },
        orderBy: {
          fullName: "asc",
        },
        select: {
          id: true,
          fullName: true,
        },
      })
    : [];

  const managerMap = new Map<string, string>();

  if (employee?.department?.depManager) {
    managerMap.set(
      employee.department.depManager.id,
      employee.department.depManager.fullName,
    );
  }

  for (const manager of departmentManagers) {
    managerMap.set(manager.id, manager.fullName);
  }

  const requester = {
    fullName: employee?.fullName ?? user?.name ?? "Employee",
    email: employee?.email ?? user?.email ?? "",
    position: employee?.position?.name ?? "Not assigned",
    currency: employee?.currency ?? "GBP",
    managers: Array.from(managerMap, ([id, name]) => ({ id, name })),
  };

  return <RequestsPageClient requester={requester} />;
}
