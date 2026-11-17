import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileText, Film, LayoutTemplate } from "lucide-react";
import { requireAdminPage } from "@/lib/supabase/admin";
import { adminPath } from "@/lib/admin-path";
import { AdminHeader } from "@/components/admin/AdminHeader";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dasbor",
};

export default async function AdminDashboardPage() {
  const { user } = await requireAdminPage();
  const userEmail = user.email ?? "Admin";

  return (
    <div className="min-h-dvh w-full">
      <AdminHeader userEmail={userEmail} isDashboard />

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="rounded-2xl border border-[#CBD8D0] bg-white p-6 shadow-xs">
          <h1 className="font-display text-xl font-bold text-[#0F1F17] sm:text-2xl">
            Selamat datang di Panel Admin
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[#33473D]">
            Anda masuk sebagai{" "}
            <span className="font-semibold text-[#0F1F17]">{userEmail}</span>.
            Pilih modul pengelolaan di bawah ini.
          </p>
        </div>

        <section
          aria-label="Modul pengelolaan konten"
          className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <Link
            href={adminPath("/artikel")}
            className="group flex flex-col justify-between rounded-2xl border border-[#CBD8D0] bg-white p-6 shadow-xs transition-all hover:border-[#15803D] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F1F17]"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D9F0E3] text-[#143D29]">
                  <FileText className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#143D29] px-3 py-1 text-xs font-bold text-white">
                  <span>Kelola</span>
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </div>
              <h2 className="mt-4 font-display text-lg font-bold text-[#0F1F17]">
                Artikel
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-[#33473D]">
                Buat, ubah, pratinjau, terbitkan, atau hapus artikel edukasi.
              </p>
            </div>
          </Link>

          <Link
            href={adminPath("/konten")}
            className="group flex flex-col justify-between rounded-2xl border border-[#CBD8D0] bg-white p-6 shadow-xs transition-all hover:border-[#15803D] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F1F17]"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D9F0E3] text-[#143D29]">
                  <LayoutTemplate className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#143D29] px-3 py-1 text-xs font-bold text-white">
                  <span>Kelola</span>
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </div>
              <h2 className="mt-4 font-display text-lg font-bold text-[#0F1F17]">
                Konten Situs
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-[#33473D]">
                Kelola bagian Beranda, Halaman Artikel, dan Seluruh Situs
                (Identitas Perusahaan &amp; Footer).
              </p>
            </div>
          </Link>

          <Link
            href={adminPath("/video")}
            className="group flex flex-col justify-between rounded-2xl border border-[#CBD8D0] bg-white p-6 shadow-xs transition-all hover:border-[#15803D] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F1F17]"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D9F0E3] text-[#143D29]">
                  <Film className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#143D29] px-3 py-1 text-xs font-bold text-white">
                  <span>Kelola</span>
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </div>
              <h2 className="mt-4 font-display text-lg font-bold text-[#0F1F17]">
                Video
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-[#33473D]">
                Kelola tautan video YouTube dan TikTok, urutan tampil, status,
                dan video unggulan.
              </p>
            </div>
          </Link>
        </section>
      </main>
    </div>
  );
}
