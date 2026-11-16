"use client";

const STEPS = [
  {
    step: "01",
    label: "Blueprint",
    title: "Plan your journey.",
    description:
      "Select your destination, pacing, and companion needs. LessGooo constructs a balanced daily blueprint with verified points of interest and realistic travel buffers.",
    detail: "Curated itineraries • Multi-modal routing • Spending forecasts",
    icon: "🗺️",
  },
  {
    step: "02",
    label: "Immersion",
    title: "Explore freely.",
    description:
      "Step into the destination without living by a timer. Savor a slow morning chai by the river, take serendipitous side-street turns, and enjoy each discovery fully.",
    detail: "Zero screen anxiety • Verified local guides • Fair transport ideas",
    icon: "🧭",
  },
  {
    step: "03",
    label: "Synchronization",
    title: "Let your plan adapt.",
    description:
      "When traffic builds up, weather shifts, or you decide to linger longer, LessGooo’s dwell detection rebalances the rest of your day automatically in real time.",
    detail: "Auto-rebalancing • Downstream shifts • Preserved reservations",
    icon: "✨",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="bg-[#FAF8F5] dark:bg-[#1A1B20]/60 rounded-3xl border border-[#E7E3DC] dark:border-[#26272D] p-8 sm:p-14 space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-widest font-mono text-[#C84B26] dark:text-[#E05A32]">
            The LessGooo Experience
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#18181B] dark:text-[#F4F1EA]">
            How intelligent travel flows.
          </h2>
          <p className="text-sm sm:text-base text-[#52525B] dark:text-[#A1A1AA] font-light leading-relaxed">
            Three simple steps that replace the friction of rigid paper itineraries with effortless on-ground adaptability.
          </p>
        </div>

        {/* 3 Step Editorial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map((item) => (
            <div
              key={item.step}
              className="group relative p-7 rounded-2xl bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between space-y-6"
            >
              {/* Card Header with Step Number */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-[#C84B26] dark:text-[#E05A32] uppercase tracking-wider group-hover:text-[#FF5A26] transition-colors">
                  {item.step} / {item.label}
                </span>
                <span className="text-2xl transition-transform duration-300 group-hover:scale-120">{item.icon}</span>
              </div>

              {/* Title & Description */}
              <div className="space-y-3">
                <h3 className="font-serif text-2xl text-[#18181B] dark:text-[#F4F1EA]">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#52525B] dark:text-[#A1A1AA] leading-relaxed font-light">
                  {item.description}
                </p>
              </div>

              {/* Footer Detail */}
              <div className="pt-4 border-t border-[#E7E3DC] dark:border-[#26272D] text-[11px] font-mono text-[#71717A] dark:text-[#A1A1AA]">
                {item.detail}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
