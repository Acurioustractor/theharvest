import { useEffect, useState } from "react";
import { trpc } from "../lib/trpc";
import { colors, fonts } from "../styles/brand";
import { socialPosts, getPostLink, type SocialPost } from "../data/socialPosts";

type Tab = "tiles" | "publish" | "queue";

interface GHLAccount {
  id: string;
  name: string;
  platform: string;
  avatar?: string;
}

interface GHLPost {
  id?: string;
  _id?: string;
  summary?: string;
  status?: string;
  scheduledAt?: string;
  createdAt?: string;
  accountIds?: string[];
}

// Platform display helpers
const platformIcon: Record<string, string> = {
  instagram: "IG",
  facebook: "FB",
  google: "GBP",
  linkedin: "LI",
};

const platformColor: Record<string, string> = {
  instagram: "#E1306C",
  facebook: "#1877F2",
  google: "#4285F4",
  linkedin: "#0A66C2",
};

export default function SocialPlanner() {
  const [tab, setTab] = useState<Tab>("tiles");

  useEffect(() => {
    document.title = "The Harvest \u2014 Social Planner";
  }, []);

  return (
    <div style={{ background: colors.shed, minHeight: "100vh", color: colors.milk, fontFamily: fonts.display }}>
      {/* Header */}
      <div style={{ padding: "2rem 2rem 0" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>
          Social Planner
        </h1>
        <div style={{ color: colors.goldenHour, fontSize: "0.85rem", marginBottom: "1.5rem" }}>
          The Harvest \u2014 First Gathering Campaign \u00b7 14 posts \u00b7 Feb 18 \u2013 Mar 7
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, borderBottom: `2px solid #333`, marginBottom: "1.5rem" }}>
          {(["tiles", "publish", "queue"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "0.6rem 1.2rem",
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: tab === t ? colors.goldenHour : "#666",
                background: "none",
                border: "none",
                borderBottom: `3px solid ${tab === t ? colors.goldenHour : "transparent"}`,
                marginBottom: -2,
                cursor: "pointer",
                fontFamily: fonts.display,
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div style={{ padding: "0 2rem 2rem" }}>
        {tab === "tiles" && <TilesTab />}
        {tab === "publish" && <PublishTab />}
        {tab === "queue" && <QueueTab />}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// TILES TAB
// ─────────────────────────────────────────────
function TilesTab() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "1.5rem" }}>
      {socialPosts.map((post) => (
        <TileCard key={post.id} post={post} />
      ))}
    </div>
  );
}

function TileCard({ post }: { post: SocialPost }) {
  const aspectRatio = post.format === "landscape" ? "16/9" : post.format === "story" ? "9/16" : "1/1";
  return (
    <div style={{ background: "#222", borderRadius: 12, overflow: "hidden", padding: "1rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
        <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: colors.goldenHour, fontWeight: 700 }}>
          {post.label}
        </span>
        <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
          {post.platforms.map((p) => (
            <span
              key={p}
              style={{
                fontSize: "0.55rem",
                fontWeight: 700,
                padding: "2px 5px",
                borderRadius: 3,
                background: platformColor[p === "IG" ? "instagram" : p === "FB" ? "facebook" : "google"] || "#555",
                color: "white",
              }}
            >
              {p}
            </span>
          ))}
          <span style={{ fontSize: "0.65rem", color: "#666" }}>{post.displayDate}</span>
        </div>
      </div>

      {/* Image */}
      <div style={{ width: "100%", aspectRatio, borderRadius: 4, overflow: "hidden", background: "#333", maxHeight: post.format === "story" ? 500 : undefined }}>
        <img src={post.image} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      </div>

      {/* Caption */}
      <div style={{ fontSize: "0.75rem", color: "#888", marginTop: "0.5rem", lineHeight: 1.4 }}>
        {post.caption}
      </div>
      {post.link && (
        <div style={{ fontSize: "0.6rem", color: "#555", marginTop: "0.25rem", fontStyle: "italic" }}>
          Link: {post.link}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// PUBLISH TAB
// ─────────────────────────────────────────────
function PublishTab() {
  const accountsQuery = trpc.social.accounts.useQuery();
  const postMutation = trpc.social.post.useMutation();
  const accounts = accountsQuery.data?.accounts ?? [];
  const hasAccounts = accounts.length > 0;

  return (
    <div style={{ maxWidth: 900 }}>
      {/* Accounts status */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 900, textTransform: "uppercase", color: colors.goldenHour, margin: 0 }}>
          Connected Accounts
        </h2>
        <button
          onClick={() => accountsQuery.refetch()}
          style={{
            background: colors.workshirt,
            color: "white",
            border: "none",
            padding: "0.4rem 0.75rem",
            borderRadius: 4,
            fontSize: "0.65rem",
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: fonts.display,
          }}
        >
          {accountsQuery.isFetching ? "Checking..." : "Refresh"}
        </button>
      </div>

      {accountsQuery.isLoading && (
        <div style={{ background: "#222", borderRadius: 8, padding: "1rem", marginBottom: "1.5rem", fontSize: "0.75rem", color: "#666" }}>
          Loading connected accounts...
        </div>
      )}

      {accountsQuery.isError && (
        <div style={{ background: "#222", borderRadius: 8, padding: "1rem", marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "0.75rem", color: colors.calendula }}>
            Failed to load accounts. Make sure GHL OAuth is configured.
          </div>
          <a
            href="/api/social-auth/start"
            style={{ fontSize: "0.7rem", color: colors.goldenHour, display: "inline-block", marginTop: "0.5rem" }}
          >
            Connect GHL Social Accounts &rarr;
          </a>
        </div>
      )}

      {!accountsQuery.isLoading && !accountsQuery.isError && !hasAccounts && (
        <div style={{ background: "#222", borderRadius: 8, padding: "1rem", marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "0.75rem", color: "#888" }}>No social accounts connected yet.</div>
          <a
            href="/api/social-auth/start"
            style={{ fontSize: "0.7rem", color: colors.goldenHour, display: "inline-block", marginTop: "0.5rem" }}
          >
            Connect Facebook & Instagram via GHL &rarr;
          </a>
        </div>
      )}

      {hasAccounts && (
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
          {accounts.map((acc) => (
            <AccountBadge key={acc.id} account={acc} />
          ))}
        </div>
      )}

      {/* Post cards */}
      <h3 style={{ fontSize: "0.85rem", fontWeight: 900, textTransform: "uppercase", color: colors.goldenHour, marginBottom: "0.75rem" }}>
        Schedule Tiles
      </h3>
      {socialPosts.map((post) => (
        <PublishCard key={post.id} post={post} accounts={accounts} postMutation={postMutation} />
      ))}

      {/* Newsletter section */}
      <NewsletterSection />
    </div>
  );
}

function AccountBadge({ account }: { account: GHLAccount }) {
  const color = platformColor[account.platform] || "#555";
  return (
    <div style={{ background: "#222", borderRadius: 8, padding: "0.6rem 0.8rem", display: "flex", alignItems: "center", gap: "0.5rem", border: `1px solid ${color}40` }}>
      {account.avatar && (
        <img src={account.avatar} alt="" style={{ width: 24, height: 24, borderRadius: "50%" }} />
      )}
      <div>
        <div style={{ fontSize: "0.7rem", fontWeight: 700, color: colors.milk }}>{account.name}</div>
        <div style={{ fontSize: "0.55rem", color, fontWeight: 700, textTransform: "uppercase" }}>
          {platformIcon[account.platform] || account.platform}
        </div>
      </div>
    </div>
  );
}

function PublishCard({
  post,
  accounts,
  postMutation,
}: {
  post: SocialPost;
  accounts: GHLAccount[];
  postMutation: ReturnType<typeof trpc.social.post.useMutation>;
}) {
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>(() => {
    // Pre-select accounts matching the post's suggested platforms
    const platMap: Record<string, string> = { IG: "instagram", FB: "facebook", GBP: "google" };
    const wantedPlatforms = post.platforms.map((p) => platMap[p]).filter(Boolean);
    return accounts.filter((a) => wantedPlatforms.includes(a.platform)).map((a) => a.id);
  });
  const [date, setDate] = useState(post.date ?? "");
  const [time, setTime] = useState("09:00");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [resultMsg, setResultMsg] = useState("");

  const toggleAccount = (id: string) => {
    setSelectedAccountIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const submit = async (mode: "schedule" | "draft") => {
    if (selectedAccountIds.length === 0) {
      setResultMsg("Select at least one platform.");
      setStatus("error");
      return;
    }
    if (mode === "schedule" && !date) {
      setResultMsg("Pick a date first.");
      setStatus("error");
      return;
    }

    setStatus("sending");
    const platform = accounts.find((a) => selectedAccountIds.includes(a.id))?.platform || "social";
    const linkText = getPostLink(post, platform);
    const summary = post.caption + (linkText ? `\n\n${linkText}` : "");
    const mediaUrl = `${window.location.origin}${post.image}`;

    try {
      const result = await postMutation.mutateAsync({
        summary,
        accountIds: selectedAccountIds,
        mediaUrls: [mediaUrl],
        scheduledAt: mode === "schedule" ? new Date(`${date}T${time}:00+10:00`).toISOString() : undefined,
      });

      if (result.success) {
        setStatus("done");
        setResultMsg(mode === "schedule" ? `Scheduled! ID: ${result.postId}` : `Draft saved! ID: ${result.postId}`);
      } else {
        setStatus("error");
        setResultMsg(result.error || "Failed");
      }
    } catch (err: any) {
      setStatus("error");
      setResultMsg(err.message || "Request failed");
    }
  };

  const inputStyle = {
    background: "#333",
    border: "1px solid #444",
    borderRadius: 4,
    padding: "0.25rem 0.4rem",
    color: colors.milk,
    fontSize: "0.65rem",
    fontFamily: fonts.display,
  };

  return (
    <div style={{ background: "#222", borderRadius: 8, padding: "1rem", marginBottom: "0.75rem", display: "grid", gridTemplateColumns: "80px 1fr", gap: "1rem", alignItems: "start" }}>
      <div style={{ width: 80, height: 80, borderRadius: 4, overflow: "hidden", background: "#333" }}>
        <img src={post.image} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div>
        <div style={{ fontSize: "0.8rem", fontWeight: 700, color: colors.milk, marginBottom: "0.5rem" }}>{post.title}</div>

        {/* Platform toggles */}
        <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
          {accounts.map((acc) => {
            const active = selectedAccountIds.includes(acc.id);
            return (
              <button
                key={acc.id}
                onClick={() => toggleAccount(acc.id)}
                style={{
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  padding: "3px 8px",
                  borderRadius: 3,
                  border: "none",
                  cursor: "pointer",
                  fontFamily: fonts.display,
                  background: active ? (platformColor[acc.platform] || "#555") : "#333",
                  color: active ? "white" : "#888",
                }}
              >
                {platformIcon[acc.platform] || acc.platform} \u00b7 {acc.name.length > 12 ? acc.name.slice(0, 12) + "\u2026" : acc.name}
              </button>
            );
          })}
        </div>

        {/* Schedule controls */}
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} />
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} style={inputStyle} />
          <button
            onClick={() => submit("schedule")}
            disabled={status === "sending"}
            style={{
              background: colors.canopy,
              color: "white",
              border: "none",
              padding: "0.3rem 0.6rem",
              borderRadius: 4,
              fontSize: "0.6rem",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: fonts.display,
              opacity: status === "sending" ? 0.5 : 1,
            }}
          >
            Schedule
          </button>
          <button
            onClick={() => submit("draft")}
            disabled={status === "sending"}
            style={{
              background: "#555",
              color: "white",
              border: "none",
              padding: "0.3rem 0.6rem",
              borderRadius: 4,
              fontSize: "0.6rem",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: fonts.display,
              opacity: status === "sending" ? 0.5 : 1,
            }}
          >
            Draft
          </button>
        </div>

        {/* Status message */}
        {resultMsg && (
          <div
            style={{
              marginTop: "0.4rem",
              fontSize: "0.65rem",
              color: status === "done" ? colors.canopy : status === "error" ? colors.calendula : "#888",
            }}
          >
            {resultMsg}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// QUEUE TAB
// ─────────────────────────────────────────────
function QueueTab() {
  const postsQuery = trpc.social.list.useQuery();
  const posts: GHLPost[] = postsQuery.data?.posts ?? [];

  const statusColors: Record<string, string> = {
    draft: "#666",
    scheduled: colors.workshirt,
    published: colors.canopy,
    failed: colors.calendula,
  };

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 900, textTransform: "uppercase", color: colors.goldenHour, margin: 0 }}>
          Post Queue
        </h2>
        <button
          onClick={() => postsQuery.refetch()}
          style={{
            background: colors.workshirt,
            color: "white",
            border: "none",
            padding: "0.4rem 0.75rem",
            borderRadius: 4,
            fontSize: "0.65rem",
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: fonts.display,
          }}
        >
          {postsQuery.isFetching ? "Loading..." : "Refresh"}
        </button>
      </div>

      {postsQuery.isLoading && (
        <div style={{ fontSize: "0.75rem", color: "#666" }}>Loading post queue...</div>
      )}

      {!postsQuery.isLoading && posts.length === 0 && (
        <div style={{ fontSize: "0.75rem", color: "#555" }}>
          No posts in queue yet. Schedule tiles from the Publish tab.
        </div>
      )}

      {posts.map((p) => {
        const st = p.status || "draft";
        const postId = p.id || p._id || "?";
        const when = p.scheduledAt
          ? new Date(p.scheduledAt).toLocaleString("en-AU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
          : "No date";
        const summaryPreview = (p.summary || "").slice(0, 100) + ((p.summary || "").length > 100 ? "\u2026" : "");

        return (
          <div
            key={postId}
            style={{
              background: "#222",
              borderRadius: 8,
              padding: "0.75rem 1rem",
              marginBottom: "0.5rem",
              display: "flex",
              gap: "1rem",
              alignItems: "center",
            }}
          >
            {/* Status badge */}
            <span
              style={{
                fontSize: "0.6rem",
                fontWeight: 700,
                textTransform: "uppercase",
                padding: "3px 8px",
                borderRadius: 3,
                background: statusColors[st] || "#555",
                color: "white",
                flexShrink: 0,
              }}
            >
              {st}
            </span>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "0.75rem", color: colors.milk, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {summaryPreview}
              </div>
              <div style={{ fontSize: "0.6rem", color: "#666", marginTop: 2 }}>{when}</div>
            </div>

            {/* ID */}
            <div style={{ fontSize: "0.55rem", color: "#444", flexShrink: 0 }}>
              {postId.slice(0, 8)}\u2026
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────
// NEWSLETTER SECTION
// ─────────────────────────────────────────────
function NewsletterSection() {
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null);
  const sendNewsletter = trpc.newsletter.sendCampaign.useMutation();

  // Fetch subscriber count on mount
  const countQuery = trpc.newsletter.subscriberCount.useQuery();
  useEffect(() => {
    if (countQuery.data?.count != null) {
      setSubscriberCount(countQuery.data.count);
    }
  }, [countQuery.data]);

  const handleSend = async () => {
    if (!confirm("Send newsletter to all subscribers tagged 'newsletter'? This triggers the GHL workflow.")) return;
    setSending(true);
    setResult(null);
    try {
      const res = await sendNewsletter.mutateAsync({ tag: "newsletter" });
      setResult({ ok: res.success, msg: res.success ? `Triggered for ${res.contactCount} contacts` : (res.error || "Failed") });
    } catch (err: any) {
      setResult({ ok: false, msg: err.message });
    }
    setSending(false);
  };

  return (
    <div style={{ marginTop: "2rem", borderTop: "1px solid #333", paddingTop: "1.5rem" }}>
      <h3 style={{ fontSize: "0.85rem", fontWeight: 900, textTransform: "uppercase", color: colors.goldenHour, marginBottom: "0.75rem" }}>
        Newsletter
      </h3>
      <div style={{ background: "#222", borderRadius: 8, padding: "1rem", display: "flex", gap: "1rem", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: "0.75rem", color: colors.milk }}>
            Subscribers: <strong style={{ color: colors.goldenHour }}>{subscriberCount ?? "..."}</strong>
          </div>
          <div style={{ fontSize: "0.6rem", color: "#666", marginTop: 4 }}>
            Sends via GHL workflow to contacts tagged "newsletter"
          </div>
        </div>
        <button
          onClick={handleSend}
          disabled={sending}
          style={{
            background: colors.calendula,
            color: "white",
            border: "none",
            padding: "0.5rem 1rem",
            borderRadius: 4,
            fontSize: "0.65rem",
            fontWeight: 700,
            cursor: sending ? "wait" : "pointer",
            fontFamily: fonts.display,
            opacity: sending ? 0.5 : 1,
            whiteSpace: "nowrap",
          }}
        >
          {sending ? "Sending..." : "Send Newsletter"}
        </button>
      </div>
      {result && (
        <div style={{ marginTop: "0.5rem", fontSize: "0.65rem", color: result.ok ? colors.canopy : colors.calendula }}>
          {result.msg}
        </div>
      )}
    </div>
  );
}
