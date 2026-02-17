import { NextResponse } from "next/server";
import { prisma } from "@/db/prisma";
import { auth } from "@/auth";

const LONDON_TZ = "Europe/London";

function londonYMD(d = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: LONDON_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

function londonDateAsUTCDate(ymd: string) {
  return new Date(`${ymd}T00:00:00.000Z`);
}

function calculateHours(checkIn: Date, checkOut: Date) {
  const hours = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
  return Math.max(0, Math.round(hours * 100) / 100);
}

export async function POST() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ymd = londonYMD();
  const date = londonDateAsUTCDate(ymd);
  const now = new Date();

  const existing = await prisma.attendance.findUnique({
    where: { userId_date: { userId, date } },
  });

  if (!existing?.checkIn) {
    return NextResponse.json(
      { error: "You must check in first" },
      { status: 400 },
    );
  }

  if (existing.checkOut) {
    return NextResponse.json(
      { error: "Already checked out today" },
      { status: 400 },
    );
  }

  const workingHours = calculateHours(existing.checkIn, now);

  const attendance = await prisma.attendance.update({
    where: { id: existing.id },
    data: {
      checkOut: now,
      workingHours,
    },
  });

  return NextResponse.json({ attendance });
}
