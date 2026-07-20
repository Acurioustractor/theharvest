import { useEffect, useState, type KeyboardEvent, type MouseEvent, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  ClipboardList,
  Hammer,
  Map,
  Menu,
  Milk,
  Music,
  Store,
  Table2,
  TreePine,
  Users,
  X,
} from "lucide-react";
import { HarvestImage } from "@/components/HarvestImage";

type Thread = {
  title: string;
  room: string;
  image: string;
  alt: string;
  note: string;
  body: string;
  ideas: string[];
  icon: typeof Hammer;
  color: string;
};

type WorkUpdate = {
  slot: string;
  workSlug?: string;
  status: string;
  title: string;
  room: string;
  image: string;
  alt: string;
  body: string;
  ask: string;
};

type IdeaGroup = {
  title: string;
  icon: typeof ClipboardList;
  ideas: string[];
};

const threads: Thread[] = [
  {
    title: "Timber",
    room: "paths and art spaces",
    image: "/images/optimized/barry-5745-1000.webp",
    alt: "Barry beside old machinery at The Harvest",
    note: "Tracing the St Mary's and Witta timber source trail.",
    body: "Walkways built from St Mary's Cathedral timber. The working question is whether part of that timber began in the Witta region before it travelled south and came back as paths.",
    ideas: [],
    icon: Hammer,
    color: "#8B4A2A",
  },
  {
    title: "Dairy",
    room: "pavilion and food",
    image: "/images/witta/history/optimized/teutoburg-cheese-making-1899-1000.webp",
    alt: "Historical cheese making at Teutoburg, Blackall Range, circa 1899",
    note: "Historical image: Teutoburg, Blackall Range, circa 1899.",
    body: "The milk crate is a working object. Stacked, carried, borrowed, returned. The first pavilion turns it into structure, seating and a frame for community days and gathering.",
    ideas: [],
    icon: Milk,
    color: "#C4922A",
  },
  {
    title: "Co-operatives",
    room: "shop and table",
    image: "/images/optimized/community-gathering-1000.webp",
    alt: "Community gathering at The Harvest Witta",
    note: "A working interest, not a legal claim yet.",
    body: "A local produce shelf, shared tools, open books and a table people can sit at. The co-op interest starts with useful things, not a formal structure.",
    ideas: [],
    icon: Table2,
    color: "#3B5563",
  },
];

const workUpdates: WorkUpdate[] = [
  {
    slot: "garden-area",
    workSlug: "the-garden",
    status: "in progress",
    title: "The Garden",
    room: "garden",
    image: "/images/optimized/sophie-garden-1000.webp",
    alt: "Sophie working in the garden at The Harvest",
    body: "Beds, seedlings, mulch, compost, paths and weekly hands in the soil. The garden carries the public work until July.",
    ask: "Seedlings, mulch, gloves, or two spare hours.",
  },
  {
    slot: "milk-crate-pavilion",
    workSlug: "milk-crate-pavilion",
    status: "building",
    title: "Milk Crate Pavilion",
    room: "garden pavilion",
    image: "/images/optimized/gathering-recap-crowd-1200.webp",
    alt: "People gathered at The Harvest during the milk crate pavilion build",
    body: "A pavilion frame made from milk crates, scaffold and salvaged timber. Built for community days, music, meals and gathering.",
    ask: "Practical fixes, shade, seating, planting and hands.",
  },
  {
    slot: "timber-walkways",
    workSlug: "the-cedar",
    status: "making",
    title: "The Garden Paths",
    room: "garden paths",
    image: "/images/optimized/barry-5745-1000.webp",
    alt: "Reclaimed timber connected to the garden paths at The Harvest",
    body: "Walkways from St Mary's Cathedral timber, returning to Witta as garden paths. The source trail is still being followed.",
    ask: "Sawmill leads, timber hands, or a local memory.",
  },
  {
    slot: "kids-playground",
    workSlug: "kids-area",
    status: "co-design",
    title: "Kids' Area",
    room: "garden",
    image: "/images/optimized/team-garden-selfie-1000.webp",
    alt: "Harvest garden crew gathered at the old nursery site",
    body: "A play area shaped with local kids. They help decide what belongs there, what it should feel like, and what makes them want to come back.",
    ask: "Kids' ideas, logs, shade, or someone who builds with care.",
  },
  {
    slot: "co-op-shop",
    workSlug: "the-shop",
    status: "shop test",
    title: "The Shop",
    room: "whole site",
    image: "/images/optimized/local-produce-760.webp",
    alt: "Local produce gathered for a Harvest food story",
    body: "A small shared shelf test for growers, makers and neighbours. Real things, plain systems, low overhead.",
    ask: "Growers, makers, prices, and the plain systems.",
  },
  {
    slot: "the-milk-man",
    workSlug: "the-milk-man",
    status: "standing now",
    title: "The Milk Man",
    room: "front gate",
    image: "/images/optimized/member-welcome-crates-1200.webp",
    alt: "Milk crates stacked at The Harvest",
    body: "A milk crate sentinel at the front of The Harvest. Part sign, part marker, part joke with a serious dairy backbone.",
    ask: "Help name him properly, or photograph him in every light.",
  },
];

