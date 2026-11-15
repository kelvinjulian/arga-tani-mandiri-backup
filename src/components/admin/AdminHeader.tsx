import Image from "next/image";
import Link from "next/link";
import { LayoutDashboard, LogOut } from "lucide-react";
import { logoutAction } from "@/app/(admin)/admin/actions";
import { AdminSafeLink } from "./AdminSafeLink";

interface AdminHeaderProps {
  userEmail: string;
  isDashboard?: boolean;
}

export function AdminHeader({
  userEmail,
  isDashboard = false,
}: AdminHeaderProps) {
  return (
    <header className="border-b border-[#CBD8D0] bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <AdminSafeLink
            href="/admin"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#CDE2D4] bg-[#EAF3EE] p-1.5 transition-colors hover:bg-[#D9F0E3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F1F17]"
            aria-label="Kembali ke Dashboard Admin"
          >
            <Image
              src="/brand/logo-mark.png"
              alt=""
              width={24}
              height={24}
              className="h-6 w-6 object-contain"
            />
          </AdminSafeLink>
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-bold text-[#0F1F17] sm:text-base">
              Panel Admin Arga Tani Mandiri
            </p>
            <p className="truncate text-xs text-[#43594D]">{userEmail}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!isDashboard && (
            <AdminSafeLink
              href="/admin"
              className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-[#CBD8D0] bg-white px-3.5 py-2 text-xs font-semibold text-[#143D29] transition-colors hover:bg-[#EAF3EE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F1F17]"
            >
              <LayoutDashboard className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>Dashboard</span>
            </AdminSafeLink>
          )}
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-[#CBD8D0] bg-white px-3.5 py-2 text-xs font-semibold text-[#143D29] transition-colors hover:bg-[#EAF3EE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F1F17]"
          >
            Lihat Situs
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#143D29] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#0E2B1D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F1F17]"
            >
              <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Keluar</span>
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
