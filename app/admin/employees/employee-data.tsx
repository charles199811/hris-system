import { prisma } from "@/db/prisma"; // change if your prisma client is elsewhere

import HeadcountChart from "@/components/admin/employees/headcount-chart";
import ReviewStatusList from "@/components/admin/employees/review-status-list";
import LastDayList from "@/components/admin/employees/last-day-list";
import EmployeeTable from "@/components/admin/employees/employee-table";

function firstDayOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export default async function EmployeeData() {
  const today = new Date();
  const month = firstDayOfMonth(today);

  // 1) Employee table (list)
  const employees = await prisma.employee.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { role: true, email: true, name: true } }, // role comes from User
      department: { select: { id: true, departmentName: true } },
      branch: { select: { id: true, branchName: true } },
      position: { select: { id: true, name: true } },
      shift: { select: { id: true, name: true } },
    },
  });

  // 2) Headcount chart (active employees grouped by department + employmentType)
  const headcount = await prisma.employee.groupBy({
    by: ["departmentId", "employmentType"],
    where: { isActive: true },
    _count: { _all: true },
  });

  // Fetch department names for labels
  const deptIds = Array.from(
    new Set(headcount.map((h) => h.departmentId).filter(Boolean)),
  ) as string[];
  const departments = await prisma.department.findMany({
    where: { id: { in: deptIds } },
    select: { id: true, departmentName: true },
  });

  // 3) Performance review status (this month)
  const reviewsThisMonth = await prisma.performanceReview.findMany({
    where: { month },
    orderBy: { updatedAt: "desc" },
    select: {
      status: true,
      month: true,
      employee: {
        select: {
          fullName: true,
          employmentType: true,
          user: { select: { role: true } },
        },
      },
    },
  });

  // 4) Employee last day list (contract end)
  const lastDays = await prisma.employee.findMany({
    where: { contractEndDate: { not: null } },
    orderBy: { contractEndDate: "asc" },
    select: {
      fullName: true,
      employmentType: true,
      contractEndDate: true,
      user: { select: { role: true } },
    },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <HeadcountChart headcount={headcount} departments={departments} />
      <ReviewStatusList month={month} reviews={reviewsThisMonth} />
      <LastDayList items={lastDays} />
      <EmployeeTable employees={employees} /> 
    </div>
  );
}
