import { useEffect } from "react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { ShopInterestSection } from "@/components/ShopInterestSection";
import { SiteNav, SiteFooter, harvestButtonClasses } from "./HarvestReviewTest";
import { VisitStrip } from "@/components/VisitStrip";

const shelfWays = [
  {
    title: "Produce",
    body: "From your garden, the farm, or the kitchen. Fruit, veg, eggs, herbs, honey.",
  },
  {
    title: "Made goods",
    body: "Ceramics, prints, oils, textiles, woodwork. Things made by hand around here.",
  },
  {
    title: "Food and ferments",
    body: "Preserves, ferments, baking, drinks. The pantry end of the shelf.",
  },
  {
    title: "Shared shelf",
    body: "A consignment spot if you would rather we hold it and sell it for you.",
  },
  {
    title: "Help shape it",
    body: "Not selling anything yet, but want a hand in how the shop works? Good.",
  },
];

export default function Shop() {
  useEffect(() => {
    document.title = "The Shop · The Harvest Witta";
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content =
      "Witta hasn't had a shop in a generation. The Harvest is putting one back: the first shelves are being shaped with the growers and makers who already live around Witta and Maleny.";
  }, []);

  return (
    <main className="min-h-screen bg-[#F5F0E8] text-[#1C1917]">
      <SiteNav />

      <section className="relative overflow-hidden bg-[#1C1917] text-[#F5F0E8]">
        <div className="relative z-10 mx-auto max-w-5xl px-5 pb-16 pt-32 md:px-8 md:pb-24 md:pt-40">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#C4922A]">
            The Shop
          </p>
          <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[0.94] md:text-7xl">
            Witta hasn't had a shop in a generation.
          </h1>
          <p className="mt-7 max-w-2xl text-xl leading-relaxed text-white/80 md:text-2xl">
            Around 1,300 people live here, with nowhere to buy a loaf of bread or the thing
            your neighbour grew. The Shop is a small, slow attempt to put one back: a shared
            shelf for the growers and makers who already live around Witta and Maleny. The
            first shelves are being shaped now, and Susie and Joey steward the place day to
            day. Not a supermarket, not a boutique. A shelf with honest signage, kept simple
            on purpose.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a href="#shop-interest" className={harvestButtonClasses.primary}>
              Put something on the shelf
              <ArrowRight className="h-4 w-4" />
            </a>
            <Link href="/works/the-shop" className={harvestButtonClasses.onDark}>
              Read the full story
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-5 md:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#8B4A2A]">
            Ways onto the shelf
          </p>
          <h2 className="mt-3 max-w-2xl text-4xl font-black leading-[0.98] md:text-5xl">
            If you grow it, make it, or want to help, there is a place for you.
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shelfWays.map((way) => (
              <article key={way.title} className="border border-stone-300 bg-[#FFFDF7] p-6">
                <h3 className="text-2xl font-black">{way.title}</h3>
                <p className="mt-3 leading-relaxed text-stone-700">{way.body}</p>
              </article>
            ))}
          </div>
          <p className="mt-8 max-w-2xl leading-relaxed text-stone-600">
            An expression of interest starts a proper conversation, not a contract. The form
            below asks for almost nothing on purpose. If there is a fit, we will be in touch to
            talk through the detail. You keep ownership of what you bring, and we will work
            out the money side together before anything goes on a shelf.
          </p>
        </div>
      </section>

      <ShopInterestSection />

      <section className="border-t border-stone-300/70 py-14 md:py-20">
        <div className="mx-auto flex max-w-5xl flex-col gap-5 px-5 md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            <h2 className="text-3xl font-black md:text-4xl">The longer story</h2>
            <p className="mt-3 max-w-xl leading-relaxed text-stone-700">
              How a village without a shop ends up building a shelf, and the co-operative
              history around Witta and Maleny it grows out of.
            </p>
          </div>
          <Link href="/works/the-shop" className={`${harvestButtonClasses.dark} shrink-0`}>
            Read the full story
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <VisitStrip />
      <SiteFooter />
    </main>
  );
}
