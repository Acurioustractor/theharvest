import { useEffect, useState } from "react";
import { trpc } from "../lib/trpc";
import { colors, fonts } from "../styles/brand";
import type { EditorialPost, EditorialProject } from "../types/social";

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

// Platform display helpers — ACT uses full names in Target Accounts
const platformIcon: Record<string, string> = {
  Instagram: "IG",
  Facebook: "FB",
  "Google Business": "GBP",
  "LinkedIn (Company)": "LI",
  "LinkedIn (Personal)": "LI",
  YouTube: "YT",
  Bluesky: "BS",
  Twitter: "TW",
  // Legacy short names
  instagram: "IG",
  facebook: "FB",
  google: "GBP",
  linkedin: "LI",
  IG: "IG",
  FB: "FB",
  GBP: "GBP",
};

const platformColor: Record<string, string> = {
  Instagram: "#E1306C",
  Facebook: "#1877F2",
  "Google Business": "#4285F4",
  "LinkedIn (Company)": "#0A66C2",
  "LinkedIn (Personal)": "#0A66C2",
  YouTube: "#FF0000",
  Bluesky: "#0085FF",
  Twitter: "#1DA1F2",
  // Legacy short names
  instagram: "#E1306C",
  facebook: "#1877F2",
  google: "#4285F4",
  linkedin: "#0A66C2",
  IG: "#E1306C",
  FB: "#1877F2",
  GBP: "#4285F4",
};

/** Build a UTM-tagged link for a post */
function getPostLink(post: EditorialPost, platform: string = "social"): string {
  if (!post.link) return "";
  const type = post.communicationType?.toLowerCase().replace(/\s+/g, "-") || "social";
  return `theharvestwitta.com.au${post.link}?utm_source=${platform}&utm_medium=social&utm_campaign=${type}&utm_content=${post.utmContent}`;
}

/** Format an ISO date to a short display string */
function formatDate(iso: string | null): string {
  if (!iso) return "\u2014";
  const d = new Date(iso);
  return d.toLocaleDateString("en-AU", { month: "short", day: "numeric" });
}

const statusColors: Record<string, string> = {
  draft: "#666",
  approved: colors.goldenHour,
  scheduled: colors.workshirt,
  published: colors.canopy,
  failed: colors.calendula,
};

