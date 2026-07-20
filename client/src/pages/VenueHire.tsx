import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Calendar,
  Clock,
  Car,
  Coffee,
  Utensils,
  CheckCircle,
  ArrowRight,
  Mail,
  Phone,
  Loader2,
} from "lucide-react";
import { communitySubmit } from "@/lib/api";
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

const spaces = [
  {
    name: "The Main Hall",
    capacity: "Up to 80 seated / 120 standing",
    description:
      "Our largest space is taking shape with exposed timber beams, natural light, and flexible seating. Perfect for workshops, markets, and celebrations.",
    features: ["Natural lighting", "Flexible layout", "Kitchen access coming", "Sound system planned"],
    ideal: ["Workshops", "Markets", "Private events", "Community gatherings"],
  },
  {
    name: "The Garden Pavilion",
    capacity: "Up to 40 seated",
    description:
      "A covered outdoor space we're developing surrounded by native gardens. Ideal for intimate gatherings, small workshops, or casual dining events.",
    features: ["Covered outdoor", "Garden views", "Power outlets", "BBQ access planned"],
    ideal: ["Small workshops", "Garden parties", "Pop-up dining", "Meetings"],
  },
  {
    name: "The Kitchen",
    capacity: "Up to 12 participants",
    description:
      "We're fitting out a commercial kitchen for cooking classes, food prep, and catering support for larger events.",
    features: ["Commercial appliances", "Prep stations", "Storage", "Dishwashing"],
    ideal: ["Cooking classes", "Food prep", "Catering base", "Preserving workshops"],
  },
];

const amenities = [
  { icon: Car, label: "Free Parking" },
  { icon: Coffee, label: "Tea & Coffee" },
  { icon: Utensils, label: "Kitchen Access" },
  { icon: Users, label: "Accessible Entry" },
];

