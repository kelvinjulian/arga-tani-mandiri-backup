import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ADMIN_BASE_PATH } from "@/lib/admin-path";
import { checkAdminSession } from "@/lib/supabase/admin";
import { AdminLoginForm } from "./AdminLoginForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Masuk",
};

interface AdminLoginPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  const session = await checkAdminSession();
  if (session.status === "authorized") {
    redirect(ADMIN_BASE_PATH);
  }

  const params = await searchParams;
  const initialError =
    params.error === "unauthorized"
      ? "Akun ini tidak memiliki akses admin"
      : null;

  return <AdminLoginForm initialError={initialError} />;
}
