import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Check, Copy, Download } from "lucide-react";
import { SiteNav, SiteFooter } from "./HarvestReviewTest";
import { colors } from "@/styles/brand";
import { setPageSeo } from "@/lib/seo";

/* -----------------------------------------------
   MEDIA + PARTNER KIT
   One page we can send to a journalist, a partner,
   a council officer or a market organiser so they
   can use our name and our pictures correctly
   without having to email us first.
   ----------------------------------------------- */

const PRESS_EMAIL = "hello@theharvestwitta.com.au";
const PRESS_PHONE = "0422 883 943";

type Boilerplate = { id: string; label: string; note: string; text: string };

const BOILERPLATES: Boilerplate[] = [
  {
    id: "short",
    label: "One line",
    note: "For a listing, a caption or a run of copy where space is tight.",
    text: "The Harvest is a garden, events and art space in Witta, on Jinibara Country, in the Sunshine Coast hinterland.",
  },
  {
    id: "medium",
    label: "Short paragraph",
    note: "For an article standfirst, a programme note or a partner's website.",
    text:
      "The Harvest is a garden, events and art space at 9 Gumland Drive, Witta, on Jinibara Country in the Sunshine Coast hinterland. " +
      "The site was the Green Harvest organic gardening nursery for decades, and The Harvest carries that name forward. " +
      "It opened to the public on 20 June 2026 and is built around three things people can actually do there: grow, make and gather.",
  },
  {
    id: "long",
    label: "Full boilerplate",
    note: "For a media release footer or a grant attachment.",
    text:
      "The Harvest is a garden, events and art space at 9 Gumland Drive, Witta, on Jinibara Country in the Sunshine Coast hinterland. " +
      "The site was the Green Harvest organic gardening nursery for decades, and The Harvest carries that name forward. " +
      "It opened to the public on 20 June 2026.\n\n" +
      "The place is organised around three rooms and three verbs. Grow is the garden: beds, seedlings, soil and work days. " +
      "Make is the art space: timber, repair, signs, workshops and things being shaped in public. " +
      "Gather is the social promise: neighbours, long tables, food, music and people coming through the gate.\n\n" +
      "The Harvest is run on a co-design ethos. The kids area is built by kids. The art space is shaped by artists. " +
      "Membership is free, and the work is done in the open.\n\n" +
      "The Harvest stands on Jinibara Country. We acknowledge the Jinibara people as Traditional Custodians and pay respect to Elders past and present.",
  },
];

const FACTS: { label: string; value: string }[] = [
  { label: "Name", value: "The Harvest" },
  { label: "Address", value: "9 Gumland Drive, Witta QLD 4552" },
  { label: "Country", value: "Jinibara Country" },
  { label: "Region", value: "Sunshine Coast hinterland, Queensland" },
  { label: "Opened to the public", value: "20 June 2026" },
  { label: "Site history", value: "Formerly the Green Harvest organic gardening nursery" },
  { label: "The three rooms", value: "Garden, events, art space" },
  { label: "The three verbs", value: "Grow, make, gather" },
  { label: "Website", value: "theharvestwitta.com.au" },
];

type LogoAsset = {
  file: string;
  name: string;
  use: string;
  dimensions: string;
  onDark?: boolean;
};

const LOGOS: LogoAsset[] = [
  {
    file: "/images/logo-v1-dark-clean.png",
    name: "Primary wordmark, dark",
    use: "The default. Use this on cream or any light background.",
    dimensions: "PNG, 1245 x 784, transparent",
  },
  {
    file: "/images/logo-v1-white-clean.png",
    name: "Primary wordmark, white",
    use: "For dark backgrounds and photographs. Same artwork, knocked out to white.",
    dimensions: "PNG, 1245 x 784, transparent",
    onDark: true,
  },
  {
    file: "/images/logo-v1-colour-clean.png",
    name: "Colour wordmark",
    use: "For full-colour print and anywhere the roots should carry the palette.",
    dimensions: "PNG, 1133 x 749, transparent",
  },
  {
    file: "/images/the-harvest-witta-logo.png",
    name: "Small-size lockup",
    use: "Website headers, email signatures and anywhere height is tight.",
    dimensions: "PNG, 360 x 227, transparent",
  },
  {
    file: "/images/logo-facebook-profile.png",
    name: "Square avatar",
    use: "Social profile pictures and anywhere the mark has to sit in a circle. White background, not transparent.",
    dimensions: "PNG, 512 x 512",
  },
];

