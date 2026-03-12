"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { QuickActionsCompact } from "@/app/(root)/user/profile/quick-actions";

const links = [
  { title: "Overview", href: "/" },
  // { title: "", href: "" },
];

export default function Sidebar({ role }: { role?: string | null }) {
  const pathname = usePathname();
  const overviewLink = links[0];

  return (
    <div className="px-4">
      <div className="px-4 py-1 border-b">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/favicon.png"   // use your logo path
            alt="Intelura"
            width={120}
            height={30}
            className="object-contain"
          />
        </Link>
      </div>
      <p className="mb-3 mt-3 text-center text-base font-semibold text-muted-foreground">
        Dashboard
      </p>

      <nav className="flex flex-col gap-1">
        {[overviewLink].map((item) => {
          const active =
            item.href === "/" ? pathname === item.href : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-xl px-4 py-3 text-center text-sm transition-colors",
                active
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {item.title}
            </Link>
          );
        })}

        <QuickActionsCompact role={role} />
      </nav>
    </div>
  );
}
