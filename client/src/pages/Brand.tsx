import { useEffect } from "react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { harvestButtonClasses, SiteFooter, SiteNav } from "./HarvestReviewTest";
import { AssetDownloads } from "@/components/BrandAssets";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { setPageSeo } from "@/lib/seo";

const voiceRules = [
  "Write like someone standing at the gate. Plain sentences, named rooms and objects, one clear invitation.",
  "Work days, never working bees.",
  "No em-dashes. Use commas, full stops and colons.",
  "No invented counts, dates or finished-build claims. In progress means say in progress.",
  "Consent before a face, a name or a story goes public.",
  "Real photos from the place only. AI-generated images are never Harvest brand assets.",
];

const bannedWords = [
  "vibrant", "tapestry", "testament", "underscore", "pivotal", "crucial",
  "leverage", "journey", "thrilled", "dive in", "unlock", "elevate",
  "game-changer", "seamless", "empower", "hub",
];

export default function Brand() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    setPageSeo({
      title: "Brand and logos · The Harvest Witta",
      description:
        "Logo files, the logo pack, colours, type and voice rules for The Harvest, Witta. Everything you need to make a post, a sign or a print piece that matches.",
      path: "/brand",
    });
  }, []);

  return (
    <main className="min-h-screen bg-[#F5F0E8] text-[#1C1917]">
      <SiteNav />

      <section className="px-5 pb-10 pt-36 md:px-8 md:pb-14 md:pt-44">
        <div className="mx-auto max-w-4xl">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#8B4A2A]">
            Brand
          </p>
          <h1 className="mt-4 max-w-3xl text-5xl font-black leading-[0.92] md:text-7xl">
            The logos, the colours, the words.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-stone-700 md:text-xl">
            If you are making a post, a label, a sign or a print piece with The
            Harvest name on it, take the files from here. One place, so everything
            we put out looks like the same place.
          </p>
        </div>
      </section>

      <AssetDownloads isMobile={isMobile} />

      <section className="border-y border-stone-300/70 bg-[#FFFDF7] px-5 py-12 md:px-8 md:py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-black">Type</h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-stone-700">
            Montserrat, bold or black, for display and tracked capital labels.
            Inter for body copy, regular to read, medium for emphasis. Direct and
            workmanlike. Large type only where the surface has room.
          </p>
          <p className="mt-4 max-w-2xl leading-relaxed text-stone-700">
            For signs: 25mm of letter height for every 3 metres of reading distance.
            A gate sign read from the road needs letters at least 100mm tall. A
            label on a container can be 6mm.
          </p>

          <h2 className="mt-12 text-3xl font-black">Voice</h2>
          <ul className="mt-4 grid max-w-2xl gap-3">
            {voiceRules.map((rule) => (
              <li key={rule} className="leading-relaxed text-stone-700">
                {rule}
              </li>
            ))}
          </ul>

          <div className="mt-8 border border-stone-300 bg-[#F5F0E8] p-6">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#CF5C1E]">
              Never use these words
            </p>
            <p className="mt-3 leading-relaxed text-stone-700">
              {bannedWords.join(", ")}.
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 py-14 md:px-8 md:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-black">Need something that is not here?</h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-stone-700">
            Vector artwork, a new sign, a print file at size, or a photo you are
            not sure you can use. Ask first, and we will get you the right file.
          </p>
          <Link href="/contact" className={`mt-7 ${harvestButtonClasses.primary}`}>
            Contact The Harvest
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
