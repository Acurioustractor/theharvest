import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Milestone,
  Building,
  Users,
  Leaf,
  Heart,
  ArrowRight,
  CheckCircle2,
  Clock,
  Target,
  Camera,
} from "lucide-react";
import { useSeason } from "@/contexts/SeasonalContext";
import { HarvestGallery } from "@/components/EmpathyLedgerGallery";
import { EditableImage } from "@/components/EditableImage";
import { EditableText } from "@/components/EditableText";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  status: "complete" | "in-progress" | "planned";
  icon: React.ComponentType<{ className?: string }>;
  slot: "hero" | "featured" | "card-1" | "card-2" | "card-3" | "card-4" | "card-5" | "card-6";
  stats?: { label: string; value: string }[];
}

const timelineEvents: TimelineEvent[] = [
  {
    id: "discovery",
    date: "Early 2025",
    title: "Discovering the Site",
    description:
      "The old Witta Nursery site caught our eye – a neglected space with incredible potential. We began exploring what this could become for the community.",
    status: "complete",
    icon: Leaf,
    slot: "card-1",
  },
  {
    id: "consultation",
    date: "Q1 2025",
    title: "Community Consultation",
    description:
      "We're talking to locals, gathering ideas, and understanding what the community needs. Your input is shaping what The Harvest will become.",
    status: "in-progress",
    icon: Users,
    slot: "card-2",
  },
  {
    id: "activation",
    date: "Q1-Q2 2025",
    title: "Activation Phase",
    description:
      "Hosting early events and gatherings to bring people together while we develop the site. Testing ideas, building connections, and learning what works.",
    status: "in-progress",
    icon: Heart,
    slot: "card-3",
  },
  {
    id: "development",
    date: "Q2-Q3 2025",
    title: "Site Development",
    description:
      "Transforming the space: fitting out the kitchen, establishing garden areas, and creating gathering spaces. Volunteer work days and community build events.",
    status: "planned",
    icon: Building,
    slot: "card-4",
  },
  {
    id: "soft-launch",
    date: "Late 2025",
    title: "Soft Launch",
    description:
      "Opening our doors more regularly with markets, workshops, and community gatherings. The beginning of something lasting.",
    status: "planned",
    icon: Leaf,
    slot: "card-5",
  },
  {
    id: "future",
    date: "2026+",
    title: "The Vision Ahead",
    description:
      "A thriving community kitchen, flourishing gardens, regular workshops, and a hub where locals shape what happens. We're building this together.",
    status: "planned",
    icon: Target,
    slot: "card-6",
  },
];

function TimelineItem({
  event,
  index,
  isLast,
}: {
  event: TimelineEvent;
  index: number;
  isLast: boolean;
}) {
  const isEven = index % 2 === 0;

  const statusColors = {
    complete: "bg-green-500",
    "in-progress": "bg-amber-500",
    planned: "bg-stone-300",
  };

  const statusIcons = {
    complete: CheckCircle2,
    "in-progress": Clock,
    planned: Target,
  };

  const StatusIcon = statusIcons[event.status];

  return (
    <motion.div
      variants={fadeInUp}
      className={`flex items-start gap-4 md:gap-8 ${isEven ? "md:flex-row" : "md:flex-row-reverse"}`}
    >
      {/* Content Card */}
      <div className="flex-1">
        <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow">
          <div className="relative h-48 overflow-hidden">
            <EditableImage
              page="journey"
              slot={event.slot}
              alt={event.title}
              className="h-full w-full"
              aspectRatio=""
              imageClassName="object-cover"
              placeholder={
                <div className="w-full h-full bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center">
                  <Camera className="h-12 w-12 text-stone-400" />
                </div>
              }
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 pointer-events-none">
              <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-stone-700">
                {event.date}
              </span>
            </div>
          </div>
          <CardContent className="p-6">
            <div className="flex items-start gap-3 mb-3">
              <div
                className={`w-10 h-10 rounded-full ${statusColors[event.status]} flex items-center justify-center shrink-0`}
              >
                <event.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <EditableText
                  page="journey"
                  slot={`${event.id}-title`}
                  defaultContent={event.title}
                  as="h3"
                  className="text-xl font-serif font-bold text-stone-800"
                />
                <div className="flex items-center gap-2 mt-1">
                  <StatusIcon className="h-4 w-4 text-stone-500" />
                  <span className="text-sm text-stone-500 capitalize">
                    {event.status.replace("-", " ")}
                  </span>
                </div>
              </div>
            </div>
            <EditableText
              page="journey"
              slot={`${event.id}-description`}
              defaultContent={event.description}
              as="p"
              className="text-stone-600 leading-relaxed"
              multiline
            />
            {event.stats && (
              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-stone-100">
                {event.stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl font-serif font-bold text-amber-600">
                      {stat.value}
                    </p>
                    <p className="text-sm text-stone-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Timeline Line */}
      <div className="hidden md:flex flex-col items-center">
        <div
          className={`w-4 h-4 rounded-full ${statusColors[event.status]} ring-4 ring-white shadow-lg`}
        />
        {!isLast && <div className="w-0.5 h-32 bg-stone-200" />}
      </div>

      {/* Spacer for alternating layout */}
      <div className="hidden md:block flex-1" />
    </motion.div>
  );
}

export default function Journey() {
  const { data: seasonalData } = useSeason();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-b from-stone-100 to-white overflow-hidden">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium bg-amber-100 text-amber-700 rounded-full">
              <Milestone className="h-4 w-4" />
              Our Transformation
            </span>

            <EditableText
              page="journey"
              slot="hero-title"
              defaultContent="From Nursery to Community Hub"
              as="h1"
              className="text-5xl md:text-6xl font-serif font-bold text-stone-800 mb-6"
            />

            <EditableText
              page="journey"
              slot="hero-description"
              defaultContent="We're in the early stages of transforming an old Witta nursery into a community gathering place. Right now we're consulting with locals and hosting activation events – and you're invited to be part of the story."
              as="p"
              className="text-xl text-stone-600 mb-8 leading-relaxed"
              multiline
            />

            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
                <Heart className="h-5 w-5 text-red-500" />
                <span className="text-stone-700 font-medium">Community-built</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
                <Leaf className="h-5 w-5 text-green-500" />
                <span className="text-stone-700 font-medium">Regenerative</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
                <Users className="h-5 w-5 text-amber-500" />
                <span className="text-stone-700 font-medium">Inclusive</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-white">
        <div className="container max-w-4xl">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-8 md:space-y-0"
          >
            {timelineEvents.map((event, index) => (
              <TimelineItem
                key={event.id}
                event={event}
                index={index}
                isLast={index === timelineEvents.length - 1}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Transformation Gallery Section */}
      <section className="py-24 bg-stone-50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium bg-amber-100 text-amber-700 rounded-full">
              <Camera className="h-4 w-4" />
              Photo Gallery
            </span>
            <h2 className="text-4xl font-serif font-bold text-stone-800 mb-4">
              The Transformation in Pictures
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              From overgrown nursery to emerging community hub - browse photos
              documenting our journey and the hands that are building it.
            </p>
          </motion.div>

          <HarvestGallery tag="journey" />
        </div>
      </section>

      {/* Support CTA Section */}
      <section className="py-24 bg-stone-900 text-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              Be Part of the Next Chapter
            </h2>
            <p className="text-xl text-stone-300 mb-10 leading-relaxed">
              The Harvest is growing through community support. Whether you visit,
              volunteer, or join our mailing list, you're helping write the story.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
                asChild
              >
                <Link href="/membership">
                  Become a Member
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
                asChild
              >
                <Link href="/visit">Plan Your Visit</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
