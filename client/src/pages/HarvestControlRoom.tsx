import { useAuth } from "@/_core/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { colors } from "@/styles/brand";
import type { EditorialPost } from "@/types/social";
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  Camera,
  CheckCircle2,
  ClipboardCheck,
  Database,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Link2,
  Loader2,
  Lock,
  LogIn,
  MessageSquareText,
  RefreshCw,
  Route,
  ShieldAlert,
  ShoppingBasket,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo } from "react";

type StatusTone = "good" | "watch" | "blocked" | "quiet";

type ControlLink = {
  label: string;
  href?: string;
  path?: string;
  note: string;
  kind: "page" | "doc" | "tool";
};

type AssetPick = {
  title: string;
  room: string;
  src: string;
  status: string;
};

type WorkItem = {
  title: string;
  detail: string;
  tone: StatusTone;
  owner: string;
};

type SetupGate = {
  id: string;
  title: string;
  status: "good" | "watch" | "blocked";
  owner: string;
  detail: string;
  nextAction: string;
};

type SignalCardProps = {
  label: string;
  value: string | number;
  detail: string;
  icon: LucideIcon;
  tone?: StatusTone;
  loading?: boolean;
};

type GhlPost = {
  id?: string;
  _id?: string;
  status?: string;
  scheduledAt?: string;
  createdAt?: string;
  summary?: string;
};

const statusClasses: Record<StatusTone, string> = {
  good: "border-[#4A6741]/25 bg-[#4A6741]/10 text-[#25421f]",
  watch: "border-[#C4922A]/35 bg-[#C4922A]/15 text-[#6f4b08]",
  blocked: "border-[#CF5C1E]/35 bg-[#CF5C1E]/15 text-[#7b2f0c]",
  quiet: "border-stone-300 bg-stone-100 text-stone-600",
};

const publicPages: ControlLink[] = [
  {
    label: "Home page",
    href: "/",
    note: "The live public home page.",
    kind: "page",
  },
  {
    label: "Home",
    href: "/",
    note: "Current public first impression.",
    kind: "page",
  },
  {
    label: "Membership",
    href: "/membership",
    note: "Member list capture and welcome bridge.",
    kind: "page",
  },
  {
    label: "Shop",
    href: "/shop",
    note: "Maker and supplier interest capture.",
    kind: "page",
  },
  {
    label: "What is The Harvest",
    href: "/what-is-the-harvest",
    note: "Core public explainer.",
    kind: "page",
  },
  {
    label: "Brand guide",
    href: "/brand-guide",
    note: "Internal design memory in the browser.",
    kind: "tool",
  },
  {
    label: "Brand development",
    href: "/brand-development",
    note: "Interactive prompt, scorecard, and decision-record workbench.",
    kind: "tool",
  },
];

const sourceDocs: ControlLink[] = [
  {
    label: "Brand operating system",
    path: "docs/brand/README.md",
    note: "repo -> Notion -> GHL -> website model.",
    kind: "doc",
  },
  {
    label: "Design memory",
    path: "DESIGN.md",
    note: "Garden, Kitchen, Art Space rules.",
    kind: "doc",
  },
  {
    label: "Voice",
    path: "docs/brand/harvest-brand-voice.md",
    note: "Public copy tests and audience angles.",
    kind: "doc",
  },
  {
    label: "Photo and history assets",
    path: "docs/brand/real-photo-and-history-assets.md",
    note: "Rights, consent, and source workflow.",
    kind: "doc",
  },
  {
    label: "June sprint plan",
    path: "docs/strategy/june-sprint-operating-plan-2026-06-02.md",
    note: "Current launch operating view.",
    kind: "doc",
  },
  {
    label: "Content flow",
    path: "docs/communications/content-flow-and-stages.md",
    note: "Empathy Ledger -> Notion -> GHL -> learned.",
    kind: "doc",
  },
];

