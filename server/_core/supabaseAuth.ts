import { createClient } from "@supabase/supabase-js";
import { ENV } from "./env.js";

let _client: ReturnType<typeof createClient> | null = null;

type SupabaseAuthUser = {
  id: string;
  email?: string | null;
  user_metadata?: {
    full_name?: string | null;
    name?: string | null;
  } | null;
  app_metadata?: {
    provider?: string | null;
    providers?: string[] | null;
  } | null;
};

type SupabaseAuthApi = {
  getUser: (jwt?: string) => Promise<{
    data: { user: SupabaseAuthUser | null };
    error: { message: string } | null;
  }>;
};

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
): Promise<SupabaseAuthUser | null> {
  if (!accessToken) return null;
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  const auth = supabase.auth as unknown as SupabaseAuthApi;
  const { data, error } = await auth.getUser(accessToken);
  if (error) {
    console.warn("[Auth] Supabase token verification failed", error.message);
    return null;
  }
  return data.user ?? null;
}
