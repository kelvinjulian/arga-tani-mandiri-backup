"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Sprout,
  CheckCircle2,
  ArrowRight,
  FlaskConical,
  FileCheck2,
  ShoppingBag,
  BookOpen,
} from "lucide-react";
import { SHOPEE_STORE_URL } from "@/data/categories";
import { Container } from "@/components/Container";

type TabKey = "profil" | "visi-misi" | "sejarah";

interface TabItem {
  key: TabKey;
  label: string;
}

const TABS: TabItem[] = [
  { key: "profil", label: "Profil & Komitmen" },
  { key: "visi-misi", label: "Visi & Misi" },
  { key: "sejarah", label: "Sejarah Perusahaan" },
];

const BENTO_REASONS = [
  {
    number: "01",
    title: "Formulasi Tepat Guna",
    description:
      "Menggabungkan pembenah tanah (Asam Humat) & agensia hayati (Trichoderma) untuk merawat kesuburan sekaligus mencegah penyakit akar.",
    icon: FlaskConical,
  },
  {
    number: "02",
    title: "Informasi Kemasan Transparan",
    description:
      "Spesifikasi komposisi, takaran penggunaan, serta kemasan 500 gr & 1 kg yang tertera jelas pada label produk.",
    icon: FileCheck2,
  },
  {
    number: "03",
    title: "Akses Pembelian Mudah di Shopee",
    description:
      "Tersedia secara resmi di Shopee (Tani InD® Indonesia) untuk memudahkan pemesanan eceran maupun rutin dari berbagai wilayah.",
    icon: ShoppingBag,
  },
  {
    number: "04",
    title: "Dukungan Panduan Budidaya",
    description:
      "Didukung artikel edukasi pertanian dan layanan konsultasi cepat via WhatsApp untuk membantu mengoptimalkan hasil panen.",
    icon: BookOpen,
  },
];

const TIMELINE_STEPS = [
  {
    step: "01",
    title: "Fase Inisiasi",
    description:
      "Berawal dari komitmen menyediakan sarana pemulihan kesehatan tanah.",
    badgeBg: "bg-[#0E2F1D]",
  },
  {
    step: "02",
    title: "Pengembangan Produk",
    description:
      "Menghadirkan formulasi Tamatric (Asam Humat & Trichoderma) dalam kemasan 500 gr & 1 kg.",
    badgeBg: "bg-[#0E2F1D]",
  },
  {
    step: "03",
    title: "Distribusi Digital Tani InD®",
    description:
      "Memperluas jangkauan nasional melalui toko resmi Shopee.",
    badgeBg: "bg-[#15803D]",
  },
];

