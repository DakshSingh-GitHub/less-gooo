"use client";

import { Trip } from "@/lib/appwrite";

export type SidebarView = "active-trip" | "upcoming-trips" | "new-trip" | "expenses" | "discover" | "settings";

interface DashboardSidebarProps {
  currentView: SidebarView;
  onSelectView: (view: SidebarView) => void;
  activeTrip: Trip | null;
  upcomingTripsCount: number;
  isOpen: boolean;
  onCloseMobile: () => void;
}

export default function DashboardSidebar({
  currentView,
  onSelectView,
  activeTrip,
  upcomingTripsCount,
  isOpen,
  onCloseMobile,
}: DashboardSidebarProps) {
  // Format local time for destination if active trip exists
  const currentTimeString = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const handleNavClick = (view: SidebarView) => {
    onSelectView(view);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-72 bg-[#FAF8F5] dark:bg-[#121316] border-r border-[#E7E3DC] dark:border-[#26272D] flex flex-col justify-between transition-transform duration-200 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top: + New Trip CTA & Main Menu Modules */}
        <div className="p-4 space-y-4 overflow-y-auto">
          {/* Prominent + New Trip CTA */}
          <button
            onClick={() => handleNavClick("new-trip")}
            className="w-full py-3 px-4 rounded-xl bg-[#C84B26] hover:bg-[#B33F1D] text-white text-xs font-mono uppercase tracking-wider font-semibold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="text-base leading-none font-bold">+</span>
            <span>New Trip</span>
          </button>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {/* 1. Active Trip */}
            <button
              onClick={() => handleNavClick("active-trip")}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                currentView === "active-trip"
                  ? "bg-white dark:bg-[#1A1B20] text-[#C84B26] dark:text-[#E05A32] font-semibold shadow-sm border border-[#E7E3DC] dark:border-[#26272D]"
                  : "text-[#71717A] dark:text-[#A1A1AA] hover:text-[#18181B] dark:hover:text-[#F4F1EA] hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
              }`}
            >
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Active Trip</span>
              </div>
              {activeTrip ? (
                <span className="w-2 h-2 rounded-full bg-emerald-500" title="Active Trip Ongoing" />
              ) : (
                <span className="text-[10px] text-[#A1A1AA] lowercase font-sans">none</span>
              )}
            </button>

            {/* 2. Upcoming Trips */}
            <button
              onClick={() => handleNavClick("upcoming-trips")}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                currentView === "upcoming-trips"
                  ? "bg-white dark:bg-[#1A1B20] text-[#C84B26] dark:text-[#E05A32] font-semibold shadow-sm border border-[#E7E3DC] dark:border-[#26272D]"
                  : "text-[#71717A] dark:text-[#A1A1AA] hover:text-[#18181B] dark:hover:text-[#F4F1EA] hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
              }`}
            >
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Upcoming Trips</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D] text-[#71717A] dark:text-[#A1A1AA]">
                {upcomingTripsCount}
              </span>
            </button>

            {/* 3. Expense Manager */}
            <button
              onClick={() => handleNavClick("expenses")}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                currentView === "expenses"
                  ? "bg-white dark:bg-[#1A1B20] text-[#C84B26] dark:text-[#E05A32] font-semibold shadow-sm border border-[#E7E3DC] dark:border-[#26272D]"
                  : "text-[#71717A] dark:text-[#A1A1AA] hover:text-[#18181B] dark:hover:text-[#F4F1EA] hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
              }`}
            >
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Expense Manager</span>
              </div>
            </button>

            {/* 4. Discover & Explore */}
            <button
              onClick={() => handleNavClick("discover")}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                currentView === "discover"
                  ? "bg-white dark:bg-[#1A1B20] text-[#C84B26] dark:text-[#E05A32] font-semibold shadow-sm border border-[#E7E3DC] dark:border-[#26272D]"
                  : "text-[#71717A] dark:text-[#A1A1AA] hover:text-[#18181B] dark:hover:text-[#F4F1EA] hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
              }`}
            >
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Discover & Explore</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer (Bottom Anchor) */}
        <div className="p-4 border-t border-[#E7E3DC] dark:border-[#26272D] space-y-3 bg-[#FAF8F5]/50 dark:bg-[#121316]/50">
          {/* Quick Travel Status / Local Time */}
          {activeTrip && (
            <div className="p-3 rounded-xl bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase text-[#71717A] dark:text-[#A1A1AA]">
                <span>Destination Local Time</span>
                <span className="text-[#C84B26] font-semibold">Live</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-medium text-[#18181B] dark:text-[#F4F1EA] truncate max-w-[130px]">
                  {activeTrip.destination}
                </span>
                <span className="font-mono text-xs font-semibold text-[#18181B] dark:text-[#F4F1EA]">
                  {currentTimeString}
                </span>
              </div>
            </div>
          )}

          {/* Cloud Sync Status */}
          <div className="flex items-center justify-between px-1 text-[11px] font-mono text-[#71717A] dark:text-[#A1A1AA]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Appwrite Cloud Synced</span>
            </span>
            <span className="text-[10px] uppercase">v1.0</span>
          </div>

          {/* Help & Support + Settings */}
          <div className="flex items-center justify-between pt-1 border-t border-[#E7E3DC]/60 dark:border-[#26272D] text-xs">
            <button
              onClick={() => handleNavClick("discover")}
              className="text-[#71717A] hover:text-[#C84B26] dark:text-[#A1A1AA] transition-colors"
            >
              Help & Guides
            </button>
            <button
              onClick={() => handleNavClick("settings")}
              className="text-[#71717A] hover:text-[#C84B26] dark:text-[#A1A1AA] transition-colors"
            >
              Settings
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
