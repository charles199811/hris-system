import { prisma } from "@/db/prisma";
import { AttendanceStatus } from "@prisma/client";

export type AttendanceAlertRow = {
  id: string; // userId
  name: string;
  role: string;
  country: string;
  lastActivity: string; // YYYY-MM-DD or "Never"
  daysMissing: number;
};

function startOfDayLocal(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export async function getAttendanceAlerts(options?: {
  windowDays?: number; // look back period
  minMissingDays?: number; // show only if missing >=
}) {
  const windowDays = options?.windowDays ?? 7;
  const minMissingDays = options?.minMissingDays ?? 2;

  const today = startOfDayLocal(new Date());
  const from = new Date(today);
  from.setDate(from.getDate() - windowDays);

  const employees = await prisma.employee.findMany({
    where: { isActive: true },
    select: {
      fullName: true,
      country: true,
      user: {
        select: {
          id: true,
          role: true,

          // ✅ last activity = latest day they were PRESENT/HALF_DAY (or had checkIn)
          attendances: {
            where: {
              OR: [
                { checkIn: { not: null } },
                {
                  status: {
                    in: [AttendanceStatus.PRESENT, AttendanceStatus.HALF_DAY],
                  },
                },
              ],
            },
            orderBy: { date: "desc" },
            take: 1,
            select: { date: true },
          },

          // ✅ count missing days = ABSENT in lookback window
          _count: {
            select: {
              attendances: {
                where: {
                  date: { gte: from, lt: today },
                  status: AttendanceStatus.ABSENT,
                },
              },
            },
          },
        },
      },
    },
  });

  const alerts: AttendanceAlertRow[] = employees
    .map((e) => {
      const last = e.user.attendances[0]?.date ?? null;
      const missing = e.user._count.attendances ?? 0;

      if (missing < minMissingDays) return null;

      return {
        id: e.user.id,
        name: e.fullName,
        role: e.user.role,
        country: e.country ?? "—",
        lastActivity: last
          ? new Date(last).toISOString().slice(0, 10)
          : "Never",
        daysMissing: missing,
      };
    })
    .filter(Boolean) as AttendanceAlertRow[];

  alerts.sort((a, b) => b.daysMissing - a.daysMissing);
  return alerts;
}
