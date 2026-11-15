import type { SupabaseClient, User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AdminSessionResult =
  | { status: "unconfigured" }
  | { status: "unauthenticated" }
  | { status: "not_admin"; user: User }
  | { status: "authorized"; user: User };

/**
 * Verifies the user via Supabase Auth (getUser) and checks admin membership
 * via the database RPC function is_admin() using the user's own session.
 */
export async function checkAdminSession(): Promise<AdminSessionResult> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { status: "unconfigured" };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { status: "unauthenticated" };
  }

  const { data: isAdmin, error: rpcError } = await supabase.rpc("is_admin");

  if (rpcError || isAdmin !== true) {
    return { status: "not_admin", user };
  }

  return { status: "authorized", user };
}

/**
 * Server-component guard for protected /admin pages.
 * Redirects to /admin/login if unauthenticated or unauthorized.
 */
export async function requireAdminPage(): Promise<{
  supabase: SupabaseClient;
  user: User;
}> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    redirect("/admin/login");
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/admin/login");
  }

  const { data: isAdmin, error: rpcError } = await supabase.rpc("is_admin");
  if (rpcError || isAdmin !== true) {
    await supabase.auth.signOut();
    redirect("/admin/login?error=unauthorized");
  }

  return { supabase, user };
}

/**
 * Server-action guard: verifies user session and is_admin() before any write.
 */
export async function verifyAdminAction(): Promise<
  | { ok: true; supabase: SupabaseClient; user: User }
  | { ok: false; error: string }
> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { ok: false, error: "Konfigurasi Supabase belum tersedia." };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      ok: false,
      error: "Sesi login Anda sudah berakhir. Silakan masuk kembali.",
    };
  }

  const { data: isAdmin, error: rpcError } = await supabase.rpc("is_admin");
  if (rpcError || isAdmin !== true) {
    return {
      ok: false,
      error: "Akun Anda tidak memiliki izin admin untuk melakukan perubahan ini.",
    };
  }

  return { ok: true, supabase, user };
}
