import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Check,
  ClipboardList,
  Hammer,
  Mail,
  Map,
  MapPin,
  Menu,
  Milk,
  Music,
  Store,
  Table2,
  TreePine,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { HarvestImage } from "@/components/HarvestImage";
import { trpc } from "@/lib/trpc";

type ReviewColumn = {
  label: string;
  title: string;
  points: string[];
};

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

type EventDetail = {
  label: string;
  value: string;
  detail: string;
  icon: typeof Calendar;
};

type NewsletterInterest =
  | "events"
  | "workshops"
  | "markets"
  | "venue-hire"
  | "garden-centre"
  | "food-kitchen";

const eventDetails: EventDetail[] = [
  {
    label: "date",
    value: "Saturday 20 June 2026",
    detail: "Community celebration day.",
    icon: Calendar,
  },
  {
    label: "time",
    value: "10am to 3pm",
    detail: "Soft program, music, food, walks and work notes.",
    icon: Music,
  },
  {
    label: "place",
    value: "9 Gumland Drive, Witta",
    detail: "The Harvest, on Jinibara Country.",
    icon: MapPin,
  },
  {
    label: "focus",
    value: "Register below",
    detail: "Put your name down for the day and the build notes.",
    icon: Users,
  },
];

const reviewColumns: ReviewColumn[] = [
  {
    label: "full idea",
    title: "a garden, kitchen and art space, staged honestly",
    points: [
      "The full Harvest idea is still simple: Garden grows, Kitchen feeds, Art Space makes.",
      "This round is the Garden: seedlings, beds, soil, shade and paths until July.",
      "The first build pieces are the timber walkways and giant milk crate pavilion for events, music and gathering.",
      "The longer build is kitchen, art, events and community space, but we should not make it sound ready yet.",
    ],
  },
  {
    label: "register for 20 June",
    title: "put your name down for the community day",
    points: [
      "Saturday 20 June 2026, 10am to 3pm, at 9 Gumland Drive, Witta.",
      "The day is a community celebration and working open day, not a polished venue reveal.",
      "The garden is the focus until July. Kitchen, art, events and community space are part of the longer build.",
      "Register below so we can send the useful details before the gate opens.",
    ],
  },
  {
    label: "longer term",
    title: "a living collection place for Witta",
    points: [
      "Dairy shows up now through the milk crate pavilion, milk bar thinking and the district's food history.",
      "Timber shows up now through the walkways, old material, Barry's shed, tools and Witta sawmill memory.",
      "Co-op interest shows up now through a local produce shelf, shared tools and a shop people can help shape.",
      "The newsletter will carry progress photos, works updates, event notes and short Witta stories as they are ready.",
    ],
  },
];

const threads: Thread[] = [
  {
    title: "timber",
    room: "paths and art space",
    image: "/images/compendium/barry/IMG_5745.jpg",
    alt: "Barry beside old machinery at The Harvest",
    note: "Story in progress: we are tracing the full St Mary's and Witta timber source trail.",
    body: "The garden walkways are being built with timber taken from St Mary's Cathedral in Sydney. We are tracing the story that some of that timber began in the Witta region before it travelled south and came back as part of the new paths.",
    ideas: [
      "Walk the first path sections on 20 June.",
      "See the timber as material, memory and a practical way through the garden.",
      "Bring sawmill leads, timber hands, story leads, tools, or a memory from the ridge.",
      "Follow the timber register as we name where each piece came from and where it lands.",
    ],
    icon: Hammer,
    color: "#8B4A2A",
  },
  {
    title: "dairy",
    room: "pavilion and food",
    image: "/images/witta/history/teutoburg-cheese-making-1899.png",
    alt: "Historical cheese making at Teutoburg, Blackall Range, circa 1899",
    note: "Historical image: Teutoburg cheese making, Blackall Range, circa 1899.",
    body: "The milk crates are becoming more than storage. The first pavilion uses the crate as a working object: stacked, carried, borrowed, returned, and turned into shade for events, music, play, meals and gathering.",
    ideas: [
      "Stand under the first pavilion structure as it is being built.",
      "Bring milk crates, dairy family photos, local memories, or a hand with the build.",
      "Follow the milk bar and kitchen tests as the food side comes into view.",
      "See how a dairy object becomes seating, shade, storage, wayfinding and story.",
    ],
    icon: Milk,
    color: "#C4922A",
  },
  {
    title: "co-operatives",
    room: "shop and table",
    image: "/images/compendium/team-garden-selfie.jpg",
    alt: "People gathered in the garden at The Harvest",
    note: "Co-op is a working interest here, not a legal claim yet.",
    body: "The co-op interest starts with useful things: a local produce shelf, shared tools, open books, working bees, and a table people can actually sit at.",
    ideas: [
      "Tell us what you would put on the first shelf.",
      "Bring growers, makers, cooks, gardeners, repairers and people who know how to run the plain systems.",
      "Follow the path from garden produce to shop table to future kitchen.",
      "Help shape the practical model before anyone gives it a formal name.",
    ],
    icon: Table2,
    color: "#3B5563",
  },
];

