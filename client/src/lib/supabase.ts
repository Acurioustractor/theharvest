import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

const missingSupabaseError = () =>
  new Error(
    "Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
  );

const createMissingSupabaseQuery = () => {
  const query = new Proxy(() => query, {
    get: () => query,
    apply: () => {
      throw missingSupabaseError();
    },
  });
  return query;
};

const createMissingSupabaseClient = (): ReturnType<typeof createClient> =>
  ({
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => undefined } },
      }),
      signOut: async () => ({ error: null }),
      signInWithPassword: async () => ({
        data: { user: null, session: null },
        error: missingSupabaseError(),
      }),
      signUp: async () => ({
        data: { user: null, session: null },
        error: missingSupabaseError(),
      }),
      signInWithOtp: async () => ({
        data: { user: null, session: null },
        error: missingSupabaseError(),
      }),
      signInWithOAuth: async () => ({
        data: { provider: null, url: null },
        error: missingSupabaseError(),
      }),
    },
    from: () => createMissingSupabaseQuery(),
  }) as unknown as ReturnType<typeof createClient>;

if (!isSupabaseConfigured) {
  console.warn(
    "[Auth] Supabase client env vars missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
  );
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : createMissingSupabaseClient();