export default function VenueHire() {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function updateField(name: string, value: string) {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (status === "error") setStatus("idle");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const result = await communitySubmit({
        type: "venue-enquiry",
        ...formData,
        ...currentAttribution(),
      });
      if (result.success) {
        setStatus("success");
        setFormData({});
      } else {
        setErrorMsg(result.error || "Something went wrong.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Could not connect. Please try again.");
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="relative py-24 bg-stone-100 overflow-hidden">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className="text-amber-600 font-medium tracking-wide uppercase text-sm">
              Host Your Event
            </span>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-stone-800 mt-3 mb-6">
              Venue Hire
            </h1>
            <p className="text-xl text-stone-600 leading-relaxed">
              We're developing flexible spaces for workshops, celebrations, community events,
              and more — surrounded by the beauty of the hinterland. Get in touch to discuss
              what's possible.
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
              Each space has its own character — choose the one that fits your vision.
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
                      {/* Image placeholder */}
                      <div
                        className={`h-64 lg:h-auto bg-stone-200 ${index % 2 === 1 ? "lg:order-2" : ""}`}
                      >
                        <div className="w-full h-full bg-gradient-to-br from-stone-100 to-amber-50 flex items-center justify-center">
                          <div className="text-center p-8">
                            <Users className="h-16 w-16 text-amber-600 mx-auto mb-4" />
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
                                  <CheckCircle className="h-4 w-4 text-amber-500" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-stone-800 mb-3">Ideal For</h4>
                            <div className="flex flex-wrap gap-2">
                              {space.ideal.map((use) => (
                                <span
                                  key={use}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-amber-300 text-amber-700 bg-amber-50"
                                >
                                  {use}
                                </span>
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
      <section className="py-16 bg-stone-100">
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
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto"
          >
            {amenities.map((amenity) => (
              <motion.div key={amenity.label} variants={fadeInUp}>
                <Card className="h-full border-0 shadow-sm bg-white text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3">
                      <amenity.icon className="h-6 w-6 text-amber-600" />
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
                <CardContent className="p-8">
                  <h2 className="text-2xl font-serif font-bold text-stone-800 mb-2">
                    Make an Enquiry
                  </h2>
                  <p className="text-stone-600 mb-6">
                    Tell us about your event and we'll get back to you with availability and pricing.
                  </p>

                  {status === "success" ? (
                    <div className="text-center py-12 space-y-4">
                      <CheckCircle className="h-12 w-12 text-amber-500 mx-auto" />
                      <h3 className="font-serif text-xl text-stone-800">Thanks for your enquiry</h3>
                      <p className="text-stone-600">We'll get back to you within 2 business days.</p>
                      <button
                        onClick={() => { setStatus("idle"); setFormData({}); }}
                        className="mt-4 px-6 py-2 rounded-lg bg-stone-800 text-stone-200 text-sm font-medium hover:bg-stone-700 transition-colors"
                      >
                        Submit another
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-stone-700 mb-1">
                            Your name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.name || ""}
                            onChange={(e) => updateField("name", e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-stone-700 mb-1">
                            Email <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            required
                            value={formData.email || ""}
                            onChange={(e) => updateField("email", e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-stone-700 mb-1">Phone</label>
                          <input
                            type="text"
                            value={formData.phone || ""}
                            onChange={(e) => updateField("phone", e.target.value)}
                            placeholder="0400 000 000"
                            className="w-full px-4 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-800 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-stone-700 mb-1">
                            Event type <span className="text-red-500">*</span>
                          </label>
                          <select
                            required
                            value={formData.eventType || ""}
                            onChange={(e) => updateField("eventType", e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          >
                            <option value="">Select...</option>
                            <option value="workshop">Workshop</option>
                            <option value="celebration">Celebration / Party</option>
                            <option value="meeting">Meeting / Retreat</option>
                            <option value="market">Market / Pop-up</option>
                            <option value="class">Class / Course</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-stone-700 mb-1">Preferred date</label>
                          <input
                            type="date"
                            value={formData.date || ""}
                            onChange={(e) => updateField("date", e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-stone-700 mb-1">Expected guests</label>
                          <input
                            type="number"
                            min="1"
                            max="150"
                            placeholder="e.g. 30"
                            value={formData.guests || ""}
                            onChange={(e) => updateField("guests", e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-800 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">
                          Tell us about your event <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          required
                          rows={4}
                          placeholder="What are you planning? Any special requirements?"
                          value={formData.message || ""}
                          onChange={(e) => updateField("message", e.target.value)}
                          className="w-full px-4 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-800 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-y"
                        />
                      </div>

                      {status === "error" && (
                        <p className="text-red-600 text-sm">{errorMsg}</p>
                      )}

                      <button
                        type="submit"
                        disabled={status === "loading"}
                        className="flex items-center gap-2 px-6 py-3 rounded-lg bg-amber-500 text-black font-medium text-sm hover:bg-amber-400 transition-colors disabled:opacity-60"
                      >
                        {status === "loading" ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <ArrowRight className="h-4 w-4" />
                        )}
                        Send Enquiry
                      </button>
                    </form>
                  )}
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
                    <CheckCircle className="h-5 w-5 text-amber-500 mt-1 flex-shrink-0" />
                    <div>
                      <strong className="text-stone-800">Flexible spaces</strong>
                      <p className="text-stone-600">
                        From intimate workshops to larger gatherings, we can accommodate your needs.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-amber-500 mt-1 flex-shrink-0" />
                    <div>
                      <strong className="text-stone-800">Beautiful setting</strong>
                      <p className="text-stone-600">
                        Surrounded by native gardens and hinterland views — a world away from the everyday.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-amber-500 mt-1 flex-shrink-0" />
                    <div>
                      <strong className="text-stone-800">Community rates</strong>
                      <p className="text-stone-600">
                        Discounted rates for local community groups and non-profits.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-amber-500 mt-1 flex-shrink-0" />
                    <div>
                      <strong className="text-stone-800">Catering options</strong>
                      <p className="text-stone-600">
                        We can connect you with local caterers or you can use our kitchen facilities.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <Card className="border-0 shadow-md bg-stone-100">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-stone-800 mb-4">Prefer to chat?</h4>
                  <div className="space-y-3">
                    <a
                      href="tel:+61422883943"
                      className="flex items-center gap-3 text-stone-600 hover:text-amber-600 transition-colors"
                    >
                      <Phone className="h-5 w-5" />
                      0422 883 943
                    </a>
                    <a
                      href="mailto:hello@theharvestwitta.com.au"
                      className="flex items-center gap-3 text-stone-600 hover:text-amber-600 transition-colors"
                    >
                      <Mail className="h-5 w-5" />
                      hello@theharvestwitta.com.au
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
                        smaller gatherings, we can often accommodate shorter notice — just ask.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md bg-stone-50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Clock className="h-8 w-8 text-amber-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-stone-800 mb-2">Still Taking Shape</h4>
                      <p className="text-stone-600 text-sm">
                        Some spaces are still being developed. We're happy to discuss what's available
                        now and what's coming — get in touch and we'll work something out.
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
