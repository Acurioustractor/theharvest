import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";
import {
  Mountain,
  Users,
  ArrowRight,
  Leaf,
  Heart,
  Camera,
  TreePine,
  Milestone,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  whileInView: {
    transition: {
      staggerChildren: 0.15,
    },
  },
  viewport: { once: true },
};

const wittaFacts = [
  {
    icon: Mountain,
    title: "561m Elevation",
    description: "Howells Knob, the highest point on the range. Cooler, mistier, and 5–10 degrees below the coast.",
  },
  {
    icon: Leaf,
    title: "2,037mm Rainfall",
    description: "Over two metres of rain a year. The range forces moist coastal air upward — it rains here more than almost anywhere in SEQ.",
  },
  {
    icon: TreePine,
    title: "Volcanic Red Soil",
    description: "Jurassic-era basalt soils — deep, nutrient-rich krasnozem. The reason everything grows here, from rainforest to dairy pasture to nurseries.",
  },
  {
    icon: Users,
    title: "~1,300 Residents",
    description: "No shops. No pub. A school that closed in 1974. A hall, a church, and people who chose to live closer to the ground.",
  },
  {
    icon: Heart,
    title: "Cooperative Roots",
    description: "Part of the Maleny co-op region. Butter factories, shared equipment, pooled resources — people here have always done things together.",
  },
  {
    icon: Milestone,
    title: "Iconic Status",
    description: "In 2008, the Blackall Range was granted iconic environmental status — only the third in Queensland, after Noosa and Port Douglas.",
  },
];

const timeline = [
  { year: "Time immemorial", event: "Jinibara (Nalbo clan) custodianship of the Blackall Range. Bunya festivals at Baroon Pocket draw thousands from across south-east Queensland." },
  { year: "1842", event: "Governor Gipps declares a reserve protecting bunya pines — settlement and clearing prohibited where bunya trees grow." },
  { year: "1845", event: "Tom Petrie, aged 14, travels from Brisbane with 100 Aboriginal people to attend the Baroon Bunya Festival. One of the only European eyewitness accounts." },
  { year: "1860", event: "Bunya pine reserve rescinded. Timber-getters flood in. The 'red gold' rush begins." },
  { year: "1878", event: "Isaac Burgess selects the first parcel of land on the Blackall Range — 790 acres, Parish of Maleny." },
  { year: "1886", event: "Two giant cedar logs shipped to the Indian and Colonial Exhibition in London. No buyer — they're too large for any mill in the world." },
  { year: "1887", event: "17 October: German families from Brisbane's Logan district select land and name the settlement Teutoburg." },
  { year: "1890", event: "Railway reaches Landsborough. Timber transport shifts from rafting logs down creeks to rail." },
  { year: "1893", event: "Teutoburg Lutheran Church built. Meat and Dairy Encouragement Act passed — dairy begins replacing timber." },
  { year: "1897", event: "Mapleton Tramway construction begins — an 18km narrow-gauge railway climbing from sea level to 380m with Shay geared locomotives." },
  { year: "1904", event: "Maleny's first butter factory opens. The co-operative model takes root." },
  { year: "1906", event: "Red cedar faces commercial extinction. One-third of Queensland's hoop and bunya pine already gone." },
  { year: "1908", event: "A 627cm-circumference cedar from Frank Dunlop's selection wins a prize at the Franco-British Exhibition in London. 60 bullocks hauled it up Walker's Pinch." },
  { year: "1911", event: "Good Shepherd Lutheran Church opened. Second Maleny butter factory operational." },
  { year: "1916", event: "18 May: Teutoburg renamed Witta — anti-German sentiment during WWI. 'Witta' comes from the Kabi word 'wetya', meaning dingo." },
  { year: "1941", event: "The Thynne sisters gift 100 acres of remnant rainforest to the shire — it becomes Mary Cairncross Scenic Reserve." },
  { year: "1944", event: "Mapleton Tramway closes after 47 years of hauling timber, cream, fruit, and passengers." },
  { year: "1960s", event: "Dairy industry peak. Around 300 butter and cheese factories operating across the hinterland. One in eight Queenslanders lives on a dairy farm." },
  { year: "1974", event: "Witta State School closes. The building at 316 Witta Road becomes the community hall — still the social heart of Witta." },
  { year: "1980s", event: "Maleny attracts artists, craftspeople, and alternative lifestylers. Co-ops, organic produce, and intentional communities replace dairy infrastructure." },
  { year: "2000", event: "Dairy deregulation. Guaranteed floor prices disappear overnight. Farms that sustained families for generations become unviable. Across the range, dairy families walk off." },
  { year: "2008", event: "Blackall Range granted iconic environmental status — third in Queensland." },
  { year: "2012", event: "Federal Court recognises the Jinibara People as traditional owners of the Blackall, D'Aguilar, and Conondale Ranges." },
];

