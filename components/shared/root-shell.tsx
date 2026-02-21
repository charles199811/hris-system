"use client"

import { usePathname } from "next/navigation"
import { UserSidebar } from "@/components/user-dashboard/user-sidebar"

export default function RootShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isUserArea = pathname.startsWith("/user")

  if (!isUserArea) return <>{children}</>

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6">
      <div className="flex gap-4">
        <UserSidebar />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  )
}