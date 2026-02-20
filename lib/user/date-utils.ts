// lib/user/date-utils.ts

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

export function monthName(d: Date) {
  return d.toLocaleString("en-GB", { month: "long" })
}

export function getMonthStats(date = new Date()) {
  const year = date.getFullYear()
  const month = date.getMonth()

  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)
  const daysInMonth = last.getDate()

  let weekends = 0
  let workDays = 0

  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month, day)
    const dow = d.getDay()
    if (dow === 0 || dow === 6) weekends++
    else workDays++
  }

  return { daysInMonth, workDays, weekends, holidays: 0 }
}

export function getPaydayInfo(date = new Date(), paydayDay = 1) {
  const year = date.getFullYear();
  const month = date.getMonth();

  const thisMonthPayday = new Date(year, month, paydayDay);
  const nextMonthPayday = new Date(year, month + 1, paydayDay);

  const nextPayday =
    date >= thisMonthPayday ? nextMonthPayday : thisMonthPayday;

  const msPerDay = 1000 * 60 * 60 * 24;
  const diff = nextPayday.getTime() - date.getTime();
  const daysRemaining = Math.max(0, Math.ceil(diff / msPerDay));

  const prevPayday =
    date >= thisMonthPayday
      ? thisMonthPayday
      : new Date(year, month - 1, paydayDay);
  const span = nextPayday.getTime() - prevPayday.getTime();
  const elapsed = clamp(
    ((date.getTime() - prevPayday.getTime()) / span) * 100,
    0,
    100,
  );

  return { nextPayday, daysRemaining, progressPct: Math.round(elapsed) };
}