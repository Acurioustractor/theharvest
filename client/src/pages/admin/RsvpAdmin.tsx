import { useMemo } from "react";
import { ArrowLeft, Loader2, LogIn, RefreshCw, ShieldAlert, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";

type RsvpPayload = {
  event?: string | null;
  day?: string | null;
  people?: number | null;
  message?: string | null;
  source?: string | null;
};

type RsvpRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  payload: RsvpPayload;
  createdAt: Date;
};

function dayLabel(day: string | null | undefined): string {
  return day && day.trim() ? day : "No session picked";
}

export default function RsvpAdmin() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const query = trpc.eoi.list.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
    staleTime: 30_000,
  });

  const rows = (query.data ?? []) as RsvpRow[];

  const groups = useMemo(() => {
    const byDay = new Map<string, RsvpRow[]>();
    for (const row of rows) {
      const key = dayLabel(row.payload?.day);
      const existing = byDay.get(key) ?? [];
      existing.push(row);
      byDay.set(key, existing);
    }
    return Array.from(byDay.entries()).sort((a, b) => b[1].length - a[1].length);
  }, [rows]);

  const totalPeople = rows.reduce((sum, row) => sum + (row.payload?.people || 1), 0);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-100">
        <Loader2 className="h-8 w-8 animate-spin text-stone-700" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-100 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-stone-100">
              <LogIn className="h-7 w-7 text-stone-700" />
            </div>
            <CardTitle>Admin access required</CardTitle>
            <CardDescription>Sign in to see who's RSVP'd.</CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Button onClick={() => (window.location.href = getLoginUrl())}>Sign in</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-100 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-stone-100">
              <ShieldAlert className="h-7 w-7 text-red-600" />
            </div>
            <CardTitle>Access denied</CardTitle>
            <CardDescription>You do not have permission to see this.</CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Button onClick={() => (window.location.href = "/")}>Return home</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F0E8] text-stone-900">
      <header className="border-b border-stone-300 bg-[#1C1917] text-[#F5F0E8]">
        <div className="mx-auto max-w-4xl px-5 py-8 md:px-8">
          <a href="/admin" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Admin dashboard
          </a>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#C4922A]">who's coming</p>
              <h1 className="mt-3 text-4xl font-black leading-none md:text-5xl">Pizza night RSVPs</h1>
              <p className="mt-3 max-w-xl text-white/72">
                Everyone who left their details on the RSVP form, grouped by the session they picked.
              </p>
            </div>
            <Button variant="outline" onClick={() => query.refetch()} disabled={query.isFetching}>
              <RefreshCw className={`mr-2 h-4 w-4 ${query.isFetching ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-5 py-8 md:px-8">
        <div className="mb-8 flex items-center gap-3 border border-stone-300 bg-white p-4">
          <Users className="h-6 w-6 text-[#8B4A2A]" />
          <div>
            <p className="text-2xl font-black">{totalPeople}</p>
            <p className="text-xs text-stone-600">
              {rows.length} RSVP{rows.length === 1 ? "" : "s"} in the last 200 submissions
            </p>
          </div>
        </div>

        {query.isLoading ? (
          <div className="flex items-center justify-center py-16 text-stone-500">
            <Loader2 className="mr-3 h-6 w-6 animate-spin" />
            Loading RSVPs…
          </div>
        ) : rows.length === 0 ? (
          <div className="border border-stone-300 bg-white p-6 text-stone-600">
            No RSVPs yet. They'll show up here as soon as someone fills in the form on What's On.
          </div>
        ) : (
          <div className="space-y-6">
            {groups.map(([day, groupRows]) => {
              const dayTotal = groupRows.reduce((sum, row) => sum + (row.payload?.people || 1), 0);
              return (
                <div key={day} className="border border-stone-300 bg-white">
                  <div className="flex items-center justify-between border-b border-stone-200 bg-stone-50 px-5 py-3">
                    <h2 className="text-lg font-bold">{day}</h2>
                    <span className="font-mono text-sm text-stone-600">
                      {dayTotal} people &middot; {groupRows.length} RSVP{groupRows.length === 1 ? "" : "s"}
                    </span>
                  </div>
                  <div className="divide-y divide-stone-100">
                    {groupRows.map((row) => (
                      <div key={row.id} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3">
                        <div>
                          <p className="font-semibold text-stone-900">{row.name}</p>
                          <p className="text-sm text-stone-500">{row.email || row.phone}</p>
                        </div>
                        <div className="text-right text-sm text-stone-600">
                          <p>{row.payload?.people || 1} people</p>
                          <p className="text-xs text-stone-400">
                            {new Date(row.createdAt).toLocaleString("en-AU", {
                              day: "numeric",
                              month: "short",
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
