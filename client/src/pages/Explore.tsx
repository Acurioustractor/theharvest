import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  MapPin,
  Utensils,
  Leaf,
  Users,
  Hammer,
  Car,
  TreeDeciduous,
  Building,
  ArrowRight,
  X,
  CheckCircle2,
  Clock,
  Target,
  Heart,
  Play,
  Camera,
  Lightbulb,
  MessageSquare,
  Ruler,
  Home,
  Sprout,
} from "lucide-react";
import { useSeason } from "@/contexts/SeasonalContext";
import { HarvestGallery } from "@/components/EmpathyLedgerGallery";
import { EditableText } from "@/components/EditableText";
import { EditableImage } from "@/components/EditableImage";

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

interface Zone {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  icon: React.ComponentType<{ className?: string }>;
  status: "complete" | "in-progress" | "planned";
  features: string[];
  position: { top: string; left: string };
  color: string;
  image?: string;
}

const zones: Zone[] = [
  {
    id: "kitchen",
    name: "The Kitchen",
    description: "Community kitchen for seasonal, honest food",
    longDescription:
      "The heart of The Harvest will be the kitchen. We're building a space to serve breakfast and lunch with ingredients sourced as locally as possible – where neighbours become friends over shared meals.",
    icon: Utensils,
    status: "in-progress",
    features: [
      "Seasonal breakfast menu planned",
      "Local produce partnerships",
      "Community cooking classes coming",
      "Commercial kitchen fit-out",
    ],
    position: { top: "35%", left: "45%" },
    color: "bg-amber-500",
    image: "/images/optimized/local-produce-900.webp",
  },
  {
    id: "garden-centre",
    name: "Garden Centre",
    description: "Native and productive plants for your patch",
    longDescription:
      "We're developing a curated selection of plants suited to the Sunshine Coast hinterland. Native species, productive fruit trees, and heirloom vegetables for your garden.",
    icon: Leaf,
    status: "in-progress",
    features: [
      "Native species focus",
      "Heirloom vegetable seedlings",
      "Fruit tree varieties",
      "Growing advice on-site",
    ],
    position: { top: "55%", left: "25%" },
    color: "bg-green-500",
    image: "/images/optimized/hero-aerial-1400.webp",
  },
  {
    id: "gathering-space",
    name: "Gathering Space",
    description: "Indoor-outdoor venue for events and celebrations",
    longDescription:
      "A flexible space taking shape for your needs. We're creating room for workshops, celebrations, community meetings, and private events in a setting that feels like home.",
    icon: Users,
    status: "in-progress",
    features: [
      "Capacity for 80 seated",
      "Indoor-outdoor flow",
      "AV equipment planned",
      "Catering options developing",
    ],
    position: { top: "25%", left: "65%" },
    color: "bg-blue-500",
    image: "/images/optimized/community-gathering-1200.webp",
  },
  {
    id: "makers-shed",
    name: "Makers Shed",
    description: "Workshop space for crafts and skills",
    longDescription:
      "We're planning a makers shed where you can get your hands dirty. Workshops in pottery, woodwork, preserving, and whatever else the community wants to learn.",
    icon: Hammer,
    status: "planned",
    features: [
      "Pottery wheel and kiln planned",
      "Basic woodworking tools",
      "Preserving kitchen",
      "Makers markets vision",
    ],
    position: { top: "65%", left: "60%" },
    color: "bg-purple-500",
    image: "/images/optimized/barry-5745-1000.webp",
  },
  {
    id: "food-forest",
    name: "Food Forest",
    description: "Productive gardens demonstrating permaculture principles",
    longDescription:
      "We're developing a food forest as a living demonstration of permaculture principles. Fruit trees, herbs, and vegetables working together in harmony.",
    icon: TreeDeciduous,
    status: "in-progress",
    features: [
      "Fruit tree varieties planted",
      "Herb spiral developing",
      "Composting systems",
      "Tours planned",
    ],
    position: { top: "75%", left: "40%" },
    color: "bg-emerald-500",
    image: "/images/optimized/hero-aerial-1400.webp",
  },
  {
    id: "parking",
    name: "Arrival Area",
    description: "Accessible parking and welcome point",
    longDescription:
      "We're establishing easy access parking with designated accessible spaces. A welcome point for first-time visitors is in development.",
    icon: Car,
    status: "in-progress",
    features: [
      "Car parking available",
      "Accessible spaces",
      "Bike racks coming",
      "EV charging planned",
    ],
    position: { top: "45%", left: "15%" },
    color: "bg-stone-500",
    image: "/images/optimized/seed-house-front-1600.webp",
  },
  {
    id: "future-hub",
    name: "Community Hub",
    description: "Future development: education and wellness centre",
    longDescription:
      "Our vision for the next phase: a purpose-built community hub housing educational programs, wellness services, and co-working space for local enterprises.",
    icon: Building,
    status: "planned",
    features: [
      "Multi-purpose education rooms",
      "Wellness treatment rooms",
      "Co-working desks",
      "Community library",
    ],
    position: { top: "20%", left: "35%" },
    color: "bg-stone-400",
    image: "/images/optimized/hero-aerial-1400.webp",
  },
];

