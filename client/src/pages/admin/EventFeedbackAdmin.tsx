import { useMemo } from "react";
import { ArrowLeft, Loader2, LogIn, RefreshCw, ShieldAlert, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";

type FeedbackRow = {
  id: number;
  eventId: number | null;
  rating: number | null;
  bestPart: string | null;
  wouldReturn: string | null;
  createdAt: Date;
};

export default function EventFeedbackAdmin() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const query = trpc.feedback.all.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
    staleTime: 30_000,
  });

  const rows = (query.data ?? []) as FeedbackRow[];

  const avgRating = useMemo(() => {
    const rated = rows.filter((r) => typeof r.rating === "number");
    if (rated.length === 0) return null;
    return (rated.reduce((sum, r) => sum + (r.rating || 0), 0) / rated.length).toFixed(1);
  }, [rows]);

  const wouldReturnYes = useMemo(
    () => rows.filter((r) => ["definitely", "probably"].includes(r.wouldReturn?.toLowerCase() ?? "")).length,
    [rows],
  );

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
            <CardDescription>Sign in to see event feedback.</CardDescription>
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
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#C4922A]">30-second feedback</p>
              <h1 className="mt-3 text-4xl font-black leading-none md:text-5xl">Event feedback</h1>
              <p className="mt-3 max-w-xl text-white/72">
                QR-code feedback left after events. Fully anonymous by design — no names or emails collected.
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
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-3 border border-stone-300 bg-white p-4">
            <Star className="h-6 w-6 text-[#8B4A2A]" />
            <div>
              <p className="text-2xl font-black">{avgRating ?? "—"}</p>
              <p className="text-xs text-stone-600">average rating out of 4, {rows.length} response{rows.length === 1 ? "" : "s"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 border border-stone-300 bg-white p-4">
            <p className="text-2xl font-black">{wouldReturnYes}/{rows.length}</p>
            <p className="text-xs text-stone-600">said definitely/probably they'd come back</p>
          </div>
        </div>

        {query.isLoading ? (
          <div className="flex items-center justify-center py-16 text-stone-500">
            <Loader2 className="mr-3 h-6 w-6 animate-spin" />
            Loading feedback…
          </div>
        ) : rows.length === 0 ? (
          <div className="border border-stone-300 bg-white p-6 text-stone-600">
            No feedback yet. It'll show up here as people scan the QR code after an event.
          </div>
        ) : (
          <div className="border border-stone-300 bg-white">
            <div className="border-b border-stone-200 bg-stone-50 px-5 py-3">
              <h2 className="text-lg font-bold">All responses</h2>
            </div>
            <div className="divide-y divide-stone-100">
              {rows.map((row) => (
                <div key={row.id} className="flex flex-wrap items-start justify-between gap-3 px-5 py-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-stone-500">
                        {row.rating ? `${row.rating}/4` : "No rating"}
                      </span>
                      {row.wouldReturn && (
                        <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-600">
                          would return: {row.wouldReturn}
                        </span>
                      )}
                      {row.eventId && (
                        <span className="text-xs text-stone-400">event #{row.eventId}</span>
                      )}
                    </div>
                    {row.bestPart && <p className="mt-1 text-sm text-stone-700">{row.bestPart}</p>}
                  </div>
                  <p className="text-xs text-stone-400">
                    {new Date(row.createdAt).toLocaleString("en-AU", {
                      day: "numeric",
                      month: "short",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
