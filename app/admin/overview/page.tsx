import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// -----------------------------
// Types (UI layer)
// -----------------------------
type Role = "ADMIN" | "HR" | "MANAGER" | "FINANCE" | "EMPLOYEE";

type AttendanceRow = {
  id: string;
  name: string;
  role: Role;
  country: string;
  checkInAt?: string; // ISO or formatted string
  checkOutAt?: string; // ISO or formatted string
  productivityHours: number; // e.g. 7.5
};

type NotActiveRow = {
  id: string;
  name: string;
  role: Role;
  country: string;
  reason: "On Leave" | "Public Holiday" | "No Check-in";
  leaveNote?: string; // e.g. "Annual Leave (10–12 Feb)"
};

type AlertRow = {
  id: string;
  name: string;
  role: Role;
  country: string;
  lastActivity: string; // e.g. "2026-02-08"
  daysMissing: number;
};

// -----------------------------
// Helpers
// -----------------------------
function formatHours(hours: number) {
  // show like "7.5h" or "0h"
  const rounded = Math.round(hours * 10) / 10;
  return `${rounded}h`;
}

function roleBadgeVariant(role: Role) {
  // simple, readable mapping (change if you already have a standard)
  switch (role) {
    case "ADMIN":
      return "destructive";
    case "HR":
      return "secondary";
    case "MANAGER":
      return "default";
    case "FINANCE":
      return "outline";
    case "EMPLOYEE":
    default:
      return "secondary";
  }
}

function reasonBadgeClass(reason: NotActiveRow["reason"]) {
  // Tailwind classes for quick differentiation (shadcn Badge supports className)
  switch (reason) {
    case "On Leave":
      return "bg-yellow-100 text-yellow-900 hover:bg-yellow-100";
    case "Public Holiday":
      return "bg-blue-100 text-blue-900 hover:bg-blue-100";
    case "No Check-in":
    default:
      return "bg-red-100 text-red-900 hover:bg-red-100";
  }
}

function kpiValue(n: number) {
  return n.toLocaleString();
}

