import { supabase } from "@/lib/supabase";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

async function getAccessToken() {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

async function callFunction<T>(path: string, payload?: unknown, options?: RequestInit) {
  const token = await getAccessToken();
  const headers = new Headers(options?.headers);
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${supabaseUrl}/functions/v1/${path}`, {
    method: payload ? "POST" : "GET",
    ...options,
    headers,
    body: payload ? JSON.stringify(payload) : undefined,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Request failed");
  }

  return (await response.json()) as T;
}

export async function syncAppUser() {
  return callFunction<{ user: unknown }>("app-user-sync", {});
}

export async function fetchAppUser(openId: string) {
  const { data, error } = await supabase
    .from("app_users")
    .select("*")
    .eq("openId", openId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function listApprovedEvents() {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("status", "approved")
    .order("date", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function submitEvent(input: Record<string, unknown>) {
  const { data, error } = await supabase.from("events").insert({
    ...input,
    status: "pending",
  }).select().maybeSingle();

  if (error) throw error;
  return data;
}

export async function listApprovedBusinesses() {
  const { data, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("status", "approved")
    .order("name", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function submitBusiness(input: Record<string, unknown>) {
  const { data, error } = await supabase.from("businesses").insert({
    ...input,
    status: "pending",
  }).select().maybeSingle();

  if (error) throw error;
  return data;
}

export async function listPendingEvents() {
  const response = await callFunction<{ events: unknown[] }>("admin-events");
  return response.events;
}

export async function updateEventStatus(eventId: number, status: "approved" | "rejected") {
  const response = await callFunction<{ event: unknown }>("admin-events", {
    eventId,
    status,
  });
  return response.event;
}

export async function listPendingBusinesses() {
  const response = await callFunction<{ businesses: unknown[] }>("admin-businesses");
  return response.businesses;
}

export async function updateBusinessStatus(businessId: number, status: "approved" | "rejected") {
  const response = await callFunction<{ business: unknown }>("admin-businesses", {
    businessId,
    status,
  });
  return response.business;
}

export async function fetchMyBusiness(openId: string) {
  const { data, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("userOpenId", openId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function listUnclaimedBusinesses() {
  const { data, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("status", "approved")
    .is("userOpenId", null)
    .order("name", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function claimBusiness(businessId: number) {
  const response = await callFunction<{ business: unknown }>("business-claim", {
    businessId,
  });
  return response.business;
}

export async function updateBusinessProfile(payload: Record<string, unknown>) {
  const response = await callFunction<{ business: unknown }>("business-update", payload);
  return response.business;
}

export async function subscribeNewsletter(payload: Record<string, unknown>) {
  return callFunction<{ success: boolean; error?: string }>("newsletter-subscribe", payload);
}
