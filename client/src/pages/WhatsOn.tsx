import { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ShoppingBag,
  Palette,
  Utensils,
  Leaf,
  Music,
  Filter,
} from "lucide-react";
import { EventSubmissionDialog } from "@/components/EventSubmissionDialog";
import { SiteFooter, SiteNav } from "./HarvestReviewTest";
import { HarvestImage } from "@/components/HarvestImage";
import { trpc } from "@/lib/trpc";
import { EditableText } from "@/components/EditableText";
import { clearJsonLd, setJsonLd, setPageSeo } from "@/lib/seo";
import eventsData from "@/data/events.json";
import { currentAttribution } from "@/lib/tracking";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const categoryIcons: Record<string, typeof Calendar> = {
  market: ShoppingBag,
  workshop: Palette,
  food: Utensils,
  garden: Leaf,
  music: Music,
  community: Users,
  arts: Palette,
};

const categoryColors: Record<string, string> = {
  market: "bg-amber-100 text-amber-700",
  workshop: "bg-purple-100 text-purple-700",
  food: "bg-orange-100 text-orange-700",
  garden: "bg-green-100 text-green-700",
  music: "bg-blue-100 text-blue-700",
  community: "bg-pink-100 text-pink-700",
  arts: "bg-purple-100 text-purple-700",
};

const pizzaFaqs = [
  {
    question: "Do I need to book for pizza at The Harvest?",
    answer:
      "You do not need a booking to come and have a look. The members page is the best place to RSVP, check this week's dates, and help us plan dough and toppings.",
  },
  {
    question: "Where is The Harvest Witta?",
    answer:
      "The Harvest is at 9 Gumland Drive, Witta QLD 4552, near Maleny in the Sunshine Coast hinterland.",
  },
  {
    question: "When is DIY pizza on?",
    answer:
      "The regular rhythm is Friday 3pm to 8pm with a community movie night, Saturday 12pm to 8pm, and Sunday 12pm to 6pm. Weeks can vary, so check the members page first.",
  },
  {
    question: "Is The Harvest a restaurant?",
    answer:
      "Not really. The pizza oven is the first public rhythm for a community garden and creative gathering place taking shape in Witta.",
  },
  {
    question: "Can families come?",
    answer:
      "Yes. Sunday has the easiest pace for families. Children need to be supervised around the oven, garden paths, tools, and works in progress.",
  },
];

interface Event {
  id: number | string;
  title: string;
  date: string | Date;
  time?: string;
  location: string;
  category: string;
  description: string;
}

interface StaticEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: string;
  image: string;
}

