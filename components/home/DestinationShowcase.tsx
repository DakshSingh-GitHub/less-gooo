"use client";

import Image from "next/image";
import { useState } from "react";

interface Destination {
  id: string;
  name: string;
  region: string;
  category: "Uttar Pradesh Heritage" | "Spiritual & Sacred" | "Hills & Backwaters" | "Palaces & Forts";
  description: string;
  image: string;
  idealDuration: string;
  highlights: string[];
  featured?: boolean;
}

const DESTINATIONS: Destination[] = [
  // ROW 1: 3 Cards across the full container width
  {
    id: "varanasi",
    name: "Varanasi",
    region: "Uttar Pradesh, India",
    category: "Uttar Pradesh Heritage",
    description: "The spiritual heart of India. Slow dawn wooden boat rides, hypnotic evening Ganga Aarti ceremonies, and ancient silk-weaving alleys untouched by time.",
    image: "/destinations/varanasi-hero.jpg",
    idealDuration: "3–4 Days",
    highlights: ["Dashashwamedh Aarti", "Assi Ghat Sunrise", "Old Alley Scent Trails"],
    featured: true,
  },
  {
    id: "lucknow",
    name: "Lucknow",
    region: "Uttar Pradesh, India",
    category: "Uttar Pradesh Heritage",
    description: "The storied City of Nawabs. The monumental Rumi Darwaza, the grand gravity-defying vaults of Bara Imambara, delicate Chikankari, and royal Awadhi gastronomy.",
    image: "/destinations/lucknow.jpg",
    idealDuration: "2–3 Days",
    highlights: ["Bara Imambara Vault", "Rumi Darwaza", "Hazratganj Food Trail"],
  },
  {
    id: "agra",
    name: "Agra",
    region: "Uttar Pradesh, India",
    category: "Uttar Pradesh Heritage",
    description: "Imperial Mughal splendor on the banks of the Yamuna. The ethereal white marble Taj Mahal at sunrise, red sandstone Agra Fort, and sunset from Mehtab Bagh.",
    image: "/destinations/agra.jpg",
    idealDuration: "2 Days",
    highlights: ["Taj Mahal at Dawn", "Agra Fort Ramparts", "Mehtab Bagh Sunset"],
  },

  // ROW 2: 2 Wider Cards across the exact same full container width
  {
    id: "ayodhya-sarnath",
    name: "Ayodhya & Sarnath",
    region: "Uttar Pradesh, India",
    category: "Spiritual & Sacred",
    description: "Sacred riverfront ghats of the Saryu in Ayodhya, complemented by the peaceful Dhamek Stupa and ancient deer park where the Buddha first turned the wheel of dharma.",
    image: "/destinations/ayodhya.jpg",
    idealDuration: "2–3 Days",
    highlights: ["Ram Janmabhoomi", "Saryu Evening Aarti", "Dhamek Stupa & Deer Park"],
    featured: true,
  },
  {
    id: "jaipur",
    name: "Jaipur",
    region: "Rajasthan, India",
    category: "Palaces & Forts",
    description: "The Pink City of Rajasthan. Terracotta-tinted courtyards, majestic hill fortresses, handcrafted block prints, and fragrant spice and gem bazaars.",
    image: "/destinations/jaipur.jpg",
    idealDuration: "3–4 Days",
    highlights: ["Amber Fort Ramparts", "Hawa Mahal Facade", "Johari Gem Bazaar"],
    featured: true,
  },

  // ROW 3: 4 Cards across the exact same full container width
  {
    id: "kerala",
    name: "Munnar & Alleppey",
    region: "Kerala, India",
    category: "Hills & Backwaters",
    description: "God's Own Country. Rolling mist-covered emerald tea plantations in Munnar cascading down to tranquil houseboats cruising the palm-fringed Alleppey backwaters.",
    image: "/destinations/kerala.jpg",
    idealDuration: "4–5 Days",
    highlights: ["Tea Estate Trails", "Vembanad Houseboats", "Spice Gardens"],
  },
  {
    id: "rishikesh",
    name: "Rishikesh",
    region: "Uttarakhand, India",
    category: "Spiritual & Sacred",
    description: "The Yoga Capital of the World nestled in the Himalayan foothills. Sunset aarti at Triveni Ghat, suspension footbridges, and emerald waters of the upper Ganges.",
    image: "/destinations/rishikesh.jpg",
    idealDuration: "3–4 Days",
    highlights: ["Triveni Ghat Aarti", "Laxman Jhula Foothills", "Ganges River Walks"],
  },
  {
    id: "goa",
    name: "Goa & Konkan Coast",
    region: "Goa, India",
    category: "Hills & Backwaters",
    description: "Sun-dappled coastal sanctuaries, Portuguese baroque churches, spice farms, and gentle Konkan seafood shacks overlooking the Arabian Sea.",
    image: "/destinations/goa.jpg",
    idealDuration: "4–5 Days",
    highlights: ["Old Goa Churches", "Fontainhas Latin Quarter", "Palolem Beach Shacks"],
  },
  {
    id: "ladakh",
    name: "Leh & Ladakh",
    region: "Ladakh, India",
    category: "Hills & Backwaters",
    description: "High-altitude desert sanctuaries, ancient Tibetan Buddhist monasteries perched on craggy pinnacles, and crystal-clear reflections in Pangong Tso.",
    image: "/destinations/ladakh.jpg",
    idealDuration: "5–7 Days",
    highlights: ["Pangong Tso Azure Lake", "Thiksey Monastery", "Nubra Valley Dunes"],
  },
];

const CATEGORIES = [
  "All",
  "Uttar Pradesh Heritage",
  "Spiritual & Sacred",
  "Hills & Backwaters",
  "Palaces & Forts",
] as const;

