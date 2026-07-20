import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowRight, CalendarDays, HandHeart, Store, Users, Utensils, Warehouse } from "lucide-react";
import { SiteFooter, SiteNav, harvestButtonClasses } from "./HarvestReviewTest";
import { fetchHarvestPublicSocialPosts } from "@/lib/api";
import { setPageSeo } from "@/lib/seo";
import { trackedPath } from "@/lib/tracking";

const paths = [
  { title: "Visit this weekend", body: "See the current opening times, DIY pizza sessions and gatherings before you leave home.", href: trackedPath("/whats-on", "visit"), action: "See what is on", icon: Utensils, colour: "bg-[#C4922A]" },
  { title: "Lend a hand", body: "Garden jobs, working days and practical help. Come for ten minutes or two hours.", href: trackedPath("/get-involved?form=volunteer", "volunteer"), action: "Offer some help", icon: HandHeart, colour: "bg-[#4A6741] text-white" },
  { title: "Host something", body: "Bring a workshop, dinner, performance, meeting or small gathering into the place.", href: trackedPath("/venue-hire", "host"), action: "Talk about hosting", icon: Warehouse, colour: "bg-[#3B5563] text-white" },
  { title: "Grow or make locally", body: "Put produce, food or useful local goods forward for the shared shelf and future shop.", href: trackedPath("/get-involved?form=business-interest", "supply"), action: "Put something forward", icon: Store, colour: "bg-[#8B4A2A] text-white" },
  { title: "Become a member", body: "Membership is free. Get dates, work-day calls and invitations first.", href: trackedPath("/membership#join", "join"), action: "Join The Harvest", icon: Users, colour: "bg-[#B58B70]" },
  { title: "Share a story", body: "Tell us about Witta, a craft, a memory or a person whose work should be carried forward.", href: trackedPath("/get-involved?form=story-feature", "story"), action: "Start a story", icon: CalendarDays, colour: "bg-[#3D3832] text-white" },
] as const;

export default function StartHere() {
  const social = useQuery({
    queryKey: ["harvest-public-social", 6],
    queryFn: () => fetchHarvestPublicSocialPosts(6),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    setPageSeo({
      title: "Start here · The Harvest Witta",
      description: "Visit, lend a hand, host something, supply local goods or become a member of The Harvest in Witta.",
      path: "/start",
    });
  }, []);

  return (
    <main className="min-h-screen bg-[#F5F0E8] text-[#1C1917]">
      <SiteNav />
      <section className="border-b border-stone-900/10 px-5 pb-16 pt-36 md:px-8 md:pb-24 md:pt-44">
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#8B4A2A]">Witta · Jinibara Country</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[0.94] sm:text-6xl lg:text-8xl">Start where you are.</h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-stone-700 sm:text-xl">Visit for pizza. Pull weeds for an hour. Bring a workshop. Put something local on the shelf. There is more than one way into The Harvest.</p>
        </div>
      </section>

      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-px overflow-hidden border border-stone-900/14 bg-stone-900/14 md:grid-cols-2 lg:grid-cols-3">
          {paths.map(({ title, body, href, action, icon: Icon, colour }) => (
            <Link key={title} href={href} className="group flex min-h-72 flex-col bg-[#F5F0E8] p-7 transition hover:bg-white md:p-9">
              <div className={`flex h-12 w-12 items-center justify-center ${colour}`}><Icon className="h-5 w-5" /></div>
              <h2 className="mt-8 text-2xl font-black">{title}</h2>
              <p className="mt-3 leading-relaxed text-stone-600">{body}</p>
              <span className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-bold text-[#8B4A2A]">{action}<ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-[#1C1917] px-5 py-16 text-[#F5F0E8] md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-5 border-b border-white/15 pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#C4922A]">From the gate</p>
              <h2 className="mt-3 text-3xl font-black sm:text-5xl">What has been happening</h2>
            </div>
            <a href="https://www.instagram.com/theharvestwitta/" target="_blank" rel="noreferrer" className={harvestButtonClasses.onDark}>See Instagram</a>
          </div>
          {social.isLoading && <p className="py-12 text-stone-400">Loading the latest notes...</p>}
          {social.isError && <p className="py-12 text-stone-400">The latest notes are taking a moment. The rest of the page still works.</p>}
          {social.data && (
            <div className="grid gap-px bg-white/15 md:grid-cols-2 lg:grid-cols-3">
              {social.data.map((post) => (
                <article key={post.id} className="flex min-h-72 flex-col bg-[#1C1917] py-8 md:p-8">
                  <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.16em] text-stone-500"><span>{post.platform}</span><time>{new Date(post.published_at).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}</time></div>
                  <p className="mt-6 line-clamp-6 whitespace-pre-line leading-relaxed text-stone-200">{post.message || "A note from The Harvest."}</p>
                  {post.permalink && <a href={post.permalink} target="_blank" rel="noreferrer" className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-bold text-[#C4922A]">Open the post<ArrowRight className="h-4 w-4" /></a>}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
