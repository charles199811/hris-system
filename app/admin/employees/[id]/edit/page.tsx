import { prisma } from "@/db/prisma"
import { notFound } from "next/navigation"

type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function EditEmployeePage({ params }: Props) {
  const { id } = await params

  const employee = await prisma.employee.findUnique({
    where: { id },
    include: {
      department: true,
      branch: true,
      position: true,
      shift: true,
      user: true,
    },
  })

  if (!employee) notFound()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">
        Edit Employee: {employee.fullName}
      </h1>

      <div className="space-y-2">
        <p>Email: {employee.email}</p>
        <p>Phone: {employee.phoneNo ?? "Not set"}</p>
        <p>Department: {employee.department?.departmentName ?? "Not assigned"}</p>
        <p>Branch: {employee.branch?.branchName ?? "Not assigned"}</p>
      </div>
    </div>
  )
}
