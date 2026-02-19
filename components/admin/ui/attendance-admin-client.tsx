"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type AttendanceStatus =
  | "PRESENT"
  | "ABSENT"
  | "LEAVE"
  | "HOLIDAY"
  | "WEEKOFF"
  | "PUBLIC_HOLIDAY";

type AttendanceRow = {
  id: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  workingHours: string | number | null;
  status: AttendanceStatus;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    role: string;
  };
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString();
}

function formatTime(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusVariant(
  status: AttendanceStatus,
): "default" | "secondary" | "destructive" | "outline" {
  if (status === "PRESENT") return "default";
  if (status === "ABSENT") return "destructive";
  if (status === "LEAVE") return "secondary";
  if (
    status === "PUBLIC_HOLIDAY" ||
    status === "HOLIDAY" ||
    status === "WEEKOFF"
  )
    return "outline";
  return "secondary";
}

export default function AttendanceAdminClient() {
  const [items, setItems] = React.useState<AttendanceRow[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Filters
  const [q, setQ] = React.useState("");
  const [status, setStatus] = React.useState<string>("ALL");

  // Default dates: today
  const today = React.useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [from, setFrom] = React.useState(today);
  const [to, setTo] = React.useState(today);

  // Pagination
  const [page, setPage] = React.useState(1);
  const pageSize = 20;
  const [total, setTotal] = React.useState(0);

  async function load() {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      q,
      status,
      from,
      to,
      page: String(page),
      pageSize: String(pageSize),
    });

    const res = await fetch(`/api/admin/attendance?${params.toString()}`, {
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      setItems([]);
      setTotal(0);
      setError(data?.error ?? "Failed to load attendance records");
      setLoading(false);
      return;
    }

    setItems(data.items ?? []);
    setTotal(data.total ?? 0);
    setLoading(false);
  }

  React.useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const canGoNext = page * pageSize < total;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Attendance Management</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="grid gap-3 md:grid-cols-4">
            <Input
              placeholder="Search name or email..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />

            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All</SelectItem>
                <SelectItem value="PRESENT">Present</SelectItem>
                <SelectItem value="ABSENT">Absent</SelectItem>
                <SelectItem value="LEAVE">Leave</SelectItem>
                <SelectItem value="HOLIDAY">Holiday</SelectItem>
                <SelectItem value="WEEKOFF">Week Off</SelectItem>
                <SelectItem value="PUBLIC_HOLIDAY">Public Holiday</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
            <Input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => {
                setPage(1);
                void load();
              }}
              disabled={loading}
            >
              {loading ? "Loading..." : "Apply Filters"}
            </Button>

            <Button
              variant="secondary"
              onClick={() => {
                setQ("");
                setStatus("ALL");
                setFrom(today);
                setTo(today);
                setPage(1);
                setItems([]);
                setTotal(0);
                setError(null);
              }}
            >
              Reset
            </Button>
          </div>

          {error ? (
            <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              {error}
            </div>
          ) : null}

          {/* Table */}
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="text-left">
                  <th className="p-3">Date</th>
                  <th className="p-3">Employee</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Check In</th>
                  <th className="p-3">Check Out</th>
                  <th className="p-3">Hours</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>

              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td className="p-4 text-muted-foreground" colSpan={7}>
                      {loading ? "Loading..." : "No records found"}
                    </td>
                  </tr>
                ) : (
                  items.map((row) => (
                    <tr key={row.id} className="border-t">
                      <td className="p-3">{formatDate(row.date)}</td>
                      <td className="p-3">{row.user?.name ?? "—"}</td>
                      <td className="p-3">{row.user?.email ?? "—"}</td>
                      <td className="p-3">{formatTime(row.checkIn)}</td>
                      <td className="p-3">{formatTime(row.checkOut)}</td>
                      <td className="p-3">{row.workingHours ?? "—"}</td>
                      <td className="p-3">
                        <Badge variant={statusVariant(row.status)}>
                          {row.status}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between text-sm">
            <div className="text-muted-foreground">
              Total: {total} • Page {page}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
              >
                Prev
              </Button>

              <Button
                variant="outline"
                onClick={() => setPage((p) => (canGoNext ? p + 1 : p))}
                disabled={!canGoNext || loading}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
