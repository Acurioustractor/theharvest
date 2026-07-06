import { useEffect } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  Hammer,
  Mail,
  Sprout,
  Users,
} from "lucide-react";
import { HarvestImage } from "@/components/HarvestImage";
import { EditableText } from "@/components/EditableText";
import { harvestButtonClasses, SiteFooter, SiteNav } from "./HarvestReviewTest";

const rooms = [
  {
    name: "Garden",
    verb: "Grow",
    body: "Beds, paths, nursery life, soil, work days, and kids with dirt on their hands.",
    image: "/images/optimized/hero-aerial-1400.webp",
    icon: Sprout,
  },
  {
    name: "Art Space",
    verb: "Make",
    body: "A shed, a workbench, timber, tools, repair, workshops, residencies, and walls that can change.",
    image: "/images/optimized/barry-5745-1000.webp",
    icon: Hammer,
  },
  {
    name: "Events",
    verb: "Gather",
    body: "The Milk Crate Pavilion, the long table, work days, open days, music, markets, and the moments where neighbours actually meet.",
    image: "/images/optimized/community-gathering-1000.webp",
    icon: Users,
  },
];

export default function HarvestJourneyPost() {
  useEffect(() => {
    document.title = "What is The Harvest?";

    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content =
      "The Harvest is a community garden and creative gathering place in Witta on Jinibara Country, for locals and visitors to grow, make, and gather.";
  }, []);

  return (
    <main className="min-h-screen bg-[#F5F0E8] text-[#1C1917]">
      <SiteNav />
      <article>
        <header className="relative min-h-[86vh] overflow-hidden bg-stone-950 text-[#F5F0E8]">
          <HarvestImage
            page="what-is-the-harvest"
            slot="hero-aerial"
            src="/images/optimized/hero-aerial-1400.webp"
            alt="Aerial view of The Harvest site in Witta"
            size="hero"
            priority
            className="absolute inset-0 h-full w-full"
            imgClassName="h-full w-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/86 via-stone-950/54 to-stone-950/16" />
          <div className="relative z-10 mx-auto flex min-h-[86vh] max-w-6xl flex-col justify-end px-5 pb-10 pt-28 md:px-8 md:pb-14">
            <div className="max-w-4xl pb-10 md:pb-14">
              <p className="mb-5 font-mono text-xs uppercase tracking-[0.24em] text-[#C4922A]">
                Start here
              </p>
              <h1 className="text-5xl font-black leading-[0.92] tracking-normal md:text-7xl">
                What is The Harvest?
              </h1>
              <p className="mt-7 max-w-2xl text-xl leading-relaxed text-white/84 md:text-2xl">
                The Harvest is a community garden and creative gathering place in Witta on Jinibara Country, for locals and visitors to grow, make, and gather.
              </p>
            </div>
          </div>
        </header>

        <section id="story" className="py-16 md:py-24">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-[0.68fr_1fr] md:px-8">
            <aside className="md:sticky md:top-8 md:self-start">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#8B4A2A]">
                Witta, Jinibara Country
              </p>
              <h2 className="mt-3 text-4xl font-black leading-[0.98] md:text-5xl">
                A garden that is now a place to gather.
              </h2>
            </aside>

            <div className="space-y-8 text-lg leading-relaxed text-stone-800">
              <p>
                The Harvest is a community garden and creative gathering place in
                Witta, on Jinibara Country. It is open, and it is still being made.
              </p>
              <p>
                Before it was The Harvest, this was Green Harvest: a nursery and seed
                place where gardeners from around the region came for plants, seeds,
                advice, and growing knowledge.
              </p>
              <p>
                <strong>Grow is the garden.</strong> Paths, beds, seedlings, work
                days, compost, kids, and food in the ground. It is the part of the
                place that tells the truth fastest. Either something is growing or it
                is not.
              </p>
              <p>
                <strong>Make is the work.</strong> The shed, the tools, the workshops,
                the odd ideas, the useful repairs, the strange experiments, and the
                chance for people to find their own way into making.
              </p>
              <p>
                <strong>Gather is the table.</strong> The Milk Crate Pavilion, the long
                table, work days, music, markets, open days, and the moments that
                bring neighbours and visitors through the gate.
              </p>
              <EditableText
                page="what-is-the-harvest"
                slot="story-thread"
                defaultContent="Timber in the shed, milk crates in the pavilion, shared tools, and a table anyone can sit at."
                as="p"
                multiline
              />
              <p>
                The Harvest opened with a first members and makers day on Saturday
                20 June 2026, and is now properly under way. You do not need
                to book to come and have a look while we find our feet. Members hear
                first, every time.
              </p>
              <EditableText
                page="what-is-the-harvest"
                slot="visiting-basics"
                defaultContent="Most weekends we fire the pizza oven: Friday 3 to 8pm with a community movie night, Saturday 12 to 8pm, Sunday 12 to 6pm. Weeks can vary, so dates land on the members page first. Dennis, our resident pizza teacher, will show you how to stretch a base. No booking needed."
                as="p"
                multiline
              />
              <p>
                Full session times and the work day calendar live on{" "}
                <Link href="/whats-on" className="underline decoration-[#8B4A2A]/40 underline-offset-4 hover:decoration-[#8B4A2A]">
                  What's On
                </Link>
                .
              </p>
              <p>
                That is what the member list is for. People on the list get the letters, the
                first invitations, the work day calls, the early opportunities, and the
                next questions while the place is still being made. Membership is free.
                No app. One list. You are welcome on it.
              </p>
            </div>
          </div>
        </section>

        <section className="border-y border-stone-300/70 bg-[#FFFDF7] py-14 md:py-20">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <h2 className="mt-3 max-w-3xl text-4xl font-black leading-[0.98] md:text-5xl">
              Grow. Make. Gather.
            </h2>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {rooms.map((room) => {
                const Icon = room.icon;
                return (
                  <section key={room.name} className="overflow-hidden border border-stone-300 bg-[#F5F0E8]">
                    <HarvestImage
                      page="what-is-the-harvest"
                      slot={`room-${room.name.toLowerCase().replace(/\s+/g, "-")}`}
                      src={room.image}
                      alt={`${room.name} at The Harvest`}
                      size="card"
                      className="aspect-[4/3] overflow-hidden bg-stone-200"
                      imgClassName="h-full w-full object-cover"
                    />
                    <div className="p-6">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1C1917] text-[#F5F0E8]">
                          <Icon className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="font-mono text-xs uppercase tracking-[0.18em] text-stone-500">
                            {room.verb}
                          </p>
                          <h3 className="text-2xl font-black">{room.name}</h3>
                        </div>
                      </div>
              <p className="mt-5 text-base leading-relaxed text-stone-700">
                {room.body}
              </p>
            </div>
          </section>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#1C1917] py-16 text-[#F5F0E8] md:py-24">
          <div className="mx-auto grid max-w-6xl gap-8 px-5 md:grid-cols-[1fr_0.74fr] md:px-8">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#C4922A]">
                Next step
              </p>
              <h2 className="mt-3 text-4xl font-black leading-[0.98] md:text-5xl">
                Put your name on the list.
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/72">
                You will get regular Harvest notes, community-day invites, calls for help,
                and first notice when there are workshops, meals, residencies, materials,
                or paid opportunities to share.
              </p>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/60">
                If you grow, make, or have an idea for the place,{" "}
                <Link href="/contact" className="underline decoration-white/40 underline-offset-4 hover:decoration-white">
                  get in touch through the contact page
                </Link>
                . A person reads every message.
              </p>
            </div>
            <div className="border border-white/14 bg-white/5 p-6">
              <Mail className="h-9 w-9 text-[#C4922A]" />
              <p className="mt-5 text-xl font-semibold">
                The front gate list.
              </p>
              <p className="mt-3 leading-relaxed text-white/66">
                For people who want to stay close and help shape the first version
                of The Harvest.
              </p>
              <Link
                href="/membership"
                className={`mt-7 ${harvestButtonClasses.primary}`}
              >
                Become a member
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </article>
      <SiteFooter />
    </main>
  );
}
