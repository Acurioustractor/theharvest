import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Calendar,
  Clock,
  Wifi,
  Car,
  Coffee,
  Music,
  Utensils,
  CheckCircle,
  ArrowRight,
  Mail,
  Phone,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

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

const spaces = [
  {
    name: "The Main Hall",
    capacity: "Up to 80 seated / 120 standing",
    description:
      "Our largest space with exposed timber beams, natural light, and flexible seating. Perfect for workshops, markets, and celebrations.",
    features: ["Natural lighting", "Sound system", "Flexible layout", "Kitchen access"],
    ideal: ["Workshops", "Markets", "Private events", "Community gatherings"],
    image: "/images/venue-main-hall.jpg",
  },
  {
    name: "The Garden Pavilion",
    capacity: "Up to 40 seated",
    description:
      "A covered outdoor space surrounded by native gardens. Ideal for intimate gatherings, small workshops, or casual dining events.",
    features: ["Covered outdoor", "Garden views", "Power outlets", "BBQ access"],
    ideal: ["Small workshops", "Garden parties", "Pop-up dining", "Meetings"],
    image: "/images/venue-pavilion.jpg",
  },
  {
    name: "The Kitchen",
    capacity: "Up to 12 participants",
    description:
      "A fully equipped commercial kitchen for cooking classes, food prep, or catering support for larger events.",
    features: ["Commercial appliances", "Prep stations", "Storage", "Dishwashing"],
    ideal: ["Cooking classes", "Food prep", "Catering base", "Preserving workshops"],
    image: "/images/venue-kitchen.jpg",
  },
];

const amenities = [
  { icon: Wifi, label: "Free WiFi" },
  { icon: Car, label: "Free Parking" },
  { icon: Coffee, label: "Tea & Coffee" },
  { icon: Music, label: "Sound System" },
  { icon: Utensils, label: "Kitchen Access" },
  { icon: Users, label: "Accessible Entry" },
];