const workUpdates: WorkUpdate[] = [
  {
    slot: "garden-area",
    workSlug: "the-garden",
    status: "in progress",
    title: "garden area until July",
    room: "garden",
    image: "/images/compendium/sophie-garden.jpg",
    alt: "Sophie working in the garden at The Harvest",
    body: "The whole site is moving, but the public work until July is the garden: beds, paths, play, pavilion, shade, produce, and weekly hands in the soil.",
    ask: "Bring gloves, seedlings, mulch, tools, or two spare hours.",
  },
  {
    slot: "milk-crate-pavilion",
    workSlug: "milk-crate-pavilion",
    status: "building",
    title: "giant milk crate pavilion",
    room: "garden pavilion",
    image: "/images/sketches/milk-crate-pavilion-01.jpg",
    alt: "Concept sketch for the milk crate pavilion",
    body: "A large pavilion made from milk crates. A roof and frame for events, music, play, talks, shared meals, shade and the dairy story.",
    ask: "Bring milk crates, scaffold leads, shade ideas, music, or a practical fix.",
  },
  {
    slot: "timber-walkways",
    workSlug: "the-cedar",
    status: "story",
    title: "St Mary's timber walkways",
    room: "garden paths",
    image: "/images/compendium/barry/IMG_5699.jpg",
    alt: "Barry working in the shed",
    body: "Walkways made from timber taken from St Mary's Cathedral in Sydney. We are tracing the Witta-origin story as part of the timber register.",
    ask: "Bring source leads, timber hands, labels, tools, or a local sawmill memory.",
  },
  {
    slot: "kids-playground",
    workSlug: "the-garden",
    status: "co-design",
    title: "kids playground",
    room: "garden",
    image: "/images/site-plan/inspiration/log-climbing-frame.jpeg",
    alt: "Log climbing frame reference for the kids playground",
    body: "A play area shaped with local kids, not designed over their heads. The kids should help decide what belongs there and what it should feel like.",
    ask: "Bring kids' ideas, logs, safe materials, shade, seating, or someone who can build with care.",
  },
  {
    slot: "co-op-shop",
    workSlug: "the-shop",
    status: "shop test",
    title: "co-op type shop",
    room: "whole site",
    image: "/images/local-produce.jpg",
    alt: "Local produce gathered for a Harvest food story",
    body: "A local produce shop idea: a place for nearby growers, makers, cooks, gardeners and neighbours to put real things on the first shelf.",
    ask: "Bring produce ideas, shelf ideas, growers, makers, prices, and the plain systems that make it work.",
  },
  {
    slot: "future-kitchen-food-loop",
    workSlug: "the-shop",
    status: "future loop",
    title: "future kitchen food loop",
    room: "future kitchen",
    image: "/images/harvest-eat.jpg",
    alt: "Harvest table and food setting",
    body: "The hope is simple: the garden slowly grows into the food story for the future cafe and restaurant space inside.",
    ask: "Bring kitchen growers, chefs, compost thinking, preserving ideas, and honest seasonal limits.",
  },
];

