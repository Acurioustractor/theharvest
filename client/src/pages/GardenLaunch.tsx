import { useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  Clock,
  MapPin,
  Users,
  Sparkles,
  Flame,
  Sprout,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const EVENT = {
  date: "Saturday 20 June 2026",
  time: "3pm – 7pm",
  address: "9 Gumland Drive, Witta QLD 4552",
  shortAddress: "Witta · Sunshine Coast Hinterland",
  acknowledgement: "Jinibara Country",
  audience: "Member list only",
};

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6 },
};

const programItems = [
  {
    icon: Sprout,
    title: "The Garden Walk",
    body: "We'll walk the new beds together. What's in, what's coming, who's tending which row.",
  },
  {
    icon: Flame,
    title: "Pizza or tea, depending on what landed",
    body: "If the oven and the food licence are both ready, three pizza types. If not, tea, water, and something simple. No surprise. No bar. No register.",
  },
  {
    icon: Users,
    title: "A short circle: what's next?",
    body: "Late afternoon, we sit together for thirty minutes. One question: what do you want to see at The Harvest in the next year? We listen and write it down.",
  },
];

export default function GardenLaunch() {
  useEffect(() => {
    document.title = "First open day · 20 June 2026 · The Harvest";
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = "Saturday 20 June 2026, 3pm-7pm. The first soft opening at The Harvest, Witta. Member list only for this one. Join the member list for the invite.";
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
              {EVENT.date} · {EVENT.audience}
            </p>
            <h1 className="text-5xl md:text-7xl font-serif font-bold leading-[0.95] mb-6">
              First open day<br />
              <span className="text-amber-400">at The Harvest</span>
            </h1>
            <p className="text-xl md:text-2xl text-stone-200 italic font-serif leading-snug max-w-2xl mx-auto mb-10">
              A soft opening. A small group. Pizza if the oven is ready, tea if not.
              The bigger public day comes later in the year.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                href="/membership#join"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-amber-500 text-stone-900 font-semibold hover:bg-amber-400 transition-colors"
              >
                Get the email invite
                <ArrowRight className="h-4 w-4" />
              </Link>
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
            <Fact icon={Sparkles} label="Audience" value={EVENT.audience} />
          </div>
          <p className="text-center text-stone-500 italic text-sm mt-8">
            We acknowledge the Jinibara people as the Traditional Custodians of
            this Country. The day begins with a Welcome.
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
                A soft opening. Not a launch.
              </h2>
              <div className="space-y-5 text-lg text-stone-700 leading-relaxed">
                <p>
                  This is the first time we open the gate at The Harvest. Member
                  list only. About 40 of you. On Jinibara Country at Witta, under
                  the Milk Create Pavilion that 80 of you helped build in March.
                </p>
                <p>
                  It is a proof night, not a launch. We want to know if we can
                  open the gate, feed people something simple, hold a clear room,
                  and close it cleanly. If the answer is yes, the next opening
                  becomes easier. If the answer is "almost", we learn what to fix.
                </p>
                <p>
                  The bigger public day comes later in the year, once the operating
                  rhythm is real.
                </p>
                <p className="font-serif italic text-stone-600">
                  Come for an hour or stay until soft close. The kettle stays on.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What we know so far */}
      <section className="py-16 md:py-20 bg-stone-50 border-t border-stone-200">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <motion.div {...fadeInUp}>
              <p className="font-mono text-amber-700 text-sm mb-4 uppercase tracking-[0.2em]">
                What we know
              </p>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-800 mb-8 leading-tight">
                Some things are confirmed. Some are still settling.
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.16em] text-emerald-700 mb-3">
                    Confirmed
                  </p>
                  <ul className="space-y-2 text-stone-700">
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 mt-1 flex-none text-emerald-700" /> Saturday 20 June 2026, 3pm to 7pm</li>
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 mt-1 flex-none text-emerald-700" /> 9 Gumland Drive, Witta. Jinibara Country.</li>
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 mt-1 flex-none text-emerald-700" /> Member list only. About 40 seats.</li>
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 mt-1 flex-none text-emerald-700" /> Free. No register, no bar.</li>
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 mt-1 flex-none text-emerald-700" /> Shape: walk, simple food, short circle, soft close.</li>
                  </ul>
                </div>
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.16em] text-amber-700 mb-3">
                    Still settling — we'll update by 7 June
                  </p>
                  <ul className="space-y-2 text-stone-700">
                    <li>Whether pizza or tea is the food story, depending on oven + council</li>
                    <li>Whether the garden walk is guided or free-walk</li>
                    <li>Whether the short circle runs 4pm or 5pm</li>
                  </ul>
                  <p className="mt-5 text-sm italic text-stone-500">
                    If you're on the member list, the practical note for the day
                    lands Thursday 18 June with everything settled.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What to expect */}
      <section className="py-20 md:py-24 bg-stone-100">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <motion.div {...fadeInUp} className="mb-12 max-w-2xl">
              <p className="font-mono text-amber-700 text-sm mb-3 uppercase tracking-[0.2em]">
                The shape of the day
              </p>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-800">
                Three things. Nothing more.
              </h2>
              <p className="mt-4 text-stone-600 leading-relaxed">
                If kids come along, there will be paper and chalk on the kids'
                corner table. Not a programmed activity, just a place for them to sit.
              </p>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {programItems.map((item, i) => {
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

      {/* Email-led invite */}
      <EmailInviteSection eventLabel={EVENT.date} />

      {/* Connect */}
      <section className="py-16 md:py-20 bg-stone-50 border-t border-stone-200">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <p className="font-mono text-amber-700 text-sm mb-4 uppercase tracking-[0.2em]">
              Stay close
            </p>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-800 mb-4">
              Hear about the day, and the next one.
            </h2>
            <p className="text-stone-600 mb-8 leading-relaxed">
              The Harvest's quietest channel is the newsletter — one note before each
              gathering, never more. Or follow along where the photos go.
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

function EmailInviteSection({ eventLabel }: { eventLabel: string }) {
  return (
    <section id="invite" className="py-20 md:py-28 bg-stone-800 text-white scroll-mt-16">
      <div className="container">
        <div className="max-w-2xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-10">
            <p className="font-mono text-amber-400 text-sm mb-3 uppercase tracking-[0.2em]">
              Member list only · {eventLabel}
            </p>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4 leading-tight">
              The invite goes through the member list.
            </h2>
            <p className="text-stone-300 leading-relaxed">
              No public RSVP form for this one. Put your name on the Harvest
              member list, then reply with seat count when the note lands.
            </p>
          </motion.div>

          <Card className="border-0 shadow-xl bg-stone-50 text-stone-800">
            <CardContent className="p-6 md:p-8">
              <div className="space-y-5">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-amber-700">
                    Current path
                  </p>
                  <p className="mt-3 text-lg leading-relaxed text-stone-700">
                    No website form is collecting RSVPs yet. We are keeping this
                    human while the food, parking, and shape of the day settle.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="border border-stone-200 bg-white p-4">
                    <p className="font-serif text-xl font-bold">1. Join</p>
                    <p className="mt-2 text-sm leading-relaxed text-stone-600">
                      Put your name on the Harvest member list.
                    </p>
                  </div>
                  <div className="border border-stone-200 bg-white p-4">
                    <p className="font-serif text-xl font-bold">2. Read</p>
                    <p className="mt-2 text-sm leading-relaxed text-stone-600">
                      Watch for the member email when the invite is ready.
                    </p>
                  </div>
                  <div className="border border-stone-200 bg-white p-4">
                    <p className="font-serif text-xl font-bold">3. Reply</p>
                    <p className="mt-2 text-sm leading-relaxed text-stone-600">
                      Reply to the email and we will count the seat by hand.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/membership#join"
                    className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 bg-amber-500 px-5 py-3 font-semibold text-stone-900 transition hover:bg-amber-400"
                  >
                    Join the member list
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/membership#questions"
                    className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 border border-stone-300 px-5 py-3 font-semibold text-stone-800 transition hover:bg-white"
                  >
                    Ask a question
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
