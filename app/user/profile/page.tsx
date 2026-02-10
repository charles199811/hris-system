import { Metadata } from "next";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { AttendanceButton } from "@/components/shared/attendance-button";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Profile",
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function monthName(d: Date) {
  return d.toLocaleString("en-GB", { month: "long" });
}

function getMonthStats(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth();

  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const daysInMonth = last.getDate();

  let weekends = 0;
  let workDays = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month, day);
    const dow = d.getDay(); // 0 Sun ... 6 Sat
    if (dow === 0 || dow === 6) weekends++;
    else workDays++;
  }

  return { daysInMonth, workDays, weekends, holidays: 0 };
}

function getPaydayInfo(date = new Date(), paydayDay = 1) {
  const year = date.getFullYear();
  const month = date.getMonth();

  const thisMonthPayday = new Date(year, month, paydayDay);
  const nextMonthPayday = new Date(year, month + 1, paydayDay);

  // If today is on/after payday, next payday is next month, else this month
  const nextPayday =
    date >= thisMonthPayday ? nextMonthPayday : thisMonthPayday;

  // Days remaining (ceil to feel natural)
  const msPerDay = 1000 * 60 * 60 * 24;
  const diff = nextPayday.getTime() - date.getTime();
  const daysRemaining = Math.max(0, Math.ceil(diff / msPerDay));

  // Progress from payday -> next payday
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

function Bar({
  value,
  label,
  rightText,
  colorClass,
}: {
  value: number; // 0..100
  label: string;
  rightText?: string;
  colorClass: string;
}) {
  const v = clamp(value, 0, 100);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-slate-200">
        <span className="font-medium">{label}</span>
        {rightText ? <span className="text-slate-300">{rightText}</span> : null}
      </div>
      <div className="h-12 w-full rounded-full bg-slate-700/60 p-2">
        <div
          className={`h-full rounded-full ${colorClass}`}
          style={{ width: `${v}%` }}
        />
      </div>
    </div>
  );
}