const ideaGroups: IdeaGroup[] = [
  {
    title: "progress notes",
    icon: Map,
    ideas: [
      "What changed in the garden this week.",
      "What is ready to show at the next community day.",
      "Which jobs need hands, materials or local knowledge.",
      "Photos from the beds, paths, pavilion and shop table.",
    ],
  },
  {
    title: "timber coming home",
    icon: Hammer,
    ideas: [
      "The St Mary's timber story as it is verified.",
      "Where each walkway section lands in the garden.",
      "Barry's shed, tools and local making memory.",
      "Calls for timber hands, labels and source leads.",
    ],
  },
  {
    title: "dairy and crates",
    icon: BookOpen,
    ideas: [
      "How the milk crate pavilion is being made.",
      "Dairy family memories, photos and local food history.",
      "Milk bar and kitchen tests as they begin.",
      "Ways to lend crates, hands, shade ideas or music.",
    ],
  },
  {
    title: "community day stories",
    icon: Music,
    ideas: [
      "Who came through the gate.",
      "What people noticed first.",
      "What locals brought to the shelf or the build.",
      "What the next work day needs.",
    ],
  },
  {
    title: "co-op shop test",
    icon: Store,
    ideas: [
      "What locals already grow, cook, make or repair.",
      "What could go on the first shelf.",
      "How prices, payments, stock and trust might work.",
      "How the garden can support the shop over time.",
    ],
  },
  {
    title: "garden to table",
    icon: TreePine,
    ideas: [
      "What is growing now.",
      "What can realistically feed the future kitchen.",
      "Compost, preserving, herbs, seedlings and seasonal limits.",
      "The long path from garden bed to plate.",
    ],
  },
  {
    title: "kids and play",
    icon: Users,
    ideas: [
      "Kids marking what they want to climb, hide in, build or change.",
      "Safe materials, shade, seating and logs.",
      "Parents and builders helping without taking over.",
      "Updates on what the kids choose next.",
    ],
  },
];

