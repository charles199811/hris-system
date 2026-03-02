import { prisma } from "@/db/prisma";

function startOfTodayUTC() {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d;
}
function startOfTomorrowUTC() {
  const d = startOfTodayUTC();
  d.setUTCDate(d.getUTCDate() + 1);
  return d;
}

function diffHours(from?: Date | null, to?: Date | null) {
  if (!from) return null;
  const end = to ?? new Date();
  const ms = end.getTime() - from.getTime();
  if (ms <= 0) return 0;
  return Math.round((ms / (1000 * 60 * 60)) * 10) / 10; // 1 decimal
}

export type TodayWorkforceRow = {
  id: string;
  name: string;
  role: string;
  country: string | null;
  checkIn: string | null;
  checkOut: string | null;
  workingHours: number | null;
  isOnline: boolean;
};

export async function getTodayWorkforce() {
  const from = startOfTodayUTC();
  const to = startOfTomorrowUTC();

  // Pull all users (or only active employees) + today attendance if exists
  const users = await prisma.user.findMany({
    where: {
      // if you have isActive:
      // isActive: true,
    },
    select: {
      id: true,
      name: true,
      role: true,
      employee: {
        select: {
          country: true, // change to your real field
        },
      },
      attendances: {
        where: {
          date: { gte: from, lt: to }, // use your field name (date/createdAt)
        },
        orderBy: { date: "desc" },
        take: 1,
        select: {
          id: true,
          checkIn: true,
          checkOut: true,
          date: true,
        },
      },
    },
  });

  const rows: TodayWorkforceRow[] = users.map((u) => {
    const a = u.attendances[0] ?? null;

    const isOnline = !!a?.checkIn && !a?.checkOut; // online = checked in, not checked out

    return {
      id: u.id,
      name: u.name ?? "—",
      role: u.role,
      country: u.employee?.country ?? null,
      checkIn: a?.checkIn
        ? new Date(a.checkIn).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : null,
      checkOut: a?.checkOut
        ? new Date(a.checkOut).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : null,
      workingHours: diffHours(a?.checkIn ?? null, a?.checkOut ?? null),
      isOnline,
    };
  });

  const online = rows.filter((r) => r.isOnline);
  const notActive = rows.filter((r) => !r.isOnline); // adjust if you want "no check-in today" only

  return {
    onlineCount: online.length,
    notActiveCount: notActive.length,
    rows,
  };
}
