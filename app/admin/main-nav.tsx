"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import React from "react";

type NavItem = {
  title: string;
  href: string;
};

const navByRoute = {
  users: [
    { title: "All User", href: "/admin/users" },
    { title: "Add User", href: "/admin/users/add-user" },
  ],
  employees: [
    { title: "All Employee", href: "/admin/employees/new" }, // change if your create route is different
    { title: "Employees Details", href: "/admin/employees" },
  ],
  
  default: [{ title: "Admin ", href: "/admin/overview" }],
};

function getLinks(pathname: string): NavItem[] {
  if (pathname.startsWith("/admin/users")) return navByRoute.users;
  if (pathname.startsWith("/admin/employees")) return navByRoute.employees;
  return navByRoute.default;
}

const MainNav = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  const pathname = usePathname();
  const links = getLinks(pathname);

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {links.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(item.href + "/");

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              active ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
};

export default MainNav;
