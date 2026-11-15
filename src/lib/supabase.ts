import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cachedClient: SupabaseClient | null | undefined;

/**
 * Returns a server-side Supabase client configured with public anon credentials.
 * Returns null when env vars are missing so callers can fall back to static data.
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (cachedClient !== undefined) {
    return cachedClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!supabaseUrl || !supabaseAnonKey) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[supabase] NEXT_PUBLIC_SUPABASE_URL atau NEXT_PUBLIC_SUPABASE_ANON_KEY belum diatur; menggunakan data statis fallback."
      );
    }
    cachedClient = null;
    return null;
  }

  cachedClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  return cachedClient;
}
