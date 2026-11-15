"use client";

import { useActionState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Lock, LogIn } from "lucide-react";
import { loginAction, type LoginActionState } from "../actions";

interface AdminLoginFormProps {
  initialError?: string | null;
}

export function AdminLoginForm({ initialError = null }: AdminLoginFormProps) {
  const initialState: LoginActionState = { error: initialError };
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState
  );

  return (
    <main className="flex min-h-dvh w-full items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-[#CBD8D0] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#CDE2D4] bg-[#EAF3EE] p-2">
            <Image
              src="/brand/logo-mark.png"
              alt=""
              width={28}
              height={28}
              className="h-6 w-6 object-contain"
            />
          </span>
          <div className="min-w-0">
            <h1 className="font-display text-lg font-bold text-[#0F1F17] sm:text-xl">
              Masuk Panel Admin
            </h1>
            <p className="text-xs font-medium text-[#43594D]">
              Arga Tani Mandiri
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-[#33473D]">
          Gunakan akun admin terdaftar untuk mengakses pengelolaan situs.
        </p>

        {state.error && (
          <div
            role="alert"
            aria-live="polite"
            className="mt-4 rounded-xl border border-[#B83516]/30 bg-[#B83516]/10 px-4 py-3 text-sm font-medium text-[#992B11]"
          >
            {state.error}
          </div>
        )}

        <form action={formAction} className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="admin-email"
              className="block text-sm font-semibold text-[#0F1F17]"
            >
              Email
            </label>
            <input
              id="admin-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              disabled={isPending}
              placeholder="admin@domain.com"
              className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] bg-[#FBFCFA] px-3.5 py-2.5 text-sm text-[#0F1F17] placeholder:text-[#5A7566] transition-colors focus:border-[#143D29] focus:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F1F17] disabled:opacity-60"
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="block text-sm font-semibold text-[#0F1F17]"
            >
              Kata Sandi
            </label>
            <input
              id="admin-password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              disabled={isPending}
              placeholder="••••••••"
              className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] bg-[#FBFCFA] px-3.5 py-2.5 text-sm text-[#0F1F17] placeholder:text-[#5A7566] transition-colors focus:border-[#143D29] focus:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F1F17] disabled:opacity-60"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex min-h-[44px] w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#143D29] px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[#0E2B1D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F1F17] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending ? (
              <>
                <Lock className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Masuk</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 border-t border-[#E4ECE7] pt-4 text-center">
          <Link
            href="/"
            className="text-xs font-semibold text-[#143D29] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F1F17]"
          >
            Kembali ke Situs Publik
          </Link>
        </div>
      </div>
    </main>
  );
}
