import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Facebook, Instagram, Linkedin, ArrowLeft, ExternalLink, Calendar, Globe } from "lucide-react";
import { colors, fonts } from "@/styles/brand";
import { trpc } from "@/lib/trpc";

const FB_PAGE_URL = "https://www.facebook.com/profile.php?id=61587776558599";
const IG_HANDLE = "theharvestwitta";

interface GHLPost {
  _id: string;
  summary: string;
  status: string;
  accountIds: string[];
  media: Array<{ url: string; type: string }>;
  scheduleDate?: string;
  createdAt: string;
  displayDate?: string;
}

function getPlatformFromAccountId(accountId: string): string {
  if (accountId.includes("_page") && !accountId.includes("linkedin")) return "facebook";
  if (accountId.includes("instagram") || accountId.includes("17841")) return "instagram";
  if (accountId.includes("linkedin")) return "linkedin";
  if (accountId.includes("youtube")) return "youtube";
  if (accountId.includes("google")) return "google";
  if (accountId.includes("bluesky")) return "bluesky";
  return "other";
}

function PlatformIcon({ platform, size = 16 }: { platform: string; size?: number }) {
  switch (platform) {
    case "facebook": return <Facebook size={size} />;
    case "instagram": return <Instagram size={size} />;
    case "linkedin": return <Linkedin size={size} />;
    default: return <Globe size={size} />;
  }
}

function platformColor(platform: string): string {
  switch (platform) {
    case "facebook": return "#1877F2";
    case "instagram": return "#E4405F";
    case "linkedin": return "#0A66C2";
    case "google": return "#4285F4";
    default: return colors.goldenHour;
  }
}

