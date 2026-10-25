"use client";

import { Trip } from "@/lib/appwrite";

interface UpcomingTripsViewProps {
  trips: Trip[];
  onSetTripActive: (tripId: string) => void;
  onNewTripClick: () => void;
}

export default function UpcomingTripsView({
  trips,
  onSetTripActive,
  onNewTripClick,
}: UpcomingTripsViewProps) {
  const upcomingTrips = trips.filter((t) => t.status === "upcoming");

  if (upcomingTrips.length === 0) {
    return (
      <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#1A1B20] border border-dashed border-[#E7E3DC] dark:border-[#26272D] space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D] flex items-center justify-center mx-auto text-[#71717A]">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="space-y-1">
          <h3 className="font-serif text-2xl text-[#18181B] dark:text-[#F4F1EA]">
            No upcoming trips scheduled
          </h3>
          <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] max-w-sm mx-auto font-light">
            You don't have any confirmed trips on your calendar. Plan ahead for your next destination.
          </p>
        </div>
        <button
          onClick={onNewTripClick}
          className="px-6 py-2.5 rounded-xl bg-[#C84B26] hover:bg-[#B33F1D] text-white text-xs font-mono uppercase tracking-wider font-semibold shadow-sm transition-colors cursor-pointer"
        >
          + Plan Upcoming Trip
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#E7E3DC] dark:border-[#26272D]">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#C84B26] dark:text-[#E05A32] block">
            Confirmed Schedule
          </span>
          <h2 className="font-serif text-3xl text-[#18181B] dark:text-[#F4F1EA]">
            Upcoming Trips ({upcomingTrips.length})
          </h2>
        </div>
        <button
          onClick={onNewTripClick}
          className="px-4 py-2 rounded-xl bg-[#18181B] dark:bg-[#F4F1EA] text-white dark:text-[#121316] text-xs font-mono uppercase font-semibold hover:bg-[#C84B26] transition-colors cursor-pointer"
        >
          + Add Trip
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {upcomingTrips.map((trip) => (
          <div
            key={trip.$id || trip.id}
            className="p-6 rounded-2xl bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] shadow-sm flex flex-col justify-between space-y-4 hover:border-[#C84B26]/40 transition-colors"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D] text-[#71717A]">
                  {trip.category}
                </span>
                <span className="text-xs font-mono text-[#C84B26] dark:text-[#E05A32] font-semibold">
                  {trip.currency} {trip.budget.toLocaleString()}
                </span>
              </div>

              <h3 className="font-serif text-2xl text-[#18181B] dark:text-[#F4F1EA]">
                {trip.title}
              </h3>

              <div className="flex items-center gap-2 text-xs font-mono text-[#71717A] dark:text-[#A1A1AA]">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{trip.destination}</span>
              </div>

              <div className="text-xs font-mono text-[#71717A] dark:text-[#A1A1AA]">
                Dates: {trip.startDate} → {trip.endDate}
              </div>

              {trip.notes && (
                <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] line-clamp-2 pt-2 border-t border-[#E7E3DC]/60 dark:border-[#26272D]">
                  {trip.notes}
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-[#E7E3DC] dark:border-[#26272D] flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-[#71717A]">
                Status: Scheduled
              </span>
              <button
                onClick={() => onSetTripActive(trip.$id || trip.id || "")}
                className="px-4 py-2 rounded-xl bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D] hover:border-[#C84B26] hover:text-[#C84B26] text-xs font-mono uppercase font-semibold transition-colors cursor-pointer"
              >
                Set as Active Trip
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
