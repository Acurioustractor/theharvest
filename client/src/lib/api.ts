import { supabase } from "@/lib/supabase";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

async function getAccessToken() {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

async function callFunction<T>(path: string, payload?: unknown, options?: RequestInit) {
  const token = await getAccessToken();
  const headers = new Headers(options?.headers);
  headers.set("Content-Type", "application/json");
  const authToken = token ?? supabaseAnonKey;
  if (authToken) {
    headers.set("Authorization", `Bearer ${authToken}`);
  }

  if (!supabaseUrl) {
    throw new Error("Supabase URL is not configured");
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
    .from("harvest_events")
    .select("*")
    .eq("status", "approved")
    .order("date", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function submitEvent(input: Record<string, unknown>) {
  const { data, error } = await supabase.from("harvest_events").insert({
    ...input,
    status: "pending",
  }).select().maybeSingle();

  if (error) throw error;
  return data;
}

export async function listApprovedBusinesses() {
  const { data, error } = await supabase
    .from("harvest_businesses")
    .select("*")
    .eq("status", "approved")
    .order("name", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function submitBusiness(input: Record<string, unknown>) {
  const { data, error } = await supabase.from("harvest_businesses").insert({
    ...input,
    status: "pending",
  }).select().maybeSingle();

  if (error) throw error;
  return data;
}

export interface HarvestPendingEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  description: string;
  contactEmail: string;
  submittedBy?: string | null;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface HarvestPendingBusiness {
  id: number;
  name: string;
  category: string;
  description: string;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  imageUrl?: string | null;
  submittedBy?: string | null;
  submitterEmail: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export async function listPendingEvents(): Promise<HarvestPendingEvent[]> {
  const response = await callFunction<{ events: HarvestPendingEvent[] }>("admin-events");
  return response.events;
}

export async function updateEventStatus(eventId: number, status: "approved" | "rejected"): Promise<HarvestPendingEvent> {
  const response = await callFunction<{ event: HarvestPendingEvent }>("admin-events", {
    eventId,
    status,
  });
  return response.event;
}

export async function listPendingBusinesses(): Promise<HarvestPendingBusiness[]> {
  const response = await callFunction<{ businesses: HarvestPendingBusiness[] }>("admin-businesses");
  return response.businesses;
}

export async function updateBusinessStatus(businessId: number, status: "approved" | "rejected"): Promise<HarvestPendingBusiness> {
  const response = await callFunction<{ business: HarvestPendingBusiness }>("admin-businesses", {
    businessId,
    status,
  });
  return response.business;
}

export async function fetchMyBusiness(openId: string) {
  const { data, error } = await supabase
    .from("harvest_businesses")
    .select("*")
    .eq("userOpenId", openId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function listUnclaimedBusinesses() {
  const { data, error } = await supabase
    .from("harvest_businesses")
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

export async function communitySubmit(payload: Record<string, unknown>) {
  return callFunction<{ success: boolean; error?: string; contactId?: string }>("community-submit", payload);
}
