import type { Trip } from "@/lib/appwrite";

/**
 * Returns the user's current local calendar date in YYYY-MM-DD format.
 */
export function getLocalTodayDateString(now: Date = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Normalizes a date string (e.g. "2026-11-12" or ISO timestamp) to "YYYY-MM-DD".
 * Returns null if the input is not a valid YYYY-MM-DD prefix.
 */
export function normalizeDateString(dateStr?: string): string | null {
  if (!dateStr) return null;
  const trimmed = dateStr.trim().slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(trimmed) ? trimmed : null;
}

/**
 * Determines the automated trip status for a given start/end date range
 * compared against today's local date.
 * - startDate <= today <= endDate => "active"
 * - today > endDate               => "completed"
 * - today < startDate             => "upcoming"
 */
export function getAutomatedTripStatus(
  startDate: string,
  endDate: string,
  today: string = getLocalTodayDateString()
): "upcoming" | "active" | "completed" {
  const start = normalizeDateString(startDate);
  const end = normalizeDateString(endDate);

  if (!start || !end) return "upcoming";
  if (today > end) return "completed";
  if (today >= start && today <= end) return "active";
  return "upcoming";
}

export interface ReconciledTripChange {
  trip: Trip;
  previousStatus: Trip["status"];
  nextStatus: Trip["status"];
}

export interface ReconcileTripsResult {
  trips: Trip[];
  changedTrips: ReconciledTripChange[];
}

/**
 * Reconciles a list of trips with the current local date:
 * 1. Deactivates any "active" or "upcoming" trip whose endDate has passed (today > endDate) -> "completed".
 * 2. If no trip is currently "active", promotes the matching "upcoming" trip whose
 *    date range includes today (startDate <= today <= endDate) -> "active".
 * 3. Leaves "completed" and "draft" trips untouched.
 */
export function reconcileTripsWithCurrentDate(
  trips: Trip[],
  today: string = getLocalTodayDateString()
): ReconcileTripsResult {
  const nowIso = new Date().toISOString();
  const changedTrips: ReconciledTripChange[] = [];

  // Pass 1: Deactivate any active or upcoming trips whose end date has been crossed
  const afterExpiry = trips.map((trip) => {
    if (trip.status === "completed" || trip.status === "draft") {
      return trip;
    }

    const end = normalizeDateString(trip.endDate);
    if (end && today > end) {
      const updated: Trip = {
        ...trip,
        status: "completed",
        updatedAt: nowIso,
      };
      changedTrips.push({
        trip: updated,
        previousStatus: trip.status,
        nextStatus: "completed",
      });
      return updated;
    }

    return trip;
  });

  // Check if a valid active trip already exists
  const hasActiveTrip = afterExpiry.some((t) => t.status === "active");
  if (hasActiveTrip) {
    return { trips: afterExpiry, changedTrips };
  }

  // Pass 2: Find an upcoming trip whose date range matches today (startDate <= today <= endDate)
  let promotedTripId: string | null = null;
  const matchingUpcoming = afterExpiry
    .filter((trip) => {
      if (trip.status !== "upcoming") return false;
      const start = normalizeDateString(trip.startDate);
      const end = normalizeDateString(trip.endDate);
      return Boolean(start && end && today >= start && today <= end);
    })
    .sort((a, b) => {
      const aStart = normalizeDateString(a.startDate) || "";
      const bStart = normalizeDateString(b.startDate) || "";
      return aStart.localeCompare(bStart);
    });

  if (matchingUpcoming.length > 0) {
    const target = matchingUpcoming[0];
    promotedTripId = target.$id || target.id || null;
  }

  if (!promotedTripId) {
    return { trips: afterExpiry, changedTrips };
  }

  const finalTrips = afterExpiry.map((trip) => {
    const id = trip.$id || trip.id;
    if (id && id === promotedTripId && trip.status !== "active") {
      const updated: Trip = {
        ...trip,
        status: "active",
        updatedAt: nowIso,
      };
      changedTrips.push({
        trip: updated,
        previousStatus: trip.status,
        nextStatus: "active",
      });
      return updated;
    }
    return trip;
  });

  return { trips: finalTrips, changedTrips };
}
