import { useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { HarvestImage } from "@/components/HarvestImage";
import {
  ArrowRight,
  Calendar,
  Camera,
  Hammer,
  MapPin,
  Sprout,
  Users,
} from "lucide-react";

type Room = {
  name: string;
  verb: string;
  body: string;
  image: string;
  alt: string;
  icon: typeof Sprout;
  accent: string;
};

type Proof = {
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  alt: string;
  credit?: string;
};

type Ask = {
  title: string;
  body: string;
};

const rooms: Room[] = [
  {
    name: "Garden",
    verb: "Grow",
    body: "Beds, nursery life, working bees, kids, soil, and food in the ground.",
    image: "/images/compendium/sophie-garden.jpg",
    alt: "Sophie working in the garden at The Harvest",
    icon: Sprout,
    accent: "#4A6741",
  },
  {
    name: "Kitchen",
    verb: "Feed",
    body: "A long table, simple food, milk bar thinking, pop-ups, and local producers.",
    image: "/images/witta/history/teutoburg-cheese-making-1899.png",
    alt: "Historical cheese making at Teutoburg, Blackall Range, circa 1899",
    icon: Users,
    accent: "#C4922A",
  },
  {
    name: "Art Space",
    verb: "Make",
    body: "Tools, workshops, residencies, repair, timber, and walls that can change.",
    image: "/images/compendium/barry/IMG_5745.jpg",
    alt: "Barry at the workbench in the shed",
    icon: Hammer,
    accent: "#8B4A2A",
  },
];

const proofItems: Proof[] = [
  {
    eyebrow: "Timber",
    title: "The shed remembers work.",
    body: "Barry's machinery, local timber, pit-sawn stories, and new hands in the room. The art space starts with tools, not decoration.",
    image: "/images/compendium/barry/IMG_5699.jpg",
    alt: "Inside Barry's shed at The Harvest",
  },
  {
    eyebrow: "Dairy",
    title: "The crates carry the dairy thread.",
    body: "The milk crate pavilion takes a plain object from the dairy economy and turns it into the first shared roof.",
    image: "/images/witta/history/teutoburg-cheese-making-1899.png",
    alt: "Historical cheese making at Teutoburg, Blackall Range, circa 1899",
    credit: "Queensland State Archives source image, citation to confirm before public use.",
  },
  {
    eyebrow: "Co-operatives",
    title: "The table comes before the structure.",
    body: "Shared tools, open books, local help, and a practical question: what can this place hold if people build the first version together?",
    image: "/images/community-gathering.jpg",
    alt: "Community gathering at The Harvest Witta",
  },
];

const asks: Ask[] = [
  {
    title: "Hands",
    body: "People who can help plant, carry, clean, build, cook, sort, paint, repair, or welcome.",
  },
  {
    title: "Materials",
    body: "Old timber, milk crates, tools, garden gear, tables, chairs, and useful things with a story.",
  },
  {
    title: "Stories",
    body: "Witta photos, dairy memories, timber stories, co-op records, and names we should know.",
  },
];

const fadeInUp = {
  initial: { opacity: 1, y: 0 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.55 },
};

function SourceNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-3 max-w-xl font-mono text-[10px] uppercase tracking-[0.14em] text-stone-500">
      {children}
    </p>
  );
}

