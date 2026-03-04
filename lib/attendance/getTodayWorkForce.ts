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
  return Math.round((ms / (1000 * 60 * 60)) * 10) / 10;
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

  const users = await prisma.user.findMany({
    where: {
      // isActive: true,
    },
    select: {
      id: true,
      name: true,
      role: true,
      country: true, // ✅ get from User now

      attendances: {
        where: {
          date: { gte: from, lt: to },
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
    const isOnline = !!a?.checkIn && !a?.checkOut;

    return {
      id: u.id,
      name: u.name ?? "—",
      role: u.role,
      country: u.country ?? null, // ✅ map from user.country
      checkIn: a?.checkIn
        ? new Date(a.checkIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : null,
      checkOut: a?.checkOut
        ? new Date(a.checkOut).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : null,
      workingHours: diffHours(a?.checkIn ?? null, a?.checkOut ?? null),
      isOnline,
    };
  });

  const online = rows.filter((r) => r.isOnline);
  const notActive = rows.filter((r) => !r.isOnline);

  return {
    onlineCount: online.length,
    notActiveCount: notActive.length,
    rows,
  };
}