function PostCard({ post }: { post: GHLPost }) {
  const platforms = Array.from(new Set(post.accountIds.map(getPlatformFromAccountId)));
  const date = post.scheduleDate || post.displayDate || post.createdAt;
  const formattedDate = date ? new Date(date).toLocaleDateString("en-AU", {
    weekday: "short", day: "numeric", month: "short",
  }) : "";

  // Split caption into first paragraph and rest
  const lines = post.summary.split("\n").filter(Boolean);
  const firstLine = lines[0] || "";
  const rest = lines.slice(1).join("\n");

  return (
    <div style={{
      background: "rgba(245,240,232,0.04)",
      border: "1px solid rgba(245,240,232,0.08)",
      borderRadius: 12,
      overflow: "hidden",
      transition: "border-color 0.2s",
    }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(245,240,232,0.15)")}
      onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(245,240,232,0.08)")}
    >
      {/* Media */}
      {post.media?.length > 0 && (
        <div style={{ aspectRatio: "4/3", overflow: "hidden" }}>
          <img
            src={post.media[0].url}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      )}

      {/* Content */}
      <div style={{ padding: 20 }}>
        {/* Platform badges + date */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}>
          <div style={{ display: "flex", gap: 8 }}>
            {platforms.map(p => (
              <span key={p} style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "3px 8px",
                borderRadius: 6,
                background: `${platformColor(p)}20`,
                color: platformColor(p),
                fontSize: 11,
                fontWeight: 600,
                textTransform: "capitalize",
              }}>
                <PlatformIcon platform={p} size={12} />
                {p}
              </span>
            ))}
          </div>
          {formattedDate && (
            <span style={{
              fontSize: 12,
              opacity: 0.4,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}>
              <Calendar size={12} />
              {formattedDate}
            </span>
          )}
        </div>

        {/* Caption */}
        <p style={{
          fontSize: 15,
          fontWeight: 600,
          lineHeight: 1.5,
          marginBottom: rest ? 8 : 0,
          color: colors.milk,
        }}>
          {firstLine}
        </p>
        {rest && (
          <p style={{
            fontSize: 14,
            lineHeight: 1.6,
            opacity: 0.6,
            whiteSpace: "pre-line",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 6,
            WebkitBoxOrient: "vertical",
          }}>
            {rest}
          </p>
        )}

        {/* Status badge */}
        <div style={{ marginTop: 12 }}>
          <span style={{
            fontSize: 11,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            padding: "3px 8px",
            borderRadius: 4,
            background: post.status === "published"
              ? "rgba(74,103,65,0.3)"
              : post.status === "scheduled"
                ? "rgba(196,146,42,0.2)"
                : "rgba(245,240,232,0.08)",
            color: post.status === "published"
              ? "#6aaa5c"
              : post.status === "scheduled"
                ? colors.goldenHour
                : "rgba(245,240,232,0.5)",
          }}>
            {post.status}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Social() {
  const [posts, setPosts] = useState<GHLPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch posts from Notion editorial calendar (which has GHL sync status)
  const { data: editorialPosts } = trpc.editorial.list.useQuery();

  useEffect(() => {
    // Load Facebook SDK for the embed
    if (!(window as any).FB) {
      const script = document.createElement("script");
      script.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v21.0";
      script.async = true;
      script.defer = true;
      script.crossOrigin = "anonymous";
      document.body.appendChild(script);
      (window as any).fbAsyncInit = () => {
        (window as any).FB.init({ xfbml: true, version: "v21.0" });
      };
    } else {
      (window as any).FB.XFBML.parse();
    }
  }, []);

  // Filter editorial posts that have platforms and captions (Harvest social content)
  const socialPosts = (editorialPosts || [])
    .filter((p: any) => p.platforms?.length > 0 && p.caption && p.communicationType !== "Newsletter")
    .sort((a: any, b: any) => {
      const dateA = a.scheduledDate || "9999";
      const dateB = b.scheduledDate || "9999";
      return dateA < dateB ? -1 : 1;
    });

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: colors.shed,
      color: colors.milk,
      fontFamily: fonts.body,
    }}>
      {/* Header */}
      <header style={{
        padding: "24px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: `1px solid rgba(245,240,232,0.08)`,
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", color: colors.milk }}>
          <ArrowLeft size={18} />
          <img
            src="/images/logo-harvest-only-clean.png"
            alt="The Harvest"
            style={{ height: 28, filter: "brightness(0) invert(1)" }}
          />
        </Link>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <a href={FB_PAGE_URL} target="_blank" rel="noopener noreferrer" style={{ color: colors.milk, opacity: 0.6, display: "flex", alignItems: "center", gap: 6, textDecoration: "none", fontSize: 13 }}>
            <Facebook size={18} />
          </a>
          <a href={`https://instagram.com/${IG_HANDLE}`} target="_blank" rel="noopener noreferrer" style={{ color: colors.milk, opacity: 0.6, display: "flex", alignItems: "center", gap: 6, textDecoration: "none", fontSize: 13 }}>
            <Instagram size={18} />
          </a>
        </div>
      </header>

      {/* Title */}
      <div style={{
        textAlign: "center",
        padding: "48px 24px 16px",
      }}>
        <h1 style={{
          fontFamily: fonts.display,
          fontSize: 36,
          fontWeight: 800,
          letterSpacing: "0.04em",
          marginBottom: 12,
        }}>
          Follow Along
        </h1>
        <p style={{
          fontSize: 16,
          opacity: 0.5,
          maxWidth: 500,
          margin: "0 auto",
          lineHeight: 1.6,
        }}>
          What's happening at The Harvest — from the garden, the kitchen, and the art space.
        </p>
      </div>

      {/* Follow buttons */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: 16,
        padding: "16px 24px 40px",
        flexWrap: "wrap",
      }}>
        <a
          href={FB_PAGE_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 20px",
            background: "#1877F2",
            color: "#fff",
            textDecoration: "none",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 14,
            fontFamily: fonts.body,
          }}
        >
          <Facebook size={18} />
          Follow on Facebook
          <ExternalLink size={14} style={{ opacity: 0.6 }} />
        </a>
        <a
          href={`https://instagram.com/${IG_HANDLE}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 20px",
            background: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
            color: "#fff",
            textDecoration: "none",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 14,
            fontFamily: fonts.body,
          }}
        >
          <Instagram size={18} />
          @{IG_HANDLE}
          <ExternalLink size={14} style={{ opacity: 0.6 }} />
        </a>
      </div>

      {/* Posts feed */}
      <div style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "0 24px 80px",
      }}>
        {socialPosts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", opacity: 0.4 }}>
            <p style={{ fontSize: 14 }}>Posts loading...</p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 20,
          }}>
            {socialPosts.map((post: any) => {
              const platforms = Array.from(new Set(post.platforms || [])) as string[];
              const date = post.scheduledDate;
              const formattedDate = date ? new Date(date).toLocaleDateString("en-AU", {
                weekday: "short", day: "numeric", month: "short",
              }) : "";

              const lines = (post.caption || "").split("\n").filter(Boolean);
              const firstLine = lines[0] || "";
              const rest = lines.slice(1, 8).join("\n");

              return (
                <div
                  key={post.id}
                  style={{
                    background: "rgba(245,240,232,0.04)",
                    border: "1px solid rgba(245,240,232,0.08)",
                    borderRadius: 12,
                    overflow: "hidden",
                    transition: "border-color 0.2s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(245,240,232,0.15)")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(245,240,232,0.08)")}
                >
                  {/* Media placeholder if has image */}
                  {post.mediaUrl && (
                    <div style={{ aspectRatio: "4/3", overflow: "hidden" }}>
                      <img src={post.mediaUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  )}

                  <div style={{ padding: 20 }}>
                    {/* Platform badges + date */}
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 12,
                      flexWrap: "wrap",
                      gap: 6,
                    }}>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {platforms.map((p: string) => {
                          const key = p.toLowerCase().includes("instagram") ? "instagram"
                            : p.toLowerCase().includes("facebook") ? "facebook"
                            : p.toLowerCase().includes("linkedin") ? "linkedin"
                            : p.toLowerCase().includes("google") ? "google"
                            : "other";
                          return (
                            <span key={p} style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                              padding: "2px 7px",
                              borderRadius: 5,
                              background: `${platformColor(key)}20`,
                              color: platformColor(key),
                              fontSize: 11,
                              fontWeight: 600,
                            }}>
                              <PlatformIcon platform={key} size={11} />
                              {p.replace(" (Company)", "").replace(" (Personal)", "")}
                            </span>
                          );
                        })}
                      </div>
                      {formattedDate && (
                        <span style={{ fontSize: 11, opacity: 0.35, whiteSpace: "nowrap" }}>
                          {formattedDate}
                        </span>
                      )}
                    </div>

                    {/* Caption */}
                    <p style={{
                      fontSize: 14,
                      fontWeight: 600,
                      lineHeight: 1.5,
                      marginBottom: rest ? 6 : 0,
                    }}>
                      {firstLine}
                    </p>
                    {rest && (
                      <p style={{
                        fontSize: 13,
                        lineHeight: 1.6,
                        opacity: 0.5,
                        whiteSpace: "pre-line",
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 5,
                        WebkitBoxOrient: "vertical",
                      }}>
                        {rest}
                      </p>
                    )}

                    {/* Status */}
                    <div style={{ marginTop: 10 }}>
                      <span style={{
                        fontSize: 10,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        padding: "2px 6px",
                        borderRadius: 4,
                        background: post.status === "published"
                          ? "rgba(74,103,65,0.3)"
                          : post.status === "scheduled"
                            ? "rgba(196,146,42,0.2)"
                            : post.status === "approved"
                              ? "rgba(196,146,42,0.15)"
                              : "rgba(245,240,232,0.06)",
                        color: post.status === "published"
                          ? "#6aaa5c"
                          : (post.status === "scheduled" || post.status === "approved")
                            ? colors.goldenHour
                            : "rgba(245,240,232,0.4)",
                      }}>
                        {post.status === "approved" ? "ready" : post.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Mobile responsive */}
      <style>{`
        @media (max-width: 600px) {
          div[style*="grid-template-columns: repeat"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
