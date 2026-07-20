import { useMemo } from "react";
import { ArrowLeft, Loader2, LogIn, RefreshCw, ShieldAlert, MessageSquareText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";

type PulseRow = {
  id: number;
  yearsInArea: string | null;
  communityValues: string[] | null;
  whatsMissing: string | null;
  heardOfHarvest: string | null;
  wouldUse: string[] | null;
  visitFrequency: string | null;
  preferredTime: string[] | null;
  skillsToShare: string | null;
  participationBarriers: string[] | null;
  ageBracket: string | null;
  name: string | null;
  email: string | null;
  source: string | null;
  createdAt: Date;
};

function tally(rows: PulseRow[], pick: (row: PulseRow) => string[] | null | undefined): [string, number][] {
  const counts = new Map<string, number>();
  for (const row of rows) {
    for (const value of pick(row) ?? []) {
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
}

function TallyList({ title, items }: { title: string; items: [string, number][] }) {
  if (items.length === 0) return null;
  return (
    <div className="border border-stone-300 bg-white p-4">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-stone-500">{title}</p>
      <div className="space-y-1.5">
        {items.map(([value, count]) => (
          <div key={value} className="flex items-center justify-between gap-3 text-sm">
            <span className="text-stone-800">{value}</span>
            <span className="font-mono text-stone-500">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PulseAdmin() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const query = trpc.pulse.results.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
    staleTime: 30_000,
  });

  const rows = (query.data ?? []) as PulseRow[];

  const namedCount = useMemo(() => rows.filter((r) => r.name && r.email).length, [rows]);

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
            <CardDescription>Sign in to see the Pulse survey results.</CardDescription>
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
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#C4922A]">community pulse</p>
              <h1 className="mt-3 text-4xl font-black leading-none md:text-5xl">Pulse survey results</h1>
              <p className="mt-3 max-w-xl text-white/72">
                Everyone who answered the community pulse survey. Anonymous answers stay anonymous —
                only responses with a name and email are shown below.
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
          <MessageSquareText className="h-6 w-6 text-[#8B4A2A]" />
          <div>
            <p className="text-2xl font-black">{rows.length}</p>
            <p className="text-xs text-stone-600">
              {rows.length} response{rows.length === 1 ? "" : "s"} total &middot; {namedCount} gave a name and email
            </p>
          </div>
        </div>

        {query.isLoading ? (
          <div className="flex items-center justify-center py-16 text-stone-500">
            <Loader2 className="mr-3 h-6 w-6 animate-spin" />
            Loading Pulse results…
          </div>
        ) : rows.length === 0 ? (
          <div className="border border-stone-300 bg-white p-6 text-stone-600">
            No Pulse responses yet. They'll show up here as soon as someone completes the survey.
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <TallyList title="What's missing" items={tally(rows, (r) => (r.whatsMissing ? [r.whatsMissing] : null))} />
              <TallyList title="Would use" items={tally(rows, (r) => r.wouldUse)} />
              <TallyList title="Community values" items={tally(rows, (r) => r.communityValues)} />
              <TallyList title="Skills to share" items={tally(rows, (r) => (r.skillsToShare ? [r.skillsToShare] : null))} />
              <TallyList title="Participation barriers" items={tally(rows, (r) => r.participationBarriers)} />
              <TallyList title="Preferred time" items={tally(rows, (r) => r.preferredTime)} />
            </div>

            <div className="border border-stone-300 bg-white">
              <div className="border-b border-stone-200 bg-stone-50 px-5 py-3">
                <h2 className="text-lg font-bold">Individual responses</h2>
              </div>
              <div className="divide-y divide-stone-100">
                {rows.map((row) => (
                  <div key={row.id} className="px-5 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold text-stone-900">
                        {row.name ? `${row.name}${row.email ? ` · ${row.email}` : ""}` : "Anonymous"}
                      </p>
                      <p className="text-xs text-stone-400">
                        {new Date(row.createdAt).toLocaleString("en-AU", {
                          day: "numeric",
                          month: "short",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <dl className="mt-2 grid gap-x-6 gap-y-1 text-sm text-stone-600 sm:grid-cols-2">
                      {row.yearsInArea && <div><dt className="inline text-stone-400">Years in area: </dt><dd className="inline">{row.yearsInArea}</dd></div>}
                      {row.ageBracket && <div><dt className="inline text-stone-400">Age: </dt><dd className="inline">{row.ageBracket}</dd></div>}
                      {row.heardOfHarvest && <div><dt className="inline text-stone-400">Heard of Harvest via: </dt><dd className="inline">{row.heardOfHarvest}</dd></div>}
                      {row.visitFrequency && <div><dt className="inline text-stone-400">Visit frequency: </dt><dd className="inline">{row.visitFrequency}</dd></div>}
                    </dl>
                    {row.whatsMissing && (
                      <p className="mt-2 text-sm text-stone-700">
                        <span className="text-stone-400">What's missing: </span>{row.whatsMissing}
                      </p>
                    )}
                    {row.skillsToShare && (
                      <p className="mt-1 text-sm text-stone-700">
                        <span className="text-stone-400">Skills to share: </span>{row.skillsToShare}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