export function AboutSection() {
  const [activeTab, setActiveTab] = useState<TabKey>("profil");
  const [topRevealed, setTopRevealed] = useState(true);
  const [bentoRevealed, setBentoRevealed] = useState(true);

  const topRef = useRef<HTMLDivElement>(null);
  const bentoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) {
      return;
    }

    const setupReveal = (
      el: HTMLElement | null,
      setRevealed: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      // Only animate in if the element starts below the current viewport
      if (rect.top > window.innerHeight * 0.92) {
        setRevealed(false);
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setRevealed(true);
                observer.disconnect();
              }
            });
          },
          { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
        );
        observer.observe(el);
        return observer;
      }
      return null;
    };

    const obs1 = setupReveal(topRef.current, setTopRevealed);
    const obs2 = setupReveal(bentoRef.current, setBentoRevealed);

    return () => {
      obs1?.disconnect();
      obs2?.disconnect();
    };
  }, []);

  return (
    <section
      id="tentang-kami"
      aria-labelledby="about-heading"
      className="scroll-mt-28 relative z-10 bg-transparent pt-4 lg:pt-6 pb-14 lg:pb-16 overflow-x-clip"
    >
      {/* Subtle Concentric SVG Circle Background Ring Graphics behind edges */}
      <svg
        aria-hidden="true"
        viewBox="0 0 360 360"
        fill="none"
        className="pointer-events-none absolute -left-28 top-10 h-80 w-80 opacity-[0.06]"
      >
        <circle cx="180" cy="180" r="90" stroke="#0E2F1D" strokeWidth="2" />
        <circle cx="180" cy="180" r="135" stroke="#0E2F1D" strokeWidth="1.5" />
        <circle
          cx="180"
          cy="180"
          r="175"
          stroke="#0E2F1D"
          strokeWidth="1.5"
          strokeDasharray="6 6"
        />
      </svg>
      <svg
        aria-hidden="true"
        viewBox="0 0 360 360"
        fill="none"
        className="pointer-events-none absolute -right-28 bottom-16 h-80 w-80 opacity-[0.06]"
      >
        <circle cx="180" cy="180" r="85" stroke="#0E2F1D" strokeWidth="2" />
        <circle cx="180" cy="180" r="130" stroke="#0E2F1D" strokeWidth="1.5" />
        <circle cx="180" cy="180" r="172" stroke="#0E2F1D" strokeWidth="1.5" />
      </svg>

      <Container className="relative z-10">
        {/* 1. Structural Redesign: 12-Column Editorial Split (Top half) */}
        <div
          ref={topRef}
          className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch transition-all duration-700 ease-out ${
            topRevealed
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
        >
          {/* Left Showcase (5 Columns - lg:col-span-5, pinned at top so it never shifts when switching tabs) */}
          <div className="lg:col-span-5 w-full min-w-0">
            <div className="relative w-full pb-6 sm:pb-4">
              <Image
                src="/images/about-collage.png"
                alt="Kolase aktivitas budidaya dan perawatan tanaman Arga Tani Mandiri"
                width={2268}
                height={1987}
                unoptimized
                className="w-full lg:w-[115%] lg:-ml-4 max-w-none h-auto object-contain select-none drop-shadow-xl"
              />

              {/* Overlay floating Badge tucked at bottom-left corner so it doesn't cover the center photos */}
              <div className="absolute -bottom-2 sm:bottom-0 left-0 sm:-left-2 z-20 bg-[#0E2F1D]/95 backdrop-blur-md text-white p-3.5 sm:p-4 rounded-2xl border border-white/15 shadow-xl max-w-[235px] sm:max-w-[255px]">
                <div className="flex items-start gap-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-emerald-400/50 bg-emerald-500/15 text-emerald-300">
                    <Sprout className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-xs sm:text-sm font-bold leading-snug text-white">
                      Fokus Kualitas &amp; Keberlanjutan
                    </p>
                    <p className="mt-1 text-[11px] leading-relaxed text-[#D9F0E3]">
                      Menghadirkan sarana produksi pertanian yang terarah untuk
                      kesuburan tanah dan hasil panen optimal.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Details (7 Columns - lg:col-span-7) */}
          <div className="lg:col-span-7 w-full min-w-0 flex flex-col justify-between">
            {/* Eyebrow Badge */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#DCE8DF] bg-[#EAF3EE] px-4 py-1.5 text-xs sm:text-sm font-semibold text-[#14532D]">
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#15803D]/30 bg-white text-[#15803D]">
                  <Sprout className="h-3 w-3" aria-hidden="true" />
                </span>
                <span>Tentang Arga Tani Mandiri</span>
              </div>

              {/* H2 Heading */}
              <h2
                id="about-heading"
                className="mt-4 font-display text-[clamp(1.7rem,2.25vw+0.35rem,2.22rem)] font-bold leading-[1.16] tracking-[-0.02em] text-[#0F1F17]"
              >
                Mitra Sarana Pertanian untuk{" "}
                <span className="relative inline-block text-[#15803D]">
                  Pertumbuhan Berkelanjutan
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 240 14"
                    fill="none"
                    className="pointer-events-none absolute -bottom-2 right-0 w-[58%] h-3 text-[#15803D]"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M 3 10 C 55 4, 155 4, 237 9"
                      stroke="currentColor"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h2>

              {/* Profile Text */}
              <p className="mt-4 text-base sm:text-[16.5px] leading-relaxed text-[#2C4235]">
                Arga Tani Mandiri menyediakan produk pupuk, pestisida, dan nutrisi
                tanaman berkualitas untuk mendukung produktivitas dan
                keberlanjutan pertanian Indonesia.
              </p>
            </div>

            {/* 2. Tabbed Content Switcher */}
            <div className="mt-6">
              <div
                role="tablist"
                aria-label="Informasi profil perusahaan"
                className="bg-[#EAF3EE]/90 p-1.5 flex flex-wrap sm:flex-nowrap gap-1 rounded-2xl sm:rounded-full max-w-xl mb-6 border border-[#DCE8DF]"
              >
                {TABS.map((tab) => {
                  const isActive = activeTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      role="tab"
                      id={`tab-${tab.key}`}
                      aria-selected={isActive}
                      aria-controls={`panel-${tab.key}`}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex-1 min-h-[44px] text-xs sm:text-sm transition-all duration-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F1F17] ${
                        isActive
                          ? "bg-[#0E2F1D] text-white rounded-xl sm:rounded-full px-4 sm:px-5 py-2.5 font-semibold shadow-md"
                          : "text-[#384E40] hover:bg-white/60 rounded-xl sm:rounded-full px-4 sm:px-5 py-2.5 font-medium"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab Content Views (Stacked in a single CSS Grid cell with balanced height across all 3 tabs) */}
              <div className="grid grid-cols-1 items-stretch">
                {/* Tab 1: Profil & Komitmen */}
                <div
                  id="panel-profil"
                  role="tabpanel"
                  aria-labelledby="tab-profil"
                  aria-hidden={activeTab !== "profil"}
                  className={`col-start-1 row-start-1 flex flex-col justify-between transition-opacity duration-200 ${
                    activeTab === "profil"
                      ? "opacity-100 z-10 pointer-events-auto"
                      : "opacity-0 z-0 pointer-events-none select-none invisible"
                  }`}
                >
                  <p className="text-[15.5px] sm:text-base leading-relaxed text-[#2C4235]">
                    Kami berkomitmen untuk selalu menyediakan formulasi
                    nutrisi tanaman dan pembenah struktur tanah (seperti lini
                    unggulan Tamatric Black Magic Powder berbahan Asam Humat
                    &amp; Trichoderma) dengan spesifikasi yang teruji serta
                    panduan penggunaan yang transparan pada setiap kemasannya.
                  </p>

                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col justify-between rounded-2xl border border-[#C5DBD0] bg-white/95 p-5 shadow-xs transition-colors hover:border-[#9BC5AC]">
                      <div className="flex items-center justify-between gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#CDE2D4] bg-[#EAF3EE] text-[#15803D]">
                          <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <span className="rounded-full bg-[#EAF3EE] px-3 py-1 text-[11px] font-bold text-[#14532D]">
                          Pendampingan Teknis
                        </span>
                      </div>
                      <div className="mt-3.5 min-w-0">
                        <h3 className="font-display text-base font-bold text-[#0F1F17]">
                          Dukungan Petani
                        </h3>
                        <p className="mt-1 text-xs sm:text-[13.5px] leading-relaxed text-[#384E40]">
                          Pendampingan pemakaian produk secara tepat guna untuk
                          mencapai hasil budidaya optimal.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between rounded-2xl border border-[#C5DBD0] bg-white/95 p-5 shadow-xs transition-colors hover:border-[#9BC5AC]">
                      <div className="flex items-center justify-between gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#CDE2D4] bg-[#EAF3EE] text-[#15803D]">
                          <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <span className="rounded-full bg-[#EAF3EE] px-3 py-1 text-[11px] font-bold text-[#14532D]">
                          Jaringan Resmi
                        </span>
                      </div>
                      <div className="mt-3.5 min-w-0">
                        <h3 className="font-display text-base font-bold text-[#0F1F17]">
                          Mitra Penyalur
                        </h3>
                        <p className="mt-1 text-xs sm:text-[13.5px] leading-relaxed text-[#384E40]">
                          Layanan distribusi resmi dan ketersediaan kemasan ke
                          berbagai wilayah pertanian Indonesia.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tab 2: Visi & Misi */}
                <div
                  id="panel-visi-misi"
                  role="tabpanel"
                  aria-labelledby="tab-visi-misi"
                  aria-hidden={activeTab !== "visi-misi"}
                  className={`col-start-1 row-start-1 grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch transition-opacity duration-200 ${
                    activeTab === "visi-misi"
                      ? "opacity-100 z-10 pointer-events-auto"
                      : "opacity-0 z-0 pointer-events-none select-none invisible"
                  }`}
                >
                  {/* Visi Card on the Left */}
                  <div className="md:col-span-5 bg-[#F0F6F2] border border-[#CBDCD0] rounded-2xl p-5 flex flex-col justify-center">
                    <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#14532D] mb-2.5">
                      <Sprout className="h-4 w-4 text-[#15803D]" aria-hidden="true" />
                      <span>Visi Kami</span>
                    </div>
                    <p className="text-sm sm:text-[15px] font-medium leading-relaxed text-[#0F1F17]">
                      Menjadi mitra penyedia sarana produksi pertanian yang
                      andal, inovatif, dan berkontribusi nyata terhadap
                      peningkatan kualitas tanah serta hasil panen petani
                      Indonesia.
                    </p>
                  </div>

                  {/* Misi List on the Right */}
                  <div className="md:col-span-7 bg-white/95 border border-[#DCE8DF] rounded-2xl p-5 space-y-2.5 flex flex-col justify-center">
                    <h3 className="font-display text-xs font-bold uppercase tracking-wider text-[#14532D]">
                      Misi Perusahaan
                    </h3>
                    <ul className="space-y-2.5">
                      <li className="flex items-start gap-2.5">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EAF3EE] text-[#15803D]">
                          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                        </span>
                        <span className="text-xs sm:text-[13.5px] leading-relaxed text-[#33473D]">
                          Menyediakan produk pupuk, pembenah tanah, dan
                          nutrisi tanaman dengan komposisi terukur.
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EAF3EE] text-[#15803D]">
                          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                        </span>
                        <span className="text-xs sm:text-[13.5px] leading-relaxed text-[#33473D]">
                          Memudahkan akses produk resmi bagi petani melalui
                          jaringan distribusi digital dan toko Shopee Tani InD®.
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EAF3EE] text-[#15803D]">
                          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                        </span>
                        <span className="text-xs sm:text-[13.5px] leading-relaxed text-[#33473D]">
                          Menghadirkan edukasi budidaya dan panduan pemakaian
                          yang tepat guna.
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Tab 3: Sejarah Perusahaan */}
                <div
                  id="panel-sejarah"
                  role="tabpanel"
                  aria-labelledby="tab-sejarah"
                  aria-hidden={activeTab !== "sejarah"}
                  className={`col-start-1 row-start-1 flex items-center transition-opacity duration-200 ${
                    activeTab === "sejarah"
                      ? "opacity-100 z-10 pointer-events-auto"
                      : "opacity-0 z-0 pointer-events-none select-none invisible"
                  }`}
                >
                  <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 relative">
                    {/* Horizontal Connector Bar on Desktop */}
                    <div
                      aria-hidden="true"
                      className="hidden sm:block absolute top-9 left-[16%] right-[16%] h-0.5 bg-[#CBDDCE] z-0"
                    />

                    {TIMELINE_STEPS.map((item) => (
                      <div
                        key={item.step}
                        className="relative z-10 flex flex-col items-center text-center bg-white/90 rounded-2xl p-5 border border-[#DCE8DF] shadow-2xs"
                      >
                        <div
                          className={`${item.badgeBg} text-white w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold z-10 mx-auto border-4 border-white shadow-sm`}
                        >
                          {item.step}
                        </div>
                        <h3 className="font-display font-bold text-[#0E2F1D] text-center mt-3 text-sm sm:text-[15px]">
                          {item.title}
                        </h3>
                        <p className="text-xs sm:text-[13px] text-[#43594D] text-center mt-1.5 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Bottom Block: "Alasan Memilih Produk Kami" Bento Grid */}
        <div
          ref={bentoRef}
          data-testid="why-choose-us-panel"
          className={`bg-gradient-to-br from-[#0B2E1B] to-[#113B24] rounded-3xl p-6 sm:p-8 lg:p-10 text-white shadow-2xl relative overflow-hidden mt-8 lg:mt-10 transition-all duration-700 ease-out ${
            bentoRevealed
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
        >
          {/* Decorative Concentric Rings inside Bento Box */}
          <svg
            aria-hidden="true"
            viewBox="0 0 320 320"
            fill="none"
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 opacity-[0.06]"
          >
            <circle cx="160" cy="160" r="70" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="160" cy="160" r="110" stroke="#FFFFFF" strokeWidth="1.5" />
            <circle cx="160" cy="160" r="150" stroke="#FFFFFF" strokeWidth="1.5" />
          </svg>

          {/* Title Block */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-xs font-semibold tracking-wide text-[#D9F0E3]">
                <Sprout className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                <span>Keunggulan Utama</span>
              </span>
              <h3 className="mt-2.5 font-display font-bold text-2xl lg:text-3xl text-white">
                Alasan Memilih Produk Kami
              </h3>
            </div>

            <a
              href={SHOPEE_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2.5 text-sm font-semibold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9F0E3]"
            >
              <span>Lihat Toko di Shopee</span>
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            </a>
          </div>

          {/* 4 Bento Cards */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
            {BENTO_REASONS.map((item) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={item.number}
                  className="bg-white/[0.05] border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:bg-white/[0.1] hover:border-emerald-500/35 relative group shadow-sm flex flex-col min-w-0"
                >
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="w-11 h-11 rounded-full bg-white/[0.1] text-emerald-400 flex items-center justify-center font-bold shrink-0">
                      <IconComponent className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-white/15 group-hover:text-white/25 text-3xl font-bold font-mono transition-colors select-none"
                    >
                      {item.number}
                    </span>
                  </div>

                  <h4 className="font-display font-bold text-lg text-white mb-2 leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-sm text-[#C4D9CC] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}

