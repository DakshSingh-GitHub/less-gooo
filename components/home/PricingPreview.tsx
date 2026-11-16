"use client";

interface PricingPreviewProps {
  onSelectPlan: (plan: "free" | "pro") => void;
}

export default function PricingPreview({ onSelectPlan }: PricingPreviewProps) {
  return (
    <section id="plans-section" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <span className="text-xs uppercase tracking-widest font-mono text-[#C84B26] dark:text-[#E05A32]">
          Plan Options
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#18181B] dark:text-[#F4F1EA]">
          Choose how you travel.
        </h2>
        <p className="text-sm sm:text-base text-[#52525B] dark:text-[#A1A1AA] font-light leading-relaxed">
          Transparent, thoughtful tiers for casual getaways or high-touch multi-day adventures.
        </p>
      </div>

      {/* Plans Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
        {/* Plan 1: Free Explorer */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] shadow-sm flex flex-col justify-between space-y-8 hover:shadow-md transition-shadow">
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-[#71717A] dark:text-[#A1A1AA] tracking-wider block">
                Base Companion
              </span>
              <h3 className="font-serif text-3xl text-[#18181B] dark:text-[#F4F1EA]">
                Free Explorer
              </h3>
              <p className="text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA]">
                Ideal for initial route structuring, essential budgeting, and unhurried day planning.
              </p>
            </div>

            <div className="pt-2">
              <span className="text-4xl font-serif text-[#18181B] dark:text-[#F4F1EA]">₹0</span>
              <span className="text-xs text-[#71717A] dark:text-[#A1A1AA] ml-1.5 font-mono">/ Forever</span>
            </div>

            <ul className="space-y-3.5 text-xs sm:text-sm text-[#52525B] dark:text-[#A1A1AA]">
              <li className="flex items-start gap-3">
                <span className="text-[#C84B26] dark:text-[#E05A32] font-bold">—</span>
                <span>Personalized trip itineraries tailored to your pace and duration</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#C84B26] dark:text-[#E05A32] font-bold">—</span>
                <span>Intelligent journey companion for rapid regional Q&A and cultural nuances</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#C84B26] dark:text-[#E05A32] font-bold">—</span>
                <span>Basic in-trip expense tracker to log holiday disbursements</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#C84B26] dark:text-[#E05A32] font-bold">—</span>
                <span>Browse verified local guide directories and heritage profiles</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => onSelectPlan("free")}
            className="w-full py-3.5 rounded-full border border-[#D4CEC3] dark:border-[#383A42] text-[#18181B] dark:text-[#F4F1EA] text-xs font-semibold hover:bg-[#FAF8F5] dark:hover:bg-[#25272F] transition-colors cursor-pointer"
          >
            Get Started Free
          </button>
        </div>

        {/* Plan 2: Pro Suite (Hero Highlight) */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#1A1B20] border-2 border-[#18181B] dark:border-[#F4F1EA] shadow-xl flex flex-col justify-between space-y-8 relative overflow-hidden">
          {/* Top Decorative Tag */}
          <div className="absolute top-0 right-0 bg-[#C84B26] dark:bg-[#E05A32] text-white text-[10px] font-mono uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl font-bold">
            Adaptive Intelligence
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-[#C84B26] dark:text-[#E05A32] tracking-wider block">
                Complete Autonomy
              </span>
              <h3 className="font-serif text-3xl text-[#18181B] dark:text-[#F4F1EA]">
                Pro Suite
              </h3>
              <p className="text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA]">
                For travellers who need dynamic recalculation, transport transparency, and accompaniment.
              </p>
            </div>

            <div className="pt-2">
              <span className="text-4xl font-serif text-[#18181B] dark:text-[#F4F1EA]">₹799</span>
              <span className="text-xs text-[#71717A] dark:text-[#A1A1AA] ml-1.5 font-mono">/ Month or ₹199 / Trip</span>
            </div>

            <ul className="space-y-3.5 text-xs sm:text-sm text-[#52525B] dark:text-[#A1A1AA]">
              <li className="flex items-start gap-3">
                <span className="text-[#C84B26] dark:text-[#E05A32] font-bold">—</span>
                <span><strong>Auto-refresh plans</strong> that dynamically rebalance when traffic or prolonged visits shift your timing</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#C84B26] dark:text-[#E05A32] font-bold">—</span>
                <span><strong>Recommendations & Fare Ideas</strong> for cabs, auto-rickshaws, and local ferries</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#C84B26] dark:text-[#E05A32] font-bold">—</span>
                <span><strong>Advanced spend runway</strong> with live daily pace indicators and limit warnings</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#C84B26] dark:text-[#E05A32] font-bold">—</span>
                <span><strong>Priority verified guide allotment</strong> and senior accompaniment coordination</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => onSelectPlan("pro")}
            className="w-full py-3.5 rounded-full bg-[#18181B] text-white hover:bg-[#C84B26] dark:bg-[#F4F1EA] dark:text-[#121316] dark:hover:bg-[#E05A32] dark:hover:text-white text-xs font-semibold tracking-wide transition-colors shadow-sm cursor-pointer"
          >
            Upgrade to Pro
          </button>
        </div>
      </div>
    </section>
  );
}
