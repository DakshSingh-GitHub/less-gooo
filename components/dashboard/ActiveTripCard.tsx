"use client";

import { useState } from "react";
import { Trip } from "@/lib/appwrite";
import TripOverviewTab from "@/components/dashboard/trip/TripOverviewTab";
import TripEditSettingsTab from "@/components/dashboard/trip/TripEditSettingsTab";
import TripMapsTab from "@/components/dashboard/trip/TripMapsTab";
import TripPlanSpecificationsTab from "@/components/dashboard/trip/TripPlanSpecificationsTab";
import TripProposedPlanTab from "@/components/dashboard/trip/TripProposedPlanTab";

export type ActiveTripSubTab =
  | "overview"
  | "edit-settings"
  | "maps"
  | "specifications"
  | "proposed-plan";

interface ActiveTripCardProps {
  trip: Trip | null;
  onNewTripClick: () => void;
  onCompleteTrip?: (tripId: string, overrideEndDate?: string) => void;
  onLogExpenseClick?: () => void;
  onUpdateTrip?: (updated: Trip) => void;
  onAddExpenseAuto?: (data: { title: string; amountINR: number; category: "transit" }) => Promise<void>;
  onSyncTransitExpenses?: (
    approaching: { title: string; amountINR: number },
    departure: { title: string; amountINR: number }
  ) => Promise<void>;
}

export default function ActiveTripCard({
  trip,
  onNewTripClick,
  onCompleteTrip,
  onLogExpenseClick,
  onUpdateTrip,
  onAddExpenseAuto,
  onSyncTransitExpenses,
}: ActiveTripCardProps) {
  const [activeSubTab, setActiveSubTab] = useState<ActiveTripSubTab>("overview");

  // STRICT INTEGRITY GUARDRAIL:
  // Under NO circumstances render dummy, placeholder, or fake data when no active trip exists.
  if (!trip || trip.status !== "active") {
    return (
      <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#1A1B20] border border-dashed border-[#E7E3DC] dark:border-[#26272D] space-y-4 animate-fadeIn">
        <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D] flex items-center justify-center mx-auto text-[#71717A]">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div className="space-y-1">
          <h3 className="font-serif text-2xl text-[#18181B] dark:text-[#F4F1EA]">
            No active trip at the moment.
          </h3>
          <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] max-w-sm mx-auto font-light">
            Plan a new journey to track live itineraries, interactive spatial maps, and real-time expense budgets.
          </p>
        </div>
        <button
          onClick={onNewTripClick}
          className="px-6 py-2.5 rounded-xl bg-[#C84B26] hover:bg-[#B33F1D] text-white text-xs font-mono uppercase tracking-wider font-semibold shadow-sm transition-colors cursor-pointer"
        >
          + Plan New Trip
        </button>
      </div>
    );
  }

  const subTabs: { id: ActiveTripSubTab; label: string; icon: string }[] = [
    { id: "overview", label: "Trip Overview", icon: "🧭" },
    { id: "edit-settings", label: "Edit Settings", icon: "⚙️" },
    { id: "maps", label: "Maps", icon: "🗺️" },
    { id: "specifications", label: "Plan Specifications", icon: "📋" },
    { id: "proposed-plan", label: "Proposed Plan", icon: "✨" },
  ];

  const handleTripUpdated = (updated: Trip) => {
    if (onUpdateTrip) {
      onUpdateTrip(updated);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP SUB-SECTIONS NAVIGATION BAR */}
      <div className="p-1.5 rounded-2xl bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] shadow-sm flex items-center gap-1 overflow-x-auto scrollbar-none font-mono text-xs">
        {subTabs.map((tab) => {
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-[#C84B26] text-white font-semibold shadow-sm"
                  : "text-[#71717A] dark:text-[#A1A1AA] hover:text-[#18181B] dark:hover:text-[#F4F1EA] hover:bg-black/[0.03] dark:hover:bg-white/[0.03]"
              }`}
            >
              <span className="text-sm leading-none">{tab.icon}</span>
              <span className="uppercase text-[11px] tracking-wider">{tab.label}</span>
              {tab.id === "proposed-plan" && trip.proposedPlan && trip.proposedPlan.length > 0 && (
                <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-white" : "bg-emerald-500"}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* 2. SUB-SECTION ACTIVE CONTENT AREA */}
      <div>
        {activeSubTab === "overview" && (
          <TripOverviewTab
            trip={trip}
            onSelectTab={setActiveSubTab}
            onLogExpenseClick={onLogExpenseClick}
            onCompleteTrip={onCompleteTrip}
          />
        )}

        {activeSubTab === "edit-settings" && (
          <TripEditSettingsTab
            trip={trip}
            onUpdateTrip={handleTripUpdated}
            onCancel={() => setActiveSubTab("overview")}
          />
        )}

        {activeSubTab === "maps" && (
          <TripMapsTab trip={trip} />
        )}

        {activeSubTab === "specifications" && (
          <TripPlanSpecificationsTab
            trip={trip}
            onUpdateTrip={handleTripUpdated}
            onGeneratePlanClick={() => setActiveSubTab("proposed-plan")}
            onSyncTransitExpenses={onSyncTransitExpenses}
          />
        )}

        {activeSubTab === "proposed-plan" && (
          <TripProposedPlanTab
            trip={trip}
            onUpdateTrip={handleTripUpdated}
            onConfigureSpecsClick={() => setActiveSubTab("specifications")}
            onAddExpenseAuto={onAddExpenseAuto}
            onSyncTransitExpenses={onSyncTransitExpenses}
          />
        )}
      </div>
    </div>
  );
}
