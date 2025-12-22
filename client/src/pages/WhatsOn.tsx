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
import { trpc } from "@/lib/trpc";
import { EventSubmissionDialog } from "@/components/EventSubmissionDialog";
import eventsData from "@/data/events.json";

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
  date: Date;
  time: string | null;
  location: string;
  category: string;
  description: string | null;
}

export default function WhatsOn() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

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
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-b from-amber-50 to-white overflow-hidden">
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
              Markets, workshops, community gatherings, and more. There's always something happening
              at The Harvest – and you're always welcome.
            </p>
            <EventSubmissionDialog onEventSubmitted={() => refetch()} />
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white border-b border-stone-200 sticky top-0 z-40">
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
                  <h3 className="text-xl font-semibold text-stone-600 mb-2">No upcoming events</h3>
                  <p className="text-stone-500 mb-6">
                    Check back soon or submit your own community event!
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
              teach – we'd love to hear from you. The Harvest is built by the community, for the
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
    </div>
  );
}
