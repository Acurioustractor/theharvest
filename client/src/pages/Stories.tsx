import { useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PenLine, ArrowDown } from "lucide-react";
import { Link } from "wouter";

const barryPhotos = [
  { src: "/images/compendium/barry/IMG_5764.jpg", caption: "Barry at golden hour" },
  { src: "/images/compendium/barry/IMG_5699.jpg", caption: "Inside the shed" },
  { src: "/images/compendium/barry/IMG_5659.jpg", caption: "Among the engines" },
  { src: "/images/compendium/barry/IMG_5727.jpg", caption: "Stories are better shared" },
  { src: "/images/compendium/barry/IMG_5745.jpg", caption: "The machines that built the hinterland" },
  { src: "/images/compendium/barry/IMG_5633.jpg", caption: "Barry" },
];

interface StoryCard {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  available: boolean;
}

const storyCards: StoryCard[] = [
  {
    id: "barry",
    title: "Barry & The Shed",
    subtitle: "Decades of engines, rust, and memory",
    image: barryPhotos[5].src,
    available: true,
  },
  {
    id: "the-land",
    title: "The Land Beneath",
    subtitle: "Jinibara Country, cedar-getters, and red soil",
    image: "/images/compendium/barry/IMG_5745.jpg",
    available: false,
  },
  {
    id: "the-kitchen",
    title: "The Gatherings",
    subtitle: "Where strangers become neighbours",
    image: "/images/compendium/barry/IMG_5727.jpg",
    available: false,
  },
  {
    id: "the-growers",
    title: "The Growers",
    subtitle: "What grows here, and who tends it",
    image: "/images/compendium/barry/IMG_5699.jpg",
    available: false,
  },
];


