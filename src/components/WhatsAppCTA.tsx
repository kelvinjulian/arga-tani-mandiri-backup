import React from "react";
import {
  MessageCircle,
  ShoppingBag,
  ExternalLink,
  ArrowRight,
  Sprout,
} from "lucide-react";
import { SITE_DATA, WHATSAPP_NUMBER } from "@/data/site";
import { Container } from "@/components/Container";

export function WhatsAppConsultationBand() {
  const rawNumber = WHATSAPP_NUMBER || "6281234567890";
  const whatsappHref = `https://wa.me/${rawNumber.replace(/\D/g, "")}`;

  return (
    <section
      aria-labelledby="wa-consultation-heading"
      className="relative w-full bg-transparent pb-8 md:pb-12"
    >
      <Container>
        <div className="relative grid grid-cols-1 items-center gap-6 overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B2E1B] to-[#113B24] p-6 text-white shadow-xl sm:p-7 lg:grid-cols-12">
          <div className="relative z-10 lg:col-span-6">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">
              <Sprout className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Saluran Komunikasi Resmi</span>
            </span>
            <h2
              id="wa-consultation-heading"
              className="mt-2.5 font-display text-xl font-bold leading-snug text-white sm:text-2xl"
            >
              {SITE_DATA.whatsappBand.heading}
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-[#D9F0E3]">
              {SITE_DATA.whatsappBand.description}
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:col-span-6">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3.5 rounded-2xl bg-white p-4 text-[#0E291B] shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#EAF4EE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E3F3E8] text-[#15803D] transition-colors group-hover:bg-[#15803D] group-hover:text-white">
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <span className="block font-display text-sm font-bold leading-snug text-[#0E291B]">
                  Chat Konsultasi WA
                </span>
                <span className="mt-0.5 block text-xs font-medium text-[#526458]">
                  Respon cepat tim teknis
                </span>
              </div>
              <ArrowRight
                className="h-4 w-4 shrink-0 text-[#15803D] transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </a>

            <a
              href={SITE_DATA.officialStore.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3.5 rounded-2xl bg-[#C84B28] p-4 text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#B03E1E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white">
                <ShoppingBag className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <span className="block font-display text-sm font-bold leading-snug text-white">
                  Toko Resmi Shopee
                </span>
                <span className="mt-0.5 block text-xs font-medium text-white/85">
                  Tani InD® Indonesia
                </span>
              </div>
              <ExternalLink
                className="h-4 w-4 shrink-0 text-white/90 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function FloatingWhatsAppButton() {
  const rawNumber = WHATSAPP_NUMBER || "6281234567890";
  const whatsappHref = `https://wa.me/${rawNumber.replace(/\D/g, "")}`;

  return (
    <div
      aria-label="Pintasan WhatsApp"
      className="fixed right-4 bottom-4 z-40 sm:right-6 sm:bottom-6"
    >
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 rounded-full bg-[#15803D] px-4 py-3 text-sm font-semibold text-white shadow-xl transition-all hover:bg-[#0E2F1D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E2F1D]"
      >
        <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>Konsultasi WA</span>
      </a>
    </div>
  );
}
