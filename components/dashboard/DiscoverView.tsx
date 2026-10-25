"use client";

export default function DiscoverView() {
  const experiences = [
    {
      title: "Local Transit Bargaining & Meter Guide",
      category: "Transit Strategy",
      readTime: "3 min read",
      description: "How to negotiate fair auto-rickshaw and e-rickshaw fares across Indian tourist circuits without friction.",
      tips: [
        "Always inquire if the rate is private reserve or shared per-seat before stepping in.",
        "Use local phonetic phrases to establish familiarity with standard rate brackets.",
        "Opt for shared battery e-rickshaws for narrow pedestrian heritage corridors where cars are prohibited."
      ]
    },
    {
      title: "Elder & Multi-Generational Travel Comfort",
      category: "Senior Care",
      readTime: "4 min read",
      description: "Best practices for traveling with parents and seniors in crowded heritage destinations.",
      tips: [
        "Plan maximum 2 major stops before noon, reserving afternoon hours for quiet tea and rest.",
        "Hire verified local guides who understand step-free access gates and wheelchair-friendly paths.",
        "Keep digital screenshots of your emergency contact and guide's direct phone on their lock screen."
      ]
    },
    {
      title: "Dynamic Itinerary Drift Management",
      category: "Planning Philosophy",
      readTime: "2 min read",
      description: "Why rigid itineraries fail in ancient cities and how to absorb delays naturally.",
      tips: [
        "Anchor your day around 1 unmissable sacred milestone (e.g. evening prayers, sunset boats).",
        "Treat shopping, street food, and minor museums as flexible overflow buffers.",
        "When delayed by temple queues, push afternoon spots rather than rushing the experience."
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-[#E7E3DC] dark:border-[#26272D]">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#C84B26] dark:text-[#E05A32] block">
          Knowledge & Insights
        </span>
        <h2 className="font-serif text-3xl text-[#18181B] dark:text-[#F4F1EA]">
          Discover & Explore
        </h2>
        <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] font-light mt-1">
          Field-tested travel wisdom for navigating chaotic routes, fair transport tariffs, and multi-generational comfort.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {experiences.map((exp, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] shadow-sm flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="uppercase tracking-wider px-2 py-0.5 rounded bg-[#FAF8F5] dark:bg-[#121316] text-[#C84B26] border border-[#E7E3DC] dark:border-[#26272D]">
                  {exp.category}
                </span>
                <span className="text-[#71717A]">{exp.readTime}</span>
              </div>

              <h3 className="font-serif text-xl text-[#18181B] dark:text-[#F4F1EA] leading-snug">
                {exp.title}
              </h3>

              <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
                {exp.description}
              </p>

              <div className="pt-3 border-t border-[#E7E3DC]/60 dark:border-[#26272D] space-y-2">
                <span className="text-[10px] font-mono uppercase text-[#71717A] block">Key Takeaways:</span>
                <ul className="text-xs text-[#52525B] dark:text-[#A1A1AA] space-y-1.5 list-disc pl-4">
                  {exp.tips.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
