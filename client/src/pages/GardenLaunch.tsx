import { useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { MEMBERS_PAGE_URL } from "@/lib/links";
import {
  ArrowRight,
  Calendar,
  MapPin,
  Users,
  Sprout,
  Lightbulb,
  Carrot,
  MessageSquare,
  PackageOpen,
  Hammer,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { VisitStrip } from "@/components/VisitStrip";

const SUPPLY_URL = "/shop"; // shop EOI: interest:markets + role:supplier
const IDEA_URL = "/get-involved?form=idea"; // deep-links straight to the idea form

const EVENT = {
  date: "Saturday 20 June 2026",
  what: "First members and makers day",
  address: "9 Gumland Drive, Witta QLD 4552",
  shortAddress: "9 Gumland Drive, Witta · 10 min from Maleny",
  acknowledgement: "Jinibara Country",
};

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6 },
};

const workBlocks = [
  {
    icon: PackageOpen,
    title: "The Milk Crate Pavilion",
    image: "/images/membership/member-welcome-crates.jpg",
    imageAlt: "Milk crates stacked at The Harvest under the open sky",
    body: "A giant crate under the pecans. Part shelter, part dairy memory, part useful argument about what a community place can be built from by many hands.",
  },
  {
    icon: Users,
    title: "The Milk Man",
    image: "/images/social/harvest-social-card.jpg",
    imageAlt: "The Milk Man made from milk crates at the front of The Harvest",
    body: "A figure at the gate, made to be noticed from the road. Some people love him. Some people do not. Good. He is already pulling the room into conversation.",
  },
  {
    icon: MessageSquare,
    title: "The question wall",
    image: "/images/photo-wall-sign.png",
    imageAlt: "The Harvest photo wall sign asking what people would love to see grow here",
    body: "A wall that asks what this place should hold, what it should not become, and what you are ready to make with us. The questions are still open.",
  },
];