// Room details with sizes
const rooms = [
  {
    id: "main-hall",
    name: "Main Hall",
    size: "120m²",
    capacity: "80 seated / 120 standing",
    description: "Our largest indoor space with high ceilings and natural light. Perfect for markets, celebrations, and community gatherings.",
    status: "in-progress" as const,
    features: ["Natural lighting", "Indoor-outdoor access", "Flexible layout"],
  },
  {
    id: "kitchen-space",
    name: "Commercial Kitchen",
    size: "45m²",
    capacity: "6 working stations",
    description: "A fully equipped commercial kitchen being fitted out for community cooking, catering, and food preparation classes.",
    status: "in-progress" as const,
    features: ["Commercial appliances", "Prep stations", "Cool room"],
  },
  {
    id: "studio",
    name: "The Studio",
    size: "35m²",
    capacity: "15-20 people",
    description: "An intimate space for workshops, small classes, and creative sessions. Quiet and focused.",
    status: "planned" as const,
    features: ["Acoustic treatment", "Natural light", "Breakout area"],
  },
  {
    id: "deck",
    name: "Covered Deck",
    size: "60m²",
    capacity: "40 seated",
    description: "Undercover outdoor space connecting inside to garden. Rain or shine, this is where morning coffee happens.",
    status: "in-progress" as const,
    features: ["Weather protected", "Garden views", "Cafe seating"],
  },
];

// Activation ideas
const activationIdeas = [
  {
    title: "Artist Studios",
    description: "Dedicated spaces for local artists to work, create, and share their practice with the community.",
    icon: Lightbulb,
    timeline: "2025",
  },
  {
    title: "Co-working Desks",
    description: "Flexible workspace for remote workers, freelancers, and knowledge workers who want community.",
    icon: Building,
    timeline: "2025",
  },
  {
    title: "Makers Markets",
    description: "Regular markets showcasing local artisans, growers, and makers from the hinterland.",
    icon: Hammer,
    timeline: "Q2 2025",
  },
  {
    title: "Community Kitchen Days",
    description: "Open kitchen sessions where locals cook together, share recipes, and build connection over food.",
    icon: Utensils,
    timeline: "Q3 2025",
  },
];