const pageNavLinks = [
  { label: "About", href: "/what-is-the-harvest" },
  { label: "Works", href: "/works" },
  { label: "Shop", href: "/shop" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const footerLinks = [
  { label: "About", href: "/what-is-the-harvest" },
  { label: "Works", href: "/works" },
  { label: "Shop", href: "/shop" },
  { label: "Blog", href: "/blog" },
  { label: "Membership", href: "/membership" },
  { label: "Witta", href: "/witta" },
  { label: "People", href: "/people" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
];

export const harvestButtonClasses = {
  primary:
    "inline-flex min-h-12 items-center justify-center gap-2 bg-[#C4922A] px-6 py-3 font-semibold text-[#1C1917] transition hover:bg-[#DEAD4A] focus:outline-none focus:ring-2 focus:ring-[#C4922A] focus:ring-offset-2 focus:ring-offset-[#F5F0E8]",
  secondary:
    "inline-flex min-h-12 items-center justify-center gap-2 border border-stone-900/24 px-6 py-3 font-semibold text-[#1C1917] transition hover:bg-white/62 focus:outline-none focus:ring-2 focus:ring-[#C4922A] focus:ring-offset-2 focus:ring-offset-[#F5F0E8]",
  dark:
    "inline-flex min-h-12 items-center justify-center gap-2 bg-[#1C1917] px-6 py-3 font-semibold text-[#F5F0E8] transition hover:bg-[#3D3832] focus:outline-none focus:ring-2 focus:ring-[#C4922A] focus:ring-offset-2 focus:ring-offset-[#F5F0E8]",
  onDark:
    "inline-flex min-h-12 items-center justify-center gap-2 border border-white/28 px-6 py-3 font-semibold text-white transition hover:border-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#C4922A] focus:ring-offset-2 focus:ring-offset-[#1C1917]",
  text:
    "inline-flex items-center gap-2 text-sm font-bold text-[#8B4A2A] underline-offset-4 transition hover:text-[#1C1917] hover:underline",
} as const;

const fadeInUp = {
  initial: { opacity: 1, y: 0 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-70px" },
  transition: { duration: 0.52 },
};

export default function HarvestReviewTest() {
  useEffect(() => {
    document.title = "The Harvest Witta · Grow. Make. Gather.";
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content =
      "The Harvest is a garden, kitchen and art space taking shape in Witta on Jinibara Country. Built in public with real photos, real work, and practical asks.";
  }, []);

  return (
    <main className="min-h-screen bg-[#F5F0E8] text-[#1C1917]">
      <SiteNav />
      <Hero />
      <WhatThisIs />
      <PlacePhotoTwo />
      <Threads />
      <WorkNotes />
      <EventCallout />
      <Closing />
      <SiteFooter />
    </main>
  );
}

export function SiteNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-stone-900/10 bg-[#F5F0E8]/96 text-[#1C1917] shadow-[0_10px_30px_rgba(28,25,23,0.08)] backdrop-blur-md">
      <div className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between gap-5 px-5 md:px-8">
        <Link
          href="/"
          className="flex min-w-0 items-center"
          onClick={closeMenu}
          aria-label="The Harvest home"
        >
          <img
            src="/images/the-harvest-witta-logo.png"
            alt="The Harvest Witta logo"
            className="h-14 w-auto shrink-0 md:h-16"
          />
        </Link>

        <nav
          className="hidden items-center gap-7 lg:flex"
          aria-label="Page sections"
        >
          {pageNavLinks.map((link) => (
            link.href.startsWith("#") ? (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-stone-700 transition hover:text-[#1C1917]"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-stone-700 transition hover:text-[#1C1917]"
              >
                {link.label}
              </Link>
            )
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/membership"
            className="inline-flex min-h-11 items-center justify-center bg-[#C4922A] px-6 py-2 text-sm font-bold text-[#1C1917] transition hover:bg-[#DEAD4A]"
          >
            Become a member
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center border border-stone-900/16 text-[#1C1917] transition hover:bg-white/60 lg:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-stone-900/10 bg-[#F5F0E8] px-5 py-4 lg:hidden">
          <nav className="mx-auto grid max-w-7xl gap-2" aria-label="Mobile page sections">
            {pageNavLinks.map((link) => (
              link.href.startsWith("#") ? (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className="flex min-h-12 items-center border border-stone-900/10 bg-white/46 px-4 text-base font-semibold text-[#1C1917]"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className="flex min-h-12 items-center border border-stone-900/10 bg-white/46 px-4 text-base font-semibold text-[#1C1917]"
                >
                  {link.label}
                </Link>
              )
            ))}
            <div className="pt-2">
              <Link
                href="/membership"
                onClick={closeMenu}
                className="flex min-h-12 items-center justify-center bg-[#C4922A] px-4 font-bold text-[#1C1917]"
              >
                Become a member
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-stone-900/10 bg-[#F5F0E8] text-[#1C1917]">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:grid-cols-[1fr_1.4fr] md:px-8 md:py-12">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#8B4A2A]">
            The Harvest Witta
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-stone-600">
            Grow. Make. Gather. A garden and creative gathering place taking shape on Jinibara Country.
          </p>
          <p className="mt-5 text-xs leading-relaxed text-stone-500">
            9 Gumland Drive, Witta QLD 4552
          </p>
          <p className="mt-1 text-xs leading-relaxed text-stone-500">
            © {new Date().getFullYear()} The Harvest Witta. All rights reserved.
          </p>
        </div>
        <nav className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Footer">
          {footerLinks.map((link) => (
            link.href.includes("#") ? (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-stone-700 underline-offset-4 hover:text-[#1C1917] hover:underline"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-stone-700 underline-offset-4 hover:text-[#1C1917] hover:underline"
              >
                {link.label}
              </Link>
            )
          ))}
        </nav>
      </div>
    </footer>
  );
}

function Hero() {
  return (
    <section id="top" className="relative min-h-[78svh] overflow-hidden bg-[#1C1917] text-[#F5F0E8] md:min-h-[94vh]">
      <img
        src="/images/optimized/seed-house-front-1600.webp"
        alt="The Harvest building in Witta"
        className="absolute inset-0 h-full w-full object-cover object-[58%_62%] opacity-[0.62] md:object-center"
      />
      <div className="absolute inset-0 bg-[#1C1917]/68" />

      <div className="relative z-10 mx-auto flex min-h-[78svh] max-w-5xl flex-col justify-center px-5 pb-10 pt-28 md:min-h-[94vh] md:justify-end md:px-8 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.72 }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#C4922A]">
            Witta · Jinibara Country · Garden opening end of June
          </p>
          <h1 className="mt-6 text-6xl font-black leading-[0.92] tracking-normal md:text-8xl lg:text-[8.5rem]">
            The Harvest
          </h1>
          <h2 className="mt-6 text-2xl font-semibold tracking-wide text-[#C4922A] md:text-3xl">
            Grow. Make. Gather.
          </h2>
          <h3 className="mt-8 max-w-3xl text-xl font-normal leading-relaxed text-white/85 md:text-2xl">
            A community garden and creative gathering place taking shape in Witta.
          </h3>

          <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/what-is-the-harvest"
              className={harvestButtonClasses.primary}
            >
              Learn about The Harvest
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function WhatThisIs() {
  return (
    <section className="bg-[#F5F0E8] px-5 py-14 md:px-8 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-[1fr_1.2fr] md:gap-20">
          <div />
          <div className="space-y-5 text-lg leading-relaxed text-stone-700">
            <p>
              The Harvest is taking shape on Jinibara Country, on land with a long
              Indigenous history before any industry arrived. The more recent story
              of this ridge runs through dairy, timber, co-operatives, and the hands
              that worked them.
            </p>
            <p>
              The site was known as Green Harvest, a nursery remembered by local
              gardeners and seed buyers. The works being made here now carry that
              growing history forward: a garden in the spirit of the farms and
              orchards that once held this ground, a milk crate pavilion that nods to
              the dairy industry, paths that hold the timber story, and a shop that
              begins with the co-op spirit still in the room.
            </p>
            <p>
              Art sits at the centre, not as decoration, but as how a place
              understands itself. The works represent this moment in Witta history.
            </p>
            <p>
              The hope is that The Harvest becomes a place where the Witta
              community and visitors come to grow, make, and gather: to celebrate
              together what has been made.
            </p>
            <Link
              href="/what-is-the-harvest"
              className={harvestButtonClasses.secondary}
            >
              Learn about The Harvest
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function PlacePhoto() {
  return (
    <HarvestImage
      page="new-look-test"
      slot="place-main"
      src="/images/optimized/gathering-recap-crowd-1200.webp"
      alt="Milk crate pavilion build at The Harvest, Witta"
      size="hero"
      className="h-[50vh] w-full"
      imgClassName="h-full w-full object-cover"
    />
  );
}

function PlacePhotoTwo() {
  return (
    <HarvestImage
      page="new-look-test"
      slot="place-second"
      src="/images/optimized/sophie-garden-1000.webp"
      alt="Hands at work in the garden at The Harvest, Witta"
      size="hero"
      className="h-[50vh] w-full"
      imgClassName="h-full w-full object-cover"
    />
  );
}

function Threads() {
  return (
    <section id="threads" className="scroll-mt-24 bg-[#1C1917] py-16 text-[#F5F0E8] md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <motion.div {...fadeInUp} className="mb-10 max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#C4922A]">
            local industry threads
          </p>
          <h2 className="mt-3 text-4xl font-black leading-[0.96] md:text-6xl">
            The place has a history. The works carry it forward.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/70">
            Dairy, timber, co-operatives. Not themes on a wall.
          </p>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-3">
          {threads.map((thread) => {
            const Icon = thread.icon;
            return (
              <motion.article
                key={thread.title}
                {...fadeInUp}
                className="flex flex-col overflow-hidden border border-white/14 bg-white/6"
              >
                <HarvestImage
                  page="new-look-test"
                  slot={`thread-${thread.title.toLowerCase()}`}
                  src={thread.image}
                  alt={thread.alt}
                  size="card"
                  className="aspect-[4/3] overflow-hidden bg-stone-800"
                  imgClassName="h-full w-full object-cover"
                />
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center justify-between gap-4">
                    <span
                      className="inline-flex h-10 w-10 items-center justify-center text-white"
                      style={{ backgroundColor: thread.color }}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/48">
                      {thread.room}
                    </p>
                  </div>
                  <h3 className="mt-5 text-3xl font-black">{thread.title}</h3>
                  <p className="mt-3 flex-1 leading-relaxed text-white/74">{thread.body}</p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function WorkNotes() {
  const [, navigate] = useLocation();

  const openWork = (item: WorkUpdate) => {
    if (item.workSlug) navigate(`/works/${item.workSlug}`);
  };

  return (
    <section id="work" className="scroll-mt-24 bg-[#F5F0E8] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <motion.div {...fadeInUp} className="mb-10 grid gap-6 md:grid-cols-[0.88fr_1fr] md:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#8B4A2A]">
              works in progress
            </p>
            <h2 className="mt-3 max-w-2xl text-4xl font-black leading-[0.96] md:text-6xl">
              See the works as they move.
            </h2>
          </div>
          <div className="max-w-2xl md:justify-self-end">
            <p className="text-lg leading-relaxed text-stone-700">
              The garden is the public focus until July: beds, paths, pavilion, kids area, shop test and the Milk Man at the gate.
            </p>
            <Link
              href="/works"
              className={`mt-5 ${harvestButtonClasses.dark}`}
            >
              See all works
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-2">
          {workUpdates.map((item) => (
            <motion.article
              key={item.title}
              {...fadeInUp}
              role={item.workSlug ? "link" : undefined}
              tabIndex={item.workSlug ? 0 : undefined}
              onClick={(event: MouseEvent<HTMLElement>) => {
                if (!isInteractiveTarget(event.target)) openWork(item);
              }}
              onKeyDown={(event: KeyboardEvent<HTMLElement>) => {
                if ((event.key === "Enter" || event.key === " ") && !isInteractiveTarget(event.target)) {
                  event.preventDefault();
                  openWork(item);
                }
              }}
              className="grid cursor-pointer overflow-hidden border border-stone-300/80 bg-[#FFFDF7] transition hover:-translate-y-0.5 hover:border-[#C4922A] hover:shadow-lg md:grid-cols-[0.78fr_1fr]"
            >
              <HarvestImage
                page="new-look-test"
                slot={`${item.slot}-card`}
                defaultWorkSlug={item.workSlug}
                src={item.image}
                alt={item.alt}
                size="card"
                className="min-h-[260px] bg-stone-200"
                imgClassName="h-full w-full object-cover"
              />
              <div className="flex flex-col justify-between p-6">
                <div>
                  <span className="inline-block bg-[#C4922A] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#1C1917]">
                    {item.status}
                  </span>
                  <h3 className="mt-4 text-3xl font-black leading-tight">{item.title}</h3>
                  <p className="mt-4 leading-relaxed text-stone-700">{item.body}</p>
                </div>
                <div className="mt-6 border-t border-stone-200 pt-4">
                  <p className="text-sm font-semibold leading-relaxed text-[#4A6741]">
                    {item.ask}
                  </p>
                  {item.workSlug && (
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#8B4A2A]">
                      See this work
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function isInteractiveTarget(target: EventTarget | null) {
  return target instanceof HTMLElement && Boolean(target.closest("a,button,input,textarea,select,[role='button']"));
}

function IdeaWall() {
  return (
    <section id="stories" className="scroll-mt-24 bg-[#B58B70] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <motion.div {...fadeInUp} className="mb-10 max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone-950/64">
            stories as we go
          </p>
          <h2 className="mt-3 text-4xl font-black leading-[0.96] text-stone-950 md:text-6xl">
            The stories become a living collection for Witta.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-stone-950/72">
            Not noise. Progress photos, short notes, useful asks and the local stories that belong here.
          </p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ideaGroups.map((group) => {
            const Icon = group.icon;
            return (
              <motion.article
                key={group.title}
                {...fadeInUp}
                className="border border-stone-950/20 bg-[#F5F0E8] p-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black">{group.title}</h3>
                  <Icon className="h-5 w-5 text-[#8B4A2A]" />
                </div>
                <ul className="mt-5 space-y-3 text-sm leading-relaxed text-stone-700">
                  {group.ideas.map((idea) => (
                    <li key={idea} className="border-t border-stone-300 pt-3">
                      {idea}
                    </li>
                  ))}
                </ul>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function EventCallout() {
  return (
    <section id="updates" className="scroll-mt-24 bg-[#3B5563] py-16 text-white md:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-[0.86fr_1.14fr] md:px-8">
        <motion.div {...fadeInUp}>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#C4922A]">
            Membership updates · community day
          </p>
          <h2 className="mt-3 max-w-xl text-4xl font-black leading-[0.96] md:text-6xl">
            Become a member for the longer build, and the next community day.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/76">
            Membership is free. It gives you weekly updates, community-day invites, first-access opportunities and a simple way to ask questions. When the community day around the end of June lands, members hear the details first.
          </p>
        </motion.div>

        <motion.div {...fadeInUp} className="grid gap-4">
          <Link
            href="/membership"
            className="flex min-h-[260px] flex-col justify-between border border-white/16 bg-[#1C1917]/52 p-6 text-white transition hover:-translate-y-1 hover:bg-[#1C1917]/72"
          >
            <span>
              <Users className="h-8 w-8 text-[#C4922A]" />
              <span className="mt-5 block font-mono text-[11px] uppercase tracking-[0.18em] text-white/52">
                membership
              </span>
              <span className="mt-3 block text-3xl font-black leading-tight">
                Become a free Harvest member.
              </span>
              <span className="mt-4 block text-sm leading-relaxed text-white/72">
                Get the weekly member update, community-day invites, first-access opportunities and a simple way to ask questions.
              </span>
            </span>
            <span className="mt-8 inline-flex items-center gap-2 font-semibold">
              Become a member
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function Closing() {
  return (
    <section className="relative overflow-hidden bg-[#1C1917] py-16 text-[#F5F0E8] md:py-24">
      <img
        src="/images/optimized/hero-aerial-1400.webp"
        alt="Aerial view of The Harvest site in Witta"
        className="absolute inset-0 h-full w-full object-cover opacity-[0.24]"
      />
      <div className="absolute inset-0 bg-[#1C1917]/72" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <motion.div {...fadeInUp} className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#C4922A]">
            Coming soon · community day
          </p>
          <h2 className="mt-3 text-4xl font-black leading-[0.96] md:text-6xl">
            Come through the gate and see what is being made.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/78">
            We're working toward a community open day around the end of June. Walk the garden, see the works in progress, and get a clear picture of what is being built next. Date and time being confirmed.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/works"
              className={harvestButtonClasses.primary}
            >
              See the works
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function SourceNote({ children }: { children: ReactNode }) {
  return (
    <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-white/42">
      {children}
    </p>
  );
}
