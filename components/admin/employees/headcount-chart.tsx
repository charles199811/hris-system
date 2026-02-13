"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"

type Props = {
  data: {
    employmentType: string
    count: number
  }[]
}

export default function HeadcountChart({ data }: Props) {
  const formattedData = [
    { name: "Full Time", value: data.find(d => d.employmentType === "FULL_TIME")?.count ?? 0 },
    { name: "Part Time", value: data.find(d => d.employmentType === "PART_TIME")?.count ?? 0 },
    { name: "Contractor", value: data.find(d => d.employmentType === "CONTRACTOR")?.count ?? 0 },
    { name: "Intern", value: data.find(d => d.employmentType === "INTERN")?.count ?? 0 },
  ]

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer>
        <BarChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          
          <XAxis
            dataKey="name"
            stroke="#94a3b8"
            tick={{ fill: "#cbd5e1" }}
          />

          <YAxis
            stroke="#94a3b8"
            tick={{ fill: "#cbd5e1" }}
            allowDecimals={false}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              border: "1px solid #334155",
              borderRadius: "8px",
              color: "#fff",
            }}
          />

          <Bar
            dataKey="value"
            radius={[8, 8, 0, 0]}
            fill="#3b82f6"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
