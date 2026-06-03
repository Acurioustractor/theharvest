import { useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  Clock,
  MapPin,
  Users,
  Sprout,
  Flame,
  Lightbulb,
  Carrot,
  CalendarCheck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// --- CTA targets ----------------------------------------------------------
// Paste the GHL "Pizza RSVP - I'm coming" trigger link here once it is built.
// While this is empty, the I'm-coming buttons scroll to the "ways in" section
// so nothing is ever a dead link.
const IM_COMING_URL = "";
const SUPPLY_URL = "/shop"; // shop EOI: interest:markets + role:supplier
const IDEA_URL = "/get-involved?form=idea"; // deep-links straight to the idea form

const imComingHref = IM_COMING_URL || "#ways-in";
const imComingExternal = IM_COMING_URL.startsWith("http");

const EVENT = {
  date: "Saturday 20 June 2026",
  time: "From 1pm, pizza from 5pm",
  address: "9 Gumland Drive, Witta QLD 4552",
  shortAddress: "9 Gumland Drive, Witta · 10 min from Maleny",
  acknowledgement: "Jinibara Country",
  audience: "Everyone welcome",
};

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6 },
};

const dayBlocks = [
  {
    icon: Sprout,
    time: "From 1pm",
    title: "Walk the place",
    body: "The gardens, the rammed earth building, the pavilion under the pecans. What's here, what's coming.",
  },
  {
    icon: Lightbulb,
    time: "Through the afternoon",
    title: "Two questions",
    body: "What you could grow or make for the shop shelf. How you'd use this space: market mornings, maker days, the kids' corner, the empty rooms. Leave it on the wall or tell us at the long table.",
  },
  {
    icon: Flame,
    time: "From 5pm",
    title: "Pizza",
    body: "Three doughs, whatever the garden gave. Music. Stay till dark.",
  },
];

const waysIn = [
  {
    icon: CalendarCheck,
    title: "I'm coming",
    body: "One tap so we make enough dough.",
    cta: "I'm coming",
    href: imComingHref,
    external: imComingExternal,
  },
  {
    icon: Carrot,
    title: "I'd grow or make for the shop",
    body: "What's in your patch or on your bench.",
    cta: "Put something on the shelf",
    href: SUPPLY_URL,
    external: false,
  },
  {
    icon: Lightbulb,
    title: "I've got an idea",
    body: "The space, the kids' corner, a maker day.",
    cta: "Share an idea",
    href: IDEA_URL,
    external: false,
  },
];

export default function GardenLaunch() {
  useEffect(() => {
    document.title = "20 June 2026 · The Harvest opens its gate · Witta";
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content =
      "Saturday 20 June 2026, from 1pm at The Harvest, Witta. An old nursery on Jinibara Country opens its gate for the afternoon: walk the gardens, grow for the shop's shelf, stay for pizza from 5pm.";
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
              The gate <span className="text-amber-400">opens.</span>
            </h1>
            <p className="text-xl md:text-2xl text-stone-200 italic font-serif leading-snug max-w-2xl mx-auto mb-6">
              An old nursery on the hill becoming a place to eat, gather, make
              and grow. Come for the afternoon: walk the gardens, tell us what
              you'd put on the shop shelf, leave an idea, stay for pizza from
              five.
            </p>
            <p className="text-stone-300 max-w-2xl mx-auto mb-10">
              Open day for anyone who might grow, make or gather here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <a
                href={imComingHref}
                {...(imComingExternal
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-amber-500 text-stone-900 font-semibold hover:bg-amber-400 transition-colors"
              >
                I'm coming
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
          <div className="max-w-4xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <Fact icon={Calendar} label="Date" value={EVENT.date} />
            <Fact icon={Clock} label="Time" value={EVENT.time} />
            <Fact icon={MapPin} label="Place" value={EVENT.shortAddress} />
            <Fact icon={Users} label="Who" value={EVENT.audience} />
          </div>
          <p className="text-center text-stone-500 italic text-sm mt-8">
            We acknowledge the Jinibara people as the Traditional Custodians of
            this Country. The day begins with a Welcome, and The Harvest is being
            shaped with that in mind.
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
                An old nursery, opening its gate.
              </h2>
              <div className="space-y-5 text-lg text-stone-700 leading-relaxed">
                <p>
                  Witta has about 1,300 people and nowhere to stop. No shop in a
                  generation, nowhere to gather. The Harvest is five acres on the
                  hill: an old nursery with a rammed earth building and gardens
                  that have grown things here for a hundred years.
                </p>
                <p>
                  On 20 June we open the gate for the afternoon. Come see the
                  place. Walk the gardens. Tell us one thing: what you'd grow or
                  make for the shop, how you'd use this space.
                </p>
                <p>We write it all down, then the oven goes on under the pavilion.</p>
                <p className="font-serif italic text-stone-600">
                  Come for an hour or stay till dark. Bring a chair if you've got
                  one.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The shape of the day */}
      <section className="py-20 md:py-24 bg-stone-100">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <motion.div {...fadeInUp} className="mb-12 max-w-2xl">
              <p className="font-mono text-amber-700 text-sm mb-3 uppercase tracking-[0.2em]">
                The shape of the day
              </p>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-800">
                Afternoon into fire.
              </h2>
              <p className="mt-4 text-stone-600 leading-relaxed">
                Free. No register, no bar. Kids welcome, there's a corner with
                paper and chalk.
              </p>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {dayBlocks.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                  >
                    <Card className="h-full border-0 shadow-sm bg-white">
                      <CardContent className="p-6">
                        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                          <Icon className="h-6 w-6 text-amber-700" />
                        </div>
                        <p className="font-mono text-xs uppercase tracking-[0.16em] text-emerald-700 mb-2">
                          {item.time}
                        </p>
                        <h3 className="font-serif text-xl font-bold text-stone-800 mb-2">
                          {item.title}
                        </h3>
                        <p className="text-stone-600 leading-relaxed">{item.body}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Three ways in */}
      <section id="ways-in" className="py-20 md:py-28 bg-stone-800 text-white scroll-mt-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <motion.div {...fadeInUp} className="text-center mb-12">
              <p className="font-mono text-amber-400 text-sm mb-3 uppercase tracking-[0.2em]">
                Before the day
              </p>
              <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight">
                Three small ways in.
              </h2>
            </motion.div>
            <div className="grid gap-5 md:grid-cols-3">
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
            <p className="text-center text-stone-400 italic text-sm mt-8">
              Free. We count the pizza by hand.
            </p>
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
                  It only works if it's full of local hands. You grow it or make
                  it, we hold the shelf.
                </p>
                <p>20 June is where we find out who's in. Come see if you are.</p>
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
              Hear about this day, and the next one.
            </h2>
            <p className="text-stone-600 mb-8 leading-relaxed">
              The Harvest's quietest channel is the newsletter: one note before
              each gathering, never more. Or follow along where the photos and
              work-in-progress go.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a
                href="https://www.instagram.com/the.harvest.witta/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-stone-300 text-stone-700 hover:bg-stone-100 transition-colors"
              >
                Instagram
              </a>
              <a
                href="https://www.facebook.com/theharvestwitta"
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
