export default function DrawingPicker() {
  const groups = [
    {
      title: "NEW — Harvest Layers (from Downloads)",
      images: [
        { src: "/images/compendium/MASTER FLOOR PLAN_1.jpeg", label: "Layer 1" },
        { src: "/images/compendium/MASTER FLOOR PLAN_2.jpeg", label: "Layer 2" },
        { src: "/images/compendium/MASTER FLOOR PLAN_3.jpeg", label: "Layer 3" },
        { src: "/images/compendium/MASTER FLOOR PLAN_4.jpeg", label: "Layer 4" },
        { src: "/images/compendium/MASTER FLOOR PLAN_5.jpeg", label: "Layer 5" },
        { src: "/images/compendium/MASTER FLOOR PLAN_6.jpeg", label: "Layer 6" },
        { src: "/images/compendium/MASTER FLOOR PLAN_7.jpeg", label: "Layer 7" },
        { src: "/images/compendium/MASTER FLOOR PLAN_8.jpeg", label: "Layer 8" },
        { src: "/images/compendium/MASTER FLOOR PLAN_9.jpeg", label: "Layer 9" },
        { src: "/images/compendium/MASTER FLOOR PLAN_10.jpeg", label: "Layer 10" },
        { src: "/images/compendium/MASTER FLOOR PLAN_11.jpeg", label: "Layer 11" },
        { src: "/images/compendium/MASTER FLOOR PLAN_12.jpeg", label: "Layer 12" },
      ],
    },
    {
      title: "Master Plan (Watercolor Composites)",
      images: [
        { src: "/images/site-plan/layers/master-plan/01-wind-flow.png", label: "01 Wind Flow" },
        { src: "/images/site-plan/layers/master-plan/02-full-plan.png", label: "02 Full Plan" },
        { src: "/images/site-plan/layers/master-plan/03-landscaping.png", label: "03 Landscaping" },
      ],
    },
    {
      title: "Sketches",
      images: [
        { src: "/images/site-plan/layers/sketches/00-base-plan.png", label: "00 Base Plan" },
        { src: "/images/site-plan/layers/sketches/01-annotations.png", label: "01 Annotations" },
        { src: "/images/site-plan/layers/sketches/02-building-outline.png", label: "02 Building Outline" },
        { src: "/images/site-plan/layers/sketches/03-dimensions.png", label: "03 Dimensions" },
      ],
    },
    {
      title: "Layers (Individual Elements)",
      images: [
        { src: "/images/site-plan/layers/00-base-floor-plan.png", label: "00 Base Floor Plan" },
        { src: "/images/site-plan/layers/01-building-outline.png", label: "01 Building Outline" },
        { src: "/images/site-plan/layers/02-site-plan.png", label: "02 Site Plan" },
        { src: "/images/site-plan/layers/03-landscaping.png", label: "03 Landscaping" },
        { src: "/images/site-plan/layers/04-stepping-stones.png", label: "04 Stepping Stones" },
        { src: "/images/site-plan/layers/05-community-gathering.png", label: "05 Community Gathering" },
        { src: "/images/site-plan/layers/06-garden-structures.png", label: "06 Garden Structures" },
        { src: "/images/site-plan/layers/07-circulation.png", label: "07 Circulation" },
        { src: "/images/site-plan/layers/08-zone-labels.png", label: "08 Zone Labels" },
        { src: "/images/site-plan/layers/09-sun-compass.png", label: "09 Sun Compass" },
        { src: "/images/site-plan/layers/10-wind-flow.png", label: "10 Wind Flow" },
        { src: "/images/site-plan/layers/11-dimensions.png", label: "11 Dimensions" },
      ],
    },
    {
      title: "Photos",
      images: [
        { src: "/images/site-plan/layers/photos/00-base-photo.png", label: "00 Base Photo" },
        { src: "/images/site-plan/layers/photos/01-sun-compass.png", label: "01 Sun Compass" },
        { src: "/images/site-plan/layers/photos/02-circulation.png", label: "02 Circulation" },
        { src: "/images/site-plan/layers/photos/03-zone-labels.png", label: "03 Zone Labels" },
        { src: "/images/site-plan/layers/photos/04-landscaping-sketch.png", label: "04 Landscaping Sketch" },
      ],
    },
    {
      title: "Overlaps: Sketches + Layers (same index stacked)",
      images: [
        { src: "/images/site-plan/layers/sketches/02-building-outline.png", label: "Sketch 02 + Layer 01", overlay: "/images/site-plan/layers/01-building-outline.png" },
        { src: "/images/site-plan/layers/sketches/03-dimensions.png", label: "Sketch 03 + Layer 11", overlay: "/images/site-plan/layers/11-dimensions.png" },
        { src: "/images/site-plan/layers/sketches/00-base-plan.png", label: "Sketch Base + Layer 02 Site Plan", overlay: "/images/site-plan/layers/02-site-plan.png" },
        { src: "/images/site-plan/layers/sketches/00-base-plan.png", label: "Sketch Base + Layer 03 Landscaping", overlay: "/images/site-plan/layers/03-landscaping.png" },
        { src: "/images/site-plan/layers/sketches/00-base-plan.png", label: "Sketch Base + Community Gathering", overlay: "/images/site-plan/layers/05-community-gathering.png" },
        { src: "/images/site-plan/layers/sketches/00-base-plan.png", label: "Sketch Base + Garden Structures", overlay: "/images/site-plan/layers/06-garden-structures.png" },
      ],
    },
    {
      title: "Overlaps: Master Plan Combos",
      images: [
        { src: "/images/site-plan/layers/master-plan/02-full-plan.png", label: "Full Plan + Wind Flow", overlay: "/images/site-plan/layers/master-plan/01-wind-flow.png" },
        { src: "/images/site-plan/layers/master-plan/02-full-plan.png", label: "Full Plan + Landscaping", overlay: "/images/site-plan/layers/master-plan/03-landscaping.png" },
        { src: "/images/site-plan/layers/master-plan/03-landscaping.png", label: "Landscaping + Circulation", overlay: "/images/site-plan/layers/07-circulation.png" },
      ],
    },
    {
      title: "Overlaps: Photo Base + Layers",
      images: [
        { src: "/images/site-plan/layers/photos/00-base-photo.png", label: "Photo + Zone Labels", overlay: "/images/site-plan/layers/08-zone-labels.png" },
        { src: "/images/site-plan/layers/photos/00-base-photo.png", label: "Photo + Circulation", overlay: "/images/site-plan/layers/07-circulation.png" },
        { src: "/images/site-plan/layers/photos/00-base-photo.png", label: "Photo + Full Plan", overlay: "/images/site-plan/layers/master-plan/02-full-plan.png" },
        { src: "/images/site-plan/layers/photos/00-base-photo.png", label: "Photo + Landscaping Sketch", overlay: "/images/site-plan/layers/photos/04-landscaping-sketch.png" },
      ],
    },
    {
      title: "Overlaps: Floor Plan + Sketches/Layers",
      images: [
        { src: "/images/site-plan/layers/00-base-floor-plan.png", label: "Floor Plan + Annotations", overlay: "/images/site-plan/layers/sketches/01-annotations.png" },
        { src: "/images/site-plan/layers/00-base-floor-plan.png", label: "Floor Plan + Full Plan", overlay: "/images/site-plan/layers/master-plan/02-full-plan.png" },
        { src: "/images/site-plan/layers/00-base-floor-plan.png", label: "Floor Plan + Community Gathering", overlay: "/images/site-plan/layers/05-community-gathering.png" },
      ],
    },
  ];

  return (
    <div className="bg-stone-100 min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Drawing Picker</h1>
        <p className="text-stone-500 mb-12">Click to see full size. Overlap combos show two layers stacked.</p>

        {groups.map((group) => (
          <div key={group.title} className="mb-16">
            <h2 className="text-xl font-bold mb-6 border-b border-stone-300 pb-2">{group.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {group.images.map((img) => (
                <div key={img.label} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="relative bg-white flex items-center justify-center p-2">
                    <img
                      src={img.src}
                      alt={img.label}
                      className="w-full h-full object-contain"
                    />
                    {"overlay" in img && img.overlay && (
                      <img
                        src={img.overlay}
                        alt=""
                        className="absolute inset-0 w-full h-full object-contain opacity-70"
                      />
                    )}
                  </div>
                  <div className="p-3 border-t border-stone-100">
                    <p className="text-sm font-mono text-stone-700">{img.label}</p>
                    <p className="text-xs text-stone-400 truncate">{img.src}</p>
                    {"overlay" in img && img.overlay && (
                      <p className="text-xs text-stone-400 truncate">+ {img.overlay}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