const nextSteps = [
  {
    icon: MapPin,
    title: "Come and have a look",
    body: "You do not need to book to come and have a look while we find our feet. Walk the garden, sit near the pavilion, say hello if someone is about.",
    cta: "Get directions",
    href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("9 Gumland Drive, Witta QLD 4552")}`,
    external: true,
  },
  {
    icon: Users,
    title: "Join the members page",
    body: "Membership is free. It is where upcoming events land first, where you RSVP, and where you can message us directly. Members hear first, every time.",
    cta: "Join the members page",
    href: MEMBERS_PAGE_URL,
    external: true,
  },
  {
    icon: Sprout,
    title: "Come to a work day",
    body: "The garden grows through regular work days: small jobs, rough edges, soil and signs. Members hear when the next one is on.",
    cta: "Hear about work days",
    href: "/membership",
    external: false,
  },
  {
    icon: Carrot,
    title: "Put something on the shelf",
    body: "The first shop shelves are being shaped with local makers and growers. An expression of interest starts a proper conversation.",
    cta: "Start the conversation",
    href: SUPPLY_URL,
    external: false,
  },
];

const waysIn = [
  {
    icon: Carrot,
    title: "Something to grow or make?",
    body: "The shelf fills with local hands. Tell us here.",
    cta: "Put something on the shelf",
    href: SUPPLY_URL,
    external: false,
  },
  {
    icon: Lightbulb,
    title: "An idea for the place?",
    body: "A maker day, a work day, the kids' corner, something we haven't thought of.",
    cta: "Share an idea",
    href: IDEA_URL,
    external: false,
  },
];

/*
 * PHOTO SLOT — temporary stand-ins only.
 * These are existing site images holding the layout. Replace all three with
 * real photos from the 20 June members and makers day once they are collected
 * (update src + alt together; alt text must describe the actual photo).
 */
const photoSlots = [
  {
    src: "/images/membership/member-welcome-crates.jpg",
    alt: "Milk crates stacked at The Harvest",
  },
  {
    src: "/images/harvest-grow.jpg",
    alt: "The garden at The Harvest",
  },
  {
    src: "/images/harvest-gather.jpg",
    alt: "The long table at The Harvest",
  },
];

export default function GardenLaunch() {
  useEffect(() => {
    document.title = "20 June 2026 · The day the gate opened · The Harvest, Witta";
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content =
      "The Harvest opened with a first members and makers day on Saturday 20 June 2026, in Witta on Jinibara Country. The garden, events and art space is now properly under way. Come and have a look, join the free members page, or put something on the shelf.";
  }, []);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero */}
      <section className="relative py-24 md:py-32 bg-stone-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <video
            src="/images/compendium/hero-aerial.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <p className="font-mono text-amber-300 text-sm mb-4 uppercase tracking-[0.25em]">
              {EVENT.date} · Witta · {EVENT.acknowledgement}
            </p>
            <p className="font-serif text-2xl md:text-3xl text-amber-200 mb-2">
              The Harvest Witta
            </p>
            <h1 className="text-5xl md:text-7xl font-serif font-bold leading-[0.95] mb-6">
              The gate opened. <span className="text-amber-400">Now the work starts.</span>
            </h1>
            <p className="text-xl md:text-2xl text-stone-200 italic font-serif leading-snug max-w-2xl mx-auto mb-6">
              The Harvest opened with a first members and makers day on
              Saturday 20 June 2026. From the first of July, the place is
              properly under way.
            </p>
            <p className="text-stone-300 max-w-2xl mx-auto mb-10">
              A community garden and creative gathering place in Witta, on
              Jinibara Country. The Milk Man is still at the gate. The Milk
              Crate Pavilion is still under the pecans. The rest is being made,
              week by week.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <a
                href={MEMBERS_PAGE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-amber-500 text-stone-900 font-semibold hover:bg-amber-400 transition-colors"
              >
                Join the members page
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(EVENT.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-stone-500 text-stone-100 hover:bg-stone-800 transition-colors"
              >
                <MapPin className="h-4 w-4" />
                Get directions
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick facts */}
      <section className="py-12 md:py-16 bg-stone-100 border-b border-stone-200">
        <div className="container">
          <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-6 text-center">
            <Fact icon={Calendar} label="When" value={`Opened ${EVENT.date}`} />
            <Fact icon={Users} label="What" value={EVENT.what} />
            <Fact icon={MapPin} label="Place" value={EVENT.shortAddress} />
          </div>
          <p className="text-center text-stone-500 italic text-sm mt-8">
            We acknowledge the Jinibara people as the Traditional Custodians of
            this Country. The Harvest is being shaped with that in mind.
          </p>
        </div>
      </section>

      {/* What it is */}
      <section className="py-20 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <motion.div {...fadeInUp}>
              <p className="font-mono text-amber-700 text-sm mb-4 uppercase tracking-[0.2em]">
                What it is
              </p>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-stone-800 mb-6 leading-tight">
                An old nursery, asking what it can become.
              </h2>
              <div className="space-y-5 text-lg text-stone-700 leading-relaxed">
                <p>
                  Witta has about 1,300 people and nowhere to stop. No shop in a
                  generation, nowhere to gather. The Harvest is an old nursery on
                  the hill: a rammed earth building and gardens that have grown
                  things here for decades.
                </p>
                <p>
                  On 20 June the gate opened for the first time, for members and
                  makers. Now the place is finding its feet: a garden, a table,
                  and a few practical ways for neighbours to keep coming back.
                </p>
                <p className="font-serif italic text-stone-600">
                  The place is still rough. That is what we are trying to build,
                  together, from here.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What happens next */}
      <section className="py-20 md:py-24 bg-amber-50 border-y border-amber-100">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <motion.div {...fadeInUp} className="mb-10 max-w-3xl">
              <p className="font-mono text-amber-800 text-sm mb-3 uppercase tracking-[0.2em]">
                What happens next
              </p>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-stone-900 leading-tight">
                The gate stays open. Here is the way in.
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-stone-700">
                The first day was the start, not the finish. These are the ways
                to be part of what comes next.
              </p>
            </motion.div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {nextSteps.map((item) => {
                const Icon = item.icon;
                return (
                  <Card key={item.title} className="h-full border border-amber-200 bg-white shadow-none">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-amber-700" />
                      </div>
                      <h3 className="font-serif text-xl font-bold text-stone-900 mb-3">
                        {item.title}
                      </h3>
                      <p className="text-stone-600 leading-relaxed mb-6 flex-1">{item.body}</p>
                      <WayInCta href={item.href} external={item.external} label={item.cta} />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Photos from the day */}
      {/*
        PHOTO SLOT: the three images below are temporary stand-ins from the
        existing site library. Swap in real opening-day photos (with accurate
        alt text) once they are collected. See photoSlots above.
      */}
      <section className="py-20 md:py-24 bg-stone-100">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <motion.div {...fadeInUp} className="mb-12 max-w-2xl">
              <p className="font-mono text-amber-700 text-sm mb-3 uppercase tracking-[0.2em]">
                The place
              </p>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-800">
                The place as it stands.
              </h2>
              <p className="mt-4 text-stone-600 leading-relaxed">
                The old nursery, the lawn and the gardens, as they are right
                now. Rough in places. That is the point.
              </p>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {photoSlots.map((photo, i) => (
                <motion.div
                  key={photo.src}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="aspect-[4/3] overflow-hidden bg-stone-200"
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The works */}
      <section className="py-20 md:py-24 bg-stone-900 text-white">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <motion.div {...fadeInUp} className="mb-12 max-w-3xl">
              <p className="font-mono text-amber-400 text-sm mb-3 uppercase tracking-[0.2em]">
                The first works
              </p>
              <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight">
                The works are not decoration.
              </h2>
              <p className="mt-5 text-stone-300 text-lg leading-relaxed">
                The milk crates are not here to decorate a finished place. They
                are here to start the conversation before the room is settled.
                They make the place a bit strange on purpose. Strange enough to
                stop. Useful enough to gather under.
              </p>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {workBlocks.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                  >
                    <Card className="h-full overflow-hidden border border-stone-700 shadow-none bg-stone-800 text-white">
                      <div className="aspect-[4/3] overflow-hidden bg-stone-950">
                        <img
                          src={item.image}
                          alt={item.imageAlt}
                          className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]"
                          loading="lazy"
                        />
                      </div>
                      <CardContent className="p-6">
                        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-amber-400/15">
                          <Icon className="h-6 w-6 text-amber-300" />
                        </div>
                        <h3 className="font-serif text-xl font-bold mb-3">
                          {item.title}
                        </h3>
                        <p className="text-stone-300 leading-relaxed">{item.body}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/works"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-amber-500 text-stone-900 font-semibold hover:bg-amber-400 transition-colors"
              >
                See the works
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#ways-in"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-stone-600 text-stone-100 hover:bg-stone-800 transition-colors"
              >
                Bring a hand
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Ways in */}
      <section id="ways-in" className="py-20 md:py-28 bg-stone-800 text-white scroll-mt-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <motion.div {...fadeInUp} className="text-center mb-12">
              <p className="font-mono text-amber-400 text-sm mb-3 uppercase tracking-[0.2em]">
                Ways in
              </p>
              <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight">
                Come as you are.
              </h2>
              <p className="mt-4 text-stone-300 max-w-xl mx-auto leading-relaxed">
                You don't have to bring a thing. Come empty-handed, that's the
                whole invitation. If you're the sort who likes to bring
                something, here's where it goes.
              </p>
            </motion.div>
            <div className="grid gap-5 md:grid-cols-2">
              {waysIn.map((w) => {
                const Icon = w.icon;
                return (
                  <Card key={w.title} className="border-0 shadow-xl bg-stone-50 text-stone-800">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-amber-700" />
                      </div>
                      <h3 className="font-serif text-xl font-bold mb-2">{w.title}</h3>
                      <p className="text-stone-600 leading-relaxed mb-6 flex-1">{w.body}</p>
                      <WayInCta href={w.href} external={w.external} label={w.cta} />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* What this is for */}
      <section className="py-20 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <motion.div {...fadeInUp}>
              <p className="font-mono text-amber-700 text-sm mb-4 uppercase tracking-[0.2em]">
                What this is for
              </p>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-stone-800 mb-6 leading-tight">
                A shop that sells what your neighbour grew.
              </h2>
              <div className="space-y-5 text-lg text-stone-700 leading-relaxed">
                <p>
                  Witta hasn't had a shop in a generation. The Harvest is putting
                  one back: a shared shelf for the growers and makers who already
                  live around Witta and Maleny. Not a supermarket, not a boutique.
                  A shelf, kept simple on purpose.
                </p>
                <p>
                  The first shelves are being shaped now, with local hands. You
                  grow it or make it, we hold the shelf.
                </p>
                <p>
                  We hold the shelf for now. One day the town won't need us to.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Connect */}
      <section className="py-16 md:py-20 bg-stone-50 border-t border-stone-200">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <p className="font-mono text-amber-700 text-sm mb-4 uppercase tracking-[0.2em]">
              Stay close
            </p>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-800 mb-4">
              Hear about the next one first.
            </h2>
            <p className="text-stone-600 mb-8 leading-relaxed">
              The members page is where upcoming events land first, and
              membership is free. Or follow along where the photos and
              work-in-progress go.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/membership"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-stone-300 text-stone-700 hover:bg-stone-100 transition-colors"
              >
                Membership
              </Link>
              <a
                href="https://www.instagram.com/theharvestwitta/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-stone-300 text-stone-700 hover:bg-stone-100 transition-colors"
              >
                Instagram
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61587776558599"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-stone-300 text-stone-700 hover:bg-stone-100 transition-colors"
              >
                Facebook
              </a>
              <Link
                href="/works"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-stone-300 text-stone-700 hover:bg-stone-100 transition-colors"
              >
                See the collection
              </Link>
              <Link
                href="/witta"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-stone-300 text-stone-700 hover:bg-stone-100 transition-colors"
              >
                Witta history
              </Link>
            </div>
          </div>
        </div>
      </section>

      <VisitStrip />
    </div>
  );
}

/* ---------- helpers ---------- */

function Fact({ icon: Icon, label, value }: { icon: typeof Calendar; label: string; value: string }) {
  return (
    <div>
      <Icon className="h-5 w-5 text-amber-700 mx-auto mb-2" />
      <p className="font-mono text-stone-400 text-[10px] uppercase tracking-[0.2em] mb-1">
        {label}
      </p>
      <p className="text-stone-800 font-medium">{value}</p>
    </div>
  );
}

function WayInCta({ href, external, label }: { href: string; external: boolean; label: string }) {
  const className =
    "inline-flex min-h-12 w-full items-center justify-center gap-2 bg-amber-500 px-5 py-3 font-semibold text-stone-900 transition hover:bg-amber-400";
  // Internal wouter routes start with "/". Anchors ("#...") and external URLs use <a>.
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className}>
        {label}
        <ArrowRight className="h-4 w-4" />
      </Link>
    );
  }
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={className}
    >
      {label}
      <ArrowRight className="h-4 w-4" />
    </a>
  );
}
