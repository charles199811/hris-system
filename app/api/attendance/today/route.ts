import { NextResponse } from "next/server"
import { prisma } from "@/db/prisma"
import { auth } from "@/auth"

const LONDON_TZ = "Europe/London"

function londonYMD(d = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: LONDON_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d)
}

function londonDateAsUTCDate(ymd: string) {
  return new Date(`${ymd}T00:00:00.000Z`)
}

export async function GET() {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const date = londonDateAsUTCDate(londonYMD())

  const attendance = await prisma.attendance.findUnique({
    where: { userId_date: { userId, date } },
  })

  // frontend can decide what to show
  return NextResponse.json({ attendance })
}
