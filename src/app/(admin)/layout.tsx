import type { Metadata } from "next";
import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "Admin | Arga Tani Mandiri",
    template: "%s | Admin Arga Tani Mandiri",
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="min-h-dvh w-full bg-[#F4F7F4] text-[#0F1F17]">
      {children}
    </div>
  );
}
