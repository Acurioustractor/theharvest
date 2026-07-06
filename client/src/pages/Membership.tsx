import { useEffect, useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";
import {
  ArrowRight,
  CheckCircle2,
  Sprout,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { InterestSelector, type Interest } from "@/components/InterestSelector";
import { ShopInterestSection } from "@/components/ShopInterestSection";
import { EditableText } from "@/components/EditableText";
import { HarvestImage } from "@/components/HarvestImage";
import { HarvestPhotoPicker, type PickedPhoto } from "@/components/HarvestPhotoPicker";
import { useAuth } from "@/_core/hooks/useAuth";
import { optimize } from "@/lib/imageOptimize";
import { MEMBERS_PAGE_URL } from "@/lib/links";
import { trpc } from "@/lib/trpc";
import { harvestButtonClasses, SiteFooter, SiteNav } from "./HarvestReviewTest";
import { VisitStrip } from "@/components/VisitStrip";

const lanes = [
  {
    slug: "grow",
    title: "Grow.",
    tagline: "Letters and updates as the garden grows.",
    body: "A Harvest Note when there is something worth saying. What changed in the beds. What's coming next. One honest question. One small ask. Same shape every time so you know what to expect.",
  },
  {
    slug: "make",
    title: "Make.",
    tagline: "Specific calls when hands are needed.",
    body: "When there is a clear job to do, we will ask. Hands for a path. Someone who knows old timber. A driver for a load of crates. Practical ways to help the place take shape.",
  },
  {
    slug: "gather",
    title: "Gather.",
    tagline: "First call for community days and meals.",
    body: "Upcoming events land with members first. Most weekends the pizza oven runs: Friday 3pm to 8pm with a community movie night, Saturday 12pm to 8pm, Sunday 12pm to 6pm. Weeks can vary, and dates reach the member list before they go public, with a way to RSVP and message us directly.",
  },
];

function splitName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || name.trim(),
    lastName: parts.slice(1).join(" ") || undefined,
  };
}

type HeardAbout = "friend-or-neighbour" | "social-media" | "in-witta" | "other" | "";

const HEARD_ABOUT_OPTIONS: { value: Exclude<HeardAbout, "">; label: string }[] = [
  { value: "friend-or-neighbour", label: "A friend or neighbour told me" },
  { value: "social-media", label: "Social media (Facebook or Instagram)" },
  { value: "in-witta", label: "In Witta: a sign, a poster, or saw the place" },
  { value: "other", label: "Something else" },
];

