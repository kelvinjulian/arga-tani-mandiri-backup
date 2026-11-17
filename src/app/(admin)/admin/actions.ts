"use server";

import { redirect } from "next/navigation";
import { ADMIN_BASE_PATH, adminPath } from "@/lib/admin-path";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface LoginActionState {
  error: string | null;
}

export async function loginAction(
  _prevState: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  const rawEmail = formData.get("email");
  const rawPassword = formData.get("password");

  const email = typeof rawEmail === "string" ? rawEmail.trim() : "";
  const password = typeof rawPassword === "string" ? rawPassword : "";

  if (!email || !password) {
    return { error: "Email dan kata sandi wajib diisi" };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { error: "Konfigurasi Supabase belum tersedia" };
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    return { error: "Email atau kata sandi salah" };
  }

  const { data: isAdmin, error: rpcError } = await supabase.rpc("is_admin");
  if (rpcError || isAdmin !== true) {
    await supabase.auth.signOut();
    return { error: "Akun ini tidak memiliki akses admin" };
  }

  redirect(ADMIN_BASE_PATH);
}

export async function logoutAction(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  redirect(adminPath("/login"));
}