export default function Stories() {
  const barryRef = useRef<HTMLDivElement>(null);

  const scrollToStory = (id: string) => {
    if (id === "barry" && barryRef.current) {
      barryRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-stone-900">
      {/* Hero */}
      <section className="relative py-32 flex items-center justify-center">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6">
              Stories from The Harvest
            </h1>
            <p className="text-xl text-stone-400 leading-relaxed mb-10">
              The people, the place, the practice. Every person who walks this land
              carries a piece of its story.
            </p>
            <ArrowDown className="h-6 w-6 text-stone-500 mx-auto animate-bounce" />
          </motion.div>
        </div>
      </section>

      {/* Story Cards Index */}
      <section className="py-20 bg-stone-800/50">
        <div className="container max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <p className="text-stone-500 font-mono text-sm mb-3 uppercase tracking-wider">
              Choose a story
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">
              Voices of the Hinterland
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            {storyCards.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`overflow-hidden border-0 bg-stone-800 group cursor-pointer transition-all duration-300 ${
                    story.available
                      ? "hover:ring-2 hover:ring-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/10"
                      : "opacity-60"
                  }`}
                  onClick={() => story.available && scrollToStory(story.id)}
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={story.image}
                      alt={story.title}
                      className={`w-full h-full object-cover transition-transform duration-500 ${
                        story.available ? "group-hover:scale-105" : "grayscale"
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent" />
                    {!story.available && (
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 bg-stone-700/80 backdrop-blur-sm rounded-full text-xs font-medium text-stone-300">
                          Not written yet
                        </span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-serif font-bold text-white mb-1">
                      {story.title}
                    </h3>
                    <p className="text-stone-400 text-sm">{story.subtitle}</p>
                    {story.available && (
                      <p className="text-amber-500 text-sm font-medium mt-3 group-hover:text-amber-400 transition-colors">
                        Read story →
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Barry's Story */}
      <section ref={barryRef} className="py-24">
        <div className="container max-w-5xl mx-auto">
          {/* Declaration */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <p className="text-stone-500 font-mono text-sm mb-4">Section II: The Shed</p>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white leading-tight">
              Barry has been on this land for decades.{" "}
              <span className="text-amber-400">
                His shed is full of machines that built this hinterland.
              </span>
            </h2>
          </motion.div>

          {/* Lead photo — full width */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <img
              src={barryPhotos[0].src}
              alt={barryPhotos[0].caption}
              className="w-full rounded-lg object-cover max-h-[70vh]"
            />
            <p className="text-stone-500 text-sm mt-3 font-mono">{barryPhotos[0].caption}</p>
          </motion.div>

          {/* Body text block 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto mb-16"
          >
            <div className="text-lg md:text-xl text-stone-300 leading-relaxed space-y-6">
              <p>
                Barry Rodgerig is 80 years old. Before this place, Peachester: 25 years
                of dairy, timber, and red soil. He drove tractors before he could see over
                the steering wheel. He still drives them now.
              </p>
              <p>
                His shed is full of machines that built this hinterland. An AB184 log
                truck from 1963. Ex-army Blitz trucks from the war. A little Italian
                Valpadana tractor with a Lombardini diesel. A 1957 Land Rover he'd
                like to restore, if he lives long enough.
              </p>
              <p>He starts them up sometimes, just to hear them run.</p>
            </div>
          </motion.div>

          {/* Two photos side by side */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-4 mb-16"
          >
            <div>
              <img
                src={barryPhotos[1].src}
                alt={barryPhotos[1].caption}
                className="w-full rounded-lg object-cover aspect-[4/3]"
              />
              <p className="text-stone-500 text-sm mt-3 font-mono">{barryPhotos[1].caption}</p>
            </div>
            <div>
              <img
                src={barryPhotos[2].src}
                alt={barryPhotos[2].caption}
                className="w-full rounded-lg object-cover aspect-[4/3]"
              />
              <p className="text-stone-500 text-sm mt-3 font-mono">{barryPhotos[2].caption}</p>
            </div>
          </motion.div>

          {/* Quote */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto mb-16 border-l-2 border-amber-500/40 pl-6"
          >
            <p className="text-2xl md:text-3xl text-white font-serif italic leading-relaxed mb-3">
              "Rust is a terrible thing. It's just like cancer in humans. It eats. It just kills you."
            </p>
            <p className="text-sm text-stone-500 font-mono">Barry Rodgerig, Witta</p>
          </motion.div>

          {/* Body text block 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto mb-16"
          >
            <div className="text-lg md:text-xl text-stone-300 leading-relaxed space-y-6">
              <p>
                The cedar-getters came first, after the Jinibara. Then dairy. Then
                timber trucks grinding through red mud to Strathpine. Barry watched
                the hippies shut down the logging at Crystal Waters. He watched the
                government finish the job. He watched the hinterland turn from
                working country into scenic drive.
              </p>
              <p>
                <span className="text-white font-semibold">The Harvest is built on layers.</span>{" "}
                Jinibara Country first. Then cedar. Then dairy. Then nursery. Now
                this. Every rusted blade and milk separator in Barry's shed is a
                chapter. The land remembers what was here before.
              </p>
            </div>
          </motion.div>

          {/* Full width photo */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <img
              src={barryPhotos[3].src}
              alt={barryPhotos[3].caption}
              className="w-full rounded-lg object-cover max-h-[60vh]"
            />
            <p className="text-stone-500 text-sm mt-3 font-mono">{barryPhotos[3].caption}</p>
          </motion.div>

          {/* Second quote */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto mb-16 border-l-2 border-amber-500/40 pl-6"
          >
            <p className="text-2xl md:text-3xl text-white font-serif italic leading-relaxed mb-3">
              "I think when I die, it'll probably all go for scrap."
            </p>
            <p className="text-sm text-stone-500 font-mono">Barry</p>
          </motion.div>

          {/* Closing text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto mb-16"
          >
            <div className="text-lg text-stone-400 leading-relaxed space-y-6">
              <p>
                Not if we can help it. Barry's shed isn't scrap. It's archaeology.
                It's the living memory of what this place was, and the reason why
                what we build next has to mean something.
              </p>
              <p>
                Barry is one neighbour. There are more. Every person who lives
                around this land carries a piece of its story, and The Harvest
                exists to make sure those stories aren't forgotten.
              </p>
              <p className="text-amber-400/80 font-serif italic">
                Four Blue Heelers. Always called Samantha. "You never have two the same."
              </p>
            </div>
          </motion.div>

          {/* Two more photos */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-4"
          >
            <div>
              <img
                src={barryPhotos[4].src}
                alt={barryPhotos[4].caption}
                className="w-full rounded-lg object-cover aspect-[4/3]"
              />
              <p className="text-stone-500 text-sm mt-3 font-mono">{barryPhotos[4].caption}</p>
            </div>
            <div>
              <img
                src={barryPhotos[5].src}
                alt={barryPhotos[5].caption}
                className="w-full rounded-lg object-cover aspect-[4/3]"
              />
              <p className="text-stone-500 text-sm mt-3 font-mono">{barryPhotos[5].caption}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* More Stories Coming + Share */}
      <section className="py-24 bg-stone-800">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
              Every person who walks through our doors brings their own story
            </h2>
            <p className="text-lg text-stone-300 mb-10 leading-relaxed">
              We're collecting stories from neighbours, volunteers, growers, and visitors.
              If you have a connection to this place, or to the land it sits on, we'd
              love to hear it. It doesn't have to be long. Just honest.
            </p>
            <Button
              size="lg"
              className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
              asChild
            >
              <Link href="/get-involved">
                <PenLine className="mr-2 h-5 w-5" />
                Share Your Story
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
