import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import Menu from "@/components/shared/header/menu";
// import MainNav from "./main-nav";
import { Input } from "@/components/ui/input";
import UserSidebar from "@/components/user-dashboard/users-sidebar";
// import AdminSearch from "@/components/admin/admin-search";

export default function RequestLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex gap-6">

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}