const LOGO_RULES: { do: string[]; dont: string[] } = {
  do: [
    "Leave clear space around the mark, at least the height of the T, on every side.",
    "Use the white version on photographs and dark panels, never the dark version.",
    "Keep the wordmark at 120px wide or larger on screen so the roots stay readable.",
    "Place it on cream (#F5F0E8) or shed black (#1C1917).",
  ],
  dont: [
    "Stretch, squash, rotate or add a drop shadow to the mark.",
    "Recolour the wordmark outside the supplied files.",
    "Put it on a mid-tone grey, a busy photo or one of the accent colours.",
    "Rebuild the wordmark by typing it in another font. Use the artwork.",
  ],
};

type Swatch = { name: string; hex: string; note: string; light?: boolean };

const PALETTE: Swatch[] = [
  { name: "Shed", hex: colors.shed, note: "Barry's shed interior. Body text and dark panels." },
  { name: "Milk", hex: colors.milk, note: "Raw milk and aged paper. The background. Never plain white.", light: true },
  { name: "Canopy", hex: colors.canopy, note: "Ridge eucalyptus. Carries Grow: garden, seedlings, work days." },
  { name: "Crane", hex: colors.crane, note: "Rust on Barry's crane. Carries Make: timber, repair, art space." },
  { name: "Golden Hour", hex: colors.goldenHour, note: "Late light on the ridge. Carries Gather: tables, food, invitation." },
  { name: "Rammed Earth", hex: colors.rammedEarth, note: "The rammed earth walls of the building." },
  { name: "Calendula", hex: colors.calendula, note: "Calendula in the garden beds. Warm accent, used sparingly." },
  { name: "Workshirt", hex: colors.workshirt, note: "Barry's navy work shirt and hinterland dusk." },
  { name: "Hardwood", hex: colors.hardwood, note: "Blackbutt beams and shed framing." },
  { name: "Lilly Pilly", hex: colors.lillyPilly, note: "The Syzygium at the front gate. Deepest accent." },
];

type Photo = { file: string; caption: string; taken: string; dimensions: string; ratio: string };

/* Real photographs of the real site only. Everything here has camera EXIF
   behind it. The concept renders used elsewhere on the website are
   deliberately not in this kit: handing an illustration to a journalist as
   a photograph is how a place gets described as something it is not. */
const PHOTOS: Photo[] = [
  {
    file: "/images/compendium/seed-house-front.jpg",
    caption: "The main building and the Lilly Pilly at the front gate",
    taken: "October 2024",
    dimensions: "2000 x 1333",
    ratio: "3 / 2",
  },
  {
    file: "/images/palette/rammed-earth.jpg",
    caption: "The site from the paddock, shadehouses on the left",
    taken: "October 2024",
    dimensions: "2000 x 1333",
    ratio: "3 / 2",
  },
  {
    file: "/images/gathering-recap-crowd.jpg",
    caption: "Neighbours at a gathering on site",
    taken: "March 2026",
    dimensions: "2000 x 1333",
    ratio: "3 / 2",
  },
  {
    file: "/images/membership/member-welcome-crates.jpg",
    caption: "Crate tower at the front of the site",
    taken: "April 2026",
    dimensions: "2000 x 1333",
    ratio: "3 / 2",
  },
  {
    file: "/images/palette/calendula.jpg",
    caption: "Calendula in the garden beds",
    taken: "October 2024",
    dimensions: "2000 x 1333",
    ratio: "3 / 2",
  },
];

