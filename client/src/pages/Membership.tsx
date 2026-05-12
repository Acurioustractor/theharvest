import { useEffect, useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Calendar,
  ExternalLink,
  Mail,
  Sprout,
  Users,
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { InterestSelector, type Interest } from "@/components/InterestSelector";
import { EditableText } from "@/components/EditableText";
import { HarvestImage } from "@/components/HarvestImage";
import { HarvestMediaGallery } from "@/components/HarvestMediaGallery";
import { elLinks } from "@/lib/empathyLedger";
import { trpc } from "@/lib/trpc";

const memberPromises = [
  {
    title: "The Harvest Note",
    body: "A monthly letter from Ben or Nic. What happened in the garden. What's coming next. One honest question. One small ask. Same shape every time so you know what to expect.",
    icon: Mail,
  },
  {
    title: "First call",
    body: "Members hear about community days, work days, workshops, residencies and meals before they go public. The next community day around the end of June lands here first.",
    icon: Calendar,
  },
  {
    title: "Invitations to help",
    body: "Not 'volunteer opportunities'. Specific calls. Hands needed for a path. Someone who knows old timber. A driver for a load of crates. The work is real and so are the asks.",
    icon: Sprout,
  },
];

function splitName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || name.trim(),
    lastName: parts.slice(1).join(" ") || undefined,
  };
}