export default function Witta() {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero */}
      <section className="relative py-24 bg-stone-100">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <p className="text-amber-600 font-mono text-sm mb-4 uppercase tracking-wider">
              Formerly Teutoburg · Est. 1887 · Renamed 1916
            </p>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-stone-800 mb-6">
              Witta
            </h1>
            <p className="text-xl text-stone-600 mb-8 leading-relaxed">
              A small village on the Blackall Range, 560 metres above the coastal plain.
              Named by German settlers, renamed during a war, sitting on soil that's been
              growing things since the Jurassic. This land has been gathering place,
              growing place, and home for tens of thousands of years.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
                <Mountain className="h-5 w-5 text-amber-600" />
                <span className="text-stone-700 font-medium">Blackall Range</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
                <Heart className="h-5 w-5 text-amber-600" />
                <span className="text-stone-700 font-medium">Jinibara Country</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Jinibara Country — prominent, first section */}
      <section className="py-20 bg-stone-800 text-white">
        <div className="container">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto">
            <p className="text-amber-400 font-mono text-sm mb-4 uppercase tracking-wider">
              First Peoples
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-8">
              Jinibara Country
            </h2>
            <div className="text-stone-300 leading-relaxed space-y-5 text-lg">
              <p>
                The Blackall Range has been home to the Jinibara people for tens of thousands
                of years. The tribal name means "people of the lawyer vine" — <em>jini</em> for
                the vine, <em>bara</em> for people. The Nalbo clan held custodianship of this
                part of the range, including the land where Witta now sits. In 2012, the Federal
                Court formally recognised the Jinibara as traditional owners of the Blackall,
                D'Aguilar, and Conondale Ranges.
              </p>
              <p>
                The bunya pine forests of the Blackall Range were central to social, spiritual,
                and economic life. Every few years when the trees produced a heavy crop, massive
                inter-tribal gatherings were held at Baroon Pocket — known to the Jinibara as
                "Burun." Invitations extended to communities from as far as Townsville, Charleville,
                and Lismore. Hundreds of people would gather for festivals lasting up to four months —
                marriages were arranged, disputes settled, alliances formed, and stories told.
              </p>
              <p>
                In 1845, a 14-year-old boy named Tom Petrie travelled from Brisbane with 100
                Aboriginal people to attend the Baroon Bunya Festival. Petrie had grown up among
                Aboriginal people from early childhood and spoke the Undumbi dialect. His account
                is one of the only first-hand European records of these ancient gatherings.
              </p>
              <p>
                In 1842, Governor Gipps had declared a reserve protecting the bunya pines — it was
                illegal to settle or clear land where the trees grew. Eighteen years later, in 1860,
                the reserve was rescinded. The timber-getters moved in, and within a generation,
                the landscape that the Jinibara had managed through fire, seasonal movement, and deep
                ecological knowledge for millennia was transformed.
              </p>
              <p>
                European settlement from the 1860s onward displaced the Jinibara from their
                traditional lands. The impact was devastating — disease, violence, and forced
                removal fractured communities that had thrived here for tens of thousands of years.
                The Jinibara people today continue to maintain their connection to Country,
                language, and culture despite this history.
              </p>
              <div className="my-8">
                <img
                  src="/images/witta/history/bunya-pines-witta-1931.png"
                  alt="Bunya pines at Witta, c. 1931"
                  className="w-full rounded-lg shadow-md"
                />
                <p className="text-stone-500 text-xs mt-2 italic">
                  Bunya pines at Witta, c. 1931. The bunya forests were central to Jinibara culture
                  and the great inter-tribal gatherings at Baroon Pocket.
                  Queensland State Archives.
                </p>
              </div>

              <p className="text-amber-400/80 font-serif italic text-xl">
                We acknowledge the Jinibara people as the Traditional Custodians of the land
                on which The Harvest stands. We pay our respects to Elders past, present,
                and emerging. This always was, and always will be, Aboriginal land.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Historical Landscape */}
      <section className="py-12 bg-stone-50">
        <div className="container">
          <motion.div {...fadeInUp} className="max-w-5xl mx-auto">
            <img
              src="/images/witta/history/witta-towards-conondale-1931.png"
              alt="Looking from Witta towards Conondale, c. 1931"
              className="w-full rounded-2xl shadow-lg"
            />
            <p className="text-stone-500 text-xs mt-2 italic text-center">
              Looking from Witta towards the Conondale Range, c. 1931. Queensland State Archives.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The Cedar-Getters */}
      <section className="py-20 bg-stone-100">
        <div className="container">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto">
            <p className="text-amber-600 font-mono text-sm mb-4 uppercase tracking-wider">
              1860s – 1900s
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mb-8">
              The Red Gold Rush
            </h2>
            <div className="text-stone-700 leading-relaxed space-y-5 text-lg">
              <p>
                The first Europeans in the Blackall Range came for the red cedar. They called
                it "red gold" — a single tree could be worth more than a year's wages. Aboriginal
                people knew it as <em>Wootha</em>. Giant trees with girths of 18 to 20 feet were
                common. By 1906, red cedar faced commercial extinction.
              </p>
              <p>
                Logs were sent down steep chutes carved into the range — Landers Chute, McCarthy's
                Chute — smashing through scrub end-over-first. At the bottom, bullock teams of up
                to 24 animals hauled them to Mellum Creek, where they were assembled into rafts,
                tied with chains, and steered on the outgoing tide through Pumicestone Passage to
                Brisbane. Before sawmills arrived, pit sawyers worked the timber by hand — two men
                over a pit with a long saw.
              </p>

              {/* Pit sawyers and bullock teams */}
              <div className="grid grid-cols-3 gap-4 my-8">
                <div>
                  <img
                    src="/images/witta/history/teutoburg-pit-sawyers-1899.png"
                    alt="Pit sawing and cutting timber at C.M. Nothling's Farm, Blackall Range, c. 1899"
                    className="w-full rounded-lg shadow-md"
                  />
                  <p className="text-stone-500 text-xs mt-2 italic">
                    Pit sawing at Nothling's Farm, Blackall Range, c. 1899.
                    Queensland State Archives.
                  </p>
                </div>
                <div>
                  <img
                    src="/images/witta/history/bullock-team-eudlo-1930.jpg"
                    alt="Bullock team hauling logs, Eudlo district, ca. 1930"
                    className="w-full rounded-lg shadow-md"
                  />
                  <p className="text-stone-500 text-xs mt-2 italic">
                    George Lander with a bullock team hauling logs, Eudlo district, ca. 1930.
                    State Library of Queensland.
                  </p>
                </div>
                <div>
                  <img
                    src="/images/witta/history/bullock-team-eudlo-1905.jpg"
                    alt="Bullock teams hauling timber logs, Eudlo district, ca. 1905"
                    className="w-full rounded-lg shadow-md"
                  />
                  <p className="text-stone-500 text-xs mt-2 italic">
                    Timber logs hauled by bullock teams, Eudlo district, ca. 1905.
                    State Library of Queensland.
                  </p>
                </div>
              </div>

              <p>
                In 1886, two massive cedar logs from the Blackall Range were shipped to the Indian
                and Colonial Exhibition in London. No buyer could be found — they were too large
                for any mill in the world. Isaac Burgess, the first European to select land on
                the range in 1878, won a medal for one of them. Twenty-two years later, a cedar
                from Frank Dunlop's selection — 627 centimetres in circumference — was hauled up
                Walker's Pinch by a combined team of 60 bullocks and shipped to the Franco-British
                Exhibition in London. Half of that log is reportedly still in a London museum.
              </p>

              {/* Sawmill and tramway photos */}
              <div className="grid grid-cols-3 gap-4 my-8">
                <div>
                  <img
                    src="/images/witta/history/maleny-sawmill-exterior.jpg"
                    alt="Outside the Maleny Sawmill in the Blackall Range"
                    className="w-full rounded-lg shadow-md"
                  />
                  <p className="text-stone-500 text-xs mt-2 italic">
                    Outside the Maleny Sawmill, Blackall Range. State Library of Queensland.
                  </p>
                </div>
                <div>
                  <img
                    src="/images/witta/history/maleny-sawmill-workers.jpg"
                    alt="Sawmill workers at the Maleny Sawmill in the Blackall Range"
                    className="w-full rounded-lg shadow-md"
                  />
                  <p className="text-stone-500 text-xs mt-2 italic">
                    Sawmill workers at the Maleny Sawmill, Blackall Range. State Library of Queensland.
                  </p>
                </div>
                <div>
                  <img
                    src="/images/witta/history/mapleton-tramway-timber-hauling.jpg"
                    alt="Mapleton Tramway Shay locomotive hauling timber at Dulong"
                    className="w-full rounded-lg shadow-md"
                  />
                  <p className="text-stone-500 text-xs mt-2 italic">
                    Shay locomotive hauling timber, Mapleton Tramway. Queensland State Archives.
                  </p>
                </div>
              </div>

              <p>
                After the cedar came broader timber extraction — hoop pine (three-quarters of all
                timber used in Queensland buildings), blackbutt, tallowwood, bunya pine. The
                Mapleton Tramway, an 18-kilometre narrow-gauge railway climbing from near sea level
                to 380 metres with Shay geared locomotives, hauled timber, cream, fruit, and
                passengers from 1897 until it closed in 1944. The logging industry employed most of
                the hinterland's small population and carved the roads, tracks, and communities that
                everything else was built on.
              </p>

              <div className="my-8">
                <img
                  src="/images/witta/history/mapleton-tramway-passengers.jpg"
                  alt="Mapleton Tramway Shay locomotive with passenger carriages on hillside"
                  className="w-full rounded-lg shadow-md"
                />
                <p className="text-stone-500 text-xs mt-2 italic">
                  Shay geared locomotive with passenger carriages on the Mapleton Tramway hillside.
                  Queensland State Archives.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Teutoburg to Witta */}
      <section className="py-20 bg-white">
        <div className="container">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto">
            <p className="text-amber-600 font-mono text-sm mb-4 uppercase tracking-wider">
              1887 – 1916
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mb-8">
              From Teutoburg to Witta
            </h2>
            <div className="text-stone-700 leading-relaxed space-y-5 text-lg">
              <p>
                On 17 October 1887, German families from Brisbane's Logan district — including
                the Nothling family — selected land on the Blackall Range and named their
                settlement <strong>Teutoburg</strong>, after the ancient forest in Germany. They
                built a Lutheran church in 1893, started a school, cleared the vine scrub, and
                began producing crops, cheese, and wine. Carl Thiedecke, the school teacher,
                was the driving force behind the Lutheran congregation.
              </p>

              {/* Teutoburg settler photos */}
              <div className="grid grid-cols-2 gap-4 my-8">
                <div>
                  <img
                    src="/images/witta/history/teutoburg-farm-couple-corn-1899.png"
                    alt="Couple with 13-feet-high corn at Manitzky's Farm, Teutoburg, c. 1899"
                    className="w-full rounded-lg shadow-md"
                  />
                  <p className="text-stone-500 text-xs mt-2 italic">
                    A couple with 13-feet-high corn at Manitzky's Farm, Teutoburg, Blackall Range, c. 1899.
                    Queensland State Archives.
                  </p>
                </div>
                <div>
                  <img
                    src="/images/witta/history/teutoburg-cheese-making-1899.png"
                    alt="Woman with a stack of cheeses at Mrs Bergann's Farm, Teutoburg, c. 1899"
                    className="w-full rounded-lg shadow-md"
                  />
                  <p className="text-stone-500 text-xs mt-2 italic">
                    A woman with cheeses at Mrs Bergann's Farm, Teutoburg, c. 1899.
                    Queensland State Archives.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 my-8">
                <div>
                  <img
                    src="/images/witta/history/teutoburg-man-hoe-1899.png"
                    alt="Man with hoe, corn and sweet potatoes at Manitzky's Farm, Teutoburg, c. 1899"
                    className="w-full rounded-lg shadow-md"
                  />
                  <p className="text-stone-500 text-xs mt-2 italic">
                    A man working the land at Manitzky's Farm, Teutoburg, c. 1899.
                    Queensland State Archives.
                  </p>
                </div>
                <div>
                  <img
                    src="/images/witta/history/teutoburg-children-grapevines-1899.png"
                    alt="Three children with grape vines and corn at Manitzky's Farm, Teutoburg, c. 1899"
                    className="w-full rounded-lg shadow-md"
                  />
                  <p className="text-stone-500 text-xs mt-2 italic">
                    Children among grape vines and corn, Manitzky's Farm, c. 1899.
                    Queensland State Archives.
                  </p>
                </div>
                <div>
                  <img
                    src="/images/witta/history/teutoburg-nothling-cottage-1899.png"
                    alt="C.M. Nothling's vineyard and shingle roof cottage at Teutoburg, c. 1899"
                    className="w-full rounded-lg shadow-md"
                  />
                  <p className="text-stone-500 text-xs mt-2 italic">
                    Nothling's vineyard and shingle-roof cottage, Teutoburg, c. 1899.
                    Queensland State Archives.
                  </p>
                </div>
              </div>

              <p>
                For almost thirty years, Teutoburg was a German-speaking farming community on
                a Queensland hilltop. Then came the First World War. On 18 May 1916,
                anti-German sentiment led to the settlement being renamed <strong>Witta</strong> —
                recorded in the Queensland Government Gazette two days later. The new name is
                believed to come from the Kabi Kabi word <em>wetya</em>, meaning dingo.
              </p>
              <p>
                The Good Shepherd Lutheran Church, opened in 1911, still stands. B.J. Nothling
                completed 50 years as church organist by 1964. The German heritage remains a
                quiet but defining thread in Witta's identity — a community that kept its roots
                while the name above the door changed.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Dairy Industry */}
      <section className="py-20 bg-stone-100">
        <div className="container">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto">
            <p className="text-amber-600 font-mono text-sm mb-4 uppercase tracking-wider">
              1890s – 2000
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mb-8">
              The Dairy Country
            </h2>
            <div className="text-stone-700 leading-relaxed space-y-5 text-lg">
              <p>
                Once the timber was cleared, the rich volcanic krasnozem soils were put to
                pasture. Over two metres of annual rainfall, cool elevation, and deep red soil
                meant lush grass year-round. The railway reaching Landsborough in 1890 gave
                farmers a way to get their cream to market. The Meat and Dairy Encouragement
                Act of 1893 provided government loans for butter factories. The industry took off.
              </p>
              <p>
                Maleny's first butter factory opened in 1904, a second in 1911. The co-operative
                model ran deep — farmers pooled resources, shared equipment, and looked out for
                each other. By the late 1930s, one in eight Queenslanders was living on a dairy
                farm. At the industry's peak in the 1960s, around 300 butter and cheese factories
                operated across the hinterland region. Even the butter boxes were local — made
                from hoop pine, the only timber tasteless and odourless enough not to taint
                the product.
              </p>
              <p>
                Dairy deregulation in 2000 ended it. The guaranteed floor price disappeared
                overnight. Farms that had sustained families for generations became unviable.
                Across the Blackall Range, dairy families walked off. The milk separators
                rusted. The bail doors closed.
              </p>
              <p>
                Some land went to beef, some to macadamias or avocados. The Hopper family at
                Maleny Dairies survived by building their own processing and bottling plant —
                Great Grandfather Hopper had purchased the land in 1948. They're still going.
                The old Witta nursery site — where The Harvest now stands — found its second
                life in horticulture, growing seedlings and serving local gardeners through the
                1970s and beyond.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Notable Places */}
      <section className="py-20 bg-white">
        <div className="container">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto mb-12">
            <p className="text-amber-600 font-mono text-sm mb-4 uppercase tracking-wider">
              Landmarks
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mb-4">
              Places That Shaped the Range
            </h2>
          </motion.div>
          <motion.div {...fadeInUp} className="max-w-4xl mx-auto mb-10">
            <img
              src="/images/witta/history/mary-cairncross-glasshouse-mountains.jpg"
              alt="Glass House Mountains viewed from Mary Cairncross Scenic Reserve"
              className="w-full rounded-2xl shadow-lg"
            />
            <p className="text-stone-500 text-xs mt-2 italic text-center">
              Glass House Mountains from Mary Cairncross Scenic Reserve, Maleny. Wikimedia Commons (CC BY 3.0).
            </p>
          </motion.div>

          <motion.div {...staggerContainer} className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            {[
              {
                name: "Mary Cairncross Scenic Reserve",
                detail: "55 hectares of remnant subtropical rainforest at 420m altitude. In 1941, the three Thynne sisters — Bessie, Mabel, and Mary — gifted 100 acres of untouched rainforest to the shire. Bessie cared for it until her death in 1978 at age 95. It's one of the last fragments of the forest that once covered the entire Maleny plateau.",
              },
              {
                name: "Baroon Pocket Dam",
                detail: "Built on the ancient bunya festival grounds at 'Burun.' The dam site was first surveyed in 1946 but took decades of political argument before construction began in 1985. Completed in 1988, it holds 61,000 megalitres and supplies 150 megalitres daily to the Sunshine Coast.",
              },
              {
                name: "The Old Witta School",
                detail: "Opened in 1892 as Maleny Provisional School, renamed Teutoberg in 1893, then Witta in 1926. The school closed in 1974. The building at 316 Witta Road became the community hall — still the social heart of Witta, the place where people gather.",
              },
              {
                name: "Good Shepherd Lutheran Church",
                detail: "The original Teutoburg church was built in 1893, demolished in 1911 for a new timber building opened 22 January that year. A quiet monument to the German families who built this community and kept going when the name changed above the door.",
              },
            ].map((place) => (
              <motion.div key={place.name} {...fadeInUp}>
                <Card className="border-0 shadow-md h-full">
                  <CardContent className="p-6">
                    <h3 className="font-serif font-bold text-stone-800 text-lg mb-3">
                      {place.name}
                    </h3>
                    <p className="text-stone-600 text-sm leading-relaxed">{place.detail}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Witta Today */}
      <section className="py-20 bg-stone-50">
        <div className="container">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto">
            <p className="text-amber-600 font-mono text-sm mb-4 uppercase tracking-wider">
              Today
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mb-8">
              A New Chapter
            </h2>
            <div className="text-stone-700 leading-relaxed space-y-5 text-lg">
              <p>
                Witta today is a village of about 1,300 people. There's no main street, no
                pub, no shop — the school closed in 1974. What there is: a hall, a church,
                and a lot of people who chose to live here because they wanted something
                quieter, closer to the ground. The predominant age group is 60–69. Over 85%
                of homes are owner-occupied. Over a quarter of the land is parks and reserves.
              </p>
              <p>
                In the 1980s, nearby Maleny attracted artists, craftspeople, and alternative
                lifestylers. Galleries and co-ops replaced dairy infrastructure. Montville
                became a tourist art village. Witta stayed quiet — the one that didn't change.
                Two thousand cars pass through every weekend on the way to Kenilworth, and
                there's nowhere to stop.
              </p>
              <p>
                The Harvest is writing the next chapter — not erasing what came before, but
                building on every layer of this place's story. Jinibara Country first. Then
                cedar. Then Teutoburg. Then dairy. Then nursery. Now this. The land remembers
                what was here before, and so should we.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Witta Facts */}
      <section className="py-24 bg-stone-100">
        <div className="container">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-stone-800 mb-4">
              What Makes Witta Special
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Volcanic soil, two metres of rain, and 560 metres of elevation.
            </p>
          </motion.div>

          <motion.div
            {...staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {wittaFacts.map((fact) => (
              <motion.div key={fact.title} {...fadeInUp}>
                <Card className="h-full border-0 shadow-md bg-white">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                      <fact.icon className="h-7 w-7 text-amber-600" />
                    </div>
                    <h3 className="text-xl font-serif font-bold text-stone-800 mb-2">
                      {fact.title}
                    </h3>
                    <p className="text-stone-600 text-sm">{fact.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-stone-800 text-white">
        <div className="container">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold mb-4">
              Timeline
            </h2>
            <p className="text-lg text-stone-400 max-w-2xl mx-auto">
              From bunya festivals to dairy deregulation — the layers of this place.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <div className="relative border-l-2 border-amber-500/30 pl-8 space-y-8">
              {timeline.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03, duration: 0.4 }}
                  className="relative"
                >
                  <div className="absolute -left-[41px] top-1 w-3 h-3 rounded-full bg-amber-500" />
                  <p className="text-amber-400 font-mono text-sm font-medium mb-1">{item.year}</p>
                  <p className="text-stone-300 text-sm leading-relaxed">{item.event}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Community memories — contributed history */}
      <CommunityMemoriesSection />

      {/* Photo Gallery */}
      <section className="py-24 bg-stone-50">
        <div className="container">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium bg-amber-100 text-amber-700 rounded-full">
              <Camera className="h-4 w-4" />
              Gallery
            </span>
            <h2 className="text-4xl font-serif font-bold text-stone-800 mb-4">
              Witta in Pictures
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              The landscape, the community, the feeling of this place.
              Photos from site walks, stories, archives, and the vision ahead.
            </p>
          </motion.div>

          {/* Gallery grid — masonry-style columns */}
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 max-w-6xl mx-auto">
            {[
              // Barry's Story
              { src: "/images/compendium/barry/IMG_5613.jpg", caption: "Barry at the nursery site", tag: "Barry's Story" },
              { src: "/images/compendium/barry/IMG_5618.jpg", caption: "27 years of care", tag: "Barry's Story" },
              { src: "/images/compendium/barry/IMG_5633.jpg", caption: "The shed", tag: "Barry's Story" },
              { src: "/images/compendium/barry/IMG_5659.jpg", caption: "Tools of the trade", tag: "Barry's Story" },
              { src: "/images/compendium/barry/IMG_5687.jpg", caption: "Nursery rows", tag: "Barry's Story" },
              { src: "/images/compendium/barry/IMG_5699.jpg", caption: "Morning light", tag: "Barry's Story" },
              { src: "/images/compendium/barry/IMG_5727.jpg", caption: "Working the land", tag: "Barry's Story" },
              { src: "/images/compendium/barry/IMG_5745.jpg", caption: "The quiet work", tag: "Barry's Story" },
              { src: "/images/compendium/barry/IMG_5758.jpg", caption: "Hands and soil", tag: "Barry's Story" },
              { src: "/images/compendium/barry/IMG_5764.jpg", caption: "Among the plants", tag: "Barry's Story" },
              { src: "/images/compendium/barry/IMG_5777.jpg", caption: "Looking out", tag: "Barry's Story" },
              { src: "/images/compendium/barry/IMG_5819.jpg", caption: "End of the day", tag: "Barry's Story" },
              // The Site
              { src: "/images/compendium/hero-aerial.jpg", caption: "Aerial view of The Harvest site", tag: "The Site" },
              { src: "/images/site-plan/layers/00-aerial-photo.jpeg", caption: "Drone photograph, 2024", tag: "The Site" },
              // Historical Archive
              { src: "/images/witta/history/witta-towards-conondale-1931.png", caption: "Looking from Witta towards Conondale, c. 1931", tag: "Historical" },
              { src: "/images/witta/history/teutoburg-farm-couple-corn-1899.png", caption: "Manitzky's Farm, Teutoburg, c. 1899", tag: "Historical" },
              { src: "/images/witta/history/teutoburg-cheese-making-1899.png", caption: "Cheese-making at Bergann's Farm, c. 1899", tag: "Historical" },
              { src: "/images/witta/history/teutoburg-nothling-cottage-1899.png", caption: "Nothling's cottage and vineyard, c. 1899", tag: "Historical" },
              { src: "/images/witta/history/teutoburg-pit-sawyers-1899.png", caption: "Pit sawing at Nothling's Farm, c. 1899", tag: "Historical" },
              { src: "/images/witta/history/bullock-team-eudlo-1930.jpg", caption: "Bullock team, Eudlo district, c. 1930", tag: "Historical" },
              { src: "/images/witta/history/maleny-sawmill-exterior.jpg", caption: "Maleny Sawmill, Blackall Range", tag: "Historical" },
              { src: "/images/witta/history/mapleton-tramway-timber-hauling.jpg", caption: "Mapleton Tramway hauling timber", tag: "Historical" },
              { src: "/images/witta/history/bunya-pines-witta-1931.png", caption: "Bunya pines at Witta, c. 1931", tag: "Historical" },
              { src: "/images/witta/history/mary-cairncross-glasshouse-mountains.jpg", caption: "Glass House Mountains from Mary Cairncross", tag: "Landmarks" },
              // Architectural Vision
              { src: "/images/compendium/MASTER FLOOR PLAN_1.jpeg", caption: "The master plan — architect's render", tag: "The Vision" },
            ].map((photo, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 8) * 0.05, duration: 0.5 }}
                className="break-inside-avoid mb-4"
              >
                <div className="group relative overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <img
                    src={photo.src}
                    alt={photo.caption}
                    className="w-full h-auto block"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <span className="inline-block px-2 py-0.5 bg-amber-500/80 text-black text-[10px] font-semibold rounded-full mb-1">
                        {photo.tag}
                      </span>
                      <p className="text-white text-xs leading-snug">{photo.caption}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-stone-100">
        <div className="container">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-serif font-bold text-stone-800 mb-6">
              Come Experience Witta
            </h2>
            <p className="text-xl text-stone-600 mb-10 leading-relaxed">
              The best way to understand this place is to be here. Walk the land,
              meet the people, and feel why this corner of the hinterland is so special.
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
                className="border-amber-300 text-amber-700 hover:bg-amber-50"
                asChild
              >
                <Link href="/stories">Read Our Stories</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

/* ---------- Community Memories ---------- */

function CommunityMemoriesSection() {
  const approvedQuery = trpc.witta.approved.useQuery();
  const memories = approvedQuery.data ?? [];

  return (
    <>
      {/* Approved memories — only render the band if there's content */}
      {memories.length > 0 && (
        <section className="py-20 bg-stone-50">
          <div className="container">
            <motion.div {...fadeInUp} className="text-center mb-12 max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium bg-amber-100 text-amber-700 rounded-full">
                <Sparkles className="h-4 w-4" />
                Community memories
              </span>
              <h2 className="text-4xl font-serif font-bold text-stone-800 mb-4">
                Witta, told by the people who live here.
              </h2>
              <p className="text-stone-600 leading-relaxed">
                These are stories, corrections, and photographs added by community
                members. Each one was reviewed before it appeared. Add yours below.
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
              {memories.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="h-full border-0 shadow-sm bg-white">
                    <CardContent className="p-6">
                      <p className="text-amber-600 font-mono text-xs font-medium mb-3 uppercase tracking-wider">
                        {m.yearOrEra}
                      </p>
                      <p className="text-stone-700 leading-relaxed whitespace-pre-line">
                        {m.memory}
                      </p>
                      {m.photoUrl && (
                        <img
                          src={m.photoUrl}
                          alt={`Memory from ${m.authorName}`}
                          className="w-full rounded-md mt-4 shadow-sm"
                          loading="lazy"
                        />
                      )}
                      <p className="text-stone-500 text-sm mt-4 italic">
                        — {m.authorName}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contribution form — always visible */}
      <ContributeMemoryForm />
    </>
  );
}

function ContributeMemoryForm() {
  const submitMutation = trpc.witta.submit.useMutation();
  const utils = trpc.useUtils();

  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [yearOrEra, setYearOrEra] = useState("");
  const [memory, setMemory] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const canSubmit =
    authorName.trim().length > 0 &&
    yearOrEra.trim().length > 0 &&
    memory.trim().length >= 10 &&
    !submitMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    try {
      await submitMutation.mutateAsync({
        authorName: authorName.trim(),
        authorEmail: authorEmail.trim() || undefined,
        yearOrEra: yearOrEra.trim(),
        memory: memory.trim(),
        photoUrl: photoUrl.trim() || undefined,
      });
      setSubmitted(true);
      setAuthorName("");
      setAuthorEmail("");
      setYearOrEra("");
      setMemory("");
      setPhotoUrl("");
      toast.success("Thank you. Your memory is in the queue for review.");
      utils.witta.approved.invalidate();
    } catch (err) {
      console.error("Failed to submit memory:", err);
      toast.error("Couldn't submit just now — please try again in a moment.");
    }
  };

  return (
    <section className="py-24 bg-stone-100">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium bg-stone-800 text-amber-300 rounded-full">
              <Heart className="h-4 w-4" />
              Add to the history
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mb-4">
              Remember a moment? Add it.
            </h2>
            <p className="text-stone-600 leading-relaxed">
              A photograph, a story, a correction, a name we missed.
              Memories of Witta — old or recent — that belong on this page.
              We review every contribution before it's published.
            </p>
          </motion.div>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6 md:p-8">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10"
                >
                  <CheckCircle2 className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-serif font-bold text-stone-800 mb-2">
                    Thank you.
                  </h3>
                  <p className="text-stone-600 max-w-md mx-auto">
                    Your memory is in the queue. We'll read it, and if it fits we'll
                    publish it on this page within a few days.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-6"
                    onClick={() => setSubmitted(false)}
                  >
                    Add another memory
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="memory-name">Your name *</Label>
                      <Input
                        id="memory-name"
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        placeholder="e.g. Barry Rodgerig"
                        required
                        maxLength={255}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="memory-email">Email (optional)</Label>
                      <Input
                        id="memory-email"
                        type="email"
                        value={authorEmail}
                        onChange={(e) => setAuthorEmail(e.target.value)}
                        placeholder="So we can ask if we have questions"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="memory-year">Year or era *</Label>
                    <Input
                      id="memory-year"
                      value={yearOrEra}
                      onChange={(e) => setYearOrEra(e.target.value)}
                      placeholder="e.g. 1916, 1980s, the dairy years, today"
                      required
                      maxLength={100}
                    />
                    <p className="text-stone-500 text-xs">
                      A rough anchor in time. Doesn't need to be exact.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="memory-text">The memory *</Label>
                    <Textarea
                      id="memory-text"
                      value={memory}
                      onChange={(e) => setMemory(e.target.value)}
                      placeholder="What you remember, what someone told you, a story passed down. A correction is welcome too."
                      required
                      minLength={10}
                      maxLength={4000}
                      rows={6}
                    />
                    <p className="text-stone-500 text-xs">
                      {memory.length}/4000 — minimum 10 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="memory-photo">Photo URL (optional)</Label>
                    <Input
                      id="memory-photo"
                      type="url"
                      value={photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      placeholder="https://..."
                      maxLength={1000}
                    />
                    <p className="text-stone-500 text-xs">
                      If you have a photograph hosted somewhere, drop the link here. Direct
                      uploads coming soon.
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <p className="text-stone-500 text-sm italic">
                      Contributions are reviewed before publishing.
                    </p>
                    <Button
                      type="submit"
                      disabled={!canSubmit}
                      className="bg-stone-800 hover:bg-stone-900 text-amber-300 font-semibold"
                      size="lg"
                    >
                      {submitMutation.isPending ? "Submitting…" : "Add this memory"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
