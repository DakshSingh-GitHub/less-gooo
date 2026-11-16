"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import HeroTripSearch from "./HeroTripSearch";

interface HeroSectionProps {
  onInitiatePlan: (searchData: {
    destination: string;
    startDate: string;
    endDate: string;
    travelers: string;
    preference: string;
  }) => void;
  selectedDestination?: string;
}

const HERO_DESTINATIONS = [
  {
    id: "varanasi",
    name: "Varanasi, Uttar Pradesh",
    subtitle: "Ghats at Sunset",
    description: "Evening Ganga Aarti oil lamps, ancient Sanskrit chants, and slow wooden boats drifting down the sacred river.",
    image: "/destinations/varanasi-hero.jpg",
    altitude: "81m • Sacred Riverfront",
    vibe: "Spiritual & Timeless",
  },
  {
    id: "lucknow",
    name: "Lucknow, Uttar Pradesh",
    subtitle: "City of Nawabs",
    description: "The monumental Rumi Darwaza, the grand labyrinth of Bara Imambara, delicate Chikankari, and legendary Awadhi heritage.",
    image: "/destinations/lucknow.jpg",
    altitude: "123m • Awadh Heritage",
    vibe: "Regal & Architectural",
  },
  {
    id: "agra",
    name: "Agra, Uttar Pradesh",
    subtitle: "Mughal Splendor",
    description: "Golden sunrise reflections across the white marble Taj Mahal, red sandstone bastions of Agra Fort, and Mughal gardens.",
    image: "/destinations/agra.jpg",
    altitude: "171m • Yamuna Valley",
    vibe: "Imperial & Historic",
  },
  {
    id: "srinagar",
    name: "Srinagar, Jammu & Kashmir",
    subtitle: "Himalayan Solitude",
    description: "Misty dawn shikaras gliding over Dal Lake, Mughal terraced gardens, and cedar houseboats surrounded by snowy peaks.",
    image: "/destinations/srinagar.jpg",
    altitude: "1,585m • Kashmir Valley",
    vibe: "Serene & Alpine",
  },
];

const ROTATION_INTERVAL_MS = 6500;

export default function HeroSection({ onInitiatePlan, selectedDestination }: HeroSectionProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const activeDest = HERO_DESTINATIONS[activeIdx];

  // Auto-rotation interval (pauses on hover)
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % HERO_DESTINATIONS.length);
    }, ROTATION_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [isPaused]);

  const handleSelectSlide = (idx: number) => {
    setActiveIdx(idx);
  };

  const handleScrollToSearch = () => {
    const el = document.getElementById("trip-search-box");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScrollToDestinations = () => {
    const el = document.getElementById("destinations");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative pt-6 pb-20 sm:pt-10 sm:pb-28 px-4 sm:px-6 max-w-7xl mx-auto overflow-hidden">
      {/* Background Hero Visual Container with Pause on Hover */}
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative rounded-3xl overflow-hidden border border-[#E7E3DC] dark:border-[#26272D] shadow-2xl bg-[#121316] group/hero transition-all"
      >
        {/* Cinematic Backdrop Images with Ken Burns slow zoom & smooth crossfade */}
        <div className="relative h-[540px] sm:h-[620px] lg:h-[680px] w-full overflow-hidden">
          {HERO_DESTINATIONS.map((dest, idx) => {
            const isActive = idx === activeIdx;
            return (
              <div
                key={dest.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                <div
                  className={`relative w-full h-full transition-transform duration-[7500ms] ease-out ${
                    isActive ? "scale-108" : "scale-100"
                  }`}
                >
                  <Image
                    src={dest.image}
                    alt={dest.name}
                    fill
                    priority={idx === 0}
                    className="object-cover object-center"
                    sizes="(max-width: 1280px) 100vw, 1280px"
                  />
                </div>
                {/* Refined gradient overlay for legible editorial contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#121316]/95 via-[#121316]/55 to-black/35" />
              </div>
            );
          })}

          {/* Top Destination Selector Pills */}
          <div className="absolute top-6 left-6 right-6 z-20 flex flex-wrap items-center justify-between gap-3">
            {/* Live Field Preview with animated radar wave */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/0">
              {/* <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E05A32] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#E05A32]"></span>
              </span>
              <span className="text-[11px] font-mono text-white/95 uppercase tracking-wider font-medium">
                Live Field Preview
              </span> */}
            </div>

            {/* Interactive Switchers with animated progress indicator */}
            <div className="flex items-center gap-1.5 bg-black/45 backdrop-blur-md p-1 rounded-full border border-white/20 overflow-x-auto scrollbar-none shadow-sm">
              {HERO_DESTINATIONS.map((dest, idx) => {
                const isActive = idx === activeIdx;
                return (
                  <button
                    key={dest.id}
                    onClick={() => handleSelectSlide(idx)}
                    className={`relative overflow-hidden px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer whitespace-nowrap font-medium ${
                      isActive
                        ? "bg-white text-[#18181B] shadow-md font-semibold"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {/* Animated slide progress bar on active button using CSS */}
                    {isActive && (
                      <span
                        key={`${dest.id}-${activeIdx}`}
                        className={`absolute bottom-0 left-0 h-0.5 bg-[#C84B26] ${
                          isPaused ? "w-full" : "animate-[heroProgress_6.5s_linear_forwards]"
                        }`}
                      />
                    )}
                    <span className="relative z-10">{dest.name.split(",")[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Hero Editorial Copy with Keyed Fade/Slide Entrance */}
          <div
            key={activeDest.id}
            className="absolute bottom-10 left-6 right-6 sm:bottom-14 sm:left-12 sm:right-12 z-20 max-w-3xl space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-700"
          >
            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-[#FCD34D] uppercase">
              <span className="animate-pulse">✦</span>
              <span>{activeDest.subtitle}</span>
              <span>•</span>
              <span className="text-white/70">{activeDest.vibe}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-white leading-[1.12] drop-shadow-sm">
              Travel changes on the ground.<br />
              <span className="italic font-light text-white/95">Your plan should adapt with you.</span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-white/85 max-w-2xl font-light leading-relaxed">
              Explore freely. Stay longer. Change plans without the stress. LessGooo keeps your journey in sync with the world around you.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleScrollToSearch}
                className="px-7 py-3 rounded-full bg-[#E05A32] hover:bg-[#C84B26] text-white text-sm font-semibold tracking-wide shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center gap-2 group hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Start Planning</span>
                <svg
                  className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>

              <button
                onClick={handleScrollToDestinations}
                className="px-7 py-3 rounded-full bg-white/15 hover:bg-white/25 text-white backdrop-blur-md border border-white/25 text-sm font-medium transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                Explore Destinations
              </button>

              <div className="hidden sm:flex items-center gap-2 text-xs text-white/70 font-mono ml-2">
                <span>📍</span>
                <span>{activeDest.altitude}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Integrated Trip Search Interface with Subtle Floating Hover */}
      <div id="trip-search-box" className="-mt-8 sm:-mt-12 relative z-30 px-2 sm:px-6">
        <HeroTripSearch
          onInitiatePlan={onInitiatePlan}
          initialDestination={selectedDestination || activeDest.name}
        />
      </div>

      <style jsx>{`
        @keyframes heroProgress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
