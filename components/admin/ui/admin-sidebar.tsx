"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import AdminQuickActions from "@/components/admin/ui/admin-quick-actions";

const links = [
  { title: "Overview", href: "/admin/overview" },
  { title: "Users", href: "/admin/users" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const overviewLink = links[0];
  const remainingLinks = links.slice(1);

  return (
    <div className="px-4">
      <p className="text-base font-semibold text-muted-foreground mb-3">
        Admin Dashboard
      </p>

      <nav className="flex flex-col gap-1">
        {[overviewLink].map((item) => {
          const active = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {item.title}
            </Link>
          );
        })}

        

        {remainingLinks.map((item) => {
          const active = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {item.title}
            </Link>
          );
        })}
        <AdminQuickActions />
      </nav>
    </div>
  );
}
