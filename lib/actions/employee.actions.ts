"use server"

import { prisma } from "@/db/prisma"
import { redirect } from "next/navigation"

export async function getUsersWithEmployeeRole() {
  const users = await prisma.user.findMany({
    where: { role: "EMPLOYEE" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,

      // If you have a relation from User -> Employee (optional)
      employee: {
        select: {
          id: true,
          fullName: true,
          email: true,
          phoneNo: true,
          employmentType: true,
          isActive: true,
          contractEndDate: true,
          department: { select: { departmentName: true } },
          branch: { select: { branchName: true } },
          position: { select: { name: true } },
          shift: { select: { name: true } },
        },
      },
    },
  })

  return users
}



function safeFullName(name: string | null | undefined, email: string) {
  if (name && name.trim().length > 0) return name.trim()
  return email.split("@")[0] ?? "Employee"
}

export async function ensureEmployeeAndRedirect(formData: FormData) {
  const userId = String(formData.get("userId") ?? "")
  if (!userId) throw new Error("Missing userId")

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true },
  })
  if (!user) throw new Error("User not found")
  if (user.role !== "EMPLOYEE") throw new Error("This user is not an EMPLOYEE")

  const employee = await prisma.employee.upsert({
    where: { userId: user.id }, // unique key in your schema
    update: {
      // keep these always in sync with the User record
      email: user.email,
      fullName: safeFullName(user.name, user.email),
    },
    create: {
      userId: user.id,
      email: user.email,
      fullName: safeFullName(user.name, user.email),

      // hireDate + currency defaults come from schema now
      // hireDate: new Date(),
      // currency: "GBP",
      isActive: true,
    },
    select: { id: true },
  })

  // once ensured, take them to the edit page where they fill the rest
  redirect(`/admin/employees/${employee.id}/edit`)
}