const assetPicks: AssetPick[] = [
  {
    title: "Aerial site",
    room: "Place",
    src: "/images/compendium/hero-aerial.jpg",
    status: "Deck spine",
  },
  {
    title: "Seed house front",
    room: "Place",
    src: "/images/compendium/seed-house-front.jpg",
    status: "Website proof",
  },
  {
    title: "Sophie garden",
    room: "Garden",
    src: "/images/optimized/hero-aerial-1400.webp",
    status: "Consent check",
  },
  {
    title: "Barry workbench",
    room: "Art Space",
    src: "/images/compendium/barry/IMG_5745.jpg",
    status: "Story proof",
  },
  {
    title: "Master floor plan",
    room: "Site",
    src: "/images/compendium/MASTER FLOOR PLAN.png",
    status: "Plan proof",
  },
  {
    title: "Milk crate card",
    room: "Kitchen",
    src: "/images/social/harvest-social-card.jpg",
    status: "Default social",
  },
];

const launchChecks: WorkItem[] = [
  {
    title: "GHL workflow status",
    detail: "Publish draft welcome and receipt workflows, then test one enrolment.",
    tone: "blocked",
    owner: "Ben / GHL",
  },
  {
    title: "Calendar tag workflows",
    detail: "B1, B2, and shop-chat bookings need tag workflows verified in the GHL UI.",
    tone: "watch",
    owner: "Ben / GHL",
  },
  {
    title: "Public page promise",
    detail: "Keep 20 June private member-day links off the public website.",
    tone: "good",
    owner: "Website",
  },
  {
    title: "Photo consent role",
    detail: "Name one day-of content person and brief them on consent before publishing people photos.",
    tone: "watch",
    owner: "Crew",
  },
  {
    title: "Hard gates",
    detail: "Public liability, food safety, pizza lead, roster, and SOP review remain launch gates.",
    tone: "blocked",
    owner: "Ops",
  },
];

const annotationTargets: WorkItem[] = [
  {
    title: "Hero",
    detail: "Does the first viewport show the real place and name the three rooms fast enough?",
    tone: "watch",
    owner: "/",
  },
  {
    title: "Rooms",
    detail: "Check that Garden, Kitchen, and Art Space each have one job, not three explanations.",
    tone: "good",
    owner: "/",
  },
  {
    title: "Proof",
    detail: "Flag any photo or historical image without clear source, rights, and publish status.",
    tone: "watch",
    owner: "Assets",
  },
  {
    title: "Calls to action",
    detail: "One action per section: member list, shop interest, story, or help.",
    tone: "good",
    owner: "Website",
  },
];

function countByStatus(posts: EditorialPost[]) {
  return posts.reduce<Record<EditorialPost["status"], number>>(
    (acc, post) => {
      acc[post.status] += 1;
      return acc;
    },
    { draft: 0, approved: 0, scheduled: 0, published: 0 },
  );
}

function formatShortDate(value?: string | null) {
  if (!value) return "No date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No date";
  return date.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
  });
}

function statusToneForPost(status: EditorialPost["status"]): StatusTone {
  if (status === "published") return "good";
  if (status === "scheduled") return "good";
  if (status === "approved") return "watch";
  return "quiet";
}

function statusToneForGhlPost(status?: string): StatusTone {
  if (status === "published" || status === "scheduled") return "good";
  if (status === "draft") return "watch";
  return "quiet";
}

function SignalCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = "quiet",
  loading,
}: SignalCardProps) {
  return (
    <Card className="rounded-lg border-stone-300 bg-[#FFFDF7] shadow-none">
      <CardHeader className="gap-4 pb-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardDescription className="font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500">
              {label}
            </CardDescription>
            <CardTitle className="mt-3 text-3xl font-black text-[#1C1917]">
              {loading ? <Loader2 className="h-7 w-7 animate-spin" /> : value}
            </CardTitle>
          </div>
          <span className={`flex h-11 w-11 items-center justify-center rounded-lg border ${statusClasses[tone]}`}>
            <Icon className="h-5 w-5" />
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed text-stone-600">{detail}</p>
      </CardContent>
    </Card>
  );
}