interface DestinationShowcaseProps {
  onSelectDestination?: (destName: string) => void;
}

export default function DestinationShowcase({ onSelectDestination }: DestinationShowcaseProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filteredDestinations =
    activeCategory === "All"
      ? DESTINATIONS
      : DESTINATIONS.filter((d) => d.category === activeCategory);

  const handleSelect = (dest: Destination) => {
    if (onSelectDestination) {
      onSelectDestination(`${dest.name}, ${dest.region}`);
    } else {
      const searchBox = document.getElementById("trip-search-box");
      if (searchBox) {
        searchBox.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // Helper to determine the column span for each card
  const getColSpanClass = (index: number, total: number) => {
    // When "All" is active, strictly follow user's 3-2-4 layout
    if (activeCategory === "All" && total === 9) {
      if (index >= 0 && index <= 2) {
        // Row 1: 3 cards (4 cols each = 12 cols total)
        return "md:col-span-4 min-h-[460px]";
      }
      if (index >= 3 && index <= 4) {
        // Row 2: 2 wider cards (6 cols each = 12 cols total)
        return "md:col-span-6 min-h-[430px]";
      }
      // Row 3: 4 cards (3 cols each on lg, 6 cols on md = 12 cols total)
      return "md:col-span-6 lg:col-span-3 min-h-[450px]";
    }

    // Filtered mode fallback: distribute evenly across full 12 cols
    if (total === 1) return "md:col-span-12 min-h-[440px]";
    if (total === 2) return "md:col-span-6 min-h-[440px]";
    if (total === 3) return "md:col-span-4 min-h-[460px]";
    if (total === 4) return "md:col-span-6 lg:col-span-3 min-h-[440px]";
    return "md:col-span-6 lg:col-span-4 min-h-[440px]";
  };

  return (
    <section id="destinations" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Section Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-3 max-w-2xl">
          <span className="text-xs uppercase tracking-widest font-mono text-[#C84B26] dark:text-[#E05A32]">
            Curated Indian Destinations
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#18181B] dark:text-[#F4F1EA] leading-tight">
            Places where spontaneous discovery thrives.
          </h2>
          <p className="text-sm sm:text-base text-[#52525B] dark:text-[#A1A1AA] font-light leading-relaxed">
            From Uttar Pradesh’s sacred riverfronts and Awadhi citadels to Himalayan foothills and tropical backwaters, explore Indian destinations engineered for deep, unrushed immersion.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none flex-shrink-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs transition-colors cursor-pointer whitespace-nowrap ${
                activeCategory === cat
                  ? "bg-[#18181B] text-white dark:bg-[#F4F1EA] dark:text-[#121316] font-medium"
                  : "bg-white dark:bg-[#1A1B20] text-[#71717A] dark:text-[#A1A1AA] border border-[#E7E3DC] dark:border-[#26272D] hover:border-[#C84B26]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: 12-column layout spanning the exact same horizontal width */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        {filteredDestinations.map((dest, index) => {
          const colSpanAndHeight = getColSpanClass(index, filteredDestinations.length);
          const isRow3Compact = activeCategory === "All" && index >= 5;

          return (
            <div
              key={dest.id}
              className={`group relative rounded-3xl overflow-hidden border border-[#E7E3DC] dark:border-[#26272D] shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 flex flex-col justify-end ${colSpanAndHeight}`}
            >
              {/* Background Photography with Ken Burns zoom on hover */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={dest.image}
                  alt={`${dest.name}, ${dest.region}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                />
                {/* Atmospheric gradient overlay for editorial readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/50 to-black/20 group-hover:via-black/60 transition-colors duration-500" />
              </div>

              {/* Top Category and Meta Tag */}
              <div className="relative z-10 p-5 sm:p-6 flex items-center justify-between gap-2">
                <span className="text-[10px] sm:text-[11px] font-mono tracking-wider uppercase px-3 py-1 rounded-full bg-black/45 backdrop-blur-md text-white/95 border border-white/20 truncate">
                  {dest.category}
                </span>
                <span className="text-[10px] sm:text-[11px] font-mono text-white/90 bg-black/35 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10 flex-shrink-0">
                  {dest.idealDuration}
                </span>
              </div>

              {/* Spacer to push content to bottom */}
              <div className="flex-1" />

              {/* Bottom Editorial Content with smooth hover elevation */}
              <div className={`relative z-10 space-y-2.5 transition-transform duration-300 group-hover:-translate-y-1 ${isRow3Compact ? "p-5" : "p-6 sm:p-7"}`}>
                <div>
                  <h3 className={`font-serif text-white font-normal group-hover:text-[#FCD34D] transition-colors leading-tight ${
                    isRow3Compact ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"
                  }`}>
                    {dest.name}
                  </h3>
                  <p className="text-[11px] font-mono text-white/70 uppercase tracking-widest mt-0.5">
                    {dest.region}
                  </p>
                </div>

                <p className={`text-white/85 font-light leading-relaxed ${
                  isRow3Compact ? "text-xs line-clamp-2" : "text-xs sm:text-sm line-clamp-2 sm:line-clamp-3"
                }`}>
                  {dest.description}
                </p>

                {/* Highlights tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(isRow3Compact ? dest.highlights.slice(0, 2) : dest.highlights).map((item) => (
                    <span
                      key={item}
                      className="text-[10px] font-mono text-white/80 bg-white/12 backdrop-blur-xs px-2 py-0.5 rounded-md"
                    >
                      • {item}
                    </span>
                  ))}
                </div>

                {/* Explore Action Button */}
                <div className="pt-2">
                  <button
                    onClick={() => handleSelect(dest)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-white hover:text-[#FCD34D] group/btn transition-colors cursor-pointer"
                  >
                    <span>Plan an adaptive journey here</span>
                    <svg
                      className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-1.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