export default function SocialPlanner() {
  const [tab, setTab] = useState<Tab>("tiles");
  const [projectId, setProjectId] = useState<string>("");

  // Fetch projects for the selector
  const projectsQuery = trpc.editorial.projects.useQuery();
  const projects: EditorialProject[] = projectsQuery.data ?? [];

  // Fetch posts from Notion filtered by project
  const postsQuery = trpc.editorial.list.useQuery(
    projectId ? { projectId } : {},
  );
  const posts: EditorialPost[] = postsQuery.data ?? [];

  // Find project name for display
  const currentProject = projects.find((p) => p.id === projectId);

  useEffect(() => {
    document.title = "ACT \u2014 Social Planner";
  }, []);

  return (
    <div style={{ background: colors.shed, minHeight: "100vh", color: colors.milk, fontFamily: fonts.display }}>
      {/* Header */}
      <div style={{ padding: "2rem 2rem 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>
              Social Planner
            </h1>
            <div style={{ color: colors.goldenHour, fontSize: "0.85rem", marginTop: "0.25rem" }}>
              {currentProject ? currentProject.name : "All Projects"} {"\u00b7"} {posts.length} posts
            </div>
          </div>

          {/* Project selector */}
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              style={{
                background: "#333",
                color: colors.milk,
                border: "1px solid #444",
                borderRadius: 4,
                padding: "0.4rem 0.6rem",
                fontSize: "0.7rem",
                fontFamily: fonts.display,
                cursor: "pointer",
              }}
            >
              <option value="">All Projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <button
              onClick={() => window.open("/social-tile-mockups.html", "_blank")}
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
                whiteSpace: "nowrap",
              }}
            >
              Tile Designer
            </button>
          </div>
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

      {/* Loading / error states */}
      {postsQuery.isLoading && (
        <div style={{ padding: "2rem", fontSize: "0.75rem", color: "#666" }}>
          Loading editorial calendar from Notion...
        </div>
      )}

      {postsQuery.isError && (
        <div style={{ padding: "2rem" }}>
          <div style={{ fontSize: "0.75rem", color: colors.calendula }}>
            Failed to load editorial calendar. Check NOTION_API_KEY and NOTION_EDITORIAL_DB_ID.
          </div>
        </div>
      )}

      {/* Tab content */}
      {!postsQuery.isLoading && !postsQuery.isError && (
        <div style={{ padding: "0 2rem 2rem" }}>
          {tab === "tiles" && <TilesTab posts={posts} />}
          {tab === "publish" && <PublishTab posts={posts} />}
          {tab === "queue" && <QueueTab posts={posts} />}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// TILES TAB — shows all posts from Notion
// ─────────────────────────────────────────────
function TilesTab({ posts }: { posts: EditorialPost[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "1.5rem" }}>
      {posts.map((post) => (
        <TileCard key={post.id} post={post} />
      ))}
      {posts.length === 0 && (
        <div style={{ fontSize: "0.75rem", color: "#555", gridColumn: "1 / -1" }}>
          No posts found. Add posts to the ACT Communications Dashboard in Notion.
        </div>
      )}
    </div>
  );
}

function TileCard({ post }: { post: EditorialPost }) {
  const aspectRatio = post.format === "landscape" ? "16/9" : post.format === "story" ? "9/16" : "1/1";
  return (
    <div style={{ background: "#222", borderRadius: 12, overflow: "hidden", padding: "1rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
        <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
          <span
            style={{
              fontSize: "0.55rem",
              fontWeight: 700,
              textTransform: "uppercase",
              padding: "2px 6px",
              borderRadius: 3,
              background: statusColors[post.status] || "#555",
              color: "white",
            }}
          >
            {post.status}
          </span>
          <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: colors.goldenHour, fontWeight: 700 }}>
            {post.title}
          </span>
        </div>
        <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
          {post.platforms.map((p) => (
            <span
              key={p}
              style={{
                fontSize: "0.55rem",
                fontWeight: 700,
                padding: "2px 5px",
                borderRadius: 3,
                background: platformColor[p] || "#555",
                color: "white",
              }}
            >
              {platformIcon[p] || p}
            </span>
          ))}
          <span style={{ fontSize: "0.65rem", color: "#666" }}>{formatDate(post.scheduledDate)}</span>
        </div>
      </div>

      {/* Image */}
      {post.mediaUrl && (
        <div style={{ width: "100%", aspectRatio, borderRadius: 4, overflow: "hidden", background: "#333", maxHeight: post.format === "story" ? 500 : undefined }}>
          <img src={post.mediaUrl} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>
      )}
      {!post.mediaUrl && (
        <div style={{ width: "100%", aspectRatio, borderRadius: 4, background: "#333", display: "flex", alignItems: "center", justifyContent: "center", color: "#555", fontSize: "0.7rem" }}>
          No media
        </div>
      )}

      {/* Communication type badge */}
      {post.communicationType && (
        <div style={{ fontSize: "0.55rem", color: "#888", marginTop: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          {post.communicationType}
        </div>
      )}

      {/* Editorial Note */}
      {post.editorialNote && (
        <div style={{ fontSize: "0.65rem", color: "#c4922a", marginTop: "0.35rem", lineHeight: 1.3, fontStyle: "italic" }}>
          {post.editorialNote}
        </div>
      )}
      {/* Caption preview */}
      <div style={{ fontSize: "0.7rem", color: "#aaa", marginTop: "0.35rem", lineHeight: 1.4, whiteSpace: "pre-line", maxHeight: 60, overflow: "hidden" }}>
        {post.caption}
      </div>
      {post.link && (
        <div style={{ fontSize: "0.6rem", color: "#555", marginTop: "0.25rem", fontStyle: "italic" }}>
          Link: {post.link}
        </div>
      )}
      {/* Download button */}
      {post.mediaUrl && (
        <a
          href={post.mediaUrl}
          download={`${post.utmContent || post.title}.png`}
          style={{
            display: "inline-block",
            marginTop: "0.5rem",
            fontSize: "0.6rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: colors.milk,
            background: "rgba(255,255,255,0.1)",
            padding: "4px 10px",
            borderRadius: 4,
            textDecoration: "none",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
        >
          Download Image
        </a>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// PUBLISH TAB — only shows "approved" posts
// ─────────────────────────────────────────────
function PublishTab({ posts }: { posts: EditorialPost[] }) {
  const accountsQuery = trpc.social.accounts.useQuery();
  const postMutation = trpc.social.post.useMutation();
  const editorialUpdate = trpc.editorial.update.useMutation();
  const accounts = accountsQuery.data?.accounts ?? [];
  const hasAccounts = accounts.length > 0;

  // Only show approved posts for publishing
  const approvedPosts = posts.filter((p) => p.status === "approved");

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

      {/* Post cards — approved only */}
      <h3 style={{ fontSize: "0.85rem", fontWeight: 900, textTransform: "uppercase", color: colors.goldenHour, marginBottom: "0.75rem" }}>
        Ready to Schedule ({approvedPosts.length} approved)
      </h3>
      {approvedPosts.length === 0 && (
        <div style={{ fontSize: "0.75rem", color: "#555", marginBottom: "1rem" }}>
          No approved posts. Mark posts as "Ready to Connect" in Notion to see them here.
        </div>
      )}
      {approvedPosts.map((post) => (
        <PublishCard key={post.id} post={post} accounts={accounts} postMutation={postMutation} editorialUpdate={editorialUpdate} />
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
  editorialUpdate,
}: {
  post: EditorialPost;
  accounts: GHLAccount[];
  postMutation: ReturnType<typeof trpc.social.post.useMutation>;
  editorialUpdate: ReturnType<typeof trpc.editorial.update.useMutation>;
}) {
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>(() => {
    // Pre-select accounts matching the post's target accounts
    // Map ACT platform names to GHL platform identifiers
    const platMap: Record<string, string> = {
      "Instagram": "instagram",
      "Facebook": "facebook",
      "Google Business": "google",
      "LinkedIn (Company)": "linkedin",
      "LinkedIn (Personal)": "linkedin",
      // Legacy
      "IG": "instagram",
      "FB": "facebook",
      "GBP": "google",
    };
    const wantedPlatforms = post.platforms.map((p) => platMap[p] || p.toLowerCase()).filter(Boolean);
    return accounts.filter((a) => wantedPlatforms.includes(a.platform)).map((a) => a.id);
  });
  const [date, setDate] = useState(() => {
    if (!post.scheduledDate) return "";
    return post.scheduledDate.slice(0, 10); // YYYY-MM-DD
  });
  const [time, setTime] = useState(() => {
    if (!post.scheduledDate) return "09:00";
    const t = post.scheduledDate.slice(11, 16);
    return t || "09:00";
  });
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
    const mediaUrl = post.mediaUrl || undefined;

    try {
      const result = await postMutation.mutateAsync({
        summary,
        accountIds: selectedAccountIds,
        mediaUrls: mediaUrl ? [mediaUrl] : undefined,
        scheduledAt: mode === "schedule" ? new Date(`${date}T${time}:00+10:00`).toISOString() : undefined,
      });

      if (result.success) {
        setStatus("done");
        setResultMsg(mode === "schedule" ? `Scheduled! ID: ${result.postId}` : `Draft saved! ID: ${result.postId}`);

        // Update Notion: mark as scheduled, store GHL Post ID, and set Sent date
        if (result.postId) {
          const sentDate = mode === "schedule"
            ? new Date(`${date}T${time}:00+10:00`).toISOString()
            : new Date().toISOString();
          editorialUpdate.mutate({
            id: post.id,
            status: "scheduled",
            ghlPostId: result.postId,
            scheduledDate: sentDate,
          });
        }
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
        {post.mediaUrl ? (
          <img src={post.mediaUrl} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#555", fontSize: "0.55rem" }}>
            No img
          </div>
        )}
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
                {platformIcon[acc.platform] || acc.platform} {"\u00b7"} {acc.name.length > 12 ? acc.name.slice(0, 12) + "\u2026" : acc.name}
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
// QUEUE TAB — shows Notion + GHL combined status
// ─────────────────────────────────────────────
function QueueTab({ posts }: { posts: EditorialPost[] }) {
  const ghlPostsQuery = trpc.social.list.useQuery();
  const ghlPosts: GHLPost[] = ghlPostsQuery.data?.posts ?? [];
  const syncMutation = trpc.editorial.update.useMutation();
  const autoSyncMutation = trpc.editorial.autoSync.useMutation();
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState("");
  const [autoSyncing, setAutoSyncing] = useState(false);
  const [autoSyncMsg, setAutoSyncMsg] = useState("");

  // Posts that are scheduled or published
  const queuedPosts = posts.filter((p) => p.status === "scheduled" || p.status === "published");

  const handleAutoSync = async () => {
    setAutoSyncing(true);
    setAutoSyncMsg("");
    try {
      const result = await autoSyncMutation.mutateAsync();
      const parts: string[] = [];
      if (result.synced > 0) parts.push(`${result.synced} synced to GHL`);
      if ((result as any).published > 0) parts.push(`${(result as any).published} marked published`);
      if (result.skipped > 0) parts.push(`${result.skipped} skipped`);
      if (result.failed > 0) parts.push(`${result.failed} failed`);
      setAutoSyncMsg(parts.length > 0 ? parts.join(", ") : "All up to date");
    } catch (err: any) {
      setAutoSyncMsg(err.message || "Auto-sync failed");
    }
    setAutoSyncing(false);
  };

  const handleSync = async () => {
    setSyncing(true);
    setSyncMsg("");
    let updated = 0;

    for (const post of queuedPosts) {
      if (!post.ghlPostId || post.status === "published") continue;

      // Check if this post is published in GHL
      const ghlPost = ghlPosts.find((g) => (g.id || g._id) === post.ghlPostId);
      if (ghlPost?.status === "published") {
        try {
          await syncMutation.mutateAsync({ id: post.id, status: "published" });
          updated++;
        } catch {}
      }
    }

    setSyncMsg(updated > 0 ? `Updated ${updated} post(s) to published` : "No new updates found");
    setSyncing(false);
  };

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 900, textTransform: "uppercase", color: colors.goldenHour, margin: 0 }}>
          Post Queue
        </h2>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={handleAutoSync}
            disabled={autoSyncing}
            style={{
              background: colors.goldenHour,
              color: "white",
              border: "none",
              padding: "0.4rem 0.75rem",
              borderRadius: 4,
              fontSize: "0.65rem",
              fontWeight: 700,
              cursor: autoSyncing ? "wait" : "pointer",
              fontFamily: fonts.display,
              opacity: autoSyncing ? 0.5 : 1,
            }}
          >
            {autoSyncing ? "Syncing..." : "Auto-Sync Now"}
          </button>
          <button
            onClick={handleSync}
            disabled={syncing}
            style={{
              background: colors.canopy,
              color: "white",
              border: "none",
              padding: "0.4rem 0.75rem",
              borderRadius: 4,
              fontSize: "0.65rem",
              fontWeight: 700,
              cursor: syncing ? "wait" : "pointer",
              fontFamily: fonts.display,
              opacity: syncing ? 0.5 : 1,
            }}
          >
            {syncing ? "Syncing..." : "Sync Published"}
          </button>
          <button
            onClick={() => ghlPostsQuery.refetch()}
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
            {ghlPostsQuery.isFetching ? "Loading..." : "Refresh"}
          </button>
        </div>
      </div>

      {autoSyncMsg && (
        <div style={{ fontSize: "0.7rem", color: autoSyncMsg.includes("failed") ? colors.calendula : colors.goldenHour, marginBottom: "0.5rem" }}>
          {autoSyncMsg}
        </div>
      )}
      {syncMsg && (
        <div style={{ fontSize: "0.7rem", color: colors.canopy, marginBottom: "1rem" }}>
          {syncMsg}
        </div>
      )}

      {/* Notion editorial queue */}
      <h3 style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "#888", marginBottom: "0.5rem" }}>
        Editorial Calendar
      </h3>

      {queuedPosts.length === 0 && (
        <div style={{ fontSize: "0.75rem", color: "#555", marginBottom: "1.5rem" }}>
          No scheduled or published posts yet.
        </div>
      )}

      {queuedPosts.map((post) => (
        <div
          key={post.id}
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
          <span
            style={{
              fontSize: "0.6rem",
              fontWeight: 700,
              textTransform: "uppercase",
              padding: "3px 8px",
              borderRadius: 3,
              background: statusColors[post.status] || "#555",
              color: "white",
              flexShrink: 0,
            }}
          >
            {post.status}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "0.75rem", color: colors.milk, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {post.title}
            </div>
            <div style={{ fontSize: "0.6rem", color: "#666", marginTop: 2 }}>
              {formatDate(post.scheduledDate)}
              {post.ghlPostId && <span> {"\u00b7"} GHL: {post.ghlPostId.slice(0, 8)}{"\u2026"}</span>}
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.3rem", flexShrink: 0 }}>
            {post.platforms.map((p) => (
              <span
                key={p}
                style={{
                  fontSize: "0.5rem",
                  fontWeight: 700,
                  padding: "1px 4px",
                  borderRadius: 2,
                  background: platformColor[p] || "#555",
                  color: "white",
                }}
              >
                {platformIcon[p] || p}
              </span>
            ))}
          </div>
        </div>
      ))}

      {/* GHL Raw Queue */}
      <h3 style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "#888", marginTop: "1.5rem", marginBottom: "0.5rem" }}>
        GHL Post Queue
      </h3>

      {ghlPostsQuery.isLoading && (
        <div style={{ fontSize: "0.75rem", color: "#666" }}>Loading GHL posts...</div>
      )}

      {!ghlPostsQuery.isLoading && ghlPosts.length === 0 && (
        <div style={{ fontSize: "0.75rem", color: "#555" }}>
          No posts in GHL queue.
        </div>
      )}

      {ghlPosts.map((p) => {
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
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "0.75rem", color: colors.milk, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {summaryPreview}
              </div>
              <div style={{ fontSize: "0.6rem", color: "#666", marginTop: 2 }}>{when}</div>
            </div>
            <div style={{ fontSize: "0.55rem", color: "#444", flexShrink: 0 }}>
              {postId.slice(0, 8)}{"\u2026"}
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
