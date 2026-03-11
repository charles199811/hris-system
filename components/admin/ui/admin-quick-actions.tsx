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
    <Card className="mt-3 rounded-2xl border-slate-200 bg-white/70 p-4 shadow-sm backdrop-blur hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50/70 hover:shadow">
      

      <div className="grid grid-cols-2 gap-3">
        {actions.map(({ title, href, Icon }) => (
          <Button
            key={title}
            asChild
            variant="outline"
            className="
              group h-11 flex-col items-center justify-center gap-1
              rounded-xl border-slate-200 bg-white/70
              text-xs font-medium text-slate-800
              transition
              hover:-translate-y-1 hover:border-blue-200
              hover:bg-blue-50/70 hover:shadow
            "
          >
            <Link href={href}>
              <Icon className="h-4 w-4 text-slate-600 group-hover:text-blue-700" />
              {title}
            </Link>
          </Button>
        ))}
      </div>
    </Card>
  );
}
