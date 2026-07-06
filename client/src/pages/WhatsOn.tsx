import { useState, useMemo } from "react";
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
import { listApprovedEvents } from "@/lib/api";
import { EventSubmissionDialog } from "@/components/EventSubmissionDialog";
import { SiteFooter, SiteNav } from "./HarvestReviewTest";
import { trpc } from "@/lib/trpc";
import { EditableText } from "@/components/EditableText";

// The members page (Mighty). Events and this week's dates land there first;
// every RSVP surface points people at it so the members space keeps growing.
const MEMBERS_PAGE_URL = "https://harvest-the-network.mn.co/share/aOwgIoYF3oOGUcfr?utm_source=website";
import eventsData from "@/data/events.json";
import { useQuery } from "@tanstack/react-query";

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

interface DBEvent {
  id: number;
  title: string;
  date: string;
  time: string | null;
  location: string;
  category: string;
  description: string | null;
}

function RegularSessions() {
  const sessions = [
    { slot: "session-friday", title: "Friday", detail: "DIY pizza and community movie night, 3pm to 8pm" },
    { slot: "session-saturday", title: "Saturday", detail: "DIY pizza making, 12pm to 8pm" },
    { slot: "session-sunday", title: "Sunday", detail: "DIY pizza making, 12pm to 6pm. An easier pace, good for families" },
  ];

  return (
    <section className="py-12 bg-white border-b border-stone-200">
      <div className="container max-w-4xl">
        <p className="text-amber-600 font-medium tracking-wide uppercase text-sm mb-2">
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
          <a
            href={MEMBERS_PAGE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-black font-semibold px-8 py-3 rounded-md transition-colors"
          >
            See this week's dates on the members page
          </a>
          <p className="text-sm text-stone-500">
            Weeks can vary. The members page has this week's dates first, and membership is free.
          </p>
        </div>
      </div>
    </section>
  );
}

function PizzaRsvpBlock() {
  const [form, setForm] = useState({ name: "", email: "", day: "", people: "2" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const submitRsvp = trpc.eoi.submit.useMutation();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      await submitRsvp.mutateAsync({
        name: form.name,
        email: form.email,
        day: form.day || undefined,
        people: form.people ? Number(form.people) : undefined,
        source: "whats-on",
      });
      setStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  return (
    <section className="py-12 bg-amber-50 border-y border-amber-200">
      <div className="container max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-800 mb-2">
          Coming along? Let us know
        </h2>
        <p className="text-stone-600 mb-4">
          The best place to RSVP is the members page. You can see this week's dates,
          message us directly, and hear about new dates first. Membership is free.
        </p>
        <a
          href={MEMBERS_PAGE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center bg-stone-800 hover:bg-stone-900 text-white font-semibold px-8 py-3 rounded-md transition-colors mb-6"
        >
          RSVP on the members page
        </a>
        <p className="text-stone-500 text-sm mb-6">
          Or leave your details here and we'll count you in.
        </p>
        {status === "success" ? (
          <div className="bg-white border border-amber-300 rounded-lg p-6">
            <p className="font-semibold text-stone-800">You're on the list.</p>
            <p className="text-stone-600 mt-1">
              We'll plan for you. For this week's dates and anything else,{" "}
              <a
                href={MEMBERS_PAGE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-700 underline hover:text-amber-800"
              >
                join us on the members page
              </a>
              .
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              required
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="rounded-md border border-stone-300 bg-white px-4 py-3 text-stone-800"
            />
            <input
              type="email"
              required
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="rounded-md border border-stone-300 bg-white px-4 py-3 text-stone-800"
            />
            <select
              value={form.day}
              onChange={(e) => setForm((f) => ({ ...f, day: e.target.value }))}
              className="rounded-md border border-stone-300 bg-white px-4 py-3 text-stone-800"
            >
              <option value="">Which session suits?</option>
              <option value="Friday evening (pizza + movie)">Friday evening (pizza + movie)</option>
              <option value="Saturday (12-8pm)">Saturday</option>
              <option value="Sunday (12-6pm)">Sunday</option>
              <option value="Not sure yet">Not sure yet</option>
            </select>
            <input
              type="number"
              min={1}
              max={30}
              placeholder="How many people?"
              value={form.people}
              onChange={(e) => setForm((f) => ({ ...f, people: e.target.value }))}
              className="rounded-md border border-stone-300 bg-white px-4 py-3 text-stone-800"
            />
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

  // Fetch approved events from database
  const { data: dbEvents, refetch } = useQuery({
    queryKey: ["events", "approved"],
    queryFn: listApprovedEvents,
  });

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

    const approvedEvents: Event[] = ((dbEvents || []) as DBEvent[]).map((e) => ({
      id: e.id,
      title: e.title,
      date: e.date,
      time: e.time || undefined,
      location: e.location,
      category: e.category.toLowerCase(),
      description: e.description || "",
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
      <section className="relative pt-36 pb-24 bg-gradient-to-b from-amber-50 to-white overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className="text-amber-600 font-medium tracking-wide uppercase text-sm">
              Events & Gatherings
            </span>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-stone-800 mt-3 mb-6">
              What's On
            </h1>
            <p className="text-xl text-stone-600 leading-relaxed mb-8">
              Markets, workshops, work days and gatherings at The Harvest, a community garden
              and creative gathering place in Witta, on Jinibara Country. New dates land on the
              members page first.
            </p>
            <EventSubmissionDialog onEventSubmitted={() => refetch()} />
          </motion.div>
        </div>
      </section>

      <RegularSessions />

      <PizzaRsvpBlock />

      {/* Filter Section */}
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

      {/* Events Content */}
      <section className="py-16 bg-white">
        <div className="container">
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
                  <p className="text-stone-500 mb-6">
                    The pizza weekend rhythm above runs most weeks. New dates land on the{" "}
                    <a
                      href={MEMBERS_PAGE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-600 underline hover:text-amber-700"
                    >
                      members page
                    </a>{" "}
                    first. You can also submit your own community event.
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
                                    <div className="flex flex-wrap gap-4 text-sm text-stone-500">
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
                              <Badge variant="outline" className="border-stone-300 text-stone-500">
                                Past Event
                              </Badge>
                            </div>
                            <h3 className="text-lg font-serif font-bold text-stone-800 mb-2">
                              {event.title}
                            </h3>
                            <p className="text-stone-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                            <div className="space-y-2 text-sm text-stone-500">
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <EventSubmissionDialog onEventSubmitted={() => refetch()} />
              <Button
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
                asChild
              >
                <a href="/venue-hire">
                  <Users className="mr-2 h-5 w-5" />
                  Enquire About Venue Hire
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