export default function VenueHire() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eventType, setEventType] = useState("");
  const [selectedSpace, setSelectedSpace] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success("Enquiry sent successfully!", {
      description: "We'll get back to you within 2 business days.",
    });

    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
    setEventType("");
    setSelectedSpace("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-b from-green-50 to-white overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
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
            <span className="text-green-600 font-medium tracking-wide uppercase text-sm">
              Host Your Event
            </span>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-stone-800 mt-3 mb-6">
              Venue Hire
            </h1>
            <p className="text-xl text-stone-600 leading-relaxed">
              Looking for a space with character? The Harvest offers flexible venues for workshops,
              celebrations, community events, and more – all surrounded by the beauty of the
              hinterland.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Spaces Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mb-4"
            >
              Our Spaces
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-stone-600 max-w-2xl mx-auto">
              Each space has its own character – choose the one that fits your vision.
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-8"
          >
            {spaces.map((space, index) => (
              <motion.div key={space.name} variants={fadeInUp}>
                <Card className="overflow-hidden border-0 shadow-lg">
                  <CardContent className="p-0">
                    <div
                      className={`grid lg:grid-cols-2 ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
                    >
                      {/* Image */}
                      <div
                        className={`h-64 lg:h-auto bg-stone-200 ${index % 2 === 1 ? "lg:order-2" : ""}`}
                      >
                        <div className="w-full h-full bg-gradient-to-br from-green-100 to-amber-100 flex items-center justify-center">
                          <div className="text-center p-8">
                            <Users className="h-16 w-16 text-green-600 mx-auto mb-4" />
                            <p className="text-stone-600 font-medium">{space.capacity}</p>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-8 lg:p-12">
                        <h3 className="text-2xl font-serif font-bold text-stone-800 mb-2">
                          {space.name}
                        </h3>
                        <p className="text-amber-600 font-medium mb-4">{space.capacity}</p>
                        <p className="text-stone-600 mb-6">{space.description}</p>

                        <div className="grid sm:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold text-stone-800 mb-3">Features</h4>
                            <ul className="space-y-2">
                              {space.features.map((feature) => (
                                <li key={feature} className="flex items-center gap-2 text-stone-600">
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-stone-800 mb-3">Ideal For</h4>
                            <div className="flex flex-wrap gap-2">
                              {space.ideal.map((use) => (
                                <Badge
                                  key={use}
                                  variant="outline"
                                  className="border-green-300 text-green-700"
                                >
                                  {use}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-16 bg-stone-50">
        <div className="container">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mb-4"
            >
              What's Included
            </motion.h2>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
          >
            {amenities.map((amenity) => (
              <motion.div key={amenity.label} variants={fadeInUp}>
                <Card className="h-full border-0 shadow-sm bg-white text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                      <amenity.icon className="h-6 w-6 text-green-600" />
                    </div>
                    <p className="font-medium text-stone-700">{amenity.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Enquiry Form Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif">Make an Enquiry</CardTitle>
                  <p className="text-stone-600">
                    Tell us about your event and we'll get back to you with availability and pricing.
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Your Name</Label>
                        <Input id="name" name="name" required placeholder="Jane Smith" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          placeholder="jane@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" name="phone" placeholder="0400 000 000" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="eventType">Event Type</Label>
                        <Select value={eventType} onValueChange={setEventType} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="workshop">Workshop</SelectItem>
                            <SelectItem value="celebration">Celebration / Party</SelectItem>
                            <SelectItem value="meeting">Meeting / Retreat</SelectItem>
                            <SelectItem value="market">Market / Pop-up</SelectItem>
                            <SelectItem value="class">Class / Course</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">Preferred Date</Label>
                        <Input id="date" name="date" type="date" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="guests">Expected Guests</Label>
                        <Input
                          id="guests"
                          name="guests"
                          type="number"
                          placeholder="e.g., 30"
                          min="1"
                          max="150"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="space">Preferred Space</Label>
                      <Select value={selectedSpace} onValueChange={setSelectedSpace}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a space (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="main-hall">The Main Hall</SelectItem>
                          <SelectItem value="garden-pavilion">The Garden Pavilion</SelectItem>
                          <SelectItem value="kitchen">The Kitchen</SelectItem>
                          <SelectItem value="not-sure">Not sure yet</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Tell us about your event</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="What are you planning? Any special requirements?"
                        className="h-32"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Enquiry
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-2xl font-serif font-bold text-stone-800 mb-4">
                  Why host at The Harvest?
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <strong className="text-stone-800">Flexible spaces</strong>
                      <p className="text-stone-600">
                        From intimate workshops to larger gatherings, we can accommodate your needs.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <strong className="text-stone-800">Beautiful setting</strong>
                      <p className="text-stone-600">
                        Surrounded by native gardens and hinterland views – a world away from the
                        everyday.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <strong className="text-stone-800">Community rates</strong>
                      <p className="text-stone-600">
                        Discounted rates for local community groups and non-profits.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <strong className="text-stone-800">Catering options</strong>
                      <p className="text-stone-600">
                        We can connect you with local caterers or you can use our kitchen facilities.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <Card className="border-0 shadow-md bg-stone-50">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-stone-800 mb-4">Prefer to chat?</h4>
                  <div className="space-y-3">
                    <a
                      href="tel:+61754941234"
                      className="flex items-center gap-3 text-stone-600 hover:text-green-600 transition-colors"
                    >
                      <Phone className="h-5 w-5" />
                      (07) 5494 1234
                    </a>
                    <a
                      href="mailto:venues@theharvestwitta.com.au"
                      className="flex items-center gap-3 text-stone-600 hover:text-green-600 transition-colors"
                    >
                      <Mail className="h-5 w-5" />
                      venues@theharvestwitta.com.au
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md bg-amber-50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Calendar className="h-8 w-8 text-amber-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-stone-800 mb-2">Booking Timeline</h4>
                      <p className="text-stone-600 text-sm">
                        We recommend booking at least 4 weeks in advance for larger events. For
                        smaller gatherings, we can often accommodate shorter notice – just ask!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
