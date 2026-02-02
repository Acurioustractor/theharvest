import SitePlanCanvas, {
  type LayerGroup,
  type InfoPoint,
} from "@/components/SitePlanCanvas";

// --- Layer groups ---
// 3 Morpholio Trace projects, all sharing the same 4096×4096 canvas.
const groups: LayerGroup[] = [
  {
    id: "master-plan",
    label: "Master Plan",
    layers: [
      { id: "base-plan", label: "Floor Plan", imageSrc: "/images/site-plan/layers/00-base-floor-plan.png" },
      { id: "building-outline", label: "Building Outline", imageSrc: "/images/site-plan/layers/01-building-outline.png" },
      { id: "site-plan", label: "Site Plan", imageSrc: "/images/site-plan/layers/02-site-plan.png" },
      { id: "landscaping", label: "Landscaping", imageSrc: "/images/site-plan/layers/03-landscaping.png", visible: false },
      { id: "stepping-stones", label: "Stepping Stones", imageSrc: "/images/site-plan/layers/04-stepping-stones.png", visible: false },
      { id: "community-gathering", label: "Community Gathering", imageSrc: "/images/site-plan/layers/05-community-gathering.png", visible: false },
      { id: "garden-structures", label: "Garden Structures", imageSrc: "/images/site-plan/layers/06-garden-structures.png", visible: false },
      { id: "circulation", label: "Circulation & Flow", imageSrc: "/images/site-plan/layers/07-circulation.png", visible: false },
      { id: "zone-labels", label: "Zone Labels", imageSrc: "/images/site-plan/layers/08-zone-labels.png", visible: false },
      { id: "sun-compass", label: "Sun Compass", imageSrc: "/images/site-plan/layers/09-sun-compass.png", visible: false },
      { id: "wind-flow", label: "Wind & Breeze", imageSrc: "/images/site-plan/layers/10-wind-flow.png", visible: false },
      { id: "dimensions", label: "Dimensions", imageSrc: "/images/site-plan/layers/11-dimensions.png", visible: false },
    ],
  },
  {
    id: "sketches",
    label: "Initial Sketches",
    layers: [
      { id: "sk-base", label: "Floor Plan", imageSrc: "/images/site-plan/layers/sketches/00-base-plan.png" },
      { id: "sk-building", label: "Building Outline", imageSrc: "/images/site-plan/layers/sketches/02-building-outline.png" },
      { id: "sk-annotations", label: "Annotations", imageSrc: "/images/site-plan/layers/sketches/01-annotations.png", visible: false },
      { id: "sk-dimensions", label: "Dimensions", imageSrc: "/images/site-plan/layers/sketches/03-dimensions.png", visible: false },
    ],
  },
  {
    id: "photos",
    label: "Photo Layers",
    layers: [
      { id: "ph-base", label: "Aerial Photo", imageSrc: "/images/site-plan/layers/photos/00-base-photo.png" },
      { id: "ph-landscaping", label: "Landscaping Sketch", imageSrc: "/images/site-plan/layers/photos/04-landscaping-sketch.png" },
      { id: "ph-zone-labels", label: "Zone Labels", imageSrc: "/images/site-plan/layers/photos/03-zone-labels.png", visible: false },
      { id: "ph-circulation", label: "Circulation", imageSrc: "/images/site-plan/layers/photos/02-circulation.png", visible: false },
      { id: "ph-sun-compass", label: "Sun Compass", imageSrc: "/images/site-plan/layers/photos/01-sun-compass.png", visible: false },
    ],
  },
];

