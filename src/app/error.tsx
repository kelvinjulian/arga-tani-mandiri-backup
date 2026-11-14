"use client";

import React from "react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      role="alert"
      className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="rounded-xl border border-[#5A7566] bg-[#F4F7F4] p-8">
        <span className="inline-block rounded-md bg-[#D9F0E3] px-2.5 py-1 text-xs font-bold text-[#143D29]">
          Gangguan Muat Halaman
        </span>
        <h1 className="mt-3 font-display text-2xl font-bold text-[#0F1F17]">
          Halaman Tidak Dapat Ditampilkan Saat Ini
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[#33473D]">
          Terjadi kendala teknis saat memuat tampilan halaman:{" "}
          {error.message || "Kesalahan tidak diketahui"}. Silakan muat ulang
          halaman atau kembali ke beranda.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#143D29] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0E2B1D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F1F17]"
          >
            Coba Muat Ulang
          </button>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#5A7566] bg-white px-4 py-2.5 text-sm font-semibold text-[#143D29] transition-colors hover:bg-[#D9F0E3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F1F17]"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}

