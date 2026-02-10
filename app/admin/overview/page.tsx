import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border bg-card px-3 py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}

function QuickActionCard({
  title,
  description,
  href,
  cta,
}: {
  title: string;
  description: string;
  href: string;
  cta: string;
}) {
  return (
    <Card className="group h-full">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild className="w-full">
          <Link href={href}>{cta}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default async function OverviewPage() {
  // Replace these with real DB calls later (Prisma)
  const summary = {
    welcomeName: "Super Root",
    quote: {
      text: "Loading Quote...",
      author: "Loading Author...",
    },
    salary: {
      currency: "EUR",
      amount: 7794,
      lastUpdated: "2026-02-09",
    },
    month: {
      name: "February",
      workDays: 20,
      weekends: 8,
      holidays: 0,
    },
    attendance: {
      attended: 5,
      absent: 2,
      lateHours: 16,
      targetWorkDays: 20,
    },
    pay: {
      payDayText: "1st of every month",
      daysRemaining: 20,
      progressPercent: 28,
    },
  };

  const attendedPct =
    summary.attendance.targetWorkDays > 0
      ? Math.round(
          (summary.attendance.attended / summary.attendance.targetWorkDays) * 100
        )
      : 0;

  const absentPct =
    summary.attendance.targetWorkDays > 0
      ? Math.round(
          (summary.attendance.absent / summary.attendance.targetWorkDays) * 100
        )
      : 0;

  return (
    <div className="space-y-6">
      {/* Top row */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-2xl">
              Welcome, {summary.welcomeName}!
            </CardTitle>
            <CardDescription>Here’s your HRM overview for today.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <StatPill label="Role" value="Super Root" />
            <StatPill label="Status" value="Active" />
          </CardContent>
        </Card>

        <Card className="border-primary/40 bg-primary/10">
          <CardHeader>
            <CardTitle className="text-xl">ATTENDANCE SIGN OFF</CardTitle>
            <CardDescription>For Monday, 02/09/2026</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="default">
              Sign Off
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Middle row */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Quote */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-2xl">Quote of the day</CardTitle>
            <CardDescription>Motivation for your workday</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-xl italic leading-relaxed">
              “{summary.quote.text}”
            </p>
            <p className="text-sm text-muted-foreground">— {summary.quote.author}</p>
          </CardContent>
        </Card>

        {/* Salary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Your Salary</CardTitle>
            <CardDescription>Most recent payroll snapshot</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-3xl font-bold">
              {summary.salary.currency}{" "}
              {summary.salary.amount.toLocaleString("en-GB")}
            </div>
            <div className="h-px w-full bg-border" />
            <div className="text-sm text-muted-foreground">
              Last Updated: <span className="text-foreground">{summary.salary.lastUpdated}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Pay Day */}
        <Card className="bg-primary/10 border-primary/40">
          <CardHeader>
            <CardTitle className="text-2xl">Pay Day</CardTitle>
            <CardDescription>Payroll schedule</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm">
              <span className="text-muted-foreground">Pay Day: </span>
              <span className="font-medium">{summary.pay.payDayText}</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Days Remaining: </span>
              <span className="font-medium">{summary.pay.daysRemaining} days</span>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary">{summary.pay.progressPercent}%</Badge>
              <Progress value={summary.pay.progressPercent} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Month Data */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Data of {summary.month.name}</CardTitle>
            <CardDescription>Calendar breakdown</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <StatPill label="Work Days" value={`${summary.month.workDays} Days`} />
            <StatPill label="Weekends" value={`${summary.month.weekends} Days`} />
            <StatPill label="Holidays" value={`${summary.month.holidays} Days`} />
          </CardContent>
        </Card>

        {/* Attendance this month */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Your Attendance This Month</CardTitle>
            <CardDescription>Summary</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Attended: {summary.attendance.attended}</span>
                <span className="text-muted-foreground">{attendedPct}%</span>
              </div>
              <Progress value={attendedPct} className="h-3" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Absent: {summary.attendance.absent}</span>
                <span className="text-muted-foreground">{absentPct}%</span>
              </div>
              <Progress value={absentPct} className="h-3" />
            </div>

            <div className="rounded-lg border bg-destructive/10 p-3">
              <div className="text-sm font-medium">Hours</div>
              <div className="text-sm text-muted-foreground">
                {summary.attendance.lateHours}.00 Hours late
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Quick Actions</h2>
            <p className="text-sm text-muted-foreground">
              Jump into the most common HR tasks
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <QuickActionCard
            title="Payrolls"
            description="View payments & payroll runs"
            href="/admin/payrolls"
            cta="Go to Payments →"
          />
          <QuickActionCard
            title="Attendance"
            description="Take attendance & view records"
            href="/admin/attendance"
            cta="Go to Attendance →"
          />
          <QuickActionCard
            title="Calendar"
            description="Meetings, shifts and events"
            href="/admin/calendar"
            cta="Go to Calendar →"
          />
          <QuickActionCard
            title="Support"
            description="Requests and support tickets"
            href="/admin/requests"
            cta="Go to Requests →"
          />
        </div>
      </div>
    </div>
  );
}