// --- Info points ---
// x and y are percentages (0-100) from top-left of the master plan image.
// Positions mapped to colored-site-plan.jpeg (4095×2896).
const infoPoints: InfoPoint[] = [
  {
    id: "entrance",
    label: "Main Entrance",
    description:
      "Welcoming entry with native plantings, signage, and a gravel path leading into the site. Accessible parking and disabled bays nearby.",
    x: 40,
    y: 87,
    color: "red",
    tags: ["access", "stage-1"],
  },
  {
    id: "cafe",
    label: "Farm-to-Plate Cafe",
    description:
      "Open-air cafe serving local produce from the on-site gardens and surrounding farms. Seasonal menus celebrate the best of the Sunshine Coast hinterland.\n\nSeating for 60 indoors and 40 on the verandah with views over the valley.",
    x: 55,
    y: 35,
    color: "amber",
    gallery: [
      {
        src: "/images/inspiration/cafe-1.jpg",
        caption: "Similar cafe in Byron Bay",
      },
      {
        src: "/images/inspiration/cafe-2.jpg",
        caption: "Outdoor dining concept",
      },
    ],
    tags: ["eat", "stage-1"],
  },
  {
    id: "nursery",
    label: "Eatery & Restaurant Pavilion",
    description:
      "The original nursery buildings, restored and repurposed as an eatery, restaurant pavilion, and retail space for plants and local crafts.",
    x: 72,
    y: 32,
    color: "purple",
    gallery: [
      {
        src: "/images/site-plan/inspiration/crate-wall.jpeg",
        caption: "Crate wall display concept",
      },
      {
        src: "/images/site-plan/inspiration/curved-pavilion.jpeg",
        caption: "Curved pavilion structure",
      },
      {
        src: "/images/site-plan/inspiration/crate-cube.jpeg",
        caption: "Modular crate structure",
      },
    ],
    tags: ["eat", "heritage", "stage-1"],
  },
  {
    id: "gathering",
    label: "Community Gathering",
    description:
      "Multi-purpose community space with colourful pavilion structures. Hosts workshops, markets, and neighbourhood events. Flexible layout adapts to different group sizes.",
    x: 20,
    y: 35,
    color: "blue",
    gallery: [
      {
        src: "/images/site-plan/inspiration/crate-cube.jpeg",
        caption: "Modular gathering structure",
      },
    ],
    tags: ["community", "events", "stage-1"],
  },
  {
    id: "gardens",
    label: "Garden Beds",
    description:
      "Raised garden beds for community members, a herb spiral, and productive growing areas. Designed with permaculture principles and wheelchair-accessible beds.",
    x: 15,
    y: 75,
    color: "green",
    gallery: [
      {
        src: "/images/inspiration/garden-1.jpg",
        caption: "Terraced garden reference",
      },
      {
        src: "/images/site-plan/inspiration/accessible-garden.jpeg",
        caption: "Wheelchair-accessible raised garden bed",
      },
    ],
    tags: ["grow", "stage-1", "community"],
  },
  {
    id: "bocce",
    label: "Bocce & Event Space",
    description:
      "Open area with bocce portico for casual play, bordered by seating. Doubles as an event lawn for markets, live music, outdoor cinema, and community gatherings.",
    x: 42,
    y: 65,
    color: "blue",
    gallery: [
      {
        src: "/images/inspiration/event-1.jpg",
        caption: "Outdoor market vibe",
      },
      {
        src: "/images/site-plan/inspiration/log-climbing-frame.jpeg",
        caption: "Natural play equipment concept",
      },
    ],
    tags: ["events", "play", "stage-1"],
  },
  {
    id: "tea-station",
    label: "Tea Station",
    description:
      "Dedicated tea station and rest stop along the garden path. A quiet spot to pause and enjoy the surroundings with a cup of locally grown tea.",
    x: 35,
    y: 72,
    color: "amber",
    tags: ["eat", "stage-1"],
  },
  {
    id: "outdoor-art",
    label: "Outdoor Art Area",
    description:
      "Outdoor area for artists to make and display art. Rotating exhibitions, workshops, and a space for creative collaboration in the open air.",
    x: 85,
    y: 8,
    color: "purple",
    tags: ["community", "stage-2"],
  },
  {
    id: "tool-shed",
    label: "Proposed Tool Shed",
    description:
      "Shared tool library and workshop space. Community members can borrow gardening tools, attend repair workshops, and access equipment for site projects.",
    x: 22,
    y: 15,
    color: "green",
    tags: ["grow", "community", "stage-2"],
  },
  {
    id: "poly-tunnel",
    label: "Proposed Poly Tunnel",
    description:
      "Protected growing environment for seedlings, sensitive plants, and year-round food production. Extends the growing season and supports the nursery program.",
    x: 8,
    y: 42,
    color: "green",
    tags: ["grow", "stage-2"],
  },
  {
    id: "parking",
    label: "Customer Car Parking",
    description:
      "Shared car parking area with disabled bays and bollard-separated pedestrian access. Staff parking located separately to the east side.",
    x: 48,
    y: 82,
    color: "red",
    tags: ["access", "stage-1"],
  },
];

export default function SitePlan() {
  return (
    <SitePlanCanvas
      title="The Harvest — Site Plan"
      groups={groups}
      infoPoints={infoPoints}
      defaultGroupId="master-plan"
    />
  );
}
