import { useEffect, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ExternalLink, Camera } from "lucide-react";
import { worksBySlug, works, LIFECYCLE_VOCAB, sortLifecycleTags, resolveWorkStatus, type LifecycleTag } from "@/data/works";
import { trpc } from "@/lib/trpc";
import { HarvestImage } from "@/components/HarvestImage";
import { EditableText } from "@/components/EditableText";
import { ShopInterestSection } from "@/components/ShopInterestSection";
import { useAuth } from "@/_core/hooks/useAuth";
import { elLinks } from "@/lib/empathyLedger";
import { optimize } from "@/lib/imageOptimize";
import { HarvestPhotoPicker } from "@/components/HarvestPhotoPicker";
import { toast } from "sonner";
import { SiteFooter, SiteNav } from "./HarvestReviewTest";
import { VisitStrip } from "@/components/VisitStrip";

const SITE_URL = "https://www.theharvestwitta.com.au";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6 },
};


export default function WorkDetail({ slug }: { slug: string }) {
  const work = worksBySlug[slug];
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const { data: storytellers } = trpc.harvest.publicStorytellers.useQuery(undefined, { staleTime: 5 * 60_000 });

  // Map a hand name to a /people/:slug link when it matches a curated Harvest storyteller.
  const storytellerForName = (name: string): { slug: string; displayName: string } | null => {
    if (!storytellers || storytellers.length === 0) return null;
    const lower = name.toLowerCase();
    // Prefer full-name match, fall back to first-name match.
    const full = storytellers.find((s) => s.displayName.toLowerCase() === lower);
    if (full) return { slug: full.slug, displayName: full.displayName };
    return storytellers.find((s) => {
      const first = s.displayName.toLowerCase().split(/\s+/)[0];
      return first.length >= 3 && lower.split(/\s+/).includes(first);
    }) ?? null;
  };

  useEffect(() => {
    if (!work) {
      document.title = "Work not found · The Harvest";
      return;
    }
    document.title = `${work.title} · The Collection · The Harvest`;
    const url = `${SITE_URL}/works/${work.slug}`;
    const title = `${work.title} · The Harvest Witta`;
    const image = work.heroImage.startsWith("http") ? work.heroImage : `${SITE_URL}${work.heroImage}`;

    setMeta("name", "description", work.blurb);
    setMeta("property", "og:type", "article");
    setMeta("property", "og:url", url);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", work.blurb);
    setMeta("property", "og:image", image);
    setMeta("property", "og:image:alt", work.heroAlt);
    setMeta("property", "twitter:card", "summary_large_image");
    setMeta("property", "twitter:url", url);
    setMeta("property", "twitter:title", title);
    setMeta("property", "twitter:description", work.blurb);
    setMeta("property", "twitter:image", image);
    setMeta("property", "twitter:image:alt", work.heroAlt);
    setCanonical(url);
    setJsonLd("work-jsonld", {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      "@id": `${url}#work`,
      name: work.title,
      headline: work.title,
      description: work.blurb,
      image,
      url,
      isPartOf: {
        "@type": "Collection",
        name: "The Harvest Works",
        url: `${SITE_URL}/works`,
      },
      about: ["The Harvest Witta", "Jinibara Country", "Witta", ...work.lifecycleTags],
      locationCreated: {
        "@type": "Place",
        name: "The Harvest",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Witta",
          addressRegion: "QLD",
          addressCountry: "AU",
        },
      },
    });
  }, [work]);

  useEffect(() => {
    const scrollToHash = () => {
      const id = window.location.hash.replace("#", "");
      if (!id) return;
      window.requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    };

    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, [slug]);

  if (!work) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <p className="font-mono text-stone-400 uppercase tracking-wider text-xs mb-3">
            Work not in the collection
          </p>
          <h1 className="text-3xl font-serif text-stone-800 mb-6">
            We couldn't find that piece.
          </h1>
          <Link
            href="/works"
            className="inline-flex items-center gap-2 text-amber-700 underline underline-offset-4 decoration-amber-500 decoration-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to the collection
          </Link>
        </div>
      </div>
    );
  }

  // Effective lifecycle tags: admin override (DB) wins, else default from works.ts
  const lifecycleSlot = `${work.slug}-lifecycleTags`;
  const lifecycleQuery = trpc.content.get.useQuery({ page: "works", slot: lifecycleSlot });
  const savedTags = (() => {
    if (!lifecycleQuery.data?.content) return null;
    try {
      const parsed = JSON.parse(lifecycleQuery.data.content);
      return Array.isArray(parsed) ? (parsed as LifecycleTag[]) : null;
    } catch {
      return null;
    }
  })();
  const activeTags: LifecycleTag[] = savedTags ?? work.lifecycleTags;
  const lifecycleTags = sortLifecycleTags(activeTags);
  const status = resolveWorkStatus(activeTags);
  const isNote = work.weight === "note";
  const index = works.findIndex((w) => w.slug === work.slug);
  const number = work.number ?? String(index + 1).padStart(2, "0");
  const next = works[(index + 1) % works.length];

  return (
    <div className="min-h-screen bg-stone-50">
      <SiteNav />
      {/* Top bar — return to collection */}
      <div className="container pt-28">
        <Link
          href="/works"
          className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 text-sm font-mono uppercase tracking-wider"
        >
          <ArrowLeft className="h-4 w-4" />
          The Collection
        </Link>
      </div>

      {/* Admin hint + quick-links — only when logged in as admin */}
      {isAdmin && <AdminQuickBar work={work} />}

      {/* Header */}
      <section className="pt-12 pb-16 md:pt-16 md:pb-20">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="grid md:grid-cols-[auto_1fr] gap-x-8 gap-y-3"
            >
              <div className="flex items-center justify-between gap-4 md:col-span-2">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#8B4A2A]">
                  {number}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {isAdmin ? (
                    lifecycleTags.map((tag) => {
                      const meta = LIFECYCLE_VOCAB[tag];
                      return (
                        <span
                          key={tag}
                          className={`px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] ${meta.badgeClass}`}
                        >
                          {meta.label}
                        </span>
                      );
                    })
                  ) : (
                    <span
                      className={`px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] ${status.badgeClass}`}
                    >
                      {status.label}
                    </span>
                  )}
                </div>
              </div>
              <div className="md:col-span-2">
                {isAdmin && (
                  <LifecycleEditor
                    workSlug={work.slug}
                    activeTags={activeTags}
                  />
                )}
                <EditableText
                  page="works"
                  slot={`${work.slug}-title`}
                  defaultContent={work.title}
                  as="h1"
                  className="mt-4 text-5xl font-black leading-[0.92] text-[#1C1917] md:text-7xl"
                />
                <EditableText
                  page="works"
                  slot={`${work.slug}-subtitle`}
                  defaultContent={work.subtitle}
                  as="p"
                  className="mt-3 text-xl italic leading-snug text-stone-600 md:text-2xl"
                  multiline
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Hero image — pulls from EL when available, falls back to bundled image */}
      <WorkHero work={work} />

      {/* Pulse — admin-editable status update for what's happening with this work right now */}
      <WorkPulseSection work={work} isAdmin={isAdmin} />

      {/* Video — admin pastes a YouTube/Vimeo/MP4 URL; hidden when blank for visitors */}
      <WorkVideoSection work={work} isAdmin={isAdmin} />

      {/* Museum label */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <motion.div
              {...fadeInUp}
              className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 border-t border-b border-stone-200 py-8"
            >
              <div>
                <p className="font-mono text-stone-400 uppercase tracking-wider text-[11px] mb-2">Year</p>
                <p className="text-stone-800 font-medium">{work.year}</p>
              </div>
              <div>
                <p className="font-mono text-stone-400 uppercase tracking-wider text-[11px] mb-2">Materials</p>
                <p className="text-stone-800">{work.materials}</p>
              </div>
              <div>
                <p className="font-mono text-stone-400 uppercase tracking-wider text-[11px] mb-2">Status</p>
                <p className="text-stone-800 font-medium">{status.label}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What it is */}
      <Section label="What it is" body={work.whatItIs} slot={`${work.slug}-whatItIs`} />

      {/* Inline feature image — slot 1 (after "What it is"). Notes skip the
          inline image slots entirely. */}
      {!isNote && <InlineFeatureImage work={work} slotKey="feature-1" />}

      {/* Why */}
      <Section label="Why" body={work.why} slot={`${work.slug}-why`} tone="dark" />

      {/* How */}
      <Section label="How" body={work.how} slot={`${work.slug}-how`} />

      {/* Inline feature image — slot 2 (after "How"). */}
      {!isNote && <InlineFeatureImage work={work} slotKey="feature-2" caption="In the making." />}

      {/* Work story — free text. Notes skip the story text (it would just repeat
          the blurb) but keep any calls to action; the section hides entirely when
          a note has neither. */}
      {(!isNote || (work.storyLinks && work.storyLinks.length > 0)) && (
      <section className="py-20 md:py-28 bg-stone-100">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            {!isNote && (
              <>
                <motion.div {...fadeInUp} className="mb-12">
                  <p className="font-mono text-amber-700 text-sm mb-3 uppercase tracking-[0.2em]">
                    Story
                  </p>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-800">
                    A note on this work.
                  </h2>
                </motion.div>

                <EditableText
                  page="works"
                  slot={`${work.slug}-story`}
                  defaultContent={work.blurb}
                  as="p"
                  className="max-w-3xl whitespace-pre-line text-xl leading-relaxed text-stone-700 md:text-2xl"
                  multiline
                />
              </>
            )}
            {work.storyLinks && work.storyLinks.length > 0 && (
              <div className="mt-8 flex flex-col items-start gap-3">
                {work.storyLinks.map((link, linkIndex) => (
                  link.href.includes("#") ? (
                    <a
                      key={`${link.href}-${linkIndex}`}
                      href={link.href}
                      className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-800 underline underline-offset-4 decoration-amber-500 decoration-2"
                    >
                      {link.label}
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  ) : link.href.startsWith("/") ? (
                    <Link
                      key={`${link.href}-${linkIndex}`}
                      href={link.href}
                      className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-800 underline underline-offset-4 decoration-amber-500 decoration-2"
                    >
                      {link.label}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  ) : (
                    <a
                      key={`${link.href}-${linkIndex}`}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-800 underline underline-offset-4 decoration-amber-500 decoration-2"
                    >
                      {link.label}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      )}

      {work.slug === "the-shop" && <ShopInterestSection />}

      {/* Two-up spread — slots 3 and 4 (between Witta thread and Hands). */}
      {!isNote && <InlineSpreadImages work={work} />}

      {/* Photographs from Empathy Ledger */}
      <WorkPhotographsSection slug={work.slug} />

      {/* The Hands */}
      <section className="py-20 md:py-24">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <motion.div {...fadeInUp} className="mb-10">
              <p className="font-mono text-stone-400 text-sm mb-3 uppercase tracking-[0.2em]">
                The Hands
              </p>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-800">
                Who made it possible.
              </h2>
            </motion.div>
            <ul className="divide-y divide-stone-200 border-t border-b border-stone-200">
              {work.hands.map((h, i) => {
                const linked = storytellerForName(h.name);
                return (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="grid sm:grid-cols-[1fr_2fr] gap-2 py-4"
                  >
                    <div className="flex items-center gap-2 text-stone-800 font-medium">
                      {h.href && !isAdmin ? (
                        <a
                          href={h.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 underline-offset-2 hover:text-amber-700 hover:underline"
                        >
                          {h.name}
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      ) : linked && !isAdmin ? (
                        <Link
                          href={`/people/${linked.slug}`}
                          className="underline-offset-2 hover:text-amber-700 hover:underline"
                        >
                          {h.name}
                        </Link>
                      ) : (
                        <EditableText
                          page="works"
                          slot={`${work.slug}-hand-${i + 1}-name`}
                          defaultContent={h.name}
                          as="span"
                          className="text-stone-800 font-medium"
                        />
                      )}
                      {h.href && isAdmin && (
                        <a
                          href={h.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-stone-300 text-stone-500 hover:border-amber-500 hover:text-amber-700"
                          title={`Open ${h.name}`}
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                    <EditableText
                      page="works"
                      slot={`${work.slug}-hand-${i + 1}-role`}
                      defaultContent={h.role}
                      as="p"
                      className="text-stone-600"
                    />
                  </motion.li>
                );
              })}
            </ul>

            {(work.link || work.links?.length) && (
              <div className="mt-8 flex flex-col items-start gap-3">
                {[...(work.link ? [work.link] : []), ...(work.links ?? [])].map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-800 underline underline-offset-4 decoration-amber-500 decoration-2"
                  >
                    {link.label}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}

            <p className="mt-10 border-t border-stone-200 pt-6 text-stone-600">
              Want to help make this one? Hands, materials, skills and local
              knowledge all count.{" "}
              <Link
                href="/get-involved"
                className="font-medium text-amber-700 underline underline-offset-4 hover:text-amber-800"
              >
                Tell us on the Get Involved page
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Blog — full article library for this work, with Past/Now/Coming filter */}
      <WorkJournalSection slug={work.slug} workTitle={work.title} />

      {/* Related works */}
      {work.related && work.related.length > 0 && (
        <section className="py-16 bg-stone-100 border-t border-stone-200">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <p className="font-mono text-stone-400 text-sm mb-6 uppercase tracking-[0.2em]">
                Adjacent works
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {work.related
                  .map((slug) => worksBySlug[slug])
                  .filter(Boolean)
                  .map((rel) => (
                    <Link
                      key={rel.slug}
                      href={`/works/${rel.slug}`}
                      className="block group"
                    >
                      <div className="aspect-[4/3] overflow-hidden bg-stone-200 rounded-sm">
                        <HarvestImage
                          page="works"
                          slot={`${rel.slug}-card`}
                          defaultWorkSlug={rel.slug}
                          src={rel.heroImage}
                          alt={rel.heroAlt}
                          size="card"
                          className="h-full w-full"
                          imgClassName="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <h3 className="mt-3 font-serif text-xl text-stone-800 group-hover:text-amber-700 transition-colors">
                        {rel.title}
                      </h3>
                      <p className="text-stone-600 italic text-sm leading-snug">
                        {rel.subtitle}
                      </p>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Next work */}
      <section className="py-20 bg-stone-800 text-white">
        <div className="container">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <p className="font-mono text-amber-400 text-sm mb-2 uppercase tracking-[0.2em]">
                Next in the collection
              </p>
              <h2 className="text-3xl md:text-4xl font-serif font-bold">
                {next.title}
              </h2>
              <p className="text-stone-300 italic mt-1">{next.subtitle}</p>
            </div>
            <Link
              href={`/works/${next.slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-500 text-stone-900 font-semibold hover:bg-amber-400 transition-colors whitespace-nowrap"
            >
              See the next work
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
      <VisitStrip />
      <SiteFooter />
    </div>
  );
}

function setMeta(attribute: "name" | "property", key: string, content: string) {
  let meta = document.querySelector(`meta[${attribute}="${key}"]`) as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute(attribute, key);
    document.head.appendChild(meta);
  }
  meta.content = content;
}

function setCanonical(href: string) {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }
  link.href = href;
}

function setJsonLd(id: string, data: Record<string, unknown>) {
  let script = document.getElementById(id) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

/**
 * Lifecycle editor — admin-only chip toggle row. Click chips to add or remove
 * lifecycle tags for this work. Persists as JSON array in editable_content.
 */
function LifecycleEditor({
  workSlug,
  activeTags,
}: {
  workSlug: string;
  activeTags: LifecycleTag[];
}) {
  const slot = `${workSlug}-lifecycleTags`;
  const utils = trpc.useUtils();
  const update = trpc.content.update.useMutation({
    onSuccess: () => utils.content.get.invalidate({ page: "works", slot }),
  });
  const [open, setOpen] = useState(false);
  const activeSet = new Set<LifecycleTag>(activeTags);

  const toggleTag = async (tag: LifecycleTag) => {
    const next = new Set(activeSet);
    if (next.has(tag)) next.delete(tag);
    else next.add(tag);
    await update.mutateAsync({
      page: "works",
      slot,
      content: JSON.stringify(Array.from(next)),
      contentType: "text",
    });
  };

  // Group vocab by family for the editor
  const FAMILY_LABEL = { build: "Build", grow: "Grow", make: "Make", concept: "Concept", open: "Open" } as const;
  const FAMILY_ORDER = ["build", "grow", "make", "concept", "open"] as const;
  const grouped = FAMILY_ORDER.map((family) => ({
    family,
    label: FAMILY_LABEL[family],
    items: (Object.entries(LIFECYCLE_VOCAB) as Array<[LifecycleTag, typeof LIFECYCLE_VOCAB[LifecycleTag]]>)
      .filter(([, meta]) => meta.family === family),
  }));

  return (
    <div className="mb-5 -mt-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-xs font-mono uppercase tracking-wider text-amber-700 hover:text-amber-800 underline underline-offset-4 decoration-amber-500 decoration-2"
      >
        {open ? "Close lifecycle editor" : "Edit lifecycle tags"}
      </button>
      {open && (
        <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 space-y-3">
          <p className="text-xs text-stone-600">
            Click a chip to add or remove. A work can carry multiple states at once.
            These tags also drive comms categorisation.
          </p>
          {grouped.map((g) => (
            <div key={g.family}>
              <p className="font-mono text-[10px] uppercase tracking-wider text-stone-500 mb-1.5">
                {g.label}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {g.items.map(([tag, meta]) => {
                  const active = activeSet.has(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      disabled={update.isPending}
                      className={`inline-flex items-center px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider rounded-full transition-all ${
                        active
                          ? meta.badgeClass + " ring-2 ring-amber-500 ring-offset-2 ring-offset-amber-50"
                          : "bg-white text-stone-500 border border-stone-300 hover:bg-stone-50"
                      } disabled:opacity-50`}
                    >
                      {meta.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Pulse — short admin-edited line about what's happening with this work right
 * now. Hidden for visitors when blank; visible (empty + editable) for admins
 * so they can drop in a quick status update without leaving the page.
 */
function WorkPulseSection({
  work,
  isAdmin,
}: {
  work: import("@/data/works").Work;
  isAdmin: boolean;
}) {
  const slot = `${work.slug}-pulse`;
  const { data: saved } = trpc.content.get.useQuery({ page: "works", slot });
  const hasContent = !!(saved?.content && saved.content.trim().length > 0);

  // For non-admins with no pulse set, render nothing
  if (!isAdmin && !hasContent) return null;

  return (
    <section className="pt-6 pb-2">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <p className="font-mono text-amber-700 text-[11px] mb-2 uppercase tracking-[0.2em] inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Now
          </p>
          <EditableText
            page="works"
            slot={slot}
            defaultContent={hasContent ? "" : (isAdmin ? "Add a short status update for what's happening with this work right now." : "")}
            as="p"
            className="text-lg md:text-xl text-stone-700 italic leading-relaxed"
            multiline
          />
        </div>
      </div>
    </section>
  );
}

/**
 * Detect a video URL and return the embed src + render mode.
 * Supports YouTube (watch / youtu.be / shorts / embed), Vimeo, and direct files.
 */
function detectVideoEmbed(url: string): { kind: "youtube" | "vimeo" | "file"; src: string } | null {
  const u = url.trim();
  if (!u) return null;
  // YouTube
  const yt = u.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/i,
  );
  if (yt) return { kind: "youtube", src: `https://www.youtube.com/embed/${yt[1]}` };
  // Vimeo
  const vm = u.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  if (vm) return { kind: "vimeo", src: `https://player.vimeo.com/video/${vm[1]}` };
  // Direct file (mp4 / webm / ogg / mov)
  if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(u)) return { kind: "file", src: u };
  return null;
}

/**
 * Video section — admin pastes a URL; we embed it. Hidden from visitors when blank.
 */
function WorkVideoSection({
  work,
  isAdmin,
}: {
  work: import("@/data/works").Work;
  isAdmin: boolean;
}) {
  const slot = `${work.slug}-videoUrl`;
  const utils = trpc.useUtils();
  const { data: saved } = trpc.content.get.useQuery({ page: "works", slot });
  const update = trpc.content.update.useMutation({
    onSuccess: () => utils.content.get.invalidate({ page: "works", slot }),
  });

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  const url = saved?.content?.trim() ?? "";
  const embed = url ? detectVideoEmbed(url) : null;

  // Visitor + no video → render nothing
  if (!isAdmin && !embed) return null;

  const startEdit = () => {
    setDraft(url);
    setEditing(true);
  };
  const save = async () => {
    await update.mutateAsync({
      page: "works",
      slot,
      content: draft.trim(),
      contentType: "text",
    });
    setEditing(false);
  };
  const clearVideo = async () => {
    await update.mutateAsync({
      page: "works",
      slot,
      content: "",
      contentType: "text",
    });
    setEditing(false);
  };

  return (
    <section className="py-10 md:py-14">
      <div className="container">
        <div className="max-w-5xl mx-auto">
          {embed ? (
            <div className="relative">
              <div className="aspect-video w-full overflow-hidden rounded-sm shadow-md bg-stone-900">
                {embed.kind === "file" ? (
                  <video
                    src={embed.src}
                    controls
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <iframe
                    src={embed.src}
                    title={`${work.title} video`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                )}
              </div>
              {isAdmin && !editing && (
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    type="button"
                    onClick={startEdit}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-500 text-stone-900 text-xs font-mono uppercase tracking-wider font-semibold shadow"
                  >
                    Edit URL
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Admin and no video set → show the inline form (also used when editing)
            <div className="rounded-md border border-dashed border-stone-300 bg-stone-50 px-6 py-8">
              <p className="font-mono text-amber-700 text-xs mb-3 uppercase tracking-[0.2em]">
                Add a video
              </p>
              <p className="text-stone-600 mb-4 text-sm">
                Paste a YouTube, Vimeo, or direct video file URL. Examples:
                <br />
                <code className="font-mono text-xs text-stone-500">https://youtu.be/abc123</code> ·
                <code className="font-mono text-xs text-stone-500"> https://vimeo.com/1234567</code> ·
                <code className="font-mono text-xs text-stone-500"> https://your.cdn/clip.mp4</code>
              </p>
              <VideoUrlForm initial={url} onSave={async (v) => {
                await update.mutateAsync({
                  page: "works",
                  slot,
                  content: v.trim(),
                  contentType: "text",
                });
              }} />
            </div>
          )}

          {/* Edit form overlay when admin clicked Edit URL */}
          {editing && (
            <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3">
              <VideoUrlForm
                initial={draft}
                onSave={async (v) => {
                  setDraft(v);
                  await update.mutateAsync({
                    page: "works",
                    slot,
                    content: v.trim(),
                    contentType: "text",
                  });
                  setEditing(false);
                }}
                onCancel={() => setEditing(false)}
                onClear={clearVideo}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function VideoUrlForm({
  initial,
  onSave,
  onCancel,
  onClear,
}: {
  initial: string;
  onSave: (url: string) => Promise<void>;
  onCancel?: () => void;
  onClear?: () => Promise<void>;
}) {
  const [value, setValue] = useState(initial);
  const [busy, setBusy] = useState(false);

  const handleSave = async () => {
    setBusy(true);
    try {
      await onSave(value);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        type="url"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="https://..."
        className="flex-1 min-w-[260px] px-3 py-2 rounded-md border border-stone-300 bg-white text-sm"
      />
      <button
        type="button"
        onClick={handleSave}
        disabled={busy}
        className="inline-flex items-center gap-1 px-4 py-2 rounded-md bg-stone-800 text-amber-300 text-sm font-semibold hover:bg-stone-900 disabled:opacity-50"
      >
        {busy ? "Saving…" : "Save video"}
      </button>
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-md text-sm text-stone-600 hover:bg-stone-100"
        >
          Cancel
        </button>
      )}
      {onClear && (
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50"
        >
          Remove
        </button>
      )}
    </div>
  );
}

/**
 * Picks a hero image for a work in this priority order:
 *   1. Admin-set override in image_overrides for (page="works", slot="<slug>-hero")
 *      — applied inside HarvestImage; admins can set/revert via the on-image widget
 *   2. EL photo tagged `special: ["hero"]` for the work
 *   3. First EL photo for the work
 *   4. Fallback: hardcoded heroImage from works.ts
 */
function WorkHero({ work }: { work: import("@/data/works").Work }) {
  const query = trpc.gallery.forWork.useQuery({ slug: work.slug, limit: 24 });

  // Wait for the gallery query to settle before picking a fallback. Otherwise
  // we render with `work.heroImage` first and then swap when EL responds —
  // visible as a "wrong image then real one" flicker.
  if (query.isPending) {
    return (
      <section>
        <div className="container">
          <div className="max-w-5xl mx-auto aspect-[16/10] rounded-sm shadow-md bg-stone-200 animate-pulse" />
        </div>
      </section>
    );
  }

  const photos = (query.data?.media ?? []).filter((photo) => isImageMediaSrc(photo.src));
  const elHero = photos.find((p) => p.special?.includes("hero")) ?? photos[0];

  const fallbackSrc = elHero?.src ?? work.heroImage;
  const fallbackAlt = elHero?.altText ?? elHero?.title ?? work.heroAlt;
  // Only show the bundled credit if neither EL nor an override won. HarvestImage
  // signals override presence visually with its own pip, so we just hide the
  // credit when an EL photo is in play (we don't have credit metadata for EL assets yet).
  const credit = elHero ? null : work.heroCredit;

  return (
    <section>
      <div className="container">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-5xl mx-auto"
        >
          <HarvestImage
            page="works"
            slot={`${work.slug}-hero`}
            defaultWorkSlug={work.slug}
            src={fallbackSrc}
            alt={fallbackAlt}
            size="hero"
            priority
            className="aspect-[16/10] overflow-hidden rounded-sm shadow-md bg-stone-200"
            imgClassName="w-full h-full object-cover"
          />
          {credit && (
            <p className="text-stone-500 text-xs mt-2 italic text-right">{credit}</p>
          )}
        </motion.div>
      </div>
    </section>
  );
}

/**
 * Admin quick-action bar — shortcuts to add/manage photos and tag in EL.
 * Only rendered when the viewer is admin.
 */
function AdminQuickBar({ work }: { work: import("@/data/works").Work }) {
  const photoManagerUrl = elLinks.photoManager();
  const bulkEditUrl = elLinks.bulkEdit();
  const galleriesUrl = elLinks.galleries();
  const articleEditorUrl = elLinks.articles();

  return (
    <div className="container mt-4">
      <div className="max-w-4xl mx-auto rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-stone-700">
          <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500 text-stone-900 font-semibold whitespace-nowrap">
            Admin
          </span>
          <span className="grow text-stone-700">
            Hover any image to <strong className="text-amber-800">Swap</strong> or
            <strong className="text-amber-800"> Revert</strong>. Hover any text and
            click the <strong className="text-amber-800">pencil</strong> to edit.
          </span>
        </div>
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          <QuickLink href={photoManagerUrl} label="Add photos" hint={`Tag with: ${work.title}`} />
          <QuickLink href={galleriesUrl} label="Galleries" />
          <QuickLink href={bulkEditUrl} label="Bulk-tag photos" />
          <QuickLink href={articleEditorUrl} label="Write an article" />
          <span className="text-stone-500 text-[11px] italic ml-auto self-center">
            Slot prefix: <code className="font-mono bg-white border px-1 py-0.5 rounded">works / {work.slug}-*</code>
          </span>
        </div>
      </div>
    </div>
  );
}

function QuickLink({ href, label, hint }: { href: string; label: string; hint?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-amber-300 text-amber-800 hover:bg-amber-100 transition-colors"
      title={hint ?? label}
    >
      <ExternalLink className="h-3 w-3" />
      {label}
    </a>
  );
}

/**
 * A single feature image between text sections. Falls back to the work's
 * heroImage when no override is set. Admins can swap via the on-image widget.
 */
function InlineFeatureImage({
  work,
  slotKey,
  caption,
}: {
  work: import("@/data/works").Work;
  slotKey: string;
  caption?: string;
}) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const slot = `${work.slug}-${slotKey}`;
  const overrideQuery = trpc.imageOverrides.get.useQuery({ page: "works", slot });
  // Visitors only see this slot when a real photo override exists, so a work
  // without its own photo library no longer repeats the hero image down the
  // page. Admins always see it, so the swap affordance stays reachable.
  if (!isAdmin && (overrideQuery.isPending || !overrideQuery.data)) return null;
  return (
    <section className="py-12 md:py-16">
      <div className="container">
        <div className="max-w-5xl mx-auto">
          <HarvestImage
            page="works"
            slot={slot}
            defaultWorkSlug={work.slug}
            src={work.heroImage}
            alt={`${work.title} feature image`}
            className="aspect-[16/9] overflow-hidden rounded-sm shadow-md bg-stone-200"
            imgClassName="w-full h-full object-cover"
          />
          {caption && (
            <p className="text-stone-500 text-sm italic mt-3 text-center">{caption}</p>
          )}
        </div>
      </div>
    </section>
  );
}

/**
 * Two-image spread — sits between the Witta thread and The Hands.
 * Each side is its own slot so admins can swap them independently.
 */
function InlineSpreadImages({ work }: { work: import("@/data/works").Work }) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const leftQuery = trpc.imageOverrides.get.useQuery({ page: "works", slot: `${work.slug}-spread-left` });
  const rightQuery = trpc.imageOverrides.get.useQuery({ page: "works", slot: `${work.slug}-spread-right` });
  // Visitors only see the two-image spread when both slots have real photos, so
  // we never show a half-empty spread or the hero image repeated twice. Admins
  // always see it, so both swap affordances stay reachable.
  const resolved = !leftQuery.isPending && !rightQuery.isPending;
  const hasBoth = Boolean(leftQuery.data) && Boolean(rightQuery.data);
  if (!isAdmin && (!resolved || !hasBoth)) return null;
  return (
    <section className="py-12 md:py-16 bg-stone-50">
      <div className="container">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-4 md:gap-6">
          <HarvestImage
            page="works"
            slot={`${work.slug}-spread-left`}
            defaultWorkSlug={work.slug}
            src={work.heroImage}
            alt={`${work.title} spread, left`}
            className="aspect-[4/3] overflow-hidden rounded-sm shadow-md bg-stone-200"
            imgClassName="w-full h-full object-cover"
          />
          <HarvestImage
            page="works"
            slot={`${work.slug}-spread-right`}
            defaultWorkSlug={work.slug}
            src={work.heroImage}
            alt={`${work.title} spread, right`}
            className="aspect-[4/3] overflow-hidden rounded-sm shadow-md bg-stone-200"
            imgClassName="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}

function WorkPhotographsSection({ slug }: { slug: string }) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [pickerOpen, setPickerOpen] = useState(false);
  const query = trpc.gallery.forWork.useQuery({ slug, limit: 24 });
  const utils = trpc.useUtils();
  const addToWorkMutation = trpc.mediaLibrary.addToWork.useMutation({
    onSuccess: () => {
      utils.gallery.forWork.invalidate({ slug, limit: 24 });
      toast.success("Photo added to this work.");
    },
    onError: (error) => toast.error("Could not add photo", { description: error.message }),
  });
  const removeFromWorkMutation = trpc.mediaLibrary.removeFromWork.useMutation({
    onSuccess: () => {
      utils.gallery.forWork.invalidate({ slug, limit: 24 });
      toast.success("Photo removed from this work.");
    },
    onError: (error) => toast.error("Could not remove photo", { description: error.message }),
  });
  const photos = (query.data?.media ?? []).filter((photo) => isImageMediaSrc(photo.src));

  // For visitors: hide section entirely when there are no photos.
  // For admins: still render the section so the "Add photo" CTA is reachable.
  if (query.isLoading) return null;
  if (photos.length === 0 && !isAdmin) return null;

  return (
    <section className="py-20 md:py-28 bg-stone-50">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="font-mono text-amber-700 text-sm mb-4 uppercase tracking-[0.2em] inline-flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Photographs · {photos.length}
              </p>
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-stone-800 leading-[0.95]">
                From the field.
              </h2>
              <p className="mt-5 text-lg text-stone-600 leading-relaxed">
                Every photograph tagged for this work in Empathy Ledger.
                {isAdmin && " Hover any image to swap or revert."}
              </p>
            </div>
            {isAdmin && (
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-800 text-amber-300 text-sm font-medium hover:bg-stone-900 transition-colors whitespace-nowrap"
                title="Pick an existing Empathy Ledger photo and link it to this work."
              >
                <Camera className="h-4 w-4" />
                Add linked photo
              </button>
            )}
          </motion.div>

          {photos.length === 0 && isAdmin && (
            <div className="mb-10 rounded-md border border-dashed border-stone-300 bg-white px-6 py-10 text-center">
              <p className="text-stone-600 mb-2">No photos tagged for this work yet.</p>
              <p className="text-stone-500 text-sm">
                Click <strong>Add a photo to this work</strong> above. In EL admin, find or
                upload your photo, then add the <code className="font-mono bg-stone-100 px-1.5 py-0.5 rounded">Milk Crate Pavilion</code>{" "}
                tag (or whichever work this is). It'll appear here within a few minutes.
              </p>
            </div>
          )}

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
            {photos.map((photo, i) => (
              <motion.figure
                key={photo.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (i % 9) * 0.04 }}
                className="break-inside-avoid mb-4"
              >
                <div className="group/photo relative overflow-hidden rounded-sm shadow-sm bg-stone-200 animate-pulse [&:has(img.loaded)]:animate-none">
                  <img
                    src={optimize(photo.src, "thumb")}
                    alt={photo.altText ?? photo.title ?? slug}
                    loading="lazy"
                    decoding="async"
                    onLoad={(e) => e.currentTarget.classList.add("loaded")}
                    className="w-full h-auto block hover:scale-[1.02] transition-transform duration-500"
                  />
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => removeFromWorkMutation.mutate({ work: slug, mediaId: photo.id })}
                      disabled={removeFromWorkMutation.isPending}
                      className="absolute right-3 top-3 rounded-full bg-white/92 px-3 py-1.5 text-xs font-semibold text-stone-800 opacity-0 shadow-md transition hover:bg-white hover:text-red-700 disabled:opacity-60 group-hover/photo:opacity-100"
                    >
                      Remove from this work
                    </button>
                  )}
                </div>
              </motion.figure>
            ))}
          </div>
          {isAdmin && (
            <HarvestPhotoPicker
              open={pickerOpen}
              onOpenChange={setPickerOpen}
              defaultWorkSlug={slug}
              onPick={async (photo) => {
                await addToWorkMutation.mutateAsync({
                  work: slug,
                  mediaIds: [photo.mediaAssetId],
                });
                setPickerOpen(false);
              }}
            />
          )}
        </div>
      </div>
    </section>
  );
}

function isImageMediaSrc(src?: string | null) {
  if (!src) return false;
  return !/\.(mp4|mov|m4v|webm|avi)$/i.test(src.split("?")[0]);
}

type JournalBucket = "past" | "present" | "forthcoming";

const PRESENT_WINDOW_DAYS = 30;

function bucketForArticle(publishedAt: string): JournalBucket {
  const now = Date.now();
  const t = new Date(publishedAt).getTime();
  if (Number.isNaN(t)) return "past";
  if (t > now) return "forthcoming";
  if (now - t <= PRESENT_WINDOW_DAYS * 24 * 60 * 60 * 1000) return "present";
  return "past";
}

function formatJournalDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

/**
 * Journal — chronological library of articles syndicated to The Harvest with
 * primaryProject matching this work. Filter chips: All / Past / Now / Coming.
 * The work's living narrative lives here.
 */
function WorkJournalSection({ slug, workTitle }: { slug: string; workTitle: string }) {
  const [filter, setFilter] = useState<"all" | JournalBucket>("all");
  const query = trpc.blog.list.useQuery({ project: slug, limit: 50 });
  const articles = query.data?.articles ?? [];

  // Hide the section entirely when there's nothing to show
  if (query.isLoading || articles.length === 0) return null;

  const grouped: Record<JournalBucket, typeof articles> = {
    forthcoming: [],
    present: [],
    past: [],
  };
  for (const a of articles) {
    grouped[bucketForArticle(a.publishedAt)].push(a);
  }
  // Sort: forthcoming asc by date, present + past desc
  grouped.forthcoming.sort((a, b) => +new Date(a.publishedAt) - +new Date(b.publishedAt));
  grouped.present.sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
  grouped.past.sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));

  const visible = filter === "all"
    ? [
        ...grouped.forthcoming.map((a) => ({ a, b: "forthcoming" as JournalBucket })),
        ...grouped.present.map((a) => ({ a, b: "present" as JournalBucket })),
        ...grouped.past.map((a) => ({ a, b: "past" as JournalBucket })),
      ]
    : grouped[filter].map((a) => ({ a, b: filter as JournalBucket }));

  const counts = {
    all: articles.length,
    past: grouped.past.length,
    present: grouped.present.length,
    forthcoming: grouped.forthcoming.length,
  };

  return (
    <section className="py-20 md:py-24 bg-stone-100 border-t border-stone-200">
      <div className="container">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeInUp} className="mb-10 max-w-2xl">
            <p className="font-mono text-amber-700 text-sm mb-3 uppercase tracking-[0.2em]">
              Blog · {articles.length}
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-800">
              The narrative of {workTitle}.
            </h2>
            <p className="mt-3 text-stone-600 leading-relaxed">
              Past dispatches, what's happening now, and what's coming next. Every
              article on the Harvest site whose primary project is this work, in
              order.
            </p>
          </motion.div>

          {/* Filter chips */}
          <div className="flex flex-wrap gap-2 mb-8">
            {(["all", "past", "present", "forthcoming"] as const).map((b) => {
              const active = filter === b;
              const label = { all: "All", past: "Past", present: "Now", forthcoming: "Coming" }[b];
              return (
                <button
                  key={b}
                  type="button"
                  onClick={() => setFilter(b)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    active
                      ? "bg-stone-800 text-amber-300 border-stone-800"
                      : "bg-white text-stone-700 border-stone-300 hover:bg-stone-50"
                  }`}
                >
                  {label} <span className="ml-1 text-stone-400">·</span>
                  <span className={`ml-1 ${active ? "text-amber-200" : "text-stone-400"}`}>{counts[b]}</span>
                </button>
              );
            })}
          </div>

          {visible.length === 0 ? (
            <p className="text-stone-500 italic py-10 text-center">
              Nothing in this window yet. Try another filter.
            </p>
          ) : (
            <ol className="relative border-l-2 border-amber-400/40 ml-3 space-y-8">
              {visible.map(({ a, b }, i) => (
                <motion.li
                  key={a.id}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (i % 8) * 0.04 }}
                  className="relative pl-8"
                >
                  <span className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full ring-4 ring-stone-100 ${
                    b === "forthcoming" ? "bg-amber-300" : b === "present" ? "bg-emerald-500" : "bg-stone-400"
                  }`} />
                  <div className="grid md:grid-cols-[140px_1fr] gap-x-6 gap-y-2">
                    <div>
                      <p className="font-mono text-xs uppercase tracking-wider text-stone-500">
                        {formatJournalDate(a.publishedAt)}
                      </p>
                      <p className={`font-mono text-[10px] uppercase tracking-wider mt-1 ${
                        b === "forthcoming" ? "text-amber-700" : b === "present" ? "text-emerald-700" : "text-stone-400"
                      }`}>
                        {b === "forthcoming" ? "Coming" : b === "present" ? "Now" : "Past"} · {a.articleType ?? "dispatch"}
                      </p>
                    </div>
                    <Link href={`/blog/${a.slug}`} className="group block">
                      <h3 className="font-serif text-xl md:text-2xl font-bold text-stone-800 leading-snug group-hover:text-amber-700 transition-colors">
                        {a.title}
                      </h3>
                      {a.subtitle && (
                        <p className="text-stone-600 italic leading-snug mt-1">{a.subtitle}</p>
                      )}
                      {a.excerpt && (
                        <p className="text-stone-700 mt-2 leading-relaxed line-clamp-2">{a.excerpt}</p>
                      )}
                      <p className="mt-2 inline-flex items-center gap-1.5 text-amber-700 text-sm font-medium group-hover:gap-2.5 transition-all">
                        Read
                        <ArrowRight className="h-3.5 w-3.5" />
                      </p>
                    </Link>
                  </div>
                </motion.li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </section>
  );
}

function Section({
  label,
  body,
  slot,
  tone = "light",
}: {
  label: string;
  body: string;
  /** When provided, body becomes admin-editable and persists to image_overrides' sibling table image content. */
  slot?: string;
  tone?: "light" | "dark";
}) {
  const isDark = tone === "dark";
  const bodyClass = `text-xl md:text-2xl leading-relaxed ${isDark ? "text-stone-100" : "text-stone-800"}`;
  return (
    <section className={`py-20 md:py-24 ${isDark ? "bg-stone-900 text-white" : ""}`}>
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeInUp}>
            <p className={`font-mono text-sm mb-4 uppercase tracking-[0.2em] ${isDark ? "text-amber-400" : "text-amber-700"}`}>
              {label}
            </p>
            {slot ? (
              <EditableText
                page="works"
                slot={slot}
                defaultContent={body}
                as="p"
                className={bodyClass}
                multiline
              />
            ) : (
              <p className={bodyClass}>{body}</p>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