export default function LaunchRedesign() {
  useEffect(() => {
    document.title = "The Harvest Witta · Launch Redesign Prototype";
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content =
      "A photo-led redesign prototype for The Harvest Witta, built around the real place, real people, and Witta history.";
  }, []);

  return (
    <main className="min-h-screen bg-[#F5F0E8] text-[#1C1917]">
      <Hero />
      <Rooms />
      <WittaThread />
      <WorksProof />
      <LaunchAsk />
      <Closing />
    </main>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[92vh] overflow-hidden bg-stone-950 text-[#F5F0E8]">
      <img
        src="/images/compendium/hero-aerial.jpg"
        alt="Aerial view of The Harvest site in Witta"
        className="absolute inset-0 h-full w-full object-cover opacity-[0.58]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-stone-950/78 via-stone-950/44 to-stone-950/8" />
      <div className="absolute inset-x-0 top-0 z-10 border-b border-white/12 bg-stone-950/28 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <Link href="/" className="font-mono text-xs uppercase tracking-[0.22em] text-white/74">
            The Harvest Witta
          </Link>
          <nav className="hidden items-center gap-6 font-mono text-[11px] uppercase tracking-[0.16em] text-white/66 md:flex">
            <a href="#rooms" className="hover:text-white">
              Rooms
            </a>
            <a href="#witta" className="hover:text-white">
              Witta
            </a>
            <a href="#works" className="hover:text-white">
              Works
            </a>
            <a href="#support" className="hover:text-white">
              Support
            </a>
          </nav>
        </div>
      </div>

      <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl items-end px-5 pb-14 pt-28 md:px-8 md:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75 }}
          className="max-w-4xl"
        >
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.24em] text-[#C4922A]">
            Witta · Jinibara Country · Launch readiness 20 June 2026
          </p>
          <h1 className="max-w-4xl text-[clamp(3.4rem,8vw,7.6rem)] font-black leading-[0.9] tracking-normal">
            Garden.
            <br />
            Kitchen.
            <br />
            Art Space.
          </h1>
          <p className="mt-7 max-w-2xl text-xl leading-relaxed text-white/84 md:text-2xl">
            A working place for growing, feeding, making, and gathering in Witta.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#support"
              className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#C4922A] px-6 py-3 font-semibold text-stone-950 transition hover:bg-[#E0AD43]"
            >
              Help build the first version
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#witta"
              className="inline-flex min-h-12 items-center justify-center gap-2 border border-white/34 px-6 py-3 font-semibold text-white transition hover:border-white hover:bg-white/10"
            >
              Follow the Witta thread
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Rooms() {
  return (
    <section id="rooms" className="bg-[#F5F0E8] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <motion.div {...fadeInUp} className="mb-10 grid gap-6 md:grid-cols-[0.82fr_1fr] md:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#8B4A2A]">
              The simple spine
            </p>
            <h2 className="mt-3 text-4xl font-black leading-[0.96] md:text-6xl">
              Three rooms. One place.
            </h2>
          </div>
          <p className="max-w-2xl text-lg leading-relaxed text-stone-700 md:justify-self-end">
            The Harvest becomes legible when it stops trying to explain everything. Grow,
            feed, make. The rest can gather around that.
          </p>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-3">
          {rooms.map((room) => {
            const Icon = room.icon;
            return (
              <motion.article
                key={room.name}
                {...fadeInUp}
                className="group overflow-hidden border border-stone-300/70 bg-[#FFFDF7]"
              >
                <div className="aspect-[4/3] overflow-hidden bg-stone-200">
                  <img
                    src={room.image}
                    alt={room.alt}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <span
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white"
                      style={{ backgroundColor: room.accent }}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="font-mono text-xs uppercase tracking-[0.18em] text-stone-500">
                      {room.verb}
                    </span>
                  </div>
                  <h3 className="text-3xl font-black">{room.name}</h3>
                  <p className="mt-3 leading-relaxed text-stone-700">{room.body}</p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function WittaThread() {
  return (
    <section id="witta" className="bg-[#1C1917] py-16 text-[#F5F0E8] md:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-[1.05fr_0.95fr] md:px-8">
        <motion.div {...fadeInUp}>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#C4922A]">
            Witta thread
          </p>
          <h2 className="mt-3 max-w-2xl text-4xl font-black leading-[0.96] md:text-6xl">
            The launch story is timber, dairy, and co-operatives.
          </h2>
          <div className="mt-8 space-y-5 text-lg leading-relaxed text-stone-200">
            <p>
              The Harvest should not borrow history as wallpaper. It should put the
              history to work.
            </p>
            <p>
              Old timber becomes seats, rails, tables, and workbenches. Dairy crates
              become a pavilion. Co-operative memory becomes a table people can sit at
              before anyone pretends the structure is finished.
            </p>
          </div>
          <div className="mt-9 grid gap-3 sm:grid-cols-3">
            {["Timber", "Dairy", "Co-operatives"].map((word) => (
              <div key={word} className="border border-white/18 p-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/54">
                  Thread
                </p>
                <p className="mt-1 text-xl font-black">{word}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.figure {...fadeInUp} className="self-start">
          <div className="overflow-hidden border border-white/16 bg-white/5">
            <img
              src="/images/witta/history/teutoburg-farm-couple-corn-1899.png"
              alt="Couple with tall corn at Manitzky's Farm, Teutoburg, circa 1899"
              className="h-full max-h-[720px] w-full object-cover"
            />
          </div>
          <SourceNote>
            Historical source: Queensland State Archives image 2383, citation to confirm
            before public release.
          </SourceNote>
        </motion.figure>
      </div>
    </section>
  );
}

function WorksProof() {
  return (
    <section id="works" className="bg-[#F5F0E8] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <motion.div {...fadeInUp} className="mb-10 max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#8B4A2A]">
            Proof before polish
          </p>
          <h2 className="mt-3 text-4xl font-black leading-[0.96] md:text-6xl">
            The website should show work already happening.
          </h2>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-3">
          {proofItems.map((item) => (
            <motion.article
              key={item.title}
              {...fadeInUp}
              className="overflow-hidden border border-stone-300/70 bg-[#FFFDF7]"
            >
              <HarvestImage
                page="launch-redesign"
                slot={`thread-${item.eyebrow.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                src={item.image}
                alt={item.alt}
                size="card"
                className="aspect-[5/4] overflow-hidden bg-stone-200"
                imgClassName="h-full w-full object-cover"
              />
              <div className="p-6">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#8B4A2A]">
                  {item.eyebrow}
                </p>
                <h3 className="mt-3 text-2xl font-black leading-tight">{item.title}</h3>
                <p className="mt-4 leading-relaxed text-stone-700">{item.body}</p>
                {item.credit && <SourceNote>{item.credit}</SourceNote>}
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div {...fadeInUp} className="mt-8 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <figure className="border border-stone-300/70 bg-white p-4">
            <img
              src="/images/compendium/MASTER FLOOR PLAN.png"
              alt="Master floor plan for The Harvest"
              className="max-h-[520px] w-full object-contain"
            />
            <SourceNote>Floor plan source: Harvest design material, credit to confirm.</SourceNote>
          </figure>
          <div className="flex flex-col justify-between border border-stone-300/70 bg-[#3B5563] p-7 text-white md:p-10">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#F5F0E8]/68">
                First screen
              </p>
              <h3 className="mt-4 max-w-xl text-3xl font-black leading-tight md:text-5xl">
                Show the place before asking people to believe in it.
              </h3>
            </div>
            <ul className="mt-8 grid gap-3 text-lg text-white/84">
              <li>Garden, Kitchen, Art Space visible in the first scroll.</li>
              <li>Real photos before abstract claims.</li>
              <li>One practical ask in every major section.</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function LaunchAsk() {
  return (
    <section id="support" className="bg-[#B58B70] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <motion.div {...fadeInUp}>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone-950/64">
              The ask
            </p>
            <h2 className="mt-3 text-4xl font-black leading-[0.96] text-stone-950 md:text-6xl">
              Help build what opens first.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-stone-950/78">
              By 20 June, the site, deck, and social story need to say the same thing:
              come see what is taking shape, and bring something useful if you can.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="mailto:hello@theharvestwitta.com.au?subject=I can help The Harvest"
                className="inline-flex min-h-12 items-center justify-center gap-2 bg-stone-950 px-6 py-3 font-semibold text-[#F5F0E8] transition hover:bg-stone-800"
              >
                Say what you can bring
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href="/garden-launch"
                className="inline-flex min-h-12 items-center justify-center gap-2 border border-stone-950/36 px-6 py-3 font-semibold text-stone-950 transition hover:bg-stone-950/8"
              >
                See the launch page
              </Link>
            </div>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-3">
            {asks.map((ask) => (
              <motion.article
                key={ask.title}
                {...fadeInUp}
                className="min-h-[260px] border border-stone-950/20 bg-[#F5F0E8] p-6"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500">
                  Useful
                </p>
                <h3 className="mt-3 text-3xl font-black text-stone-950">{ask.title}</h3>
                <p className="mt-4 leading-relaxed text-stone-700">{ask.body}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Closing() {
  return (
    <section className="relative overflow-hidden bg-stone-950 py-16 text-white md:py-24">
      <img
        src="/images/community-gathering.jpg"
        alt="Community gathering at The Harvest Witta"
        className="absolute inset-0 h-full w-full object-cover opacity-28"
      />
      <div className="absolute inset-0 bg-stone-950/62" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <motion.div {...fadeInUp} className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#C4922A]">
            Next screen
          </p>
          <h2 className="mt-3 text-4xl font-black leading-[0.96] md:text-6xl">
            Come see what is taking shape.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/78">
            The first version opens with what is already here: garden beds, old timber,
            milk crates, a shed, a table, and neighbours who want to help shape it.
          </p>
          <div className="mt-8 grid gap-3 font-mono text-xs uppercase tracking-[0.16em] text-white/64 sm:grid-cols-3">
            <p className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#C4922A]" />
              20 June 2026
            </p>
            <p className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#C4922A]" />
              9 Gumland Drive
            </p>
            <p className="inline-flex items-center gap-2">
              <Camera className="h-4 w-4 text-[#C4922A]" />
              Real photos only
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
