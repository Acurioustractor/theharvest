import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Mail,
  MapPin,
  Phone,
  Send,
  Clock,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { MapView } from "@/components/Map";

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

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission - in production this would go to the API
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success("Message sent!", {
      description: "We'll get back to you as soon as we can.",
    });

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
    setIsSubmitting(false);
  };

  const handleMapReady = (map: google.maps.Map) => {
    const harvestLocation = { lat: -26.7833, lng: 152.8667 };

    new google.maps.Marker({
      position: harvestLocation,
      map,
      title: "The Harvest",
      icon: {
        url:
          "data:image/svg+xml," +
          encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="#d97706" stroke="#ffffff" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3" fill="#ffffff"/>
          </svg>
        `),
        scaledSize: new google.maps.Size(40, 40),
      },
    });

    map.setCenter(harvestLocation);
    map.setZoom(14);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-b from-stone-100 to-white overflow-hidden">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className="text-amber-600 font-medium tracking-wide uppercase text-sm">
              Get in Touch
            </span>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-stone-800 mt-3 mb-6">
              Contact Us
            </h1>
            <p className="text-xl text-stone-600 leading-relaxed">
              Have a question about what we're building, want to get involved, or just want to say hello?
              We'd love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-serif font-bold text-stone-800 mb-6">
                    Send us a message
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Your Name</Label>
                        <Input
                          id="name"
                          placeholder="Jane Smith"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, name: e.target.value }))
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="jane@example.com"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, email: e.target.value }))
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        placeholder="What's this about?"
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, subject: e.target.value }))
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us what's on your mind..."
                        className="min-h-[150px]"
                        value={formData.message}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, message: e.target.value }))
                        }
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold"
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        "Sending..."
                      ) : (
                        <>
                          Send Message
                          <Send className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Address */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-stone-800">
                    Visit Us
                  </h3>
                </div>
                <div className="ml-[60px]">
                  <p className="text-stone-700 font-medium mb-1">The Harvest</p>
                  <p className="text-stone-600">
                    123 Witta Road
                    <br />
                    Witta QLD 4552
                  </p>
                  <p className="text-stone-500 text-sm mt-2">
                    10 minutes from Maleny, in the Sunshine Coast Hinterland
                  </p>
                </div>
              </div>

              {/* Email */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-stone-800">
                    Email
                  </h3>
                </div>
                <div className="ml-[60px]">
                  <a
                    href="mailto:hello@theharvestwitta.com.au"
                    className="text-stone-700 hover:text-amber-600 transition-colors"
                  >
                    hello@theharvestwitta.com.au
                  </a>
                  <p className="text-stone-500 text-sm mt-1">
                    We typically respond within 1-2 business days
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Phone className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-stone-800">
                    Phone
                  </h3>
                </div>
                <div className="ml-[60px]">
                  <a
                    href="tel:+61422883943"
                    className="text-stone-700 hover:text-amber-600 transition-colors"
                  >
                    0422 883 943
                  </a>
                  <p className="text-stone-500 text-sm mt-1">
                    Best reached during opening hours
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-stone-800">
                    Opening Hours
                  </h3>
                </div>
                <div className="ml-[60px] text-stone-600 space-y-1">
                  <p>Wed–Fri: 8am – 3pm</p>
                  <p>Saturday: 7am – 2pm (Market day)</p>
                  <p>Sunday: 8am – 2pm</p>
                  <p className="text-stone-400">Mon–Tue: Closed</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-stone-50">
        <div className="container">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-8"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl font-serif font-bold text-stone-800 mb-4"
            >
              Find Us
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-stone-600">
              Tucked away in the hills of Witta
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="overflow-hidden border-0 shadow-lg">
              <div className="h-[400px]">
                <MapView onMapReady={handleMapReady} />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center mt-8"
          >
            <Button
              variant="outline"
              className="border-amber-300 text-amber-700 hover:bg-amber-50"
              onClick={() =>
                window.open(
                  "https://www.google.com/maps/dir/?api=1&destination=-26.7833,152.8667",
                  "_blank"
                )
              }
            >
              Get Directions
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