const ideaGroups: IdeaGroup[] = [
  {
    title: "progress notes",
    icon: Map,
    ideas: [
      "What changed in the garden this week.",
      "What is ready to see on 20 June.",
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
    title: "20 June stories",
    icon: Music,
    ideas: [
      "Who came through the gate.",
      "What people noticed first.",
      "What locals brought to the shelf or the build.",
      "What the next working bee needs.",
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

const updateOptions: { id: NewsletterInterest; label: string; body: string }[] = [
  {
    id: "events",
    label: "20 June event",
    body: "registration notes, gate times and open day details",
  },
  {
    id: "workshops",
    label: "timber and making",
    body: "walkways, tools, repair, art and events space work",
  },
  {
    id: "food-kitchen",
    label: "future kitchen",
    body: "long table, milk bar tests, cafe and simple food",
  },
  {
    id: "garden-centre",
    label: "garden build",
    body: "beds, planting, paths, seedlings and weekly work",
  },
  {
    id: "markets",
    label: "co-op shop",
    body: "local produce, shared tools and shelf tests",
  },
];

const pageNavLinks = [
  { label: "20 June", href: "#review" },
  { label: "This Stage", href: "#rooms" },
  { label: "Stories", href: "#threads" },
  { label: "Works", href: "#work" },
  { label: "Updates", href: "#stories" },
];

const fadeInUp = {
  initial: { opacity: 1, y: 0 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-70px" },
  transition: { duration: 0.52 },
};

export default function HarvestReviewTest() {
  useEffect(() => {
    document.title = "The Harvest Witta - 20 June Community Day";
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content =
      "Register for The Harvest Witta community day on 20 June 2026 and follow the Garden, kitchen, art, events and community space as they grow, feed, make and gather local stories.";
  }, []);

  return (
    <main className="min-h-screen bg-[#F5F0E8] text-[#1C1917]">
      <SiteNav />
      <Hero />
      <Review />
      <Threads />
      <WorkNotes />
      <IdeaWall />
      <UpdateForm />
      <Closing />
    </main>
  );
}

function SiteNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-stone-900/10 bg-[#F5F0E8]/96 text-[#1C1917] shadow-[0_10px_30px_rgba(28,25,23,0.08)] backdrop-blur-md">
      <div className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between gap-5 px-5 md:px-8">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-4"
          onClick={closeMenu}
          aria-label="The Harvest home"
        >
          <span className="flex h-12 w-12 shrink-0 overflow-hidden border border-stone-900/10 bg-[#F5F0E8]">
            <img
              src="/images/logo-mono-v1.png"
              alt=""
              className="h-full w-full object-cover object-[50%_33%]"
            />
          </span>
          <span className="grid min-w-0">
            <span className="truncate text-[22px] font-black leading-none tracking-normal text-[#1C1917]">
              The Harvest Witta
            </span>
            <span className="mt-1 truncate text-xs font-semibold tracking-normal text-stone-600">
              Garden first · Kitchen, art, events + community next
            </span>
          </span>
        </Link>

        <nav
          className="hidden items-center gap-1 rounded-full border border-stone-900/10 bg-white/46 p-1 lg:flex"
          aria-label="Page sections"
        >
          {pageNavLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-semibold text-stone-700 transition hover:bg-[#1C1917] hover:text-[#F5F0E8]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/works"
            className="inline-flex min-h-11 items-center justify-center border border-stone-900/14 px-5 py-2 text-sm font-semibold text-[#1C1917] transition hover:border-[#1C1917] hover:bg-white/54"
          >
            All Works
          </Link>
          <a
            href="#updates"
            className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#C4922A] px-5 py-2 text-sm font-bold text-[#1C1917] transition hover:bg-[#DEAD4A]"
          >
            Register
            <Calendar className="h-4 w-4" />
          </a>
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
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="flex min-h-12 items-center border border-stone-900/10 bg-white/46 px-4 text-base font-semibold text-[#1C1917]"
              >
                {link.label}
              </a>
            ))}
            <div className="grid gap-2 pt-2 sm:grid-cols-2">
              <Link
                href="/works"
                onClick={closeMenu}
                className="inline-flex min-h-12 items-center justify-center border border-stone-900/14 px-4 font-semibold text-[#1C1917]"
              >
                Open Works
              </Link>
              <a
                href="#updates"
                onClick={closeMenu}
                className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#C4922A] px-4 font-semibold text-[#1C1917]"
              >
                Register for 20 June
                <Calendar className="h-4 w-4" />
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative min-h-[94vh] overflow-hidden bg-[#1C1917] text-[#F5F0E8]">
      <img
        src="/images/compendium/seed-house-front.jpg"
        alt="The Harvest building in Witta"
        className="absolute inset-0 h-full w-full object-cover opacity-[0.62]"
      />
      <div className="absolute inset-0 bg-[#1C1917]/68" />

      <div className="relative z-10 mx-auto grid min-h-[94vh] max-w-7xl items-end gap-10 px-5 pb-12 pt-28 md:grid-cols-[1fr_0.72fr] md:px-8 md:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.72 }}
          className="max-w-4xl"
        >
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#C4922A]">
            Saturday 20 June 2026 / Witta / Jinibara Country
          </p>
          <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[0.92] tracking-normal md:text-7xl lg:text-8xl">
            The Garden is taking shape.
          </h1>
          <p className="mt-7 max-w-2xl text-xl leading-relaxed text-white/82">
            The Harvest is a garden, kitchen and art space taking shape in Witta:
            a place to grow, feed and make. This round is Garden-first: beds,
            timber paths, the milk crate pavilion, kids playground and a co-op shop
            test. The longer build is kitchen, art, events and community space.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#updates"
              className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#C4922A] px-6 py-3 font-semibold text-[#1C1917] transition hover:bg-[#DEAD4A]"
            >
              Register for 20 June
              <Calendar className="h-4 w-4" />
            </a>
            <a
              href="#work"
              className="inline-flex min-h-12 items-center justify-center gap-2 border border-white/34 px-6 py-3 font-semibold text-white transition hover:border-white hover:bg-white/10"
            >
              See the works
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.72, delay: 0.12 }}
          id="rooms"
          className="scroll-mt-28 grid gap-3"
        >
          {[
            ["Now", "Garden area", "seedlings, beds, soil and shade"],
            ["Building", "Paths + pavilion", "timber walkways and the giant milk crate roof"],
            ["Next", "Play + shop", "kids playground and co-op produce shelf"],
          ].map(([tag, title, body]) => (
            <div key={title} className="border border-white/18 bg-white/8 p-5 backdrop-blur">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#C4922A]">
                {tag}
              </p>
              <h2 className="mt-2 text-2xl font-black">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-white/72">{body}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Review() {
  return (
    <section id="review" className="scroll-mt-24 bg-[#F5F0E8] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <motion.div {...fadeInUp} className="mb-10 grid gap-6 md:grid-cols-[0.82fr_1fr] md:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#8B4A2A]">
              20 June community day
            </p>
            <h2 className="mt-3 max-w-2xl text-4xl font-black leading-[0.96] md:text-6xl">
              Come through the gate and see what is being made.
            </h2>
          </div>
          <p className="max-w-2xl text-lg leading-relaxed text-stone-700 md:justify-self-end">
            The Harvest is opening the first version to the community on Saturday
            20 June. You will be able to walk the Garden, see the works in progress,
            and understand how the longer kitchen, art, events and community space is beginning to form.
          </p>
        </motion.div>

        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {eventDetails.map((detail) => {
            const Icon = detail.icon;
            return (
              <motion.article
                key={detail.label}
                {...fadeInUp}
                className="border border-stone-300/80 bg-[#FFFDF7] p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8B4A2A]">
                    {detail.label}
                  </p>
                  <Icon className="h-5 w-5 text-[#4A6741]" />
                </div>
                <h3 className="mt-3 text-2xl font-black leading-tight">{detail.value}</h3>
                <p className="mt-3 text-sm leading-relaxed text-stone-600">{detail.detail}</p>
              </motion.article>
            );
          })}
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {reviewColumns.map((column) => (
            <motion.article
              key={column.title}
              {...fadeInUp}
              className="border border-stone-300/80 bg-[#FFFDF7] p-6"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#8B4A2A]">
                {column.label}
              </p>
              <h3 className="mt-3 text-2xl font-black leading-tight">{column.title}</h3>
              <ul className="mt-5 space-y-4 text-sm leading-relaxed text-stone-700">
                {column.points.map((point) => (
                  <li key={point} className="grid grid-cols-[auto_1fr] gap-3">
                    <Check className="mt-0.5 h-4 w-4 text-[#4A6741]" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
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
            Dairy, timber and co-op history are part of the experience.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/70">
            These are not themes sitting on a wall. They show up as crates, timber,
            tools, produce, shop shelves, paths, meals and stories people can add to.
          </p>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-3">
          {threads.map((thread) => {
            const Icon = thread.icon;
            return (
              <motion.article
                key={thread.title}
                {...fadeInUp}
                className="overflow-hidden border border-white/14 bg-white/6"
              >
                <div className="aspect-[4/3] overflow-hidden bg-stone-800">
                  <img
                    src={thread.image}
                    alt={thread.alt}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-6">
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
                  <p className="mt-3 leading-relaxed text-white/74">{thread.body}</p>
                  <ul className="mt-5 space-y-3 text-sm leading-relaxed text-white/68">
                    {thread.ideas.map((idea) => (
                      <li key={idea} className="border-t border-white/12 pt-3">
                        {idea}
                      </li>
                    ))}
                  </ul>
                  <SourceNote>{thread.note}</SourceNote>
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
  return (
    <section id="work" className="scroll-mt-24 bg-[#F5F0E8] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <motion.div {...fadeInUp} className="mb-10 grid gap-6 md:grid-cols-[0.88fr_1fr] md:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#8B4A2A]">
              works in progress
            </p>
            <h2 className="mt-3 max-w-2xl text-4xl font-black leading-[0.96] md:text-6xl">
              See the works, photos and updates as they move.
            </h2>
          </div>
          <p className="max-w-2xl text-lg leading-relaxed text-stone-700 md:justify-self-end">
            Until July, the garden area carries the public work. These are the first
            works to follow: what is being made, what changed, and what help is useful now.
          </p>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-2">
          {workUpdates.map((item) => (
            <motion.article
              key={item.title}
              {...fadeInUp}
              className="grid overflow-hidden border border-stone-300/80 bg-[#FFFDF7] md:grid-cols-[0.78fr_1fr]"
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
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-[#C4922A] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#1C1917]">
                      {item.status}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-500">
                      {item.room}
                    </span>
                  </div>
                  <h3 className="mt-4 text-3xl font-black leading-tight">{item.title}</h3>
                  <p className="mt-4 leading-relaxed text-stone-700">{item.body}</p>
                </div>
                <p className="mt-6 border-t border-stone-200 pt-4 text-sm font-semibold leading-relaxed text-[#4A6741]">
                  Ask: {item.ask}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
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
            The newsletter should not be noise. It should carry progress photos,
            short notes, useful asks, and the local stories, objects and memories that
            belong with the Garden, kitchen, art, events and community space.
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

function UpdateForm() {
  const subscribe = trpc.newsletter.subscribe.useMutation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<NewsletterInterest[]>([
    "events",
    "food-kitchen",
    "garden-centre",
  ]);
  const [submitted, setSubmitted] = useState(false);
  const [submittedForEvent, setSubmittedForEvent] = useState(false);

  const toggleInterest = (id: NewsletterInterest) => {
    setSelectedInterests((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const eventSelected = selectedInterests.includes("events");
  const followOptions = updateOptions.filter((option) => option.id !== "events");
  const canSubmit = name.trim().length > 0 && email.trim().length > 0 && !subscribe.isPending;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    const [firstName, ...rest] = name.trim().split(/\s+/);
    const wantsEvent = selectedInterests.includes("events");

    try {
      await subscribe.mutateAsync({
        email: email.trim(),
        phone: phone.trim() || null,
        firstName,
        lastName: rest.join(" ") || undefined,
        source: wantsEvent
          ? "Harvest June 20 event registration"
          : "Harvest public newsletter signup",
        interests: selectedInterests,
      });
      setSubmittedForEvent(wantsEvent);
      setSubmitted(true);
      toast.success(wantsEvent ? "Registered for 20 June updates." : "Saved for Harvest updates.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Please try again later.";
      toast.error("Could not save this yet", { description: message });
    }
  };

  return (
    <section id="updates" className="scroll-mt-24 bg-[#3B5563] py-16 text-white md:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-[0.86fr_1.14fr] md:px-8">
        <motion.div {...fadeInUp}>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#C4922A]">
            register and follow
          </p>
          <h2 className="mt-3 max-w-xl text-4xl font-black leading-[0.96] md:text-6xl">
            Register for 20 June and get the build notes.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/76">
            Put your name down for the community day. We will also send the useful
            notes as this Garden round takes shape: pavilion, timber paths, kids
            playground, co-op shop and the first hints of the long-table food loop.
          </p>
          <div className="mt-8 grid gap-3 text-sm leading-relaxed text-white/70">
            <p className="border-l-2 border-[#C4922A] pl-4">
              Event: Saturday 20 June 2026, 10am to 3pm.
            </p>
            <p className="border-l-2 border-[#C4922A] pl-4">
              Place: 9 Gumland Drive, Witta, on Jinibara Country.
            </p>
            <p className="border-l-2 border-[#C4922A] pl-4">
              Bring: hands, stories, produce, crates, timber, tools, or time.
            </p>
          </div>
        </motion.div>

        <motion.div {...fadeInUp} className="border border-white/16 bg-[#F5F0E8] p-5 text-[#1C1917] md:p-7">
          {submitted ? (
            <div className="flex min-h-[420px] flex-col justify-center text-center">
              <Check className="mx-auto h-12 w-12 text-[#4A6741]" />
              <h3 className="mt-5 text-3xl font-black">
                {submittedForEvent ? "You are on the 20 June list." : "You are on the newsletter list."}
              </h3>
              <p className="mx-auto mt-3 max-w-md leading-relaxed text-stone-700">
                We will send the useful notes: event details, beds, crates, timber,
                playground, produce, stories and the next practical ask.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mx-auto mt-8 inline-flex min-h-11 items-center justify-center gap-2 border border-stone-900/30 px-5 py-2.5 font-semibold text-stone-900 transition hover:bg-stone-900/[0.08]"
              >
                Add another person
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold">
                  Name
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="min-h-12 border border-stone-300 bg-white px-4 text-base outline-none focus:border-[#8B4A2A]"
                    placeholder="First and last"
                    required
                    maxLength={120}
                  />
                </label>
                <label className="grid gap-2 text-sm font-semibold">
                  Email
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="min-h-12 border border-stone-300 bg-white px-4 text-base outline-none focus:border-[#8B4A2A]"
                    placeholder="you@example.com"
                    required
                    maxLength={180}
                  />
                </label>
              </div>

              <label className="grid gap-2 text-sm font-semibold">
                Phone, optional
                <input
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="min-h-12 border border-stone-300 bg-white px-4 text-base outline-none focus:border-[#8B4A2A]"
                  placeholder="04..."
                  maxLength={60}
                />
              </label>

              <fieldset className="space-y-3">
                <legend className="text-sm font-semibold">Register</legend>
                <label
                  className={`grid gap-2 border p-4 transition ${
                    eventSelected
                      ? "border-[#4A6741] bg-[#4A6741]/10"
                      : "border-stone-300 bg-white"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={eventSelected}
                      onChange={() => toggleInterest("events")}
                      className="h-4 w-4 accent-[#4A6741]"
                    />
                    <span className="font-semibold">Register my interest for 20 June</span>
                  </span>
                  <span className="text-sm leading-relaxed text-stone-600">
                    Community celebration and working open day, Saturday 20 June, 10am to 3pm.
                  </span>
                </label>
              </fieldset>

              <fieldset className="space-y-3">
                <legend className="text-sm font-semibold">Also send me updates about</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {followOptions.map((option) => {
                    const checked = selectedInterests.includes(option.id);
                    return (
                      <label
                        key={option.id}
                        className={`grid min-h-[112px] gap-2 border p-4 transition ${
                          checked
                            ? "border-[#4A6741] bg-[#4A6741]/10"
                            : "border-stone-300 bg-white"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleInterest(option.id)}
                            className="h-4 w-4 accent-[#4A6741]"
                          />
                          <span className="font-semibold">{option.label}</span>
                        </span>
                        <span className="text-sm leading-relaxed text-stone-600">
                          {option.body}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <button
                type="submit"
                disabled={!canSubmit}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 bg-[#1C1917] px-6 py-3 font-semibold text-[#F5F0E8] transition hover:bg-[#3D3832] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {subscribe.isPending
                  ? "Saving..."
                  : eventSelected
                    ? "Register and join the list"
                    : "Join the newsletter"}
                <Mail className="h-4 w-4" />
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function Closing() {
  return (
    <section className="relative overflow-hidden bg-[#1C1917] py-16 text-[#F5F0E8] md:py-24">
      <img
        src="/images/compendium/hero-aerial.jpg"
        alt="Aerial view of The Harvest site in Witta"
        className="absolute inset-0 h-full w-full object-cover opacity-[0.24]"
      />
      <div className="absolute inset-0 bg-[#1C1917]/72" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <motion.div {...fadeInUp} className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#C4922A]">
            keep going
          </p>
          <h2 className="mt-3 text-4xl font-black leading-[0.96] md:text-6xl">
            Follow the works as they become real.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/78">
            Start with the garden area, milk crate pavilion, timber walkways,
            kids playground, co-op shop and garden-to-cafe food loop. Each work
            will gather photos, updates, stories and one practical way to help.
            Over time, that becomes part of a living Witta collection.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/works"
              className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#C4922A] px-6 py-3 font-semibold text-[#1C1917] transition hover:bg-[#DEAD4A]"
            >
              See the works
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#updates"
              className="inline-flex min-h-12 items-center justify-center gap-2 border border-white/28 px-6 py-3 font-semibold text-white transition hover:border-white hover:bg-white/10"
            >
              Register for 20 June
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
