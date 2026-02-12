"use client"

import * as React from "react"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

//Props and Types
type HeadcountRow = {
  departmentId: string | null
  employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACTOR" | "INTERN" | string
  _count: { _all: number }
}

type DepartmentRow = {
  id: string
  departmentName: string
}

type Props = {
  headcount: HeadcountRow[]
  departments: DepartmentRow[]
}

function labelEmploymentType(t: string) {
  return t.replaceAll("_", " ")
}

export default function HeadCountChart({ headcount, departments }: Props) {
  const deptMap = React.useMemo(() => {
    return new Map(departments.map((d) => [d.id, d.departmentName]))
  }, [departments])

  // Build chart rows per department
  const data = React.useMemo(() => {
    const byDept = new Map<string, any>()

    for (const row of headcount) {
      const deptKey = row.departmentId ?? "unassigned"
      const deptName =
        row.departmentId ? deptMap.get(row.departmentId) ?? "Unknown" : "Unassigned"

      if (!byDept.has(deptKey)) {
        byDept.set(deptKey, {
          department: deptName,
          FULL_TIME: 0,
          PART_TIME: 0,
          CONTRACTOR: 0,
          INTERN: 0,
        })
      }

      const current = byDept.get(deptKey)
      const key = row.employmentType as keyof typeof current
      if (key in current) current[key] += row._count._all
    }

    return Array.from(byDept.values())
  }, [headcount, deptMap])

  const totalActive = React.useMemo(() => {
    return headcount.reduce((sum, r) => sum + (r._count?._all ?? 0), 0)
  }, [headcount])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Employees Headcount (Active): {totalActive}</CardTitle>
      </CardHeader>

      <CardContent className="h-[320px]">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No active employees found.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="department" tickMargin={8} />
              <YAxis allowDecimals={false} />
              <Tooltip
                formatter={(value: any, name: any) => [value, labelEmploymentType(String(name))]}
              />
              <Legend
                formatter={(value: any) => labelEmploymentType(String(value))}
              />

              {/* stacked bars by employment type */}
              <Bar dataKey="FULL_TIME" stackId="a" />
              <Bar dataKey="PART_TIME" stackId="a" />
              <Bar dataKey="CONTRACTOR" stackId="a" />
              <Bar dataKey="INTERN" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
