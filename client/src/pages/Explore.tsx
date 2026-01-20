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
} from "lucide-react";
import { useSeason } from "@/contexts/SeasonalContext";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
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
    image: "/images/zone-kitchen.jpg",
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
    image: "/images/zone-garden.jpg",
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
    image: "/images/zone-gathering.jpg",
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
    image: "/images/zone-makers.jpg",
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
    image: "/images/zone-forest.jpg",
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
    image: "/images/zone-arrival.jpg",
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
    image: "/images/zone-future.jpg",
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

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-b from-stone-100 to-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium bg-green-100 text-green-700 rounded-full">
              <MapPin className="h-4 w-4" />
              Interactive Site Map
            </span>

            <h1 className="text-5xl md:text-6xl font-serif font-bold text-stone-800 mb-6">
              Explore <span className="text-green-600">The Harvest</span>
            </h1>

            <p className="text-xl text-stone-600 mb-4 leading-relaxed">
              Discover the different spaces we're creating at The Harvest.
              Click on any zone to learn more about what's planned and what's in progress.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="py-12 bg-white">
        <div className="container">
          <div className="relative aspect-[16/10] bg-gradient-to-br from-green-100 via-amber-50 to-stone-100 rounded-2xl overflow-hidden shadow-lg">
            {/* Background illustration */}
            <div className="absolute inset-0 opacity-20">
              <svg
                viewBox="0 0 1000 625"
                className="w-full h-full"
                preserveAspectRatio="xMidYMid slice"
              >
                {/* Simple landscape lines */}
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

      {/* Zone Grid (Alternative View) */}
      <section className="py-24 bg-gradient-to-b from-white to-stone-50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mb-4">
              All Zones at a Glance
            </h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              Prefer a list view? Here's everything The Harvest has to offer.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {zones.map((zone, index) => (
              <motion.div
                key={zone.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className="h-full cursor-pointer hover:shadow-lg transition-shadow border-0 overflow-hidden"
                  onClick={() => setSelectedZone(zone)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-full ${zone.color} flex items-center justify-center shrink-0`}
                      >
                        <zone.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-serif font-bold text-stone-800 mb-1">
                          {zone.name}
                        </h3>
                        <p className="text-sm text-stone-600 line-clamp-2">
                          {zone.description}
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                          <span className="text-amber-600 text-sm font-medium group-hover:underline">
                            Learn more
                          </span>
                          <ArrowRight className="h-4 w-4 text-amber-600" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
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