function RegularSessions() {
  const sessions = [
    { slot: "session-friday", title: "Friday", detail: "DIY pizza and community movie night, 3pm to 8pm" },
    { slot: "session-saturday", title: "Saturday", detail: "DIY pizza making, 12pm to 8pm" },
    { slot: "session-sunday", title: "Sunday", detail: "DIY pizza making, 12pm to 6pm. An easier pace, good for families" },
  ];

  return (
    <section id="regular-sessions" className="scroll-mt-24 py-12 bg-white border-b border-stone-200">
      <div className="container max-w-4xl">
        <p className="text-amber-800 font-medium tracking-wide uppercase text-sm mb-2">
          The regular rhythm
        </p>
        <EditableText
          page="whats-on"
          slot="sessions-heading"
          defaultContent="Open most weekends for DIY pizza"
          as="h2"
          className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mb-3"
        />
        <EditableText
          page="whats-on"
          slot="sessions-intro"
          defaultContent="Stretch dough, top it your way, fire it in the oven, and enjoy the garden while it bakes. Our resident pizza teacher Dennis is in the house. All welcome, no experience needed."
          as="p"
          className="text-stone-600 mb-8 max-w-2xl"
          multiline
        />
        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          {sessions.map((s) => (
            <div key={s.slot} className="rounded-lg border border-stone-200 bg-stone-50 p-5">
              <EditableText
                page="whats-on"
                slot={`${s.slot}-title`}
                defaultContent={s.title}
                as="h3"
                className="text-lg font-serif font-bold text-stone-800 mb-1"
              />
              <EditableText
                page="whats-on"
                slot={`${s.slot}-detail`}
                defaultContent={s.detail}
                as="p"
                className="text-stone-600 text-sm leading-relaxed"
                multiline
              />
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Link
            href="/membership"
            className="inline-flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-black font-semibold px-8 py-3 rounded-md transition-colors"
          >
            Become a member
          </Link>
          <p className="text-sm text-stone-600">
            Weeks can vary. The members page has this week's dates first, and membership is free.
          </p>
        </div>
        <p className="mt-6 text-sm text-stone-600">
          Find us at 9 Gumland Drive, Witta, on Jinibara Country.
        </p>
      </div>
    </section>
  );
}

function PizzaGallery() {
  const photos = [
    { slot: "pizza-gallery-1", src: "/images/optimized/community-gathering-1000.webp", alt: "Neighbours sharing pizza at The Harvest" },
    { slot: "pizza-gallery-2", src: "/images/optimized/gathering-recap-crowd-1200.webp", alt: "A pizza night crowd at The Harvest" },
    { slot: "pizza-gallery-3", src: "/images/optimized/member-welcome-crates-1200.webp", alt: "Pizza dough and toppings ready to go at The Harvest" },
    { slot: "pizza-gallery-4", src: "/images/optimized/community-gathering-1200.webp", alt: "Fresh pizza out of the oven at The Harvest" },
  ];

  return (
    <section className="py-16 bg-white border-b border-stone-200">
      <div className="container max-w-5xl">
        <p className="text-amber-800 font-medium tracking-wide uppercase text-sm mb-2">
          How it works
        </p>
        <EditableText
          page="whats-on"
          slot="pizza-gallery-heading"
          defaultContent="Build your own pizza, fire it yourself."
          as="h2"
          className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mb-6"
        />
        <div className="grid gap-6 mb-10 sm:grid-cols-3 max-w-3xl">
          <div>
            <EditableText
              page="whats-on"
              slot="pizza-gallery-pizza-title"
              defaultContent="Your pizza"
              as="h3"
              className="text-lg font-serif font-bold text-stone-800 mb-2"
            />
            <EditableText
              page="whats-on"
              slot="pizza-gallery-pizza-body"
              defaultContent="Stretch your own base, then choose your toppings from a bench of cheeses, meats and vegetables. Dennis, our resident pizza teacher, shows you how to fire it in the oven. $30 each."
              as="p"
              className="text-stone-600 text-sm leading-relaxed"
              multiline
            />
          </div>
          <div>
            <EditableText
              page="whats-on"
              slot="pizza-gallery-dessert-title"
              defaultContent="Not full yet?"
              as="h3"
              className="text-lg font-serif font-bold text-stone-800 mb-2"
            />
            <EditableText
              page="whats-on"
              slot="pizza-gallery-dessert-body"
              defaultContent="There's a Nutella dessert pizza, topped with whipped cream, strawberries, caramel sauce or marshmallows. $10 each, or included free with an order of 3 pizzas."
              as="p"
              className="text-stone-600 text-sm leading-relaxed"
              multiline
            />
          </div>
          <div>
            <EditableText
              page="whats-on"
              slot="pizza-gallery-drinks-title"
              defaultContent="To drink"
              as="h3"
              className="text-lg font-serif font-bold text-stone-800 mb-2"
            />
            <EditableText
              page="whats-on"
              slot="pizza-gallery-drinks-body"
              defaultContent="A range of soft drinks, from $5 to $6.50."
              as="p"
              className="text-stone-600 text-sm leading-relaxed"
              multiline
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {photos.map((photo) => (
            <HarvestImage
              key={photo.slot}
              page="whats-on"
              slot={photo.slot}
              src={photo.src}
              alt={photo.alt}
              size="card"
              className="aspect-square overflow-hidden rounded-lg bg-stone-100"
              imgClassName="h-full w-full object-cover"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function PizzaSearchBlock() {
  return (
    <section className="border-b border-stone-200 bg-stone-50 py-12">
      <div className="container max-w-4xl">
        <p className="mb-2 text-sm font-medium uppercase tracking-wide text-amber-800">
          Pizza in Witta
        </p>
        <h2 className="mb-4 font-serif text-3xl font-bold text-stone-800 md:text-4xl">
          DIY pizza at 9 Gumland Drive.
        </h2>
        <div className="grid gap-6 md:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-4 text-stone-600">
            <p>
              The pizza oven is the easiest way to see The Harvest in person.
              Come to Witta, make your own pizza, sit in the garden, and see
              what is taking shape around the shed.
            </p>
            <p>
              Most weeks the rhythm is Friday 3pm to 8pm with a community movie
              night, Saturday 12pm to 8pm, and Sunday 12pm to 6pm. Weeks can
              vary, so the members page carries this week's dates first.
            </p>
          </div>
          <div className="rounded-lg border border-stone-200 bg-white p-5 text-sm text-stone-600">
            <p className="mb-2 font-semibold text-stone-800">What to know</p>
            <p>DIY pizza: $30 each.</p>
            <p>Dessert pizza: $10 each.</p>
            <p>Soft drinks: $5 to $6.50.</p>
            <p className="mt-3">
              The Harvest, 9 Gumland Drive, Witta QLD 4552.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function PizzaProofArticle() {
  return (
    <section className="border-b border-stone-200 bg-white py-16">
      <article className="container max-w-4xl">
        <p className="mb-2 text-sm font-medium uppercase tracking-wide text-amber-800">
          First public rhythm
        </p>
        <h2 className="mb-5 font-serif text-3xl font-bold text-stone-800 md:text-4xl">
          Pizza is how the gate opens.
        </h2>
        <div className="grid gap-8 text-stone-600 md:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4 leading-relaxed">
            <p>
              The Harvest is a community garden and creative gathering place
              taking shape in Witta, on Jinibara Country. The pizza oven is the
              simplest way to understand it: come through the gate, make
              something with your hands, sit at a table, and meet the place
              while it is still being made.
            </p>
            <p>
              This is not a finished restaurant. It is a working room with a
              garden around it. The oven sits beside the first public version of
              the kitchen, the shop shelves are being shaped with local growers
              and makers, and the art space is finding its first people.
            </p>
            <p>
              If you are looking for pizza near Maleny or something to do in
              Witta on the weekend, start here. If you are a maker, grower,
              artist or neighbour, pizza weekends are also a good way to see
              where you might fit.
            </p>
          </div>
          <aside className="rounded-lg border border-stone-200 bg-stone-50 p-6">
            <h3 className="mb-3 font-serif text-xl font-bold text-stone-800">
              While you are here
            </h3>
            <ul className="space-y-3 text-sm leading-relaxed text-stone-600">
              <li>
                Walk the garden paths and see what is growing.{" "}
                <Link
                  href="/get-involved"
                  className="font-semibold text-amber-700 underline underline-offset-4 hover:text-amber-800"
                >
                  Lend a hand
                </Link>
                .
              </li>
              <li>
                Look at the first shop shelves for local growers and makers.{" "}
                <Link
                  href="/shop"
                  className="font-semibold text-amber-700 underline underline-offset-4 hover:text-amber-800"
                >
                  See the shop
                </Link>
                .
              </li>
              <li>
                Follow the works shaping the art space and shared rooms.{" "}
                <Link
                  href="/works"
                  className="font-semibold text-amber-700 underline underline-offset-4 hover:text-amber-800"
                >
                  See the works
                </Link>
                .
              </li>
              <li>
                Read the longer story of the old nursery becoming The Harvest.{" "}
                <Link
                  href="/what-is-the-harvest"
                  className="font-semibold text-amber-700 underline underline-offset-4 hover:text-amber-800"
                >
                  Read the story
                </Link>
                .
              </li>
            </ul>
          </aside>
        </div>
      </article>
    </section>
  );
}

function PizzaFaqBlock() {
  return (
    <section className="border-b border-stone-200 bg-stone-50 py-14">
      <div className="container max-w-4xl">
        <p className="mb-2 text-sm font-medium uppercase tracking-wide text-amber-800">
          Plan the visit
        </p>
        <h2 className="mb-8 font-serif text-3xl font-bold text-stone-800 md:text-4xl">
          Pizza questions
        </h2>
        <div className="grid gap-4">
          {pizzaFaqs.map((faq) => (
            <div key={faq.question} className="rounded-lg border border-stone-200 bg-white p-5">
              <h3 className="mb-2 font-serif text-lg font-bold text-stone-800">
                {faq.question}
              </h3>
              <p className="text-sm leading-relaxed text-stone-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MembershipInvite() {
  const perks = [
    {
      slot: "member-perk-days",
      title: "Member days",
      body: "First notice of community and makers days, like the one we opened with on 20 June.",
    },
    {
      slot: "member-perk-garden",
      title: "Garden sessions",
      body: "Work day dates land on the members page first, before anywhere else.",
    },
    {
      slot: "member-perk-events",
      title: "Upcoming events",
      body: "New dates land on the members page first.",
    },
    {
      slot: "member-perk-ideas",
      title: "Share your ideas",
      body: "Message us directly with what you think The Harvest should become for the community.",
    },
  ];

  return (
    <section className="py-16 bg-amber-50 border-y border-amber-200">
      <div className="container max-w-4xl">
        <p className="text-amber-700 font-medium tracking-wide uppercase text-sm mb-2">
          Membership
        </p>
        <EditableText
          page="whats-on"
          slot="membership-heading"
          defaultContent="Get the next dates first."
          as="h2"
          className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mb-3"
        />
        <EditableText
          page="whats-on"
          slot="membership-intro"
          defaultContent="Membership is free. Get event dates, work-day calls and invitations before they are shared more widely."
          as="p"
          className="text-stone-600 mb-8 max-w-2xl"
          multiline
        />
        <div className="grid gap-4 sm:grid-cols-2 mb-8">
          {perks.map((perk) => (
            <div key={perk.slot} className="rounded-lg border border-amber-200 bg-white p-5">
              <EditableText
                page="whats-on"
                slot={`${perk.slot}-title`}
                defaultContent={perk.title}
                as="h3"
                className="text-lg font-serif font-bold text-stone-800 mb-2"
              />
              <EditableText
                page="whats-on"
                slot={`${perk.slot}-body`}
                defaultContent={perk.body}
                as="p"
                className="text-stone-600 text-sm leading-relaxed"
                multiline
              />
            </div>
          ))}
        </div>
        <Link
          href="/membership"
          className="inline-flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-black font-semibold px-8 py-3 rounded-md transition-colors"
        >
          Become a member
        </Link>
      </div>
    </section>
  );
}

function RoadmapStrip() {
  const areas = [
    {
      slot: "roadmap-garden",
      title: "The Garden",
      body: "Growing through regular work days: beds, seedlings, mulch, compost and paths.",
      href: "/get-involved",
      linkLabel: "Lend a hand",
    },
    {
      slot: "roadmap-shop",
      title: "The Shop",
      body: "The first shelves are being shaped with local makers and growers.",
      href: "/shop",
      linkLabel: "See the shop",
    },
    {
      slot: "roadmap-art-space",
      title: "The Art Space",
      body: "Finding its shape, and artists are the ones shaping it.",
      href: "/works",
      linkLabel: "See the works",
    },
  ];

  return (
    <section className="py-12 bg-stone-50 border-t border-stone-200">
      <div className="container max-w-4xl">
        <p className="text-amber-800 font-medium tracking-wide uppercase text-sm mb-2">
          Elsewhere on site
        </p>
        <EditableText
          page="whats-on"
          slot="roadmap-heading"
          defaultContent="Where the rest of the place stands"
          as="h2"
          className="text-2xl md:text-3xl font-serif font-bold text-stone-800 mb-8"
        />
        <div className="grid gap-4 sm:grid-cols-3">
          {areas.map((area) => (
            <div key={area.slot} className="rounded-lg border border-stone-200 bg-white p-5">
              <h3 className="text-lg font-serif font-bold text-stone-800 mb-2">{area.title}</h3>
              <EditableText
                page="whats-on"
                slot={`${area.slot}-body`}
                defaultContent={area.body}
                as="p"
                className="text-stone-600 text-sm leading-relaxed mb-3"
                multiline
              />
              <Link
                href={area.href}
                className="text-sm font-semibold text-amber-700 underline underline-offset-4 hover:text-amber-800"
              >
                {area.linkLabel}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeedbackBand() {
  return (
    <section className="py-12 bg-stone-50 border-t border-stone-200">
      <div className="container max-w-3xl text-center">
        <EditableText
          page="whats-on"
          slot="feedback-heading"
          defaultContent="Been along? Tell us how it went"
          as="h2"
          className="text-2xl md:text-3xl font-serif font-bold text-stone-800 mb-3"
        />
        <EditableText
          page="whats-on"
          slot="feedback-intro"
          defaultContent="The Harvest is being shaped by the people who turn up. The pulse survey takes a few minutes and feeds straight into what happens next."
          as="p"
          className="text-stone-600 mb-6 max-w-xl mx-auto"
          multiline
        />
        <Link
          href="/pulse"
          className="inline-flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-black font-semibold px-8 py-3 rounded-md transition-colors"
        >
          Take the pulse survey
        </Link>
      </div>
    </section>
  );
}

type PizzaSession = "friday" | "saturday" | "sunday" | "unsure";

const pizzaSessionLabels: Record<PizzaSession, string> = {
  friday: "Friday, pizza and movie, 3pm to 8pm",
  saturday: "Saturday, 12pm to 8pm",
  sunday: "Sunday, 12pm to 6pm",
  unsure: "Not sure yet",
};

const pizzaSessionByDay: Record<number, Exclude<PizzaSession, "unsure">> = {
  5: "friday",
  6: "saturday",
  0: "sunday",
};

function todayInBrisbane() {
  const parts = new Intl.DateTimeFormat("en-AU", {
    timeZone: "Australia/Brisbane",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${value.year}-${value.month}-${value.day}`;
}

function expectedPizzaSessionForDate(value: string): Exclude<PizzaSession, "unsure"> | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  return pizzaSessionByDay[new Date(Date.UTC(year, month - 1, day)).getUTCDay()] ?? null;
}

function PizzaRsvpBlock() {
  const [form, setForm] = useState<{
    name: string;
    email: string;
    occurrenceDate: string;
    session: PizzaSession | "";
    people: string;
  }>({ name: "", email: "", occurrenceDate: "", session: "", people: "2" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const submitRsvp = trpc.eoi.submit.useMutation();
  const expectedSession = expectedPizzaSessionForDate(form.occurrenceDate);
  const sessionOptions: PizzaSession[] = expectedSession ? [expectedSession, "unsure"] : ["unsure"];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.occurrenceDate || !form.session) {
      setErrorMsg("Choose the date and session you are planning to attend.");
      setStatus("error");
      return;
    }
    if (!expectedSession) {
      setErrorMsg("Choose a Friday, Saturday or Sunday pizza date.");
      setStatus("error");
      return;
    }
    if (form.session !== "unsure" && form.session !== expectedSession) {
      setErrorMsg("The session does not match the date you selected.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      const attribution = currentAttribution();
      await submitRsvp.mutateAsync({
        name: form.name,
        email: form.email,
        occurrenceDate: form.occurrenceDate,
        session: form.session,
        people: form.people ? Number(form.people) : undefined,
        source: attribution.sourceContent ? `whats-on:${attribution.sourceContent}` : "whats-on",
      });
      setStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  return (
    <section id="pizza-rsvp" className="scroll-mt-24 py-12 bg-amber-50 border-y border-amber-200">
      <div className="container max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-800 mb-2">
          Coming along? Let us know
        </h2>
        <p className="text-stone-600 mb-2">
          Choose the date and session you are planning to attend. An RSVP is not required,
          but it helps us plan dough, toppings and space.
        </p>
        <p className="text-stone-600 text-xs mb-6">
          Used only to plan numbers and get in touch about this RSVP. See our{" "}
          <Link href="/privacy" className="underline hover:text-stone-700">
            privacy page
          </Link>{" "}
          for details.
        </p>
        {status === "success" ? (
          <div className="bg-white border border-amber-300 rounded-lg p-6">
            <p className="font-semibold text-stone-800">You're on the list.</p>
            <p className="text-stone-600 mt-1">
              We'll plan for you. To hear when dates change,{" "}
              <Link
                href="/membership"
                className="text-amber-700 underline hover:text-amber-800"
              >
                become a free member
              </Link>
              .
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1 text-sm font-medium text-stone-700" htmlFor="pizza-rsvp-name">
              Your name
              <input
                id="pizza-rsvp-name"
                name="name"
                autoComplete="name"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="rounded-md border border-stone-300 bg-white px-4 py-3 text-stone-800"
              />
            </label>
            <label className="grid gap-1 text-sm font-medium text-stone-700" htmlFor="pizza-rsvp-email">
              Email
              <input
                id="pizza-rsvp-email"
                name="email"
                autoComplete="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="rounded-md border border-stone-300 bg-white px-4 py-3 text-stone-800"
              />
            </label>
            <label className="grid gap-1 text-sm font-medium text-stone-700" htmlFor="pizza-rsvp-date">
              Date you plan to come
              <input
                id="pizza-rsvp-date"
                name="occurrenceDate"
                type="date"
                min={todayInBrisbane()}
                required
                value={form.occurrenceDate}
                onChange={(e) => {
                  const occurrenceDate = e.target.value;
                  const nextSession = expectedPizzaSessionForDate(occurrenceDate);
                  setForm((f) => ({
                    ...f,
                    occurrenceDate,
                    session: nextSession ?? "",
                  }));
                }}
                className="rounded-md border border-stone-300 bg-white px-4 py-3 text-stone-800"
              />
              {form.occurrenceDate && !expectedSession && (
                <span className="text-xs font-normal text-red-700">
                  Pizza RSVPs are for Fridays, Saturdays and Sundays.
                </span>
              )}
            </label>
            <label className="grid gap-1 text-sm font-medium text-stone-700" htmlFor="pizza-rsvp-session">
              Session
              <select
                id="pizza-rsvp-session"
                name="session"
                required
                value={form.session}
                onChange={(e) => setForm((f) => ({ ...f, session: e.target.value as PizzaSession | "" }))}
                className="rounded-md border border-stone-300 bg-white px-4 py-3 text-stone-800"
              >
                <option value="">Choose a session</option>
                {sessionOptions.map((session) => (
                  <option key={session} value={session}>
                    {pizzaSessionLabels[session]}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1 text-sm font-medium text-stone-700 sm:col-span-2" htmlFor="pizza-rsvp-people">
              Number of people
              <input
                id="pizza-rsvp-people"
                name="people"
                type="number"
                min={1}
                max={30}
                value={form.people}
                onChange={(e) => setForm((f) => ({ ...f, people: e.target.value }))}
                className="rounded-md border border-stone-300 bg-white px-4 py-3 text-stone-800 sm:max-w-48"
              />
            </label>
            {status === "error" && (
              <p className="sm:col-span-2 text-sm text-red-700">{errorMsg}</p>
            )}
            <div className="sm:col-span-2">
              <Button
                type="submit"
                disabled={status === "loading"}
                className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-8"
              >
                {status === "loading" ? "Sending..." : "Count us in"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

export default function WhatsOn() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [location] = useLocation();
  const isPizzaPage = location === "/witta-pizza";

  useEffect(() => {
    setPageSeo({
      title: isPizzaPage ? "DIY Pizza in Witta · The Harvest" : "What's On · The Harvest Witta",
      description: isPizzaPage
        ? "Make your own pizza at The Harvest, 9 Gumland Drive, Witta. Weekend DIY pizza sessions most Fridays, Saturdays and Sundays, with dates confirmed on the members page."
        : "DIY pizza weekends, community days, work days and events at The Harvest, 9 Gumland Drive, Witta on Jinibara Country.",
      path: isPizzaPage ? "/witta-pizza" : "/whats-on",
      image: "/images/optimized/community-gathering-1000.webp",
      imageAlt: "Neighbours gathered at The Harvest in Witta.",
    });

    setJsonLd("whats-on-jsonld", {
      "@context": "https://schema.org",
      "@type": isPizzaPage ? "FoodEstablishment" : "LocalBusiness",
      "@id": isPizzaPage
        ? "https://www.theharvestwitta.com.au/witta-pizza#pizza"
        : "https://www.theharvestwitta.com.au/whats-on#events",
      name: isPizzaPage ? "DIY pizza at The Harvest" : "What's on at The Harvest",
      url: `https://www.theharvestwitta.com.au${isPizzaPage ? "/witta-pizza" : "/whats-on"}`,
      image: "https://www.theharvestwitta.com.au/images/optimized/community-gathering-1000.webp",
      description: isPizzaPage
        ? "DIY pizza sessions at The Harvest, 9 Gumland Drive, Witta. Make your own pizza and sit in the garden while it bakes."
        : "Weekend pizza sessions, community days, work days and gatherings at The Harvest in Witta.",
      parentOrganization: {
        "@id": "https://www.theharvestwitta.com.au/#organization",
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: "9 Gumland Drive",
        addressLocality: "Witta",
        addressRegion: "QLD",
        postalCode: "4552",
        addressCountry: "AU",
      },
      areaServed: ["Witta", "Maleny", "Sunshine Coast Hinterland"],
      servesCuisine: isPizzaPage ? "Pizza" : undefined,
      telephone: "+61422883943",
      makesOffer: isPizzaPage
        ? {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "DIY pizza making",
              description:
                "Stretch your base, choose your toppings and fire your pizza at The Harvest.",
            },
          }
        : undefined,
    });

    if (isPizzaPage) {
      setJsonLd("pizza-faq-jsonld", {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: pizzaFaqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      });
    } else {
      clearJsonLd("pizza-faq-jsonld");
    }
  }, [isPizzaPage]);

  // Fetch approved events from database
  const { data: dbEvents, refetch } = trpc.events.list.useQuery();

  // Combine static and database events
  const allEvents = useMemo(() => {
    const staticEvents: Event[] = (eventsData.events as StaticEvent[]).map((e) => ({
      id: `static-${e.id}`,
      title: e.title,
      date: e.date,
      time: e.time,
      location: e.location,
      category: e.category.toLowerCase(),
      description: e.description,
    }));

    const approvedEvents: Event[] = (dbEvents || []).map((e) => ({
      id: e.id,
      title: e.title,
      date: e.date instanceof Date ? e.date.toISOString().slice(0, 10) : e.date,
      time: e.time,
      location: e.location,
      category: e.category.toLowerCase(),
      description: e.description,
    }));

    return [...staticEvents, ...approvedEvents].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [dbEvents]);

  // Filter events
  const filteredEvents = useMemo(() => {
    if (selectedCategory === "all") return allEvents;
    return allEvents.filter((e) => e.category === selectedCategory);
  }, [allEvents, selectedCategory]);

  // Separate upcoming and past events
  const now = new Date();
  const upcomingEvents = filteredEvents.filter((e) => new Date(e.date) >= now);
  const pastEvents = filteredEvents.filter((e) => new Date(e.date) < now);

  const categories = [
    { value: "all", label: "All Events" },
    { value: "market", label: "Markets" },
    { value: "workshop", label: "Workshops" },
    { value: "food", label: "Food & Dining" },
    { value: "garden", label: "Garden" },
    { value: "music", label: "Music" },
    { value: "community", label: "Community" },
    { value: "arts", label: "Arts" },
  ];

  const formatDate = (dateInput: string | Date) => {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    return {
      day: date.getDate(),
      month: date.toLocaleDateString("en-AU", { month: "short" }),
      weekday: date.toLocaleDateString("en-AU", { weekday: "short" }),
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-stone-900 pt-36 pb-24">
        <HarvestImage
          page="whats-on"
          slot="hero-photo"
          src="/images/optimized/gathering-recap-crowd-1600.webp"
          alt="Making pizza together at The Harvest, Witta"
          size="hero"
          priority
          controlsPosition="corner"
          className="absolute inset-0 h-full w-full"
          imgClassName="h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-stone-900/70" />

        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="text-amber-400 font-medium tracking-wide uppercase text-sm">
              {isPizzaPage ? "Witta pizza weekends" : "Events & Gatherings"}
            </span>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mt-3 mb-6">
              {isPizzaPage ? "DIY pizza in Witta" : "What's On"}
            </h1>
            <p className="text-xl text-white/80 leading-relaxed mb-8">
              {isPizzaPage
                ? "Make your own pizza at The Harvest, 9 Gumland Drive, Witta. Most weekends the oven is on Friday, Saturday and Sunday. Weeks can vary, and new dates land on the members page first."
                : "Weekend pizza sessions, work days and gatherings at The Harvest, a community garden and creative gathering place in Witta, on Jinibara Country. New dates land on the members page first."}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href={isPizzaPage ? "#pizza-rsvp" : "#regular-sessions"}
                className="inline-flex min-h-11 items-center justify-center rounded-md bg-amber-500 px-6 py-3 font-semibold text-black transition hover:bg-amber-400"
              >
                {isPizzaPage ? "RSVP for pizza" : "See this weekend"}
              </a>
              {!isPizzaPage && <EventSubmissionDialog onEventSubmitted={() => refetch()} />}
            </div>
          </motion.div>
        </div>
      </section>

      {/* The weekend rhythm is the thing that actually runs every week, so it
          leads the page. The submitted-events stream sits below it: when that
          stream is empty, an empty list must not be the first thing a visitor
          reads on the page that answers "what is happening?". */}
      <RegularSessions />
      <PizzaRsvpBlock />

      {/* Filter Section: only worth showing once there are events to filter */}
      {allEvents.length > 1 && (
        <section className="py-8 bg-white border-b border-stone-200 sticky top-[76px] z-40">
          <div className="container">
            <div className="flex items-center gap-4 overflow-x-auto pb-2">
              <Filter className="h-5 w-5 text-stone-400 flex-shrink-0" />
              {categories.map((cat) => (
                <Button
                  key={cat.value}
                  variant={selectedCategory === cat.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.value)}
                  className={
                    selectedCategory === cat.value
                      ? "bg-amber-500 hover:bg-amber-600 text-black"
                      : "border-stone-300"
                  }
                >
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Events Content */}
      <section id="upcoming-events" className="scroll-mt-24 py-16 bg-white">
        <div className="container">
          <div className="mb-8 max-w-3xl">
            <p className="text-amber-800 font-medium tracking-wide uppercase text-sm mb-2">
              One-off events
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900">
              Workshops, markets and gatherings
            </h2>
            <p className="mt-3 text-stone-600 leading-relaxed">
              Community events at The Harvest, alongside the weekend rhythm above. Anyone can put one
              forward.
            </p>
          </div>
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="upcoming">Upcoming Events ({upcomingEvents.length})</TabsTrigger>
              <TabsTrigger value="past">Past Events ({pastEvents.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming">
              {upcomingEvents.length === 0 ? (
                <div className="text-center py-16">
                  <Calendar className="h-16 w-16 text-stone-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-stone-600 mb-2">Nothing listed just yet</h3>
                  <p className="text-stone-600 mb-6">
                    The pizza weekend rhythm above runs most weeks. You can{" "}
                    <a
                      href="#pizza-rsvp"
                      className="text-amber-800 underline hover:text-amber-700"
                    >
                      leave an RSVP
                    </a>{" "}
                    or submit your own community event.
                  </p>
                  <EventSubmissionDialog onEventSubmitted={() => refetch()} />
                </div>
              ) : (
                <motion.div
                  initial="initial"
                  animate="animate"
                  variants={staggerContainer}
                  className="space-y-6"
                >
                  {upcomingEvents.map((event) => {
                    const dateInfo = formatDate(event.date);
                    const IconComponent = categoryIcons[event.category] || Calendar;
                    const colorClass = categoryColors[event.category] || "bg-stone-100 text-stone-700";

                    return (
                      <motion.div key={event.id} variants={fadeInUp}>
                        <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow">
                          <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row">
                              {/* Date Badge */}
                              <div className="md:w-32 bg-amber-500 text-black p-6 flex flex-col items-center justify-center">
                                <span className="text-sm font-medium uppercase">
                                  {dateInfo.weekday}
                                </span>
                                <span className="text-4xl font-bold">{dateInfo.day}</span>
                                <span className="text-sm font-medium uppercase">
                                  {dateInfo.month}
                                </span>
                              </div>

                              {/* Event Details */}
                              <div className="flex-1 p-6">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                      <Badge className={colorClass}>
                                        <IconComponent className="h-3 w-3 mr-1" />
                                        {event.category}
                                      </Badge>
                                    </div>
                                    <h3 className="text-xl font-serif font-bold text-stone-800 mb-2">
                                      {event.title}
                                    </h3>
                                    <p className="text-stone-600 mb-4">{event.description}</p>
                                    <div className="flex flex-wrap gap-4 text-sm text-stone-600">
                                      {event.time && (
                                        <span className="flex items-center gap-1">
                                          <Clock className="h-4 w-4" />
                                          {event.time}
                                        </span>
                                      )}
                                      <span className="flex items-center gap-1">
                                        <MapPin className="h-4 w-4" />
                                        {event.location}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </TabsContent>

            <TabsContent value="past">
              {pastEvents.length === 0 ? (
                <div className="text-center py-16">
                  <Calendar className="h-16 w-16 text-stone-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-stone-600">No past events</h3>
                </div>
              ) : (
                <motion.div
                  initial="initial"
                  animate="animate"
                  variants={staggerContainer}
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {pastEvents.map((event) => {
                    const dateInfo = formatDate(event.date);
                    const IconComponent = categoryIcons[event.category] || Calendar;
                    const colorClass = categoryColors[event.category] || "bg-stone-100 text-stone-700";

                    return (
                      <motion.div key={event.id} variants={fadeInUp}>
                        <Card className="h-full border-0 shadow-md opacity-75">
                          <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                              <div
                                className={`w-10 h-10 rounded-full ${colorClass} flex items-center justify-center`}
                              >
                                <IconComponent className="h-5 w-5" />
                              </div>
                              <Badge variant="outline" className="border-stone-300 text-stone-600">
                                Past Event
                              </Badge>
                            </div>
                            <h3 className="text-lg font-serif font-bold text-stone-800 mb-2">
                              {event.title}
                            </h3>
                            <p className="text-stone-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                            <div className="space-y-2 text-sm text-stone-600">
                              <span className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {dateInfo.weekday}, {dateInfo.day} {dateInfo.month}
                              </span>
                              <span className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                {event.location}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <PizzaGallery />

      <PizzaSearchBlock />

      {isPizzaPage && <PizzaProofArticle />}

      {isPizzaPage && <PizzaFaqBlock />}

      <MembershipInvite />

      <RoadmapStrip />

      <FeedbackBand />

      {/* CTA Section */}
      <section className="py-16 bg-stone-800 text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Got something to share?
            </h2>
            <p className="text-stone-300 mb-8">
              Whether it's a workshop you want to run, a community gathering, or a skill you want to
              teach, we'd love to hear from you. The Harvest is made with the community, for the
              community.
            </p>
            <div className="flex justify-center">
              <EventSubmissionDialog onEventSubmitted={() => refetch()} />
            </div>
            <p className="mt-6 text-sm text-stone-400">
              Planning something bigger?{" "}
              <Link
                href="/venue-hire"
                className="text-amber-400 underline underline-offset-4 hover:text-amber-300"
              >
                Ask about using the space
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