export default async function OverviewPage() {
  // Phase 1 UI: mock data (replace with DB/API later)
  const onlineToday: AttendanceRow[] = [
    {
      id: "1",
      name: "Ayesha Khan",
      role: "EMPLOYEE",
      country: "Pakistan",
      checkInAt: "09:02",
      checkOutAt: undefined,
      productivityHours: 6.8,
    },
    {
      id: "2",
      name: "Daniel Tan",
      role: "HR",
      country: "Malaysia",
      checkInAt: "08:41",
      checkOutAt: "17:12",
      productivityHours: 8.5,
    },
    {
      id: "3",
      name: "Oliver Smith",
      role: "MANAGER",
      country: "United Kingdom",
      checkInAt: "09:15",
      checkOutAt: undefined,
      productivityHours: 6.2,
    },
  ];

  const notActiveToday: NotActiveRow[] = [
    {
      id: "10",
      name: "Siti Nur",
      role: "EMPLOYEE",
      country: "Indonesia",
      reason: "On Leave",
      leaveNote: "Annual Leave (10–11 Feb)",
    },
    {
      id: "11",
      name: "Hamza Ali",
      role: "FINANCE",
      country: "Pakistan",
      reason: "No Check-in",
    },
    {
      id: "12",
      name: "Nattapong K.",
      role: "EMPLOYEE",
      country: "Thailand",
      reason: "Public Holiday",
      leaveNote: "Makha Bucha Day",
    },
  ];

  const alerts: AlertRow[] = [
    {
      id: "a1",
      name: "Hamza Ali",
      role: "FINANCE",
      country: "Pakistan",
      lastActivity: "2026-02-08",
      daysMissing: 2,
    },
    {
      id: "a2",
      name: "Mei Ling",
      role: "EMPLOYEE",
      country: "Malaysia",
      lastActivity: "2026-02-07",
      daysMissing: 3,
    },
  ];

  const onlineCount = onlineToday.length;
  const notActiveCount = notActiveToday.length;
  const alertCount = alerts.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Admin Overview</h1>
          <p className="text-sm text-muted-foreground">
            Attendance snapshot for today (online, not active, and alerts).
          </p>
        </div>

        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/attendance">Attendance</Link>
          </Button>
          <Button asChild>
            <Link href="/admin/requests">HR Requests</Link>
          </Button>
        </div>
      </div>

      {/* Top KPI row */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Online Today</CardTitle>
            <CardDescription>Checked in and not checked out</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {kpiValue(onlineCount)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Not Active Today</CardTitle>
            <CardDescription>No check-in recorded</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {kpiValue(notActiveCount)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Alerts</CardTitle>
            <CardDescription>No activity for 2+ days</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {kpiValue(alertCount)}
          </CardContent>
        </Card>
      </div>

      {/* Main grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Attendance Tabs */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Attendance</CardTitle>
            <CardDescription>Today’s workforce status</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="online" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="online">
                  Online Today <span className="ml-2 text-xs text-muted-foreground">({onlineCount})</span>
                </TabsTrigger>
                <TabsTrigger value="not-active">
                  Not Active <span className="ml-2 text-xs text-muted-foreground">({notActiveCount})</span>
                </TabsTrigger>
              </TabsList>

              {/* Online */}
              <TabsContent value="online" className="mt-4">
                <div className="rounded-md border">
                  <ScrollArea className="h-[360px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Country</TableHead>
                          <TableHead>Check In</TableHead>
                          <TableHead>Check Out</TableHead>
                          <TableHead className="text-right">Productivity</TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {onlineToday.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell className="font-medium">{row.name}</TableCell>
                            <TableCell>
                              <Badge variant={roleBadgeVariant(row.role)}>{row.role}</Badge>
                            </TableCell>
                            <TableCell>{row.country}</TableCell>
                            <TableCell>{row.checkInAt ?? "-"}</TableCell>
                            <TableCell>{row.checkOutAt ?? <span className="text-muted-foreground">—</span>}</TableCell>
                            <TableCell className="text-right font-semibold">
                              {formatHours(row.productivityHours)}
                            </TableCell>
                          </TableRow>
                        ))}

                        {onlineToday.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                              No one is online yet today.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </div>
              </TabsContent>

              {/* Not Active */}
              <TabsContent value="not-active" className="mt-4">
                <div className="rounded-md border">
                  <ScrollArea className="h-[360px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Country</TableHead>
                          <TableHead>Reason</TableHead>
                          <TableHead>Notes</TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {notActiveToday.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell className="font-medium">{row.name}</TableCell>
                            <TableCell>
                              <Badge variant={roleBadgeVariant(row.role)}>{row.role}</Badge>
                            </TableCell>
                            <TableCell>{row.country}</TableCell>
                            <TableCell>
                              <Badge className={reasonBadgeClass(row.reason)} variant="secondary">
                                {row.reason}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {row.leaveNote ?? "—"}
                            </TableCell>
                          </TableRow>
                        ))}

                        {notActiveToday.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                              Everyone has checked in today.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Alerts</CardTitle>
            <CardDescription>Employees missing check-in/out for 2+ days</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Alert>
              <AlertTitle className="flex items-center justify-between">
                <span>Action needed</span>
                <Badge variant={alertCount > 0 ? "destructive" : "secondary"}>
                  {alertCount}
                </Badge>
              </AlertTitle>
              <AlertDescription className="text-sm text-muted-foreground">
                Only alert employees with no activity AND no approved leave/public holiday (we’ll enforce this in Phase 2).
              </AlertDescription>
            </Alert>

            <div className="rounded-md border">
              <ScrollArea className="h-[280px]">
                <div className="p-3 space-y-2">
                  {alerts.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-start justify-between gap-3 rounded-lg border bg-card p-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium">{a.name}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <Badge variant={roleBadgeVariant(a.role)}>{a.role}</Badge>
                          <span className="text-xs text-muted-foreground">{a.country}</span>
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">
                          Last activity: <span className="font-medium">{a.lastActivity}</span> • Missing:{" "}
                          <span className="font-medium">{a.daysMissing} days</span>
                        </p>
                      </div>

                      <Button asChild size="sm" variant="outline" className="shrink-0">
                        <Link href={`/admin/users`}>View</Link>
                      </Button>
                    </div>
                  ))}

                  {alerts.length === 0 && (
                    <div className="py-10 text-center text-sm text-muted-foreground">
                      No alerts 🎉
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
