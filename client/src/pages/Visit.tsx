import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Clock,
  Car,
  Accessibility,
  Dog,
  Baby,
  Coffee,
  Leaf,
  Phone,
  Mail,
  Navigation,
  Sun,
  Cloud,
  Umbrella,
} from "lucide-react";
import { MapView } from "@/components/Map";
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

const openingHours = [
  { day: "Wednesday", hours: "8am – 3pm", note: "Market prep day" },
  { day: "Thursday", hours: "8am – 3pm", note: "" },
  { day: "Friday", hours: "8am – 3pm", note: "" },
  { day: "Saturday", hours: "7am – 2pm", note: "Market day" },
  { day: "Sunday", hours: "8am – 2pm", note: "" },
  { day: "Monday", hours: "Closed", note: "" },
  { day: "Tuesday", hours: "Closed", note: "" },
];

const faqs = [
  {
    icon: Dog,
    question: "Are dogs welcome?",
    answer:
      "Well-behaved dogs on leads are welcome in our outdoor areas. Please keep them close and clean up after them.",
  },
  {
    icon: Baby,
    question: "Is it family-friendly?",
    answer:
      "Absolutely. We have highchairs, a grassy area for kids to run, and a relaxed atmosphere where families feel at home.",
  },
  {
    icon: Accessibility,
    question: "Is the venue accessible?",
    answer:
      "Our main building and café are wheelchair accessible with level entry. Accessible parking is available near the entrance.",
  },
  {
    icon: Coffee,
    question: "Can I just come for coffee?",
    answer:
      "Of course. Drop in for a coffee and a wander. No pressure to buy anything else – we're just happy you came.",
  },
  {
    icon: Leaf,
    question: "Do you cater for dietary needs?",
    answer:
      "We always have vegetarian and gluten-free options. Let us know about allergies and we'll do our best to accommodate.",
  },
  {
    icon: Car,
    question: "Is there parking?",
    answer:
      "Free parking on site with plenty of space. On market days, overflow parking is available in the adjacent paddock.",
  },
];

export default function Visit() {
  const handleMapReady = (map: google.maps.Map) => {
    // Add marker for The Harvest location
    const harvestLocation = { lat: -26.7833, lng: 152.8667 }; // Witta coordinates

    new google.maps.Marker({
      position: harvestLocation,
      map,
      title: "The Harvest",
      icon: {
        url: "data:image/svg+xml," + encodeURIComponent(`
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
      {/* Hero Section with Editable Image */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <EditableImage
            page="visit"
            slot="hero"
            alt="The Harvest entrance and grounds"
            className="h-full w-full"
            aspectRatio=""
            imageClassName="object-cover"
            placeholder={
              <div className="w-full h-full bg-gradient-to-br from-stone-600 via-stone-700 to-stone-800" />
            }
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        </div>

        <div className="container relative z-10 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <span className="text-amber-400 font-medium tracking-wide uppercase text-sm">
              Plan Your Visit
            </span>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mt-3 mb-6">
              Come find us in the hills
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              We're tucked away in Witta, just 10 minutes from Maleny. As we develop the site,
              we're opening our doors for markets, events, and community gatherings.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Location & Hours Grid */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="overflow-hidden border-0 shadow-lg h-full">
                <div className="h-80 lg:h-full min-h-[400px]">
                  <MapView onMapReady={handleMapReady} />
                </div>
              </Card>
            </motion.div>

            {/* Location Details */}
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
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-amber-600" />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-stone-800">Location</h2>
                </div>
                <div className="pl-13 ml-[52px]">
                  <p className="text-lg text-stone-700 mb-2">
                    <strong>The Harvest</strong>
                  </p>
                  <p className="text-stone-600 mb-4">
                    123 Witta Road
                    <br />
                    Witta QLD 4552
                  </p>
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
                    <Navigation className="mr-2 h-4 w-4" />
                    Get Directions
                  </Button>
                </div>
              </div>

              {/* Opening Hours */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-stone-800">Opening Hours</h2>
                </div>
                <div className="pl-13 ml-[52px]">
                  <div className="space-y-2">
                    {openingHours.map((item) => (
                      <div
                        key={item.day}
                        className={`flex justify-between items-center py-2 border-b border-stone-100 ${
                          item.hours === "Closed" ? "text-stone-400" : "text-stone-700"
                        }`}
                      >
                        <span className="font-medium">{item.day}</span>
                        <div className="text-right">
                          <span>{item.hours}</span>
                          {item.note && (
                            <span className="text-amber-600 text-sm ml-2">({item.note})</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-stone-800">Contact</h2>
                </div>
                <div className="pl-13 ml-[52px] space-y-2">
                  <a
                    href="tel:+61422883943"
                    className="flex items-center gap-2 text-stone-600 hover:text-amber-600 transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    0422 883 943
                  </a>
                  <a
                    href="mailto:hello@theharvestwitta.com.au"
                    className="flex items-center gap-2 text-stone-600 hover:text-amber-600 transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                    hello@theharvestwitta.com.au
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What to Expect */}
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
              What to expect
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-stone-600 max-w-2xl mx-auto">
              A few things to know before you arrive
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            <motion.div variants={fadeInUp}>
              <Card className="h-full border-0 shadow-md bg-white overflow-hidden">
                <EditableImage
                  page="visit"
                  slot="card-1"
                  alt="Misty morning at The Harvest"
                  aspectRatio="aspect-[4/3]"
                  placeholder={
                    <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                      <Sun className="h-12 w-12 text-amber-400" />
                    </div>
                  }
                />
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-serif font-bold text-stone-800 mb-3">
                    Dress for the hills
                  </h3>
                  <p className="text-stone-600">
                    It's often 5-10 degrees cooler up here than the coast. Bring a layer, especially
                    for early mornings.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="h-full border-0 shadow-md bg-white overflow-hidden">
                <EditableImage
                  page="visit"
                  slot="card-2"
                  alt="Rainy day at The Harvest"
                  aspectRatio="aspect-[4/3]"
                  placeholder={
                    <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                      <Umbrella className="h-12 w-12 text-green-400" />
                    </div>
                  }
                />
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-serif font-bold text-stone-800 mb-3">
                    Rain or shine
                  </h3>
                  <p className="text-stone-600">
                    We're open in all weather. The covered areas keep you dry, and there's nothing
                    like a hot coffee on a misty morning.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="h-full border-0 shadow-md bg-white overflow-hidden">
                <EditableImage
                  page="visit"
                  slot="card-3"
                  alt="Relaxing at The Harvest"
                  aspectRatio="aspect-[4/3]"
                  placeholder={
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                      <Cloud className="h-12 w-12 text-blue-400" />
                    </div>
                  }
                />
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-serif font-bold text-stone-800 mb-3">
                    Take your time
                  </h3>
                  <p className="text-stone-600">
                    This isn't a grab-and-go place. Sit down, have a wander, chat to someone new.
                    That's what we're here for.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
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
              Common questions
            </motion.h2>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {faqs.map((faq, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full border-0 shadow-sm bg-stone-50 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <faq.icon className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-stone-800 mb-2">{faq.question}</h3>
                        <p className="text-stone-600 text-sm leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
