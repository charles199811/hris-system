"use client"

import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
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

  const barGradients = [
    { id: "headcount-full-time", start: "#2563eb", end: "#60a5fa" },
    { id: "headcount-part-time", start: "#0891b2", end: "#67e8f9" },
    { id: "headcount-contractor", start: "#7c3aed", end: "#c4b5fd" },
    { id: "headcount-intern", start: "#d97706", end: "#fcd34d" },
  ]

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer>
        <BarChart data={formattedData}>
          <defs>
            {barGradients.map((gradient) => (
              <linearGradient
                key={gradient.id}
                id={gradient.id}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={gradient.start} />
                <stop offset="100%" stopColor={gradient.end} />
              </linearGradient>
            ))}
          </defs>

          <XAxis
            dataKey="name"
            stroke="#94a3b8"
            tick={{ fill: "#000000" }}
            axisLine={{ stroke: "#94a3b8" }}
            tickLine={{ stroke: "#94a3b8" }}
          />

          <YAxis
            stroke="#94a3b8"
            tick={{ fill: "#cbd5e1" }}
            allowDecimals={false}
            axisLine={{ stroke: "#94a3b8" }}
            tickLine={{ stroke: "#94a3b8" }}
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
            isAnimationActive
            animationDuration={1100}
            animationEasing="ease-out"
          >
            {formattedData.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={`url(#${barGradients[index % barGradients.length].id})`}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
