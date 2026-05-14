import { useEffect } from "react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { harvestButtonClasses, SiteFooter, SiteNav } from "./HarvestReviewTest";

const sections = [
  {
    title: "What we collect",
    body:
      "When you use a Harvest form, we may collect your name, email, phone number, interests, questions, comments, shop interest details, or Witta memory contributions. We also receive basic website analytics and technical information from normal site hosting.",
  },
  {
    title: "Why we collect it",
    body:
      "We use this information to reply, send Harvest updates, manage the member list, understand shop interest, review community memories before publishing, and keep the website working.",
  },
  {
    title: "Where it is stored",
    body:
      "Harvest website form data may be stored in the website database, Supabase, GoHighLevel, or connected Harvest operating tools. We keep the system practical and use access controls where the tools allow it.",
  },
  {
    title: "What we publish",
    body:
      "We do not publish personal contact details. Witta memories, photos, names, and local stories are reviewed before publication. If a story, image, or person is sensitive, it stays internal until permission is clear.",
  },
  {
    title: "Your choices",
    body:
      "You can ask to update, correct, or remove your details from the Harvest list. You can also ask us not to publish a contribution or to remove something you supplied.",
  },
];

export default function Privacy() {
  useEffect(() => {
    document.title = "Privacy · The Harvest Witta";

    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content =
      "Plain privacy notes for The Harvest Witta member list, contact forms, shop interest forms, and community memory contributions.";
  }, []);

  return (
    <main className="min-h-screen bg-[#F5F0E8] text-[#1C1917]">
      <SiteNav />
      <section className="px-5 pb-14 pt-36 md:px-8 md:pb-20 md:pt-44">
        <div className="mx-auto max-w-4xl">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#8B4A2A]">
            Privacy
          </p>
          <h1 className="mt-4 max-w-3xl text-5xl font-black leading-[0.92] md:text-7xl">
            Plain notes on what we collect.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-stone-700 md:text-xl">
            The short version: we collect the details you give us so we can reply,
            keep you close to The Harvest, and review contributions before anything
            becomes public.
          </p>
          <p className="mt-4 text-sm text-stone-500">Last updated 14 May 2026.</p>
        </div>
      </section>

      <section className="border-y border-stone-300/70 bg-[#FFFDF7] px-5 py-12 md:px-8 md:py-16">
        <div className="mx-auto grid max-w-4xl gap-5">
          {sections.map((section) => (
            <article key={section.title} className="border border-stone-300 bg-[#F5F0E8] p-6">
              <h2 className="text-2xl font-black">{section.title}</h2>
              <p className="mt-3 leading-relaxed text-stone-700">{section.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-5 py-14 md:px-8 md:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-black">Contact</h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-stone-700">
            For privacy requests, corrections, or removal, contact The Harvest directly.
          </p>
          <Link href="/contact" className={`mt-7 ${harvestButtonClasses.primary}`}>
            Contact The Harvest
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