const Profile = async () => {
  const session = await auth();
  if (!session?.user) {
    redirect("/sign-in");
  }

  // Keep your existing logic (you can wire real values later)
  const isSignedInToday = false;

  // --- Dashboard mock data (swap with real DB values later) ---
  const quote = {
    text: "Loading Quote...",
    author: "Loading Author...",
  };

  // If you later store salary in your Employee table, replace this with real values.
  const salary = {
    currency: "EUR",
    amount: 7794,
    lastUpdated: new Date(), // replace with DB updatedAt
  };

  const now = new Date();
  const monthStats = getMonthStats(now);
  const payday = getPaydayInfo(now, 1);

  const attendanceThisMonth = {
    attended: 5,
    absent: 2,
    expectedWorkDays: monthStats.workDays,
    hoursDelta: -16, // e.g. -16h
    lateHours: 15.95, // e.g. 15.95 hours late
  };

  const attendedPct =
    attendanceThisMonth.expectedWorkDays > 0
      ? (attendanceThisMonth.attended / attendanceThisMonth.expectedWorkDays) *
        100
      : 0;

  const absentPct =
    attendanceThisMonth.expectedWorkDays > 0
      ? (attendanceThisMonth.absent / attendanceThisMonth.expectedWorkDays) *
        100
      : 0;

  // Treat "late" as a severity bar (cap at 100). Adjust when you define your rule.
  const latePct = clamp(attendanceThisMonth.lateHours * 6, 0, 100);

  return (
    <SessionProvider session={session}>
      <div className="space-y-6">
        {/* ✅ KEEP THIS CARD SAME (your current progress) */}
        <div className="flex items-center justify-between rounded-xl bg-slate-900 p-6 text-white shadow">
          <div>
            <h1 className="text-2xl font-semibold">
              Welcome, {session?.user.name}!
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              Role: <span className="font-medium">{session?.user.role}</span>
            </p>
          </div>

          <AttendanceButton isSignedIn={isSignedInToday} />
        </div>

        {/* Rest of dashboard (matches your screenshot layout style) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Quote of the day (wide) */}
          <div className="lg:col-span-9 rounded-xl bg-slate-900 p-6 text-white shadow">
            <h2 className="text-2xl font-semibold">Quote of the day</h2>
            <div className="mt-5 space-y-2">
              <p className="text-2xl italic text-slate-100">“{quote.text}”</p>
              <p className="text-sm italic text-slate-400">- {quote.author}</p>
            </div>
          </div>

          {/* Salary (right) */}
          <div className="lg:col-span-3 rounded-xl bg-slate-900 p-6 text-white shadow">
            <h2 className="text-2xl font-semibold">Your Salary</h2>
            <div className="mt-5">
              <p className="text-center text-2xl font-semibold">
                {salary.currency}{" "}
                {salary.amount.toLocaleString("en-GB", {
                  maximumFractionDigits: 0,
                })}
              </p>
              <div className="my-4 h-px w-full bg-slate-700" />
              <p className="text-sm text-slate-300">
                Last Updated:{" "}
                <span className="text-slate-200">
                  {salary.lastUpdated.toISOString().slice(0, 10)}
                </span>
              </p>
            </div>
          </div>

          {/* Pay Day (left purple) */}
          <div className="lg:col-span-4 rounded-xl bg-gradient-to-br bg-slate-900 to-indigo-900 p-6 text-white shadow">
            <h2 className="text-2xl font-semibold">Pay Day</h2>

            <div className="mt-6 space-y-3 text-base text-white/90">
              <p>
                <span className="font-semibold">Pay Day:</span> 1st of every
                month.
              </p>
              <p>
                <span className="font-semibold">Days Remaining:</span>{" "}
                {payday.daysRemaining} Days.
              </p>
            </div>

            <div className="mt-6">
              <div className="h-4 w-full rounded-full bg-black/30">
                <div
                  className="h-4 rounded-full bg-yellow-400"
                  style={{ width: `${payday.progressPct}%` }}
                />
              </div>
              <p className="mt-2 text-sm text-white/80">
                {payday.progressPct}%
              </p>
            </div>
          </div>

          {/* Month data (middle) */}
          <div className="lg:col-span-3 rounded-xl bg-slate-900 p-6 text-white shadow">
            <h2 className="text-2xl font-semibold">Data of {monthName(now)}</h2>

            <div className="mt-6 space-y-3 text-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Work Days:</span>
                <span className="font-semibold">
                  {monthStats.workDays} Days
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Weekends:</span>
                <span className="font-semibold">
                  {monthStats.weekends} Days
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Holidays:</span>
                <span className="font-semibold">
                  {monthStats.holidays} Days
                </span>
              </div>
            </div>
          </div>

          {/* Attendance (right wide) */}
          <div className="lg:col-span-5 rounded-xl bg-slate-900 p-6 text-white shadow">
            <h2 className="text-2xl font-semibold">
              Your Attendance This Month
            </h2>

            <div className="mt-6 space-y-5">
              <Bar
                label={`Attended ${attendanceThisMonth.attended}`}
                value={attendedPct}
                colorClass="bg-yellow-400"
              />

              <Bar
                label={`Absented: ${attendanceThisMonth.absent}`}
                value={absentPct}
                colorClass="bg-yellow-400"
              />

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Hours:</span>
                    <span className="text-slate-300">
                      {attendanceThisMonth.hoursDelta}h
                    </span>
                  </div>
                  <span className="text-slate-300">
                    {attendanceThisMonth.lateHours.toFixed(2)} Hours late
                  </span>
                </div>

                <div className="h-12 w-full rounded-full bg-slate-700/60 p-2">
                  <div
                    className="h-full rounded-full bg-yellow-400"
                    style={{ width: `${latePct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SessionProvider>
  );
};

export default Profile;