function ItemRow({ item }: { item: WorkItem }) {
  return (
    <div className="grid gap-3 border-t border-stone-300 py-4 first:border-t-0 md:grid-cols-[0.72fr_1fr_auto] md:items-start">
      <div>
        <p className="font-semibold text-[#1C1917]">{item.title}</p>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-stone-500">
          {item.owner}
        </p>
      </div>
      <p className="text-sm leading-relaxed text-stone-700">{item.detail}</p>
      <Badge className={`rounded-md border ${statusClasses[item.tone]}`} variant="outline">
        {item.tone}
      </Badge>
    </div>
  );
}

function GateRow({ gate }: { gate: SetupGate }) {
  return (
    <div className="grid gap-3 border-t border-stone-300 py-4 first:border-t-0 md:grid-cols-[0.72fr_1fr_auto] md:items-start">
      <div>
        <p className="font-semibold text-[#1C1917]">{gate.title}</p>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-stone-500">
          {gate.owner}
        </p>
      </div>
      <div>
        <p className="text-sm leading-relaxed text-stone-700">{gate.detail}</p>
        <p className="mt-2 text-sm font-medium leading-relaxed text-[#8B4A2A]">
          {gate.nextAction}
        </p>
      </div>
      <Badge className={`rounded-md border ${statusClasses[gate.status]}`} variant="outline">
        {gate.status}
      </Badge>
    </div>
  );
}

function LinkRow({ item }: { item: ControlLink }) {
  const content = (
    <>
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-300 bg-white text-stone-700">
          {item.kind === "page" ? (
            <Route className="h-4 w-4" />
          ) : item.kind === "tool" ? (
            <ClipboardCheck className="h-4 w-4" />
          ) : (
            <FileText className="h-4 w-4" />
          )}
        </span>
        <span>
          <span className="block font-semibold text-[#1C1917]">{item.label}</span>
          {item.path ? (
            <code className="mt-1 block text-xs text-stone-500">{item.path}</code>
          ) : null}
        </span>
      </div>
      <span className="text-sm text-stone-600">{item.note}</span>
      {item.href ? (
        <ExternalLink className="h-4 w-4 text-stone-400 transition group-hover:text-[#8B4A2A]" />
      ) : (
        <FileText className="h-4 w-4 text-stone-300" />
      )}
    </>
  );

  if (!item.href) {
    return (
      <div className="grid gap-3 border-t border-stone-300 py-4 first:border-t-0 md:grid-cols-[0.64fr_1fr_auto] md:items-center">
        {content}
      </div>
    );
  }

  return (
    <a
      href={item.href}
      className="group grid gap-3 border-t border-stone-300 py-4 first:border-t-0 md:grid-cols-[0.64fr_1fr_auto] md:items-center"
    >
      {content}
    </a>
  );
}

