import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { getRobotsMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Halaman Tidak Ditemukan (404)",
  description:
    "Halaman yang Anda tuju tidak ditemukan di situs Arga Tani Mandiri.",
  robots: getRobotsMetadata(true),
};

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-xl border border-[#CBD8D0] bg-[#F4F7F4] p-8 text-center">
        <span className="inline-block rounded-md bg-[#D9F0E3] px-2.5 py-1 text-xs font-bold text-[#143D29]">
          Halaman Tidak Ditemukan (404)
        </span>
        <h1 className="mt-3 font-display text-2xl font-bold text-[#0F1F17]">
          Alamat Halaman Tidak Tersedia
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#33473D]">
          Halaman yang Anda tuju tidak ditemukan di situs Arga Tani Mandiri.
          Silakan gunakan tautan di bawah untuk melihat etalase produk atau
          artikel edukasi.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#143D29] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0E2B1D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F1F17]"
          >
            Kembali ke Beranda
          </Link>
          <Link
            href="/#produk"
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#5A7566] bg-white px-4 py-2.5 text-sm font-semibold text-[#143D29] transition-colors hover:bg-[#D9F0E3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F1F17]"
          >
            Lihat Kategori Produk
          </Link>
        </div>
      </div>
    </div>
  );
}
