import { useEffect, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  Clock,
  MapPin,
  Mail,
  Phone,
  Users,
  CheckCircle2,
  Sparkles,
  Mic,
  Music,
  Sprout,
  Hammer,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const EVENT = {
  date: "Saturday 20 June 2026",
  time: "10am – 3pm",
  address: "9 Gumland Drive, Witta QLD 4552",
  shortAddress: "Witta · Sunshine Coast Hinterland",
  acknowledgement: "Jinibara Country",
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
    body: "We'll walk the new beds together — what's in, what's coming, who's tending which row.",
  },
  {
    icon: Hammer,
    title: "Milk Create Pavilion open",
    body: "First public day under the pavilion, built by 80 of you in March. Same crates, new shade.",
  },
  {
    icon: Music,
    title: "Long table lunch",
    body: "Wood-fired, hinterland-grown, chef-led. Free. BYO seat or bring an empty one for a neighbour.",
  },
  {
    icon: Mic,
    title: "Kids' co-design",
    body: "The children plan their own corner of The Harvest. Markers, chalk, whatever floats up.",
  },
  {
    icon: Users,
    title: "Open mic — what's missing in Witta?",
    body: "A few minutes each, anyone who wants to speak. We listen and we write it down.",
  },
];

export default function GardenLaunch() {
  useEffect(() => {
    document.title = "Garden Launch + Community Day · 20 June 2026 · The Harvest";
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = "Saturday 20 June 2026, 10am–3pm. Garden Launch and Community Day at The Harvest, Witta. Free. RSVP for a seat at the long table.";
  }, []);

  const countQuery = trpc.eoi.count.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });
  const count = countQuery.data?.count ?? 0;

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
              Coming up · {EVENT.date}
            </p>
            <h1 className="text-5xl md:text-7xl font-serif font-bold leading-[0.95] mb-6">
              Garden Launch<br />
              <span className="text-amber-400">+ Community Day</span>
            </h1>
            <p className="text-xl md:text-2xl text-stone-200 italic font-serif leading-snug max-w-2xl mx-auto mb-10">
              The first full day under the pavilion. The garden, finally open.
              The neighbours, finally in the same room.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <a
                href="#rsvp"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-amber-500 text-stone-900 font-semibold hover:bg-amber-400 transition-colors"
              >
                Save your spot
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
            {count > 0 && (
              <p className="text-stone-300 text-sm">
                <span className="text-amber-400 font-semibold">{count}</span>{" "}
                {count === 1 ? "neighbour has" : "neighbours have"} RSVP'd so far.
              </p>
            )}
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
            <Fact icon={Sparkles} label="Cost" value="Free" />
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
                A small village, on its own ground, for a day.
              </h2>
              <div className="space-y-5 text-lg text-stone-700 leading-relaxed">
                <p>
                  This is the first proper open day at The Harvest. The garden's
                  beds are in. The Milk Create Pavilion is up. The kitchen will
                  be feeding, the kids will be drawing, and the long table will
                  stretch as far as it needs to.
                </p>
                <p>
                  It's a launch, but really it's an invitation. We've spent two
                  years listening. This day is the first answer — and the first
                  question for the next year of the work.
                </p>
                <p className="font-serif italic text-stone-600">
                  Come for an hour or stay all afternoon. Bring kids, bring a friend,
                  bring an empty seat for someone you'd like to meet.
                </p>
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
                What to expect
              </p>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-800">
                Soft schedule. Real food. No hurry.
              </h2>
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

      {/* RSVP */}
      <RsvpSection eventLabel={EVENT.date} />

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

function RsvpSection({ eventLabel }: { eventLabel: string }) {
  const submit = trpc.eoi.submit.useMutation();
  const utils = trpc.useUtils();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [excitement, setExcitement] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const canSubmit =
    name.trim().length > 0 &&
    (email.trim().length > 0 || phone.trim().length > 0) &&
    !submit.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    try {
      await submit.mutateAsync({
        name: name.trim(),
        email: email.trim() || null,
        phone: phone.trim() || null,
        excitement: excitement.trim() || undefined,
        source: "Garden Launch page",
      });
      setSubmitted(true);
      utils.eoi.count.invalidate();
      toast.success("Saved your spot. See you on the 20th.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error("Couldn't save just now", { description: msg });
    }
  };

  return (
    <section id="rsvp" className="py-20 md:py-28 bg-stone-800 text-white scroll-mt-16">
      <div className="container">
        <div className="max-w-2xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-10">
            <p className="font-mono text-amber-400 text-sm mb-3 uppercase tracking-[0.2em]">
              RSVP — {eventLabel}
            </p>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4 leading-tight">
              Save your spot at the long table.
            </h2>
            <p className="text-stone-300 leading-relaxed">
              Free. Just so we know how much food to bring. Your name (and an
              email or phone) is enough.
            </p>
          </motion.div>

          <Card className="border-0 shadow-xl bg-stone-50 text-stone-800">
            <CardContent className="p-6 md:p-8">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <CheckCircle2 className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-serif font-bold mb-2">
                    You're in.
                  </h3>
                  <p className="text-stone-600 max-w-md mx-auto">
                    We'll send a quick note in the week before with parking + the
                    short program. See you on the 20th.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="rsvp-name">Your name *</Label>
                    <Input
                      id="rsvp-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="First and last is great"
                      required
                      maxLength={255}
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="rsvp-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                        <Input
                          id="rsvp-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="pl-9"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rsvp-phone">Phone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                        <Input
                          id="rsvp-phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="04…"
                          className="pl-9"
                        />
                      </div>
                    </div>
                  </div>
                  <p className="text-stone-500 text-xs -mt-3">
                    Email or phone — we just need one way to send the reminder.
                  </p>

                  <div className="space-y-2">
                    <Label htmlFor="rsvp-excitement">
                      What are you most curious about? (optional)
                    </Label>
                    <Textarea
                      id="rsvp-excitement"
                      value={excitement}
                      onChange={(e) => setExcitement(e.target.value)}
                      rows={3}
                      placeholder="The garden, the pavilion, the food, the kids' bit, just being here…"
                      maxLength={1000}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={!canSubmit}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-stone-900 font-semibold"
                    size="lg"
                  >
                    {submit.isPending ? "Saving…" : "Save my spot"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
