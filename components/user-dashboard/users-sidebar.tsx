"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { title: "Overview", href: "" },
  // { title: "", href: "" },
];

export default function Sidebar() {
  const pathname = usePathname();

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
      <p className="text-base font-semibold text-muted-foreground mb-3 mt-3">
        Dashboard
      </p>

      <nav className="flex flex-col gap-1">
        {links.map((item) => {
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
      </nav>
    </div>
  );
}
