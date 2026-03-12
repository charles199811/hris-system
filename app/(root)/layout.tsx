import { APP_NAME, APP_SIDEBAR_WIDTH_CLASS } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import Menu from "@/components/shared/header/menu";
import { auth } from "@/auth";
// import MainNav from "./main-nav";
import { Input } from "@/components/ui/input";
import UserSidebar from "@/components/user-dashboard/users-sidebar";
// import AdminSearch from "@/components/admin/admin-search";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto">
          <div className="flex items-center h-16 px-4">
            <div className="ml-auto items-center flex space-x-4">
              <Input
                type="search"
                placeholder="Search..."
                className="md:w-[100px] lg:w-[300px]"
              />
              <Menu />
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1">
        <div className="container mx-auto flex gap-6">
          {/* Sidebar */}
          <aside className={`hidden md:block ${APP_SIDEBAR_WIDTH_CLASS} border-r py-5`}>
            <UserSidebar role={session?.user?.role} />
          </aside>
          {/* Page content */}
          <main className="flex-1 py-5">{children}</main>
        </div>
      </div>
    </div>
  );
}