const VOICE_DO = [
  "Write \"The Harvest\", with the capital T on The.",
  "Say \"garden, events and art space\". That is the top line.",
  "Say \"work days\", not \"working bees\".",
  "Use the Jinibara place name first, colonial name in brackets, if you need both.",
  "Credit photographs to The Harvest unless a specific photographer is named on the file.",
];

const VOICE_DONT = [
  "Do not call it a farm, a cafe, a market or a retreat. It is none of those.",
  "Do not put \"Kitchen\" in the top line. A kitchen is a future sublicenced operation, not the brand.",
  "Do not invent attendance numbers, member counts or dollar figures. Ask us and we will give you the real ones.",
  "Do not describe anything as finished that is still being built. Most of the site is in progress and we say so.",
  "Do not run the illustrated concept scenes from our website as photographs. Use the pictures on this page.",
];

/* ----------------------------------------------- */

function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex min-h-9 items-center gap-2 border border-stone-900/20 bg-transparent px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-stone-700 transition hover:border-stone-900/50 hover:text-[#1C1917]"
    >
      {copied ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
      {copied ? "Copied" : label}
    </button>
  );
}

function SectionHeading({
  eyebrow,
  title,
  intro,
  id,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  id: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#8B4A2A]">{eyebrow}</p>
      <h2
        id={id}
        style={{ scrollMarginTop: 108 }}
        className="mt-3 text-3xl font-black leading-tight md:text-4xl"
      >
        {title}
      </h2>
      {intro ? <p className="mt-4 text-base leading-relaxed text-stone-600">{intro}</p> : null}
    </div>
  );
}

const NAV_SECTIONS = [
  { id: "boilerplate", label: "Words about us" },
  { id: "logos", label: "Logos" },
  { id: "colour", label: "Colour" },
  { id: "type", label: "Type" },
  { id: "photos", label: "Photographs" },
  { id: "video", label: "Video" },
  { id: "facts", label: "Facts" },
  { id: "voice", label: "How to write about us" },
  { id: "terms", label: "Terms of use" },
];