export default function Membership() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [interests, setInterests] = useState<Interest[]>(["events", "community", "membership"]);
  const [questionName, setQuestionName] = useState("");
  const [questionEmail, setQuestionEmail] = useState("");
  const [questionPhone, setQuestionPhone] = useState("");
  const [question, setQuestion] = useState("");

  useEffect(() => {
    document.title = "Become a Harvest member";

    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content =
      "Join the Harvest member list for regular notes, event invitations, work day calls, and early opportunities.";
  }, []);

  const joinMutation = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => {
      toast.success("You are on the Harvest member list.");
      setName("");
      setEmail("");
      setPhone("");
      setInterests(["events", "community", "membership"]);
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
      source: "Harvest member list",
      interests: taggedInterests,
      member: true,
    });
  }

  function handleQuestionSubmit(event: React.FormEvent) {
    event.preventDefault();
    questionMutation.mutate({
      name: questionName.trim(),
      email: questionEmail.trim(),
      phone: questionPhone.trim() || null,
      question: question.trim(),
      source: "Membership page question form",
    });
  }

  return (
    <main className="min-h-screen bg-[#F5F0E8] text-[#1C1917]">
      <section className="relative overflow-hidden bg-[#1C1917] text-[#F5F0E8]">
        <HarvestImage
          page="membership"
          slot="hero-image"
          src="/images/compendium/seed-house-front.jpg"
          alt="The front of The Harvest building in Witta"
          size="hero"
          priority
          className="absolute inset-0 h-full w-full"
          imgClassName="h-full w-full object-cover opacity-[0.38]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1C1917] via-[#1C1917]/82 to-[#1C1917]/40" />

        <div className="relative z-10 mx-auto flex min-h-[78vh] max-w-6xl flex-col justify-between px-5 py-6 md:px-8">
          <nav className="flex items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.16em] text-white/68">
            <Link href="/" className="hover:text-white">
              The Harvest Witta
            </Link>
            <Link href="/what-is-the-harvest" className="inline-flex items-center gap-2 hover:text-white">
              <ArrowLeft className="h-3.5 w-3.5" />
              What is The Harvest?
            </Link>
          </nav>

          <div className="grid gap-10 pb-10 md:grid-cols-[1fr_0.78fr] md:items-end md:pb-14">
            <div>
              <EditableText
                page="membership"
                slot="hero-eyebrow"
                defaultContent="Member list now open"
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
                defaultContent="For now, membership means this: your name is on the Harvest list. You get the letters, invitations, first calls, and early opportunities while the place is being made."
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
                defaultContent="The legal structure comes later."
                as="p"
                className="mt-5 text-xl font-semibold"
              />
              <EditableText
                page="membership"
                slot="hero-note-body"
                defaultContent="This is the front gate list for people who want to stay close, turn up, and help shape the first version."
                as="p"
                className="mt-3 leading-relaxed text-white/66"
                multiline
              />
            </div>
          </div>
        </div>
      </section>

      {isAdmin && <MembershipAdminLedgerPanel />}

      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <EditableText
            page="membership"
            slot="benefits-eyebrow"
            defaultContent="What you get on the list"
            as="p"
            className="font-mono text-xs uppercase tracking-[0.2em] text-[#8B4A2A]"
          />
          <EditableText
            page="membership"
            slot="benefits-title"
            defaultContent="Three concrete things. Nothing performative."
            as="h2"
            className="mt-3 max-w-3xl text-4xl font-black leading-[0.98] md:text-5xl"
          />

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {memberPromises.map((item, index) => {
              const Icon = item.icon;
              return (
                <section key={item.title} className="border border-stone-300 bg-[#FFFDF7] p-6">
                  <Icon className="h-8 w-8 text-[#8B4A2A]" />
                  <EditableText
                    page="membership"
                    slot={`benefit-${index + 1}-title`}
                    defaultContent={item.title}
                    as="h3"
                    className="mt-5 text-2xl font-black"
                  />
                  <EditableText
                    page="membership"
                    slot={`benefit-${index + 1}-body`}
                    defaultContent={item.body}
                    as="p"
                    className="mt-3 leading-relaxed text-stone-700"
                    multiline
                  />
                </section>
              );
            })}
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
              defaultContent="Free. Just your name, an email, and the things you're curious about. We'll send the welcome note straight after."
              as="p"
              className="mt-6 max-w-xl text-lg leading-relaxed text-stone-700"
              multiline
            />
            <EditableText
              page="membership"
              slot="join-legal-note"
              defaultContent="No paid membership is being sold here. No formal co-op membership is being claimed here. This is the public Harvest member list. The deeper structures come later, with care, after we've earned them."
              as="p"
              className="mt-5 max-w-xl text-sm leading-relaxed text-stone-500"
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
              defaultContent="Sometimes you want to know something before you sign anything up. Ben or Nic will reply within 48 hours, sometimes faster."
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
              defaultContent="Read What is The Harvest, or open the collection."
              as="h2"
              className="mt-3 max-w-2xl text-4xl font-black leading-[0.98]"
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/what-is-the-harvest"
              className="inline-flex min-h-12 items-center justify-center gap-2 border border-white/22 px-6 py-3 font-semibold text-white transition hover:border-white hover:bg-white/10"
            >
              What is The Harvest?
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/works"
              className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#C4922A] px-6 py-3 font-semibold text-[#1C1917] transition hover:bg-[#E0AD43]"
            >
              See the works
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function MembershipAdminLedgerPanel() {
  return (
    <section className="border-b border-amber-500/30 bg-amber-50 px-5 py-5 md:px-8">
      <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[0.74fr_1fr]">
        <div className="border border-amber-300 bg-white p-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#8B4A2A]">
            Admin editing
          </p>
          <h2 className="mt-2 text-2xl font-black leading-tight">
            Membership page copy and media are editable here.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-stone-700">
            Click any amber <strong>Edit</strong> pill to rewrite copy. Hover the hero image and use
            <strong> Swap photo</strong> to choose from Empathy Ledger. Form field labels stay fixed
            so the signup flow remains stable while you edit the public story.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <AdminLedgerLink href="/admin/media-library" label="Harvest media library" />
            <AdminLedgerLink href={elLinks.photoManager()} label="EL photo manager" external />
            <AdminLedgerLink href={elLinks.galleries()} label="EL galleries" external />
            <AdminLedgerLink href={elLinks.bulkEdit()} label="EL bulk edit" external />
          </div>
        </div>

        <HarvestMediaGallery
          title="Membership media"
          eyebrow="Empathy Ledger widget"
          description="A quick view of EL assets tagged for gathering/community use. Use this as the source pool while you choose hero or support images."
          theme="gather"
          limit={4}
          tagHint="theme:gather + Harvest gallery"
          className="min-h-full"
        />
      </div>
    </section>
  );
}

function AdminLedgerLink({
  href,
  label,
  external = false,
}: {
  href: string;
  label: string;
  external?: boolean;
}) {
  const className =
    "inline-flex min-h-10 items-center justify-center gap-2 border border-stone-900/16 bg-[#1C1917] px-3 py-2 text-xs font-semibold text-[#F5F0E8] transition hover:bg-[#3D3832]";

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {label}
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {label}
      <ArrowRight className="h-3.5 w-3.5" />
    </Link>
  );
}
