import { getLoginUrl } from "@/const";
import { fetchAppUser, syncAppUser } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";

// Dev mode admin user - bypasses Supabase entirely
const DEV_ADMIN_USER = {
  id: 1,
  openId: "dev-admin-local",
  name: "Dev Admin",
  email: "benjamin@act.place",
  role: "admin" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
  loginMethod: "dev",
};

// Check if dev mode is enabled
const isDevMode = () => {
  if (typeof window === "undefined") return false;
  return window.location.hostname === "localhost" &&
         localStorage.getItem("dev-admin-login") === "true";
};

// Enable dev login
export const enableDevLogin = (redirectTo?: string) => {
  localStorage.setItem("dev-admin-login", "true");
  if (redirectTo) {
    window.location.href = redirectTo;
    return;
  }
  window.location.reload();
};

// Disable dev login
export const disableDevLogin = () => {
  localStorage.removeItem("dev-admin-login");
  window.location.reload();
};

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
  const [devMode, setDevMode] = useState(isDevMode());

  useEffect(() => {
    // Check dev mode on mount
    setDevMode(isDevMode());

    // If dev mode, skip Supabase entirely
    if (isDevMode()) {
      setSessionLoading(false);
      return;
    }

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
    queryKey: ["app-user", devMode ? "dev" : session?.user?.id],
    enabled: devMode || Boolean(session?.access_token && session?.user?.id),
    queryFn: async () => {
      // Dev mode - return mock admin user
      if (devMode) {
        return DEV_ADMIN_USER;
      }

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
    // Dev mode logout
    if (isDevMode()) {
      disableDevLogin();
      return;
    }

    await supabase.auth.signOut();
    queryClient.setQueryData(["app-user"], null);
  }, [queryClient]);

  const state = useMemo(() => {
    // Dev mode - always authenticated as admin
    if (devMode) {
      return {
        user: DEV_ADMIN_USER,
        loading: false,
        error: null,
        isAuthenticated: true,
      };
    }

    return {
      user: meQuery.data ?? null,
      loading: sessionLoading || meQuery.isLoading,
      error: meQuery.error ?? null,
      isAuthenticated: Boolean(session?.access_token && meQuery.data),
    };
  }, [
    devMode,
    meQuery.data,
    meQuery.error,
    meQuery.isLoading,
    session?.access_token,
    sessionLoading,
  ]);

  useEffect(() => {
    if (!redirectOnUnauthenticated) return;
    if (devMode) return; // Dev mode always authenticated
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
    devMode,
  ]);

  return {
    ...state,
    refresh: () => meQuery.refetch(),
    logout,
  };
}
