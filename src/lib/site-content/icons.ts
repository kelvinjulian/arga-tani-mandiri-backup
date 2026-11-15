import { createElement } from "react";
import {
  BookOpen,
  CheckCircle2,
  FileCheck2,
  FlaskConical,
  Leaf,
  MapPin,
  MessageCircle,
  Package,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Sprout,
  type LucideIcon,
} from "lucide-react";

export const SUPPORTED_ICON_MAP = {
  ShieldCheck,
  Leaf,
  PackageCheck,
  Sprout,
  CheckCircle2,
  FlaskConical,
  FileCheck2,
  ShoppingBag,
  BookOpen,
  MapPin,
  Package,
  MessageCircle,
} as const satisfies Record<string, LucideIcon>;

export type SupportedIconName = keyof typeof SUPPORTED_ICON_MAP;

export const SUPPORTED_ICON_OPTIONS: ReadonlyArray<{
  value: SupportedIconName;
  label: string;
}> = [
  { value: "ShieldCheck", label: "Perisai Mutu (ShieldCheck)" },
  { value: "Leaf", label: "Daun Ramah Lingkungan (Leaf)" },
  { value: "PackageCheck", label: "Kemasan Teruji (PackageCheck)" },
  { value: "Sprout", label: "Tunas Tanaman (Sprout)" },
  { value: "CheckCircle2", label: "Centang Terverifikasi (CheckCircle2)" },
  { value: "FlaskConical", label: "Formulasi Lab (FlaskConical)" },
  { value: "FileCheck2", label: "Label & Dokumen (FileCheck2)" },
  { value: "ShoppingBag", label: "Belanja / Toko (ShoppingBag)" },
  { value: "BookOpen", label: "Panduan / Edukasi (BookOpen)" },
  { value: "MapPin", label: "Lokasi / Distribusi (MapPin)" },
  { value: "Package", label: "Paket / Produk (Package)" },
  { value: "MessageCircle", label: "Konsultasi / Pesan (MessageCircle)" },
];

export function isSupportedIconName(value: unknown): value is SupportedIconName {
  return (
    typeof value === "string" &&
    Object.prototype.hasOwnProperty.call(SUPPORTED_ICON_MAP, value)
  );
}

export function getSupportedIcon(
  name: unknown,
  fallback: SupportedIconName = "ShieldCheck"
): LucideIcon {
  if (isSupportedIconName(name)) {
    return SUPPORTED_ICON_MAP[name];
  }
  return SUPPORTED_ICON_MAP[fallback];
}

export function SupportedIcon({
  name,
  fallback = "ShieldCheck",
  className,
}: {
  name: unknown;
  fallback?: SupportedIconName;
  className?: string;
}) {
  return createElement(getSupportedIcon(name, fallback), {
    className,
    "aria-hidden": true,
  });
}
