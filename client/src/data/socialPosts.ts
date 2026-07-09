export interface SocialPost {
  id: number;
  title: string;
  label: string;
  date: string | null; // ISO date string, null for static assets
  displayDate: string;
  image: string;
  platforms: ("IG" | "FB" | "GBP")[];
  caption: string; // ready-to-paste social copy
  editorialNote: string; // internal posting strategy note
  link: string | null;
  format: "square" | "landscape" | "story";
  utmContent: string;
}

export const socialPosts: SocialPost[] = [
  {
    id: 1,
    title: "Origin Story",
    label: "Post 1 — Origin Story",
    date: "2026-02-27",
    displayDate: "Feb 27",
    image: "/images/social/01-origin-story.png",
    platforms: ["IG", "FB"],
    caption: `Witta has nowhere to gather. We're changing that.

On 5 acres of Jinibara Country, between the dairy farms and the rainforest, something is taking root.

A community kitchen. Workshop spaces. A native nursery that's been here for 27 years. And room for whatever this community wants to build.

We're not a venue. We're not a brand. We're a gathering place — built by and for the people who show up.

This is the beginning.

theharvestwitta.com.au

#TheHarvestWitta #Witta #SunshineCoastHinterland #Maleny #CommunityBuilding`,
    editorialNote: "PIN THIS FIRST. Launch post for Facebook & Instagram. Share in Maleny, Witta, Hinterland groups.",
    link: "/",
    format: "square",
    utmContent: "post-1-origin-story",
  },
  {
    id: 2,
    title: "First Gathering",
    label: "Post 2 — First Gathering",
    date: "2026-02-28",
    displayDate: "Feb 28",
    image: "/images/social/02-event-announcement.png",
    platforms: ["IG", "FB", "GBP"],
    caption: `You're invited.

Saturday 7 March. 11am. 9 Gumland Drive, Witta.

Oysters from Minjerribah — shucked fresh by Shaun Fisher, Quandamooka man, oyster farmer. Pay what you feel.

Pizza from the trailer. BYO drinks.

We're launching the Radical Scoops project with Regional Arts Australia — celebrating the dairy, timber and co-op heritage of the Blackall Range. Bring your hands. We're building a milk crate pavilion together.

No tickets. No agenda. Just the beginning of something.

Kids welcome. Dogs on leads. Bring a chair or a blanket.

theharvestwitta.com.au/whats-on

#TheHarvestWitta #FirstGathering #Witta #Maleny #SunshineCoastHinterland #CommunityEvent`,
    editorialNote: "The big event announcement. Create Facebook Event with this image. Share in all local groups.",
    link: "/whats-on",
    format: "square",
    utmContent: "post-2-first-gathering",
  },
  {
    id: 3,
    title: "Shaun Fisher",
    label: "Post 3 — Shaun Fisher",
    date: "2026-03-01",
    displayDate: "Mar 1",
    image: "/images/social/03-shaun-fisher.png",
    platforms: ["IG", "FB"],
    caption: `Shaun Fisher was the first person to say yes.

Quandamooka man. Oyster farmer. When colonisers arrived in Moreton Bay, they blew up the Aboriginal oyster leases for limestone — to build the Treasury, the banks, the city itself.

Shaun is bringing them back. Farmed on Quandamooka Country. Sold direct to community.

On March 7, he's shucking fresh oysters at our first gathering in Witta. Pay what you feel. The shells get collected and used by our architect to make rammed earth flooring.

Full circle.

theharvestwitta.com.au/whats-on

#TheHarvestWitta #ShaunFisher #Quandamooka #MoretonBayOysters #FirstGathering`,
    editorialNote: "Trust signal + food story. The Shaun story is the most shareable piece of content we have.",
    link: "/whats-on",
    format: "square",
    utmContent: "post-3-shaun-fisher",
  },
  {
    id: 4,
    title: "Radical Scoops",
    label: "Post 4 — Radical Scoops",
    date: "2026-03-01",
    displayDate: "Mar 1",
    image: "/images/social/04-radical-scoops.png",
    platforms: ["IG", "FB"],
    caption: `We've been funded by Regional Arts Australia to explore the dairy, timber and co-op heritage of the Blackall Range.

It's called Radical Scoops — a 12-month creative fellowship connecting agriculture, food, and community on Kabi Kabi and Jinibara Country.

Photography. Oral histories. Building things from recycled materials.

Got old photos of Witta? Equipment from the dairy days? Stories about the co-ops? We want to hear from you.

Come tell us at the first gathering on March 7. Or reply to this post.

#RadicalScoops #RegionalArtsAustralia #BlackallRange #TheHarvestWitta #Heritage #Witta`,
    editorialNote: "Credibility + depth. Regional Arts framing. Good for arts/heritage audience.",
    link: "/",
    format: "square",
    utmContent: "post-4-radical-scoops",
  },
  {
    id: 5,
    title: "Zone: Garden",
    label: "Post 5 — Zone: Garden",
    date: "2026-03-02",
    displayDate: "Mar 2",
    image: "/images/social/05-zone-garden.png",
    platforms: ["IG", "FB"],
    caption: `Grow.

Barry has been restoring the native nursery on this site for 27 years. He doesn't own it. He just couldn't let it go.

Now it's becoming a community garden. Raised beds. A polytunnel. Seasonal rhythms. Soil you can actually smell.

We're not selling produce. We're growing together — literally.

What would you want to grow? Tell us below.

#TheHarvestWitta #CommunityGarden #Grow #Witta #NativeNursery #SunshineCoastHinterland`,
    editorialNote: "Garden zone intro. The question at the end drives comments. Tag local garden groups.",
    link: null,
    format: "square",
    utmContent: "post-5-zone-garden",
  },
  {
    id: 6,
    title: "Zone: Art",
    label: "Post 6 — Zone: Art",
    date: "2026-02-27",
    displayDate: "Feb 27",
    image: "/images/social/06-zone-art.png",
    platforms: ["IG", "FB"],
    caption: `Make.

Studio space with good light and room to think. A place where artists and makers can work without watching the clock.

We're building a residency program — come for a few weeks, work on your thing, share meals with the community, leave something behind that matters.

Ceramics. Woodwork. Print. Fermentation. Repair. Whatever you make with your hands.

The art space shapes itself around whoever shows up.

#TheHarvestWitta #Make #ArtistResidency #MakerSpace #Witta #SunshineCoastHinterland #CreativeSpace`,
    editorialNote: "Art zone intro. Tag Sunshine Coast Creative Network, QLD artist residency groups.",
    link: null,
    format: "square",
    utmContent: "post-6-zone-art",
  },
  {
    id: 7,
    title: "Zone: Food",
    label: "Post 7 — Zone: Food",
    date: "2026-03-03",
    displayDate: "Mar 3",
    image: "/images/social/07-zone-food.png",
    platforms: ["IG", "FB"],
    caption: `Feed.

A community kitchen where locals cook together. Long tables under the trees. Hinterland producers meeting the people who eat what they grow.

Not a restaurant. Not a café. A shared table.

Oyster nights before a restaurant. Pizza from a trailer before a kitchen. The scaffold pavilion before the permanent structure.

That's the whole beginning.

Saturday 7 March. Come eat with us.

theharvestwitta.com.au/whats-on

#TheHarvestWitta #Feed #CommunityKitchen #SharedTable #Witta #Maleny #HinterlandFood`,
    editorialNote: "Food zone intro. Links back to the gathering. Post Monday before event week.",
    link: "/whats-on",
    format: "square",
    utmContent: "post-7-zone-food",
  },
  {
    id: 8,
    title: "Countdown 7 Days",
    label: "Post 8 — Countdown 7 Days",
    date: "2026-03-01",
    displayDate: "Mar 1",
    image: "/images/social/08-countdown-7days.png",
    platforms: ["IG", "FB", "GBP"],
    caption: `7 days.

Saturday 7 March. 11am.
9 Gumland Drive, Witta.

Oysters. Pizza. Music. Building things together.

Free. Just show up.

theharvestwitta.com.au/whats-on

#TheHarvestWitta #FirstGathering #7Days #Witta`,
    editorialNote: "One week out. Short, punchy. Boost this one ($20-50). Update GBP listing.",
    link: "/whats-on",
    format: "square",
    utmContent: "post-8-countdown-7days",
  },
  {
    id: 9,
    title: "Locals Day",
    label: "Post 9 — Locals Day",
    date: "2026-03-03",
    displayDate: "Mar 3",
    image: "/images/social/09-locals-day.png",
    platforms: ["FB"],
    caption: `Witta locals — this one's for you.

Friday 6 March, afternoon. Before the big gathering on Saturday.

Just neighbours. Meet each other. See the site. Share your ideas for what this place should become.

Kids can run around. Bring something to share if you want. Or just bring yourself.

9 Gumland Drive. You know where it is.

theharvestwitta.com.au/whats-on

#Witta #LocalsDay #TheHarvestWitta #Community`,
    editorialNote: "Witta locals only. Facebook only — share in Witta & District group + Nextdoor.",
    link: "/whats-on",
    format: "square",
    utmContent: "post-9-locals-day",
  },
  {
    id: 10,
    title: "Save Your Spot",
    label: "Post 10 — Save Your Spot",
    date: "2026-03-05",
    displayDate: "Mar 5",
    image: "/images/social/10-save-your-spot.png",
    platforms: ["IG", "FB", "GBP"],
    caption: `This Saturday.

We're opening the gates for the first time. 5 acres of Jinibara Country in Witta.

Fresh oysters from Minjerribah. Pizza. Music. A milk crate build with the kids. The beginning of a community kitchen, garden, and art space.

Saturday 7 March. 11am. Free.
9 Gumland Drive, Witta.

Bring a chair. Bring the neighbours. Bring an appetite.

theharvestwitta.com.au/whats-on

#TheHarvestWitta #ThisSaturday #Witta #Maleny #SunshineCoastHinterland #FreeEvent`,
    editorialNote: "Final CTA. 2 days out. Boost with $30-50. Last push across all platforms.",
    link: "/whats-on",
    format: "square",
    utmContent: "post-10-save-your-spot",
  },
  {
    id: 11,
    title: "Facebook Cover",
    label: "Post 11 — Facebook Cover",
    date: null,
    displayDate: "\u2014",
    image: "/images/social/11-facebook-cover.png",
    platforms: ["FB"],
    caption: "Facebook page cover photo or event cover image. Upload directly — no caption needed.",
    editorialNote: "Static asset. Upload as FB page cover and/or event cover. 16:9 landscape format.",
    link: null,
    format: "landscape",
    utmContent: "post-11-facebook-cover",
  },
  {
    id: 12,
    title: "Story: Invite",
    label: "Post 12 — Story: Invite",
    date: "2026-03-05",
    displayDate: "Mar 5",
    image: "/images/social/12-story-invite.png",
    platforms: ["IG"],
    caption: `This Saturday. Witta. You're invited.

Swipe up for details.`,
    editorialNote: "Instagram story. Add link sticker to /whats-on. Post Wed + Thu before event.",
    link: "/whats-on",
    format: "story",
    utmContent: "post-12-story-invite",
  },
  {
    id: 13,
    title: "Story: Shaun",
    label: "Post 13 — Story: Shaun",
    date: "2026-03-04",
    displayDate: "Mar 4",
    image: "/images/social/13-story-shaun.png",
    platforms: ["IG"],
    caption: `Fresh oysters from Minjerribah. Shucked by Shaun Fisher. Pay what you feel.

This Saturday at The Harvest, Witta.`,
    editorialNote: "Instagram story. Food provenance angle. Add link sticker. Pair with oyster-lease video if available.",
    link: "/whats-on",
    format: "story",
    utmContent: "post-13-story-shaun",
  },
  {
    id: 14,
    title: "Countdown 3 Days",
    label: "Post 14 — Countdown 3 Days",
    date: "2026-03-04",
    displayDate: "Mar 4",
    image: "/images/social/14-countdown-3days.png",
    platforms: ["IG", "FB"],
    caption: `3 days.

Oysters. Pizza. Building things together.

Saturday 7 March. 11am. Witta.

theharvestwitta.com.au/whats-on

#TheHarvestWitta #3Days #Witta #FirstGathering`,
    editorialNote: "Three days out. Short and punchy like the 7-day post. Post to feed + story.",
    link: "/whats-on",
    format: "square",
    utmContent: "post-14-countdown-3days",
  },
];

/** Build a UTM-tagged link for a post */
export function getPostLink(post: SocialPost, platform: string = "social"): string {
  if (!post.link) return "";
  return `theharvestwitta.com.au${post.link}?utm_source=${platform}&utm_medium=social&utm_campaign=first-gathering&utm_content=${post.utmContent}`;
}
