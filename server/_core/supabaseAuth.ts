import { createClient } from "@supabase/supabase-js";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { ENV } from "./env";

let _client: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
  if (_client) return _client;
  if (!ENV.supabaseUrl || !ENV.supabaseAnonKey) {
    console.warn(
      "[Auth] Supabase URL or anon key missing. Set SUPABASE_URL and SUPABASE_ANON_KEY."
    );
    return null;
  }
  _client = createClient(ENV.supabaseUrl, ENV.supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  return _client;
}

export async function getSupabaseUser(
  accessToken: string
): Promise<SupabaseUser | null> {
  if (!accessToken) return null;
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error) {
    console.warn("[Auth] Supabase token verification failed", error.message);
    return null;
  }
  return data.user ?? null;
}
