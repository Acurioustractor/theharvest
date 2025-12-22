import { getLoginUrl } from "@/const";
import { fetchAppUser, syncAppUser } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath = getLoginUrl() } =
    options ?? {};
  const queryClient = useQueryClient();
  const [session, setSession] = useState<Session | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session ?? null);
      setSessionLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ?? null);
      setSessionLoading(false);
      queryClient.invalidateQueries({ queryKey: ["app-user"] });
    });

    return () => {
      active = false;
      subscription?.unsubscribe();
    };
  }, [queryClient]);

  const meQuery = useQuery({
    queryKey: ["app-user", session?.user?.id],
    enabled: Boolean(session?.access_token && session?.user?.id),
    queryFn: async () => {
      try {
        await syncAppUser();
      } catch {
        // Edge function may not be deployed yet; continue with best-effort lookup.
      }
      return fetchAppUser(session!.user.id);
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    queryClient.setQueryData(["app-user"], null);
  }, [queryClient]);

  const state = useMemo(() => {
    return {
      user: meQuery.data ?? null,
      loading: sessionLoading || meQuery.isLoading,
      error: meQuery.error ?? null,
      isAuthenticated: Boolean(session?.access_token && meQuery.data),
    };
  }, [
    meQuery.data,
    meQuery.error,
    meQuery.isLoading,
    session?.access_token,
    sessionLoading,
  ]);

  useEffect(() => {
    if (!redirectOnUnauthenticated) return;
    if (sessionLoading || meQuery.isLoading) return;
    if (state.user) return;
    if (typeof window === "undefined") return;
    if (window.location.pathname === redirectPath) return;

    window.location.href = redirectPath;
  }, [
    redirectOnUnauthenticated,
    redirectPath,
    meQuery.isLoading,
    sessionLoading,
    state.user,
  ]);

  return {
    ...state,
    refresh: () => meQuery.refetch(),
    logout,
  };
}