function ZoneModal({
  zone,
  onClose,
}: {
  zone: Zone;
  onClose: () => void;
}) {
  const statusConfig = {
    complete: { icon: CheckCircle2, label: "Operational", color: "text-green-600 bg-green-100" },
    "in-progress": { icon: Clock, label: "In Development", color: "text-amber-600 bg-amber-100" },
    planned: { icon: Target, label: "Future Vision", color: "text-stone-600 bg-stone-100" },
  };

  const StatusIcon = statusConfig[zone.status].icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-2xl overflow-hidden max-w-lg w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {zone.image && (
          <div className="relative h-48">
            <img
              src={zone.image}
              alt={zone.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
            >
              <X className="h-5 w-5 text-stone-700" />
            </button>
            <div className="absolute bottom-4 left-4 flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full ${zone.color} flex items-center justify-center`}>
                <zone.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-white drop-shadow-lg">
                {zone.name}
              </h3>
            </div>
          </div>
        )}

        <div className="p-6">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 ${statusConfig[zone.status].color}`}>
            <StatusIcon className="h-4 w-4" />
            {statusConfig[zone.status].label}
          </div>

          <p className="text-stone-600 leading-relaxed mb-6">
            {zone.longDescription}
          </p>

          <div className="space-y-2 mb-6">
            <h4 className="text-sm font-semibold text-stone-500 uppercase tracking-wide">
              Features
            </h4>
            <ul className="grid grid-cols-2 gap-2">
              {zone.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2 text-sm text-stone-600"
                >
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {zone.status === "planned" && (
            <div className="p-4 bg-amber-50 rounded-lg mb-6">
              <p className="text-sm text-amber-800">
                <Heart className="h-4 w-4 inline mr-1" />
                This is a future vision. Your support helps make it reality.
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-black"
              asChild
            >
              <Link href="/visit">Plan Your Visit</Link>
            </Button>
            {zone.status === "planned" && (
              <Button
                variant="outline"
                asChild
              >
                <Link href="/membership">Support This</Link>
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Explore() {
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const { data: seasonalData } = useSeason();

  const statusConfig = {
    complete: { label: "Ready", color: "bg-green-100 text-green-700" },
    "in-progress": { label: "In Progress", color: "bg-amber-100 text-amber-700" },
    planned: { label: "Planned", color: "bg-stone-100 text-stone-600" },
  };

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
              <Home className="h-4 w-4" />
              Discover The Harvest
            </span>

            <EditableText
              page="space"
              slot="hero-title"
              defaultContent="The Space"
              as="h1"
              className="text-5xl md:text-6xl font-serif font-bold text-stone-800 mb-6"
            />

            <EditableText
              page="space"
              slot="hero-description"
              defaultContent="An old plant nursery in Witta, transforming into something new. Explore the buildings, gardens, and spaces we're creating – and imagine what they could become."
              as="p"
              className="text-xl text-stone-600 mb-8 leading-relaxed"
              multiline
            />
          </motion.div>
        </div>
      </section>

      {/* The Story Section */}
      <section className="py-24 bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-amber-600 font-medium tracking-wide uppercase text-sm">
                The Story
              </span>
              <h2 className="text-4xl font-serif font-bold text-stone-800 mt-3 mb-6">
                From Nursery to Community Hub
              </h2>
              <div className="space-y-4 text-stone-600 leading-relaxed">
                <p>
                  This site was once a thriving plant nursery, serving the Witta community for decades.
                  When it closed, the land sat waiting – greenhouses empty, gardens overgrown,
                  but the bones of something special still here.
                </p>
                <p>
                  We saw potential: not just buildings and land, but a place where people could
                  gather, create, and belong. A community hub growing from what already existed,
                  shaped by the people who show up.
                </p>
                <p>
                  Today we're in the early stages – cleaning, planning, dreaming. Every week
                  the space evolves. And we're inviting you to be part of that story.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <EditableImage
                page="space"
                slot="story-image"
                alt="The Harvest transformation"
                className="w-full aspect-[4/3] rounded-2xl shadow-lg"
                imageClassName="object-cover"
                placeholder={
                  <div className="w-full h-full bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center rounded-2xl">
                    <Camera className="h-16 w-16 text-stone-400" />
                  </div>
                }
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Video Walkthrough Section */}
      <section className="py-24 bg-stone-50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium bg-blue-100 text-blue-700 rounded-full">
              <Play className="h-4 w-4" />
              Video Tour
            </span>
            <h2 className="text-4xl font-serif font-bold text-stone-800 mb-4">
              Walk Through The Harvest
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Take a virtual stroll through the space and see the transformation in progress.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            {/* Video placeholder - replace with actual embed */}
            <div className="relative aspect-video bg-stone-200 rounded-2xl overflow-hidden shadow-lg">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Play className="h-8 w-8 text-amber-600 ml-1" />
                  </div>
                  <p className="text-stone-500 font-medium">Video coming soon</p>
                  <p className="text-stone-400 text-sm mt-1">We're filming the walkthrough</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section className="py-24 bg-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium bg-pink-100 text-pink-700 rounded-full">
              <Camera className="h-4 w-4" />
              Photo Gallery
            </span>
            <h2 className="text-4xl font-serif font-bold text-stone-800 mb-4">
              See The Space
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Browse photos of the buildings, gardens, and ongoing transformation.
            </p>
          </motion.div>

          <HarvestGallery />
        </div>
      </section>

      {/* The Rooms Section */}
      <section className="py-24 bg-stone-50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium bg-amber-100 text-amber-700 rounded-full">
              <Ruler className="h-4 w-4" />
              Indoor Spaces
            </span>
            <h2 className="text-4xl font-serif font-bold text-stone-800 mb-4">
              The Rooms
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Our indoor spaces – each with its own character and purpose.
            </p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto"
          >
            {rooms.map((room) => (
              <motion.div key={room.id} variants={fadeInUp}>
                <Card className="h-full border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-serif font-bold text-stone-800">
                          {room.name}
                        </h3>
                        <p className="text-amber-600 font-medium">{room.size}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig[room.status].color}`}>
                        {statusConfig[room.status].label}
                      </span>
                    </div>
                    <p className="text-stone-600 mb-4">{room.description}</p>
                    <div className="flex items-center gap-2 text-sm text-stone-500 mb-4">
                      <Users className="h-4 w-4" />
                      {room.capacity}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {room.features.map((feature) => (
                        <span
                          key={feature}
                          className="px-2 py-1 bg-stone-100 text-stone-600 rounded text-xs"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* The Gardens Section */}
      <section className="py-24 bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1"
            >
              <EditableImage
                page="space"
                slot="garden-image"
                alt="The Harvest gardens"
                className="w-full aspect-[4/3] rounded-2xl shadow-lg"
                imageClassName="object-cover"
                placeholder={
                  <div className="w-full h-full bg-gradient-to-br from-green-200 to-emerald-300 flex items-center justify-center rounded-2xl">
                    <Sprout className="h-16 w-16 text-green-500" />
                  </div>
                }
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-1 lg:order-2"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium bg-green-100 text-green-700 rounded-full">
                <Leaf className="h-4 w-4" />
                Outdoor Spaces
              </span>
              <h2 className="text-4xl font-serif font-bold text-stone-800 mb-6">
                The Gardens
              </h2>
              <div className="space-y-4 text-stone-600 leading-relaxed">
                <p>
                  The land holds decades of growing history. Former nursery beds are becoming
                  food gardens. Established trees provide shade and fruit. Native plantings
                  are returning habitat for local wildlife.
                </p>
                <p>
                  We're developing a food forest, herb spirals, and demonstration gardens
                  that show what's possible in the Sunshine Coast hinterland climate.
                  This is hands-in-soil learning.
                </p>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-serif font-bold text-green-700">2,000m²</p>
                  <p className="text-sm text-green-600">Garden area</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-serif font-bold text-green-700">50+</p>
                  <p className="text-sm text-green-600">Fruit trees</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="py-24 bg-stone-50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium bg-green-100 text-green-700 rounded-full">
              <MapPin className="h-4 w-4" />
              Interactive Map
            </span>
            <h2 className="text-4xl font-serif font-bold text-stone-800 mb-4">
              Explore the Site
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Click on any zone to learn more about what's planned and what's in progress.
            </p>
          </motion.div>

          <div className="relative aspect-[16/10] bg-gradient-to-br from-green-100 via-amber-50 to-stone-100 rounded-2xl overflow-hidden shadow-lg">
            {/* Background illustration */}
            <div className="absolute inset-0 opacity-20">
              <svg
                viewBox="0 0 1000 625"
                className="w-full h-full"
                preserveAspectRatio="xMidYMid slice"
              >
                <path
                  d="M0 500 Q250 450 500 480 T1000 460 V625 H0Z"
                  fill="currentColor"
                  className="text-green-300"
                />
                <path
                  d="M0 520 Q350 490 700 510 T1000 490 V625 H0Z"
                  fill="currentColor"
                  className="text-green-400"
                />
              </svg>
            </div>

            {/* Zone markers */}
            {zones.map((zone) => (
              <motion.button
                key={zone.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                style={{ top: zone.position.top, left: zone.position.left }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedZone(zone)}
              >
                <div
                  className={`relative w-14 h-14 ${zone.color} rounded-full flex items-center justify-center shadow-lg ring-4 ring-white group-hover:ring-amber-200 transition-all`}
                >
                  <zone.icon className="h-7 w-7 text-white" />
                  {zone.status === "in-progress" && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full border-2 border-white" />
                  )}
                  {zone.status === "planned" && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-stone-400 rounded-full border-2 border-white" />
                  )}
                </div>
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded text-xs font-medium text-stone-700 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    {zone.name}
                  </span>
                </div>
              </motion.button>
            ))}

            {/* Legend */}
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-sm">
              <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">
                Status
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-stone-600">Operational</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-stone-600">In Development</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-stone-400" />
                  <span className="text-stone-600">Future Vision</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-stone-500 mt-4">
            Click on any marker to learn more about that area
          </p>
        </div>
      </section>

      {/* Activation Ideas Section */}
      <section className="py-24 bg-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium bg-purple-100 text-purple-700 rounded-full">
              <Lightbulb className="h-4 w-4" />
              What's Next
            </span>
            <h2 className="text-4xl font-serif font-bold text-stone-800 mb-4">
              Activation Ideas
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Here's what we're dreaming about for these spaces. Have an idea? We'd love to hear it.
            </p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {activationIdeas.map((idea) => (
              <motion.div key={idea.title} variants={fadeInUp}>
                <Card className="h-full border-0 shadow-md bg-gradient-to-br from-purple-50 to-white">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                      <idea.icon className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-serif font-bold text-stone-800 mb-2">
                      {idea.title}
                    </h3>
                    <p className="text-stone-600 text-sm mb-4">{idea.description}</p>
                    <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                      Target: {idea.timeline}
                    </span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <Card className="border-0 shadow-lg bg-gradient-to-r from-amber-50 to-orange-50">
              <CardContent className="p-8 text-center">
                <MessageSquare className="h-10 w-10 text-amber-600 mx-auto mb-4" />
                <h3 className="text-2xl font-serif font-bold text-stone-800 mb-3">
                  Got an Idea?
                </h3>
                <p className="text-stone-600 mb-6">
                  We're building this with the community. If you have an idea for how
                  a space could be used, a workshop you'd like to run, or something
                  you'd love to see here – tell us.
                </p>
                <Button
                  className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
                  asChild
                >
                  <Link href="/contact">
                    Share Your Idea
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
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
              Come See It For Yourself
            </h2>
            <p className="text-xl text-stone-300 mb-10 leading-relaxed">
              Photos only tell part of the story. Visit The Harvest, walk the grounds,
              and feel what this place could become.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
                asChild
              >
                <Link href="/visit">
                  Plan Your Visit
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
                asChild
              >
                <Link href="/journey">See Our Journey</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Zone Modal */}
      <AnimatePresence>
        {selectedZone && (
          <ZoneModal zone={selectedZone} onClose={() => setSelectedZone(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
