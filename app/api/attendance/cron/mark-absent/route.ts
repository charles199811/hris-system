import { NextResponse } from "next/server";
import { prisma } from "@/db/prisma";

const LONDON_TZ = "Europe/London";
const CRON_SECRET = process.env.CRON_SECRET!;



function londonYMD(d = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: LONDON_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d); //YYYY-MM-DD
}

function londonDateAsUTCDateFromYMD(ymd: string) {
  return new Date(`${ymd}T00:00:00.000Z`); // stored as @db.Date
}

function getYesterdayLondonYMD() {
  // Take "now in London", then subtract 1 day safely by using UTC date from ymd.
  const todayYMD = londonYMD(new Date());
  const todayUTC = new Date(`${todayYMD}T00:00:00.000Z`);
  todayUTC.setUTCDate(todayUTC.getUTCDate() - 1);
  return londonYMD(todayUTC); // returns yesterday in London
}

function isWeekendLondon(ymd: string) {
  // Determine day-of-week for London date key:
  // Create UTC midnight for that date; day-of-week is stable for date-only.
  const dt = new Date(`${ymd}T00:00:00.000Z`);
  const day = dt.getUTCDay(); // 0 Sun, 6 Sat
  return day === 0 || day === 6;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const secretFromQuery = searchParams.get("secret");
  const dateOverride = searchParams.get("date")
  const authHeader = req.headers.get("authorization");

  if (
    !CRON_SECRET ||
    (authHeader !== `Bearer ${CRON_SECRET}` && secretFromQuery !== CRON_SECRET)
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ymd = dateOverride ?? getYesterdayLondonYMD()

  // skip weekends (Sat/Sun)
  if (isWeekendLondon(ymd)) {
    return NextResponse.json({ ok: true, skipped: "WEEKOFF", date: ymd });
  }

  const date = londonDateAsUTCDateFromYMD(ymd);

  // Get all employee users (adjust role enum string if yours differs)
  const employees = await prisma.user.findMany({
    where: { role: "EMPLOYEE" },
    select: { id: true },
  });

  if (employees.length === 0) {
    return NextResponse.json({ ok: true, created: 0, date: ymd });
  }

  // Find existing attendance records for that date (any status)
  const existing = await prisma.attendance.findMany({
    where: {
      date,
      userId: { in: employees.map((e) => e.id) },
    },
    select: { userId: true, status: true },
  });

  const existingSet = new Set(existing.map((a) => a.userId));

  // Only create ABSENT for employees with NO record at all
  const missing = employees.filter((e) => !existingSet.has(e.id));

  if (missing.length === 0) {
    return NextResponse.json({ ok: true, created: 0, date: ymd });
  }

  // Create ABSENT rows
  await prisma.attendance.createMany({
    data: missing.map((e) => ({
      userId: e.id,
      date,
      status: "ABSENT",
      // checkIn/checkOut null
    })),
    skipDuplicates: true,
  });

  return NextResponse.json({ ok: true, created: missing.length, date: ymd });
}