export default function Media() {
  useEffect(() => {
    setPageSeo({
      title: "Media and partner kit · The Harvest Witta",
      description:
        "Logos, colours, photographs and approved copy for journalists, partners and anyone writing about The Harvest in Witta.",
      path: "/media",
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#1C1917]">
      <SiteNav />

      <main className="pt-[76px]">
        {/* ---------- HERO ---------- */}
        <section className="border-b border-stone-900/10 bg-[#1C1917] text-[#F5F0E8]">
          <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#C4922A]">
              Media and partner kit
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-black leading-[1.05] md:text-6xl">
              Everything you need to write about The Harvest, without emailing us first.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#F5F0E8]/75">
              Logos, colours, photographs and copy you can use. Free for editorial use, just credit us.
              If you need something that is not here, or you are using it commercially, ask and we will
              sort it out.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="/the-harvest-logo-pack.zip"
                download
                className="inline-flex min-h-12 items-center gap-2 bg-[#C4922A] px-6 py-3 font-semibold text-[#1C1917] transition hover:bg-[#d9a534]"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Download the logo pack
              </a>
              <a
                href={`mailto:${PRESS_EMAIL}?subject=Media%20enquiry`}
                className="inline-flex min-h-12 items-center gap-2 border border-[#F5F0E8]/30 px-6 py-3 font-semibold text-[#F5F0E8] transition hover:border-[#F5F0E8]/70"
              >
                Talk to a person
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>

            <nav aria-label="Kit sections" className="mt-12 flex flex-wrap gap-x-6 gap-y-3 border-t border-[#F5F0E8]/15 pt-8">
              {NAV_SECTIONS.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#F5F0E8]/60 underline-offset-4 transition hover:text-[#C4922A] hover:underline"
                >
                  {section.label}
                </a>
              ))}
            </nav>
          </div>
        </section>

        {/* ---------- PRESS CONTACT ---------- */}
        <section className="border-b border-stone-900/10 bg-[#C4922A]">
          <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 md:flex-row md:items-center md:justify-between md:px-8">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#1C1917]/60">
                Media contact
              </p>
              <p className="mt-2 text-xl font-black leading-tight">
                Ben Knight, co-founder
              </p>
              <p className="mt-1 text-sm leading-relaxed text-[#1C1917]/75">
                Interviews, site visits, photography on site, and anything you cannot find on this page.
              </p>
            </div>
            <div className="flex flex-col gap-2 md:items-end">
              <a href={`mailto:${PRESS_EMAIL}`} className="font-semibold underline underline-offset-4">
                {PRESS_EMAIL}
              </a>
              <a href={`tel:${PRESS_PHONE.replace(/\s/g, "")}`} className="font-semibold underline underline-offset-4">
                {PRESS_PHONE}
              </a>
            </div>
          </div>
        </section>

        {/* ---------- BOILERPLATE ---------- */}
        <section className="border-b border-stone-900/10">
          <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
            <SectionHeading
              id="boilerplate"
              eyebrow="Words about us"
              title="Approved copy, three lengths"
              intro="Paste any of these straight in. They are checked and current, so you do not have to write around us."
            />

            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {BOILERPLATES.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-col border border-stone-900/15 bg-white/40 p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-black leading-tight">{item.label}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-stone-500">{item.note}</p>
                    </div>
                    <CopyButton value={item.text} />
                  </div>
                  <div className="mt-5 flex-1 whitespace-pre-line border-t border-stone-900/10 pt-5 text-sm leading-relaxed text-stone-700">
                    {item.text}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- LOGOS ---------- */}
        <section className="border-b border-stone-900/10 bg-white/30">
          <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                id="logos"
                eyebrow="Logos"
                title="The wordmark, in every version you will need"
                intro="Roots growing out of the letters. That is the whole idea, so keep them visible. Every file is transparent PNG unless noted."
              />
              <a
                href="/the-harvest-logo-pack.zip"
                download
                className="inline-flex min-h-12 shrink-0 items-center gap-2 bg-[#1C1917] px-6 py-3 font-semibold text-[#F5F0E8] transition hover:bg-[#3D3832]"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                All logos, ZIP
              </a>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {LOGOS.map((logo) => (
                <article
                  key={logo.name}
                  className="flex flex-col border border-stone-900/15 bg-[#F5F0E8]"
                >
                  <div
                    className="flex min-h-[180px] items-center justify-center p-8"
                    style={{ backgroundColor: logo.onDark ? colors.shed : colors.milk }}
                  >
                    <img
                      src={logo.file}
                      alt={`The Harvest logo: ${logo.name}`}
                      className="max-h-24 w-auto max-w-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-1 flex-col border-t border-stone-900/15 p-5">
                    <h3 className="text-base font-black leading-tight">{logo.name}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-600">{logo.use}</p>
                    <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-stone-500">
                      {logo.dimensions}
                    </p>
                    <a
                      href={logo.file}
                      download
                      className="mt-4 inline-flex min-h-10 items-center gap-2 self-start border border-stone-900/25 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] transition hover:border-stone-900/60 hover:bg-[#1C1917] hover:text-[#F5F0E8]"
                    >
                      <Download className="h-3.5 w-3.5" aria-hidden="true" />
                      Download
                    </a>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <div className="border-l-4 p-6" style={{ borderColor: colors.canopy, backgroundColor: "rgba(74,103,65,0.06)" }}>
                <h3 className="font-mono text-xs uppercase tracking-[0.18em]" style={{ color: colors.canopy }}>
                  Please do
                </h3>
                <ul className="mt-4 space-y-3">
                  {LOGO_RULES.do.map((rule) => (
                    <li key={rule} className="text-sm leading-relaxed text-stone-700">
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-l-4 p-6" style={{ borderColor: colors.crane, backgroundColor: "rgba(139,74,42,0.06)" }}>
                <h3 className="font-mono text-xs uppercase tracking-[0.18em]" style={{ color: colors.crane }}>
                  Please do not
                </h3>
                <ul className="mt-4 space-y-3">
                  {LOGO_RULES.dont.map((rule) => (
                    <li key={rule} className="text-sm leading-relaxed text-stone-700">
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- COLOUR ---------- */}
        <section className="border-b border-stone-900/10">
          <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
            <SectionHeading
              id="colour"
              eyebrow="Colour"
              title="Ten colours, all of them taken from the place"
              intro="Every colour here was pulled off something real on the ridge: the rammed earth walls, the rust on Barry's crane, the late light. Click a swatch to copy the hex."
            />

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {PALETTE.map((swatch) => (
                <div key={swatch.name} className="border border-stone-900/15 bg-white/40">
                  <div
                    className="flex h-28 items-end justify-between p-4"
                    style={{ backgroundColor: swatch.hex }}
                  >
                    <span
                      className="font-mono text-xs uppercase tracking-[0.14em]"
                      style={{ color: swatch.light ? colors.shed : colors.milk }}
                    >
                      {swatch.hex.toUpperCase()}
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-base font-black leading-tight">{swatch.name}</h3>
                      <CopyButton value={swatch.hex.toUpperCase()} label="Hex" />
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-stone-600">{swatch.note}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-8 max-w-3xl border-l-4 border-[#C4922A] bg-[#C4922A]/8 p-5 text-sm leading-relaxed text-stone-700">
              Colour carries meaning here, so please use it that way. Canopy is Grow. Crane is Make.
              Golden Hour is Gather. Backgrounds are cream or shed black, never plain white and never a
              mid-tone grey.
            </p>
          </div>
        </section>

        {/* ---------- TYPE ---------- */}
        <section className="border-b border-stone-900/10 bg-white/30">
          <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
            <SectionHeading
              id="type"
              eyebrow="Type"
              title="Two typefaces, both free"
              intro="Nothing licensed, nothing you have to buy. Both are on Google Fonts."
            />

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <article className="border border-stone-900/15 bg-[#F5F0E8] p-8">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#8B4A2A]">
                  Display and headings
                </p>
                <p className="mt-4 text-5xl font-black leading-none" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Montserrat
                </p>
                <p className="mt-4 text-lg leading-relaxed" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900 }}>
                  Grow. Make. Gather.
                </p>
                <p className="mt-5 text-sm leading-relaxed text-stone-600">
                  Weight 900 for headlines and 700 for labels. Labels are uppercase with wide letter
                  spacing. Headlines are sentence case.
                </p>
                <a
                  href="https://fonts.google.com/specimen/Montserrat"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] underline underline-offset-4"
                >
                  Get Montserrat
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </article>

              <article className="border border-stone-900/15 bg-[#F5F0E8] p-8">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#8B4A2A]">
                  Body copy
                </p>
                <p className="mt-4 text-5xl font-black leading-none" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Inter
                </p>
                <p className="mt-4 text-lg leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                  A garden and creative gathering place in Witta.
                </p>
                <p className="mt-5 text-sm leading-relaxed text-stone-600">
                  Regular 400 for reading, 600 for emphasis. Line height 1.5 or looser. Long paragraphs
                  stay under about 70 characters a line.
                </p>
                <a
                  href="https://fonts.google.com/specimen/Inter"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] underline underline-offset-4"
                >
                  Get Inter
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </article>
            </div>
          </div>
        </section>

        {/* ---------- PHOTOGRAPHS ---------- */}
        <section className="border-b border-stone-900/10">
          <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
            <SectionHeading
              id="photos"
              eyebrow="Photographs"
              title="Real photographs of the real place"
              intro="Every picture here was taken on site with a camera. There are not many of them yet, and that is the honest position: the place has only been open since June. Full resolution, no watermark. Free for editorial use, credit The Harvest."
            />

            <p className="mt-6 max-w-3xl border-l-4 border-[#8B4A2A] bg-[#8B4A2A]/8 p-5 text-sm leading-relaxed text-stone-700">
              You will see illustrated scenes elsewhere on our website, showing the garden, the art
              space and long tables. Those are concept drawings of what we are building, not
              photographs, and they are deliberately not in this kit. Please do not use them as
              pictures of the site.
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {PHOTOS.map((photo) => (
                <figure key={photo.file} className="flex flex-col border border-stone-900/15 bg-white/40">
                  <div className="overflow-hidden bg-stone-200" style={{ aspectRatio: photo.ratio }}>
                    <img
                      src={photo.file}
                      alt={photo.caption}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <figcaption className="flex flex-1 flex-col p-5">
                    <p className="text-base font-black leading-tight">{photo.caption}</p>
                    <p className="mt-2 flex-1 font-mono text-[11px] uppercase tracking-[0.12em] text-stone-500">
                      JPG, {photo.dimensions} · Taken {photo.taken}
                    </p>
                    <a
                      href={photo.file}
                      download
                      className="mt-4 inline-flex min-h-10 items-center gap-2 self-start border border-stone-900/25 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] transition hover:border-stone-900/60 hover:bg-[#1C1917] hover:text-[#F5F0E8]"
                    >
                      <Download className="h-3.5 w-3.5" aria-hidden="true" />
                      Download
                    </a>
                  </figcaption>
                </figure>
              ))}
            </div>

            <p className="mt-8 max-w-3xl text-sm leading-relaxed text-stone-600">
              Need something specific: a portrait, a particular room, a shot of an event, or something at
              print resolution for a poster? Email {" "}
              <a href={`mailto:${PRESS_EMAIL}`} className="underline underline-offset-4">
                {PRESS_EMAIL}
              </a>{" "}
              and tell us what the picture has to do. We will usually turn it around the same week.
            </p>
          </div>
        </section>

        {/* ---------- VIDEO ---------- */}
        <section className="border-b border-stone-900/10 bg-white/30">
          <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
            <SectionHeading
              id="video"
              eyebrow="Video"
              title="Footage on request"
              intro="We hold drone footage of the site and the ridge, plus clips from work days and open days. The files are large, so we send them directly rather than hosting them here."
            />

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <div className="border border-stone-900/15 bg-[#F5F0E8] p-6">
                <h3 className="text-lg font-black leading-tight">What we have</h3>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-stone-700">
                  <li>Aerial passes over the site and the surrounding ridge, shot in May and June 2026.</li>
                  <li>Ground footage from work days and open days, unedited.</li>
                  <li>Short vertical cuts suitable for social.</li>
                </ul>
              </div>
              <div className="border border-stone-900/15 bg-[#F5F0E8] p-6">
                <h3 className="text-lg font-black leading-tight">How to get it</h3>
                <p className="mt-4 text-sm leading-relaxed text-stone-700">
                  Email us with the deadline, the format you need and where it will run. We will send a
                  download link. If you need an interview or footage shot on the day, give us a week's
                  notice and we will arrange site access.
                </p>
                <a
                  href={`mailto:${PRESS_EMAIL}?subject=Footage%20request`}
                  className="mt-5 inline-flex min-h-11 items-center gap-2 bg-[#1C1917] px-5 py-3 font-semibold text-[#F5F0E8] transition hover:bg-[#3D3832]"
                >
                  Request footage
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- FACTS ---------- */}
        <section className="border-b border-stone-900/10">
          <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
            <SectionHeading
              id="facts"
              eyebrow="Facts"
              title="The details, checked"
              intro="If you need a number that is not on this list, ask us. We would rather give you the real one than have you estimate."
            />

            <dl className="mt-10 grid gap-px border border-stone-900/15 bg-stone-900/15 sm:grid-cols-2 lg:grid-cols-3">
              {FACTS.map((fact) => (
                <div key={fact.label} className="bg-[#F5F0E8] p-6">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500">
                    {fact.label}
                  </dt>
                  <dd className="mt-2 text-base font-semibold leading-snug">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ---------- VOICE ---------- */}
        <section className="border-b border-stone-900/10 bg-white/30">
          <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
            <SectionHeading
              id="voice"
              eyebrow="How to write about us"
              title="A few things that matter to us"
              intro="Not style policing. These are the places where getting it wrong actually misleads people about what the place is."
            />

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <div className="border-l-4 p-6" style={{ borderColor: colors.canopy, backgroundColor: "rgba(74,103,65,0.06)" }}>
                <h3 className="font-mono text-xs uppercase tracking-[0.18em]" style={{ color: colors.canopy }}>
                  Please do
                </h3>
                <ul className="mt-4 space-y-3">
                  {VOICE_DO.map((item) => (
                    <li key={item} className="text-sm leading-relaxed text-stone-700">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-l-4 p-6" style={{ borderColor: colors.crane, backgroundColor: "rgba(139,74,42,0.06)" }}>
                <h3 className="font-mono text-xs uppercase tracking-[0.18em]" style={{ color: colors.crane }}>
                  Please do not
                </h3>
                <ul className="mt-4 space-y-3">
                  {VOICE_DONT.map((item) => (
                    <li key={item} className="text-sm leading-relaxed text-stone-700">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- TERMS ---------- */}
        <section className="bg-[#1C1917] text-[#F5F0E8]">
          <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#C4922A]">
              Terms of use
            </p>
            <h2
              id="terms"
              style={{ scrollMarginTop: 108 }}
              className="mt-3 max-w-3xl text-3xl font-black leading-tight md:text-4xl"
            >
              Free for editorial. Ask us for commercial.
            </h2>

            <div className="mt-8 grid max-w-5xl gap-6 md:grid-cols-2">
              <ul className="space-y-4 text-base leading-relaxed text-[#F5F0E8]/80">
                <li>
                  <span className="font-semibold text-[#C4922A]">Editorial use is free.</span> Writing
                  an article, a listing, a programme note, a newsletter, a community post, or promoting
                  an event you are running with us. Take what you need and credit The Harvest. No
                  permission needed.
                </li>
                <li>
                  <span className="font-semibold text-[#C4922A]">Commercial use, email us first.</span>{" "}
                  If the assets appear on something being sold, on packaging, on merchandise, or in paid
                  advertising, we want a quick conversation before it runs. The answer is usually yes.
                </li>
                <li>
                  Do not use the logo in a way that suggests we endorse a product, a candidate or a
                  business we have not partnered with.
                </li>
              </ul>
              <ul className="space-y-4 text-base leading-relaxed text-[#F5F0E8]/80">
                <li>
                  People appear in some of these photographs. Do not crop or caption them in a way they
                  would not recognise as fair.
                </li>
                <li>
                  If you are not sure whether a use is fine, ask. The answer is usually yes and it takes
                  us a minute.
                </li>
              </ul>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-[#F5F0E8]/15 pt-10">
              <a
                href={`mailto:${PRESS_EMAIL}?subject=Media%20enquiry`}
                className="inline-flex min-h-12 items-center gap-2 bg-[#C4922A] px-6 py-3 font-semibold text-[#1C1917] transition hover:bg-[#d9a534]"
              >
                {PRESS_EMAIL}
              </a>
              <Link
                href="/what-is-the-harvest"
                className="inline-flex min-h-12 items-center gap-2 border border-[#F5F0E8]/30 px-6 py-3 font-semibold text-[#F5F0E8] transition hover:border-[#F5F0E8]/70"
              >
                Read the fuller story
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