function AuthShell() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F5F0E8] px-5">
      <Card className="w-full max-w-md rounded-lg border-stone-300 bg-[#FFFDF7] text-center shadow-none">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-[#1C1917] text-[#F5F0E8]">
            <Lock className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-black text-[#1C1917]">
            Harvest Control Room
          </CardTitle>
          <CardDescription>
            Admin access is required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full bg-[#1C1917] text-[#F5F0E8] hover:bg-[#3D3832]"
            onClick={() => {
              window.location.href = getLoginUrl();
            }}
          >
            <LogIn className="h-4 w-4" />
            Sign in
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}

function AccessDenied() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F5F0E8] px-5">
      <Card className="w-full max-w-md rounded-lg border-stone-300 bg-[#FFFDF7] text-center shadow-none">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-[#CF5C1E]/15 text-[#CF5C1E]">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-black text-[#1C1917]">
            Admin only
          </CardTitle>
          <CardDescription>
            This surface is for Harvest operators.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={() => (window.location.href = "/")}>
            Return home
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}

export default function HarvestControlRoom() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const editorialSummaryQuery = trpc.editorial.harvestSummary.useQuery(undefined, {
    retry: false,
    enabled: isAuthenticated && user?.role === "admin",
  });

  const socialAccountsQuery = trpc.social.accounts.useQuery(undefined, {
    retry: false,
    enabled: isAuthenticated && user?.role === "admin",
  });
  const socialPostsQuery = trpc.social.list.useQuery(undefined, {
    retry: false,
    enabled: isAuthenticated && user?.role === "admin",
  });
  const rsvpCountQuery = trpc.eoi.count.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });
  const newsletterCountQuery = trpc.newsletter.subscriberCount.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });
  const businessSetupQuery = trpc.businessSetup.summary.useQuery(undefined, {
    retry: false,
    enabled: isAuthenticated && user?.role === "admin",
  });

  useEffect(() => {
    document.title = "Harvest Control Room";
  }, []);

  const posts = editorialSummaryQuery.data?.posts ?? [];
  const socialPosts = (socialPostsQuery.data?.posts ?? []) as GhlPost[];
  const socialAccounts = socialAccountsQuery.data?.accounts ?? [];
  const businessSetup = businessSetupQuery.data;
  const blockedSetupGates =
    businessSetup?.gates.filter((gate) => gate.status === "blocked").length ?? 0;
  const watchSetupGates =
    businessSetup?.gates.filter((gate) => gate.status === "watch").length ?? 0;
  const editorialCounts = useMemo(() => countByStatus(posts), [posts]);
  const upcomingPosts = useMemo(() => {
    return [...posts]
      .filter((post) => post.status !== "published")
      .sort((a, b) => {
        const aTime = a.scheduledDate ? new Date(a.scheduledDate).getTime() : Number.MAX_SAFE_INTEGER;
        const bTime = b.scheduledDate ? new Date(b.scheduledDate).getTime() : Number.MAX_SAFE_INTEGER;
        return aTime - bTime;
      })
      .slice(0, 5);
  }, [posts]);

  const recentGhlPosts = useMemo(() => {
    return socialPosts
      .sort((a, b) => {
        const aDate = a.scheduledAt || a.createdAt || "";
        const bDate = b.scheduledAt || b.createdAt || "";
        return bDate.localeCompare(aDate);
      })
      .slice(0, 5);
  }, [socialPosts]);

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F5F0E8]">
        <Loader2 className="h-8 w-8 animate-spin text-[#1C1917]" />
      </main>
    );
  }

  if (!isAuthenticated) return <AuthShell />;
  if (user?.role !== "admin") return <AccessDenied />;

  const editorialIssue = editorialSummaryQuery.isError
    ? editorialSummaryQuery.error.message
    : editorialSummaryQuery.data?.error;
  const editorialCredentialHint = editorialIssue?.toLowerCase().includes("api token is invalid")
    ? "Rotate the server-side NOTION_API_KEY or NOTION_TOKEN, then refresh this page."
    : null;
  const editorialScope = editorialIssue
    ? `Harvest Notion editorial lookup failed: ${editorialIssue}${editorialCredentialHint ? ` ${editorialCredentialHint}` : ""}`
    : editorialSummaryQuery.data?.source || "The Harvest editorial project";

  return (
    <main className="min-h-screen bg-[#F5F0E8] text-[#1C1917]">
      <section className="border-b border-stone-300 bg-[#1C1917] text-[#F5F0E8]">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-10 md:px-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-4xl">
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <Badge className="rounded-md border border-[#C4922A]/40 bg-[#C4922A]/15 text-[#F5F0E8]">
                Internal
              </Badge>
              <Badge className="rounded-md border border-white/20 bg-white/10 text-[#F5F0E8]">
                Witta · Jinibara Country
              </Badge>
            </div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#C4922A]">
              Harvest Control Room
            </p>
            <h1 className="mt-4 max-w-4xl text-5xl font-black leading-[0.95] md:text-7xl">
              Business setup, launch gates, publishing state.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#F5F0E8]/78">
              One cockpit for the parts that can drift: GHL headcount, Notion truth,
              Supabase security, shop follow-up, and the public website.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              className="bg-[#C4922A] text-[#1C1917] hover:bg-[#d8a943]"
              onClick={() => window.open("/", "_blank")}
            >
              Review home page
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="border-white/30 bg-transparent text-[#F5F0E8] hover:bg-white/10 hover:text-[#F5F0E8]"
              onClick={() => {
                editorialSummaryQuery.refetch();
                socialAccountsQuery.refetch();
                socialPostsQuery.refetch();
                rsvpCountQuery.refetch();
                newsletterCountQuery.refetch();
                businessSetupQuery.refetch();
              }}
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-5 py-8 md:grid-cols-2 md:px-8 xl:grid-cols-4">
        <SignalCard
          label="Setup blockers"
          value={businessSetupQuery.isError ? "Check" : blockedSetupGates}
          detail={`${watchSetupGates} watch item(s). This is the business setup list, not a design review.`}
          icon={ShieldAlert}
          tone={blockedSetupGates > 0 ? "blocked" : watchSetupGates > 0 ? "watch" : "good"}
          loading={businessSetupQuery.isLoading}
        />
        <SignalCard
          label="Pizza headcount"
          value={businessSetup?.launch.tags.pizza.count ?? rsvpCountQuery.data?.count ?? "Check"}
          detail={
            businessSetup?.launch.tags.pizza.occurrenceDate
              ? `${businessSetup.launch.tags.pizza.rsvpCount} RSVP(s) for ${businessSetup.launch.tags.pizza.occurrenceDate}. This is the dough and turnout signal.`
              : "Upcoming stored RSVP people count."
          }
          icon={CalendarDays}
          tone={(businessSetup?.launch.tags.pizza.count ?? 0) > 0 ? "good" : "blocked"}
          loading={businessSetupQuery.isLoading || rsvpCountQuery.isLoading}
        />
        <SignalCard
          label="Members and followers"
          value={businessSetup?.crm.tags.members.count ?? newsletterCountQuery.data?.count ?? "Check"}
          detail={`${businessSetup?.crm.tags.newsletter.count ?? newsletterCountQuery.data?.count ?? 0} contacts carrying comms:harvest-newsletter.`}
          icon={Users}
          tone="good"
          loading={businessSetupQuery.isLoading || newsletterCountQuery.isLoading}
        />
        <SignalCard
          label="Shop loop"
          value={businessSetup?.crm.tags.shopInterest.count ?? "Check"}
          detail={`${businessSetup?.crm.tags.shopCallBooked.count ?? 0} contacts have shop-call-booked. interest:markets is the shop signal.`}
          icon={ShoppingBasket}
          tone={(businessSetup?.crm.tags.shopInterest.count ?? 0) > 0 ? "watch" : "blocked"}
          loading={businessSetupQuery.isLoading}
        />
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 pb-8 md:px-8 lg:grid-cols-[0.92fr_1.08fr]">
        <Card className="rounded-lg border-stone-300 bg-[#FFFDF7] shadow-none">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardDescription className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#8B4A2A]">
                  Business setup
                </CardDescription>
                <CardTitle className="mt-2 text-3xl font-black">
                  One current operating truth.
                </CardTitle>
              </div>
              <Database className="h-5 w-5 text-[#3B5563]" />
            </div>
          </CardHeader>
          <CardContent>
            {businessSetupQuery.isError ? (
              <p className="rounded-lg border border-[#CF5C1E]/30 bg-[#CF5C1E]/10 p-4 text-sm text-[#7b2f0c]">
                Business setup summary did not load: {businessSetupQuery.error.message}
              </p>
            ) : businessSetup ? (
              <div className="grid gap-4">
                <div className="rounded-lg border border-stone-300 bg-stone-100 p-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500">
                    Current truth
                  </p>
                  <p className="mt-2 text-xl font-black text-[#1C1917]">
                    {businessSetup.currentTruth.dayModel} · {businessSetup.currentTruth.eventDate}
                  </p>
                  <div className="mt-3 grid gap-2 text-sm text-stone-700">
                    <p>
                      Public route:{" "}
                      <a className="font-semibold text-[#8B4A2A] underline-offset-4 hover:underline" href={businessSetup.currentTruth.publicRoute}>
                        {businessSetup.currentTruth.publicRoute}
                      </a>
                    </p>
                    <code className="text-xs text-stone-500">
                      {businessSetup.currentTruth.sourceDoc}
                    </code>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className={`rounded-lg border p-4 ${statusClasses.good}`}>
                    <Link2 className="mb-3 h-5 w-5" />
                    <p className="font-semibold">Public RSVP form</p>
                    <p className="mt-1 text-sm">
                      Embedded at {businessSetup.launch.publicRsvp.route}. Writes{" "}
                      {businessSetup.launch.publicRsvp.tags.join(" + ")} and a durable website RSVP row.
                    </p>
                  </div>
                  <div className={`rounded-lg border p-4 ${businessSetup.crm.tagsOk ? statusClasses.good : statusClasses.watch}`}>
                    <MessageSquareText className="mb-3 h-5 w-5" />
                    <p className="font-semibold">GHL counts</p>
                    <p className="mt-1 text-sm">
                      {businessSetup.crm.tagsOk
                        ? "GHL tag counts returned."
                        : "One or more GHL tag counts failed."}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ["Harvest inbox", businessSetup.crm.tags.harvestInbox.count],
                    ["Shop interest", businessSetup.crm.tags.shopInterest.count],
                    ["Pending events", businessSetup.website.pendingEvents],
                    ["Pending businesses", businessSetup.website.pendingBusinesses],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-lg border border-stone-300 bg-white p-4">
                      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500">
                        {label}
                      </p>
                      <p className="mt-2 text-2xl font-black text-[#1C1917]">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-lg border border-stone-300 bg-stone-100 p-4 text-sm text-stone-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading business setup state.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-lg border-stone-300 bg-[#FFFDF7] shadow-none">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardDescription className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#8B4A2A]">
                  Hard gates
                </CardDescription>
                <CardTitle className="mt-2 text-3xl font-black">
                  What still needs a person.
                </CardTitle>
              </div>
              <AlertTriangle className="h-5 w-5 text-[#CF5C1E]" />
            </div>
          </CardHeader>
          <CardContent>
            {businessSetup?.gates.length ? (
              businessSetup.gates.map((gate) => (
                <GateRow key={gate.id} gate={gate} />
              ))
            ) : (
              <p className="rounded-lg border border-stone-300 bg-stone-100 p-4 text-sm text-stone-600">
                Setup gates are loading.
              </p>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 pb-8 md:px-8 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="rounded-lg border-stone-300 bg-[#FFFDF7] shadow-none">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardDescription className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#8B4A2A]">
                  Launch checks
                </CardDescription>
                <CardTitle className="mt-2 text-3xl font-black">
                  The work that can break the day.
                </CardTitle>
              </div>
              <AlertTriangle className="h-5 w-5 text-[#CF5C1E]" />
            </div>
          </CardHeader>
          <CardContent>
            {launchChecks.map((item) => (
              <ItemRow key={item.title} item={item} />
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-lg border-stone-300 bg-[#FFFDF7] shadow-none">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardDescription className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#8B4A2A]">
                  Annotation targets
                </CardDescription>
                <CardTitle className="mt-2 text-3xl font-black">
                  Review the exact surface.
                </CardTitle>
              </div>
              <ClipboardCheck className="h-5 w-5 text-[#4A6741]" />
            </div>
          </CardHeader>
          <CardContent>
            {annotationTargets.map((item) => (
              <ItemRow key={item.title} item={item} />
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 pb-8 md:px-8 lg:grid-cols-2">
        <Card className="rounded-lg border-stone-300 bg-[#FFFDF7] shadow-none">
          <CardHeader>
            <CardDescription className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#8B4A2A]">
              Public surfaces
            </CardDescription>
            <CardTitle className="mt-2 text-3xl font-black">
              Pages to inspect.
            </CardTitle>
          </CardHeader>
          <CardContent>
            {publicPages.map((item) => (
              <LinkRow key={item.href ?? item.path} item={item} />
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-lg border-stone-300 bg-[#FFFDF7] shadow-none">
          <CardHeader>
            <CardDescription className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#8B4A2A]">
              Source memory
            </CardDescription>
            <CardTitle className="mt-2 text-3xl font-black">
              Files that keep it straight.
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sourceDocs.map((item) => (
              <LinkRow key={item.href ?? item.path} item={item} />
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 pb-8 md:px-8 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="rounded-lg border-stone-300 bg-[#FFFDF7] shadow-none">
          <CardHeader>
            <CardDescription className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#8B4A2A]">
              Approved first pool
            </CardDescription>
            <CardTitle className="mt-2 text-3xl font-black">
              Real assets before decoration.
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {assetPicks.map((asset) => (
                <div
                  key={asset.src}
                  className="overflow-hidden rounded-lg border border-stone-300 bg-white"
                >
                  <div className="aspect-[4/3] bg-stone-200">
                    <img
                      src={asset.src}
                      alt={asset.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold">{asset.title}</p>
                      <ImageIcon className="h-4 w-4 text-stone-400" />
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge className="rounded-md bg-[#F5F0E8] text-stone-700">
                        {asset.room}
                      </Badge>
                      <Badge className="rounded-md bg-[#1C1917] text-[#F5F0E8]">
                        {asset.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-lg border-stone-300 bg-[#FFFDF7] shadow-none">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardDescription className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#8B4A2A]">
                  Publishing queue
                </CardDescription>
                <CardTitle className="mt-2 text-3xl font-black">
                  Notion and GHL state.
                </CardTitle>
              </div>
              <Camera className="h-5 w-5 text-[#3B5563]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-5 lg:grid-cols-2">
              <div>
                <h3 className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500">
                  Next Notion items
                </h3>
                {editorialIssue ? (
                  <p className="rounded-lg border border-[#CF5C1E]/30 bg-[#CF5C1E]/10 p-4 text-sm text-[#7b2f0c]">
                    {editorialIssue}
                    {editorialCredentialHint ? (
                      <span className="mt-2 block font-medium">
                        {editorialCredentialHint}
                      </span>
                    ) : null}
                  </p>
                ) : upcomingPosts.length > 0 ? (
                  <div className="divide-y divide-stone-300">
                    {upcomingPosts.map((post) => (
                      <div key={post.id} className="py-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge
                            className={`rounded-md border ${statusClasses[statusToneForPost(post.status)]}`}
                            variant="outline"
                          >
                            {post.status}
                          </Badge>
                          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-stone-500">
                            {formatShortDate(post.scheduledDate)}
                          </span>
                        </div>
                        <p className="mt-2 font-semibold text-[#1C1917]">{post.title || "Untitled"}</p>
                        <p className="mt-1 text-sm text-stone-600">
                          {post.communicationType || "Communication"} · {post.platforms.join(", ") || "No target account"}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="rounded-lg border border-stone-300 bg-stone-100 p-4 text-sm text-stone-600">
                    No unpublished Notion items returned.
                  </p>
                )}
              </div>

              <div>
                <h3 className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500">
                  Recent GHL posts
                </h3>
                {socialPostsQuery.isError || socialPostsQuery.data?.success === false ? (
                  <p className="rounded-lg border border-[#CF5C1E]/30 bg-[#CF5C1E]/10 p-4 text-sm text-[#7b2f0c]">
                    GHL Social Planner did not load. Check OAuth and scopes.
                  </p>
                ) : recentGhlPosts.length > 0 ? (
                  <div className="divide-y divide-stone-300">
                    {recentGhlPosts.map((post) => (
                      <div key={post.id || post._id || post.summary} className="py-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge
                            className={`rounded-md border ${statusClasses[statusToneForGhlPost(post.status)]}`}
                            variant="outline"
                          >
                            {post.status || "unknown"}
                          </Badge>
                          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-stone-500">
                            {formatShortDate(post.scheduledAt || post.createdAt)}
                          </span>
                        </div>
                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-stone-700">
                          {post.summary || "No summary returned"}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="rounded-lg border border-stone-300 bg-stone-100 p-4 text-sm text-stone-600">
                    No GHL posts returned.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="border-t border-stone-300 bg-[#3D3832] px-5 py-8 text-[#F5F0E8] md:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-[0.85fr_1fr] md:items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em]" style={{ color: colors.goldenHour }}>
              Operating model
            </p>
            <h2 className="mt-3 text-3xl font-black">
              Repo holds memory. GHL publishes. Website proves it.
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {["Garden: grow", "Kitchen: feed", "Art Space: make"].map((label) => (
              <div key={label} className="rounded-lg border border-white/15 bg-white/5 p-4">
                <CheckCircle2 className="mb-3 h-5 w-5 text-[#C4922A]" />
                <p className="font-semibold">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
