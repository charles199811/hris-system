"use client";

import Link from "next/link";
import { CalendarCheck, ClipboardList, Building2, Users, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const actions = [
  { title: "Attendance", href: "/admin/attendance", Icon: CalendarCheck },
  { title: "Requests", href: "/admin/requests", Icon: ClipboardList },
  { title: "Employees", href: "/admin/employees", Icon: Users },
  { title: "Departments", href: "/admin/departments", Icon: Building2 },
];

export default function AdminQuickActions() {
  return (
    <Card className="mt-3 rounded-xl border bg-background/90 p-3 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">Quick Actions</p>
          <p className="text-xs text-muted-foreground">Common admin tasks</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {actions.map(({ title, href, Icon }) => (
          <Button
            key={title}
            asChild
            variant="outline"
            className="h-auto min-h-16 flex-col gap-1 rounded-lg px-2 py-3 text-xs"
          >
            <Link href={href}>
              <Icon className="h-4 w-4" />
              <span>{title}</span>
            </Link>
          </Button>
        ))}
      </div>
    </Card>
  );
}