export default function Membership() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [interests, setInterests] = useState<Interest[]>(["events", "community", "membership"]);
  const [comments, setComments] = useState("");
  const [heardAbout, setHeardAbout] = useState<HeardAbout>("");
  const [questionName, setQuestionName] = useState("");
  const [questionEmail, setQuestionEmail] = useState("");
  const [questionPhone, setQuestionPhone] = useState("");
  const [question, setQuestion] = useState("");
  const [showMemberWelcome, setShowMemberWelcome] = useState(false);

  useEffect(() => {
    document.title = "Become a Harvest member";

    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content =
      "Join the Harvest member list for regular notes, community-day invitations, work day calls, and early opportunities.";

    if (import.meta.env.DEV) {
      const params = new URLSearchParams(window.location.search);
      if (params.get("member-welcome-preview") === "1") {
        setShowMemberWelcome(true);
      }
    }
  }, []);

  useEffect(() => {
    if (!showMemberWelcome) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowMemberWelcome(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showMemberWelcome]);

  const joinMutation = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => {
      setShowMemberWelcome(true);
      setName("");
      setEmail("");
      setPhone("");
      setInterests(["events", "community", "membership"]);
      setComments("");
      setHeardAbout("");
    },
    onError: (error) => {
      toast.error("Could not add you to the list", {
        description: error.message || "Please try again.",
      });
    },
  });

  const questionMutation = trpc.members.question.useMutation({
    onSuccess: () => {
      toast.success("Question sent.");
      setQuestionName("");
      setQuestionEmail("");
      setQuestionPhone("");
      setQuestion("");
    },
    onError: (error) => {
      toast.error("Could not send the question", {
        description: error.message || "Please try again.",
      });
    },
  });

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const { firstName, lastName } = splitName(name);
    const taggedInterests = Array.from(new Set<Interest>(["membership", ...interests]));

    joinMutation.mutate({
      email: email.trim(),
      phone: phone.trim() || undefined,
      firstName,
      lastName,
      source: "Harvest | Member Signup",
      interests: taggedInterests,
      member: true,
      notes: comments.trim() || undefined,
      heardAbout: heardAbout || undefined,
    });
  }

  function handleQuestionSubmit(event: React.FormEvent) {
    event.preventDefault();
    questionMutation.mutate({
      name: questionName.trim(),
      email: questionEmail.trim(),
      phone: questionPhone.trim() || null,
      question: question.trim(),
      source: "Harvest | Member Question",
    });
  }

  return (
    <main className="min-h-screen bg-[#F5F0E8] text-[#1C1917]">
      <MemberWelcomeOverlay
        open={showMemberWelcome}
        onClose={() => setShowMemberWelcome(false)}
      />
      <SiteNav />
      <section className="relative overflow-hidden bg-[#1C1917] text-[#F5F0E8]">
        <HarvestImage
          page="membership"
          slot="hero-image"
          src="/images/optimized/seed-house-front-1600.webp"
          alt="The front of The Harvest building in Witta"
          size="hero"
          priority
          className="absolute inset-0 h-full w-full"
          imgClassName="h-full w-full object-cover opacity-[0.38]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1C1917] via-[#1C1917]/82 to-[#1C1917]/40" />

        <div className="relative z-10 mx-auto flex min-h-[78vh] max-w-6xl flex-col justify-end px-5 pb-6 pt-28 md:px-8">
          <div className="grid gap-10 pb-10 md:grid-cols-[1fr_0.78fr] md:items-end md:pb-14">
            <div>
              <EditableText
                page="membership"
                slot="hero-eyebrow"
                defaultContent="Become a member"
                as="p"
                className="mb-5 font-mono text-xs uppercase tracking-[0.24em] text-[#C4922A]"
              />
              <EditableText
                page="membership"
                slot="hero-title"
                defaultContent="Become a Harvest member."
                as="h1"
                className="max-w-3xl text-5xl font-black leading-[0.92] tracking-normal md:text-7xl"
              />
              <EditableText
                page="membership"
                slot="hero-body"
                defaultContent="Membership is free, and it means this: your name is on the Harvest list. You get the letters, invitations, first calls, and early opportunities as the place finds its feet. Use the comments box for ideas."
                as="p"
                className="mt-7 max-w-2xl text-xl leading-relaxed text-white/80 md:text-2xl"
                multiline
              />
            </div>

            <div className="border border-white/14 bg-white/[0.08] p-6 backdrop-blur-sm">
              <Sprout className="h-9 w-9 text-[#C4922A]" />
              <EditableText
                page="membership"
                slot="hero-note-title"
                defaultContent="What this list is."
                as="p"
                className="mt-5 text-xl font-semibold"
              />
              <EditableText
                page="membership"
                slot="hero-note-body"
                defaultContent="This is the front gate list for people who want to stay close, turn up, and help shape what The Harvest becomes. If you have produce or made goods, use the shop form below."
                as="p"
                className="mt-3 leading-relaxed text-white/66"
                multiline
              />
              <p className="mt-4 text-sm leading-relaxed text-white/60">
                Just want to have a look first? No booking needed while we find
                our feet.{" "}
                <Link
                  href="/whats-on"
                  className="text-[#C4922A] underline underline-offset-4 hover:text-white"
                >
                  Come by on a pizza weekend
                </Link>{" "}
                and say hello.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <EditableText
            page="membership"
            slot="lanes-eyebrow"
            defaultContent="What being on the list means"
            as="p"
            className="font-mono text-xs uppercase tracking-[0.2em] text-[#8B4A2A]"
          />
          <EditableText
            page="membership"
            slot="lanes-title"
            defaultContent="Grow. Make. Gather."
            as="h2"
            className="mt-3 text-5xl font-black tracking-wide text-[#C4922A] md:text-7xl"
          />
          <EditableText
            page="membership"
            slot="lanes-body"
            defaultContent="Three lanes you can lean into. Nothing performative."
            as="p"
            className="mt-5 max-w-2xl text-lg leading-relaxed text-stone-700"
            multiline
          />

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {lanes.map((lane) => (
              <article key={lane.slug} className="border border-stone-300 bg-[#FFFDF7] p-6">
                <EditableText
                  page="membership"
                  slot={`lane-${lane.slug}-title`}
                  defaultContent={lane.title}
                  as="h3"
                  className="text-3xl font-black"
                />
                <EditableText
                  page="membership"
                  slot={`lane-${lane.slug}-tagline`}
                  defaultContent={lane.tagline}
                  as="p"
                  className="mt-2 text-sm italic leading-relaxed text-[#8B4A2A]"
                  multiline
                />
                <EditableText
                  page="membership"
                  slot={`lane-${lane.slug}-body`}
                  defaultContent={lane.body}
                  as="p"
                  className="mt-4 leading-relaxed text-stone-700"
                  multiline
                />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="join" className="border-y border-stone-300/70 bg-[#FFFDF7] py-14 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-[0.82fr_1fr] md:px-8">
          <div>
            <EditableText
              page="membership"
              slot="join-eyebrow"
              defaultContent="Sign up"
              as="p"
              className="font-mono text-xs uppercase tracking-[0.2em] text-[#8B4A2A]"
            />
            <EditableText
              page="membership"
              slot="join-title"
              defaultContent="Put your name on the list."
              as="h2"
              className="mt-3 text-4xl font-black leading-[0.98] md:text-5xl"
            />
            <EditableText
              page="membership"
              slot="join-body"
              defaultContent="Free. Just your name, an email, a few interests, and any comments or ideas. We'll send the welcome note straight after."
              as="p"
              className="mt-6 max-w-xl text-lg leading-relaxed text-stone-700"
              multiline
            />
          </div>

          <form onSubmit={handleSubmit} className="border border-stone-300 bg-[#F5F0E8] p-5 md:p-7">
            <div className="grid gap-4">
              <div>
                <label className="mb-2 block font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500">
                  Name
                </label>
                <Input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                  className="h-12 rounded-none border-stone-300 bg-white"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500">
                  Email
                </label>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="h-12 rounded-none border-stone-300 bg-white"
                />
              </div>
              <div>
                <label className="mb-2 block font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500">
                  Phone, optional
                </label>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="For text updates"
                  className="h-12 rounded-none border-stone-300 bg-white"
                />
              </div>

              <InterestSelector selected={interests} onChange={setInterests} />

              <div>
                <label htmlFor="membership-heard-about" className="mb-2 block font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500">
                  How did you hear about The Harvest? Optional
                </label>
                <select
                  id="membership-heard-about"
                  value={heardAbout}
                  onChange={(event) => setHeardAbout(event.target.value as HeardAbout)}
                  className="h-12 w-full rounded-none border border-stone-300 bg-white px-3 text-stone-900 focus:border-[#C4922A] focus:outline-none"
                >
                  <option value="">Skip</option>
                  {HEARD_ABOUT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="membership-comments" className="mb-2 block font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500">
                  Comments or ideas, optional
                </label>
                <Textarea
                  id="membership-comments"
                  value={comments}
                  onChange={(event) => setComments(event.target.value)}
                  placeholder="What should we know? What would help? What would you like to see?"
                  className="min-h-28 rounded-none border-stone-300 bg-white"
                  maxLength={2000}
                />
              </div>

              <Button
                type="submit"
                disabled={joinMutation.isPending}
                className="mt-2 h-12 rounded-none bg-[#C4922A] font-semibold text-stone-950 hover:bg-[#E0AD43]"
              >
                {joinMutation.isPending ? "Joining..." : "Join the member list"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </section>

      <ShopInterestSection
        eyebrow="Different lane"
        title="Got produce or made goods for the shelf?"
        body="Use the shop form below for produce, food, made goods, consignment, or help shaping the shelf."
      />

      <section id="questions" className="bg-[#F5F0E8] py-14 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-[0.8fr_1fr] md:px-8">
          <div>
            <EditableText
              page="membership"
              slot="questions-eyebrow"
              defaultContent="Or ask a question first"
              as="p"
              className="font-mono text-xs uppercase tracking-[0.2em] text-[#8B4A2A]"
            />
            <EditableText
              page="membership"
              slot="questions-title"
              defaultContent="Not ready to join? Send a question."
              as="h2"
              className="mt-3 text-4xl font-black leading-[0.98] md:text-5xl"
            />
            <EditableText
              page="membership"
              slot="questions-body"
              defaultContent="Sometimes you want to know something before you sign anything up. Ben or Nic will reply, though replies can take a few days while we find our feet."
              as="p"
              className="mt-6 max-w-xl text-lg leading-relaxed text-stone-700"
              multiline
            />
          </div>

          <form onSubmit={handleQuestionSubmit} className="border border-stone-300 bg-[#FFFDF7] p-5 md:p-7">
            <div className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500">
                    Name
                  </label>
                  <Input
                    value={questionName}
                    onChange={(event) => setQuestionName(event.target.value)}
                    placeholder="Your name"
                    className="h-12 rounded-none border-stone-300 bg-white"
                    required
                    maxLength={120}
                  />
                </div>
                <div>
                  <label className="mb-2 block font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={questionEmail}
                    onChange={(event) => setQuestionEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="h-12 rounded-none border-stone-300 bg-white"
                    required
                    maxLength={180}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500">
                  Phone, optional
                </label>
                <Input
                  type="tel"
                  value={questionPhone}
                  onChange={(event) => setQuestionPhone(event.target.value)}
                  placeholder="For a call or text back"
                  className="h-12 rounded-none border-stone-300 bg-white"
                  maxLength={60}
                />
              </div>

              <div>
                <label className="mb-2 block font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500">
                  Question
                </label>
                <Textarea
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  placeholder="What would you like to ask?"
                  className="min-h-36 rounded-none border-stone-300 bg-white"
                  required
                  maxLength={2000}
                />
              </div>

              <Button
                type="submit"
                disabled={questionMutation.isPending}
                className="mt-2 h-12 rounded-none bg-[#1C1917] font-semibold text-[#F5F0E8] hover:bg-[#3D3832]"
              >
                {questionMutation.isPending ? "Sending..." : "Send question"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </section>

      <section className="bg-[#1C1917] py-14 text-[#F5F0E8] md:py-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            <EditableText
              page="membership"
              slot="footer-eyebrow"
              defaultContent="Start here"
              as="p"
              className="font-mono text-xs uppercase tracking-[0.2em] text-[#C4922A]"
            />
            <EditableText
              page="membership"
              slot="footer-title"
              defaultContent="Start with: What is The Harvest."
              as="h2"
              className="mt-3 max-w-2xl text-4xl font-black leading-[0.98]"
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/what-is-the-harvest"
              className={harvestButtonClasses.onDark}
            >
              Learn about The Harvest
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
      <VisitStrip />
      <SiteFooter />
    </main>
  );
}

function MemberWelcomeOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="member-welcome-title"
      className="fixed inset-0 z-[100] overflow-y-auto bg-[#1C1917] text-[#F5F0E8]"
    >
      <style>
        {`
          @keyframes harvest-welcome-rise {
            from { opacity: 0; transform: translateY(18px) scale(0.985); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes harvest-welcome-scan {
            from { transform: translateX(-30%); opacity: 0.08; }
            50% { opacity: 0.22; }
            to { transform: translateX(30%); opacity: 0.08; }
          }
        `}
      </style>

      <div className="relative min-h-screen overflow-hidden">
        <MemberWelcomeImage />
        <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_24%_18%,rgba(196,146,42,0.32),transparent_30%),linear-gradient(115deg,rgba(28,25,23,0.96)_0%,rgba(28,25,23,0.78)_42%,rgba(28,25,23,0.46)_100%)]" />
        <div
          className="pointer-events-none absolute left-[-12%] top-[18%] z-[2] h-40 w-[130%] rotate-[-8deg] border-y border-[#C4922A]/40 bg-[#C4922A]/10"
          style={{ animation: "harvest-welcome-scan 5.5s ease-in-out infinite alternate" }}
        />
        <div className="pointer-events-none absolute bottom-8 left-8 z-[3] hidden font-mono text-[10px] uppercase tracking-[0.28em] text-[#C4922A]/70 md:block">
          Crates / front gate / member list
        </div>

        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 z-20 inline-flex h-12 w-12 items-center justify-center border border-white/20 bg-black/20 text-white backdrop-blur-sm transition hover:bg-white hover:text-[#1C1917]"
          aria-label="Close member welcome"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative z-10 mx-auto grid min-h-screen max-w-6xl content-center gap-10 px-5 py-24 md:grid-cols-[0.95fr_0.72fr] md:px-8">
          <section
            className="max-w-3xl"
            style={{ animation: "harvest-welcome-rise 520ms ease-out both" }}
          >
            <div className="mb-7 inline-flex items-center gap-3 border border-[#C4922A]/40 bg-[#C4922A]/10 px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-[#E0AD43]">
              <CheckCircle2 className="h-4 w-4" />
              Member list confirmed
            </div>

            <p className="font-mono text-xs uppercase tracking-[0.28em] text-white/54">
              Front gate note
            </p>
            <h2
              id="member-welcome-title"
              className="mt-5 max-w-4xl text-5xl font-black leading-[0.84] tracking-[-0.04em] text-white md:text-8xl"
            >
              Your name is in the room.
            </h2>
            <p className="mt-7 max-w-2xl text-xl leading-relaxed text-white/76 md:text-2xl">
              You are on the Harvest member list. The next note comes from a real
              person, not a funnel. First calls, work days, meals, strange useful
              ideas, and the art of making this place together.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href={MEMBERS_PAGE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#C4922A] px-6 py-3 font-semibold text-[#1C1917] transition hover:bg-[#E0AD43]"
              >
                Go to the members page
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href="/works"
                onClick={onClose}
                className="inline-flex min-h-12 items-center justify-center border border-white/24 px-6 py-3 font-semibold text-white transition hover:bg-white hover:text-[#1C1917]"
              >
                See the works
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex min-h-12 items-center justify-center border border-white/24 px-6 py-3 font-semibold text-white transition hover:bg-white hover:text-[#1C1917]"
              >
                Back to the page
              </button>
            </div>
          </section>

          <aside
            className="border border-white/16 bg-[#F5F0E8]/10 p-5 backdrop-blur-md md:p-7"
            style={{ animation: "harvest-welcome-rise 640ms ease-out 90ms both" }}
          >
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#C4922A]">
              What happens next
            </p>
            <div className="mt-6 space-y-5">
              {[
                ["1", "The welcome note lands in your inbox."],
                ["2", "The first invite comes through the member list."],
                ["3", "Reply when you have a question, an idea, or a thing to bring."],
              ].map(([number, text]) => (
                <div key={number} className="grid grid-cols-[2.25rem_1fr] gap-4">
                  <div className="flex h-9 w-9 items-center justify-center border border-[#C4922A]/50 font-mono text-sm text-[#E0AD43]">
                    {number}
                  </div>
                  <p className="pt-1 text-base leading-relaxed text-white/78">
                    {text}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-8 border-t border-white/12 pt-6">
              <p className="text-lg font-semibold text-white">
                Keep one thing close:
              </p>
              <p className="mt-2 leading-relaxed text-white/66">
                The Harvest is not finished. That is why the list matters.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function MemberWelcomeImage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const page = "membership";
  const slot = "member-welcome-image";
  const defaultAlt = "Milk crates against the sky at The Harvest";
  const overrideQuery = trpc.imageOverrides.get.useQuery({ page, slot });
  const utils = trpc.useUtils();
  const [pickerOpen, setPickerOpen] = useState(false);

  const setMutation = trpc.imageOverrides.set.useMutation({
    onSuccess: () => {
      utils.imageOverrides.get.invalidate({ page, slot });
      toast.success("Welcome image swapped.");
    },
    onError: (error) => {
      toast.error("Could not save welcome image", {
        description: error.message,
      });
    },
  });

  const clearMutation = trpc.imageOverrides.clear.useMutation({
    onSuccess: () => {
      utils.imageOverrides.get.invalidate({ page, slot });
      toast.success("Welcome image reverted.");
    },
    onError: (error) => {
      toast.error("Could not revert welcome image", {
        description: error.message,
      });
    },
  });

  const override = overrideQuery.data;
  const src = optimize(override?.src ?? "/images/optimized/member-welcome-crates-1200.webp", "hero");
  const alt = override?.altText ?? defaultAlt;

  async function handlePick(photo: PickedPhoto) {
    await setMutation.mutateAsync({
      page,
      slot,
      mediaAssetId: photo.mediaAssetId,
      src: photo.src,
      altText: photo.altText ?? defaultAlt,
      title: photo.title ?? undefined,
    });
  }

  return (
    <>
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 z-0 h-full w-full object-cover opacity-45"
        loading="eager"
        decoding="sync"
        fetchPriority="high"
      />

      {isAdmin && (
        <>
          <div className="absolute left-5 top-5 z-30 flex flex-wrap gap-2 pr-20">
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              disabled={setMutation.isPending}
              className="inline-flex min-h-10 items-center justify-center border border-[#C4922A]/60 bg-[#1C1917]/72 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[#F5F0E8] backdrop-blur-sm transition hover:bg-[#C4922A] hover:text-[#1C1917] disabled:opacity-50"
            >
              {setMutation.isPending ? "Saving..." : "Choose welcome image"}
            </button>
            {override && (
              <button
                type="button"
                onClick={() => clearMutation.mutate({ page, slot })}
                disabled={clearMutation.isPending}
                className="inline-flex min-h-10 items-center justify-center border border-white/20 bg-black/25 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white/82 backdrop-blur-sm transition hover:bg-white hover:text-[#1C1917] disabled:opacity-50"
              >
                {clearMutation.isPending ? "Reverting..." : "Revert"}
              </button>
            )}
          </div>

          <HarvestPhotoPicker
            open={pickerOpen}
            onOpenChange={setPickerOpen}
            onPick={handlePick}
            defaultWorkSlug="milk-crate-pavilion"
          />
        </>
      )}
    </>
  );
}
