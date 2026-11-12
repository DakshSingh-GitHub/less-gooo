export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

const ACCESS_TOKEN_STORAGE_KEY = "lessgooo_access_token";
export const VERIFIED_USER_STORAGE_KEY = "lessgooo_verified_user";

export type TransitMode = "flight" | "train" | "cab" | "self_car";

export interface SingleLegTransitCost {
  mode: TransitMode;
  direction: "approaching" | "departure";
  directionLabel: string;
  from: string;
  to: string;
  distanceKm: number;
  fuelCost?: number;
  fuelLiters?: number;
  tollCost?: number;
  ticketPricePerPerson?: number;
  passengersCount: number;
  totalCost: number;
  summaryText: string;
}

export interface TransitCostBreakdown {
  mode: TransitMode;
  distanceKm: number;
  roundTripDistanceKm: number;
  fuelCost?: number;
  tollCost?: number;
  ticketPricePerPerson?: number;
  passengersCount: number;
  roundTripTotal: number;
  summaryText: string;
}

export interface PlanSpecifications {
  pace: "relaxed" | "moderate" | "intensive";
  includeRestaurants: boolean;
  dietaryPreference: "pure_veg" | "all";
  cuisineTypes: string[];
  touristPreferences: string[];
  stayType: string;
  includeStayRest: boolean;
  approachingTransitMode: TransitMode;
  departureTransitMode: TransitMode;
  passengersCount: number;
  approachingCarFuelType?: "petrol" | "diesel" | "ev";
  departureCarFuelType?: "petrol" | "diesel" | "ev";
  transitMode?: TransitMode;
  carFuelType?: "petrol" | "diesel" | "ev";
  necessities: {
    hospital: boolean;
    medicalStore: boolean;
    atm: boolean;
    restrooms: boolean;
  };
}

export interface ProposedPlanStop {
  time: string;
  title: string;
  category: "sightseeing" | "food" | "culture" | "rest" | "medical" | "transit";
  description: string;
  location?: string;
  isPureVeg?: boolean;
  transitNote?: string;
  estimatedCost?: string;
}

export interface ProposedPlanDay {
  dayNumber: number;
  date: string;
  theme: string;
  stops: ProposedPlanStop[];
}

export interface Trip {
  $id?: string;
  id?: string;
  userId: string;
  title: string;
  from?: string;
  destination: string;
  startDate: string;
  endDate: string;
  category: "Solo" | "Family" | "Business" | "Vacation" | "Spiritual" | "Adventure" | string;
  budget: number;
  currency: string;
  status: "draft" | "upcoming" | "active" | "completed";
  notes?: string;
  specifications?: PlanSpecifications;
  proposedPlan?: ProposedPlanDay[];
  estimatedTicketCost?: number;
  estimatedTransitCost?: TransitCostBreakdown;
  approachingTransitCost?: SingleLegTransitCost;
  departureTransitCost?: SingleLegTransitCost;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseItem {
  $id?: string;
  id?: string;
  userId: string;
  tripId?: string;
  itineraryId?: string;
  title: string;
  amountINR: number;
  category: "transit" | "food" | "temple" | "guide" | "shopping" | "stay";
  timestamp: string;
}

export interface GuideItem {
  $id?: string;
  id?: string;
  name: string;
  phone: string;
  specialty: string;
  languages: string[];
  hourlyRateINR: number;
  dailyRateINR: number;
  isGovtVerified: boolean;
  city?: string;
}

export interface UserProfile {
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  state: string;
  username: string;
  tier: "free" | "pro";
  createdAt: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  state: string;
  username: string;
}

export interface Post {
  $id?: string;
  id?: string;
  userId: string;
  authorName: string;
  authorUsername: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  likesCount: number;
  likedBy: string[];
  createdAt: string;
}

export const DEFAULT_POST_TAGS = [
  "#Varanasi",
  "#GhatWalks",
  "#Backpacking",
  "#SoloTravel",
  "#HiddenGems",
  "#StreetFood",
  "#BudgetTravel",
  "#HeritageWalk",
  "#SunrisePoint",
  "#LocalChai",
  "#TravelTips",
  "#TempleGuide",
  "#NightWalks",
  "#BoatRide",
  "#CulturalImmersion",
  "#PhotographySpot",
  "#SpiritualJourney",
  "#WeekendGetaway",
  "#HomestayFinds",
  "#MonsoonTravel",
  "#OffTheBeatenPath",
  "#SafeTravel",
  "#TrainJourneys",
  "#HistoricalSites",
  "#EveningAarti",
  "#ArtAndCraft",
  "#TrekDiaries",
  "#LocalLegends",
  "#SlowTravel",
  "#RoadTrip",
] as const;

export const DEFAULT_POST_CATEGORIES = [
  "Experiences",
  "Tips & Hacks",
  "Ask Community",
  "Itinerary Review",
  "Food & Chai",
  "Scam Alert",
  "Solo Meetups",
  "Hidden Gems",
] as const;

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

function setAccessToken(token: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (token) {
      localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    }
  } catch {}
}

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 204) {
    return undefined as T;
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.detail || data?.error || `Request failed (${res.status})`);
  }
  return data as T;
}

export const client = {
  ping: async () => {
    const healthUrl = `${API_BASE_URL.replace(/\/api\/v1\/?$/, "")}/health`;
    const res = await fetch(healthUrl);
    return res.json();
  },
};

export function getCachedUserProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(VERIFIED_USER_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UserProfile) : null;
  } catch {
    return null;
  }
}

export function setCachedUserProfile(profile: UserProfile | null): void {
  if (typeof window === "undefined") return;
  try {
    if (profile) {
      localStorage.setItem(VERIFIED_USER_STORAGE_KEY, JSON.stringify(profile));
    } else {
      localStorage.removeItem(VERIFIED_USER_STORAGE_KEY);
    }
  } catch {}
}

export async function registerUser(payload: RegisterPayload) {
  const data = await apiRequest<{ accessToken: string; profile: UserProfile }>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  setAccessToken(data.accessToken);
  setCachedUserProfile(data.profile);
  return { account: { $id: data.profile.userId }, profile: data.profile };
}

export async function loginUser(email: string, password: string) {
  const data = await apiRequest<{ accessToken: string; profile: UserProfile }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setAccessToken(data.accessToken);
  setCachedUserProfile(data.profile);
  return { session: data.accessToken, account: { $id: data.profile.userId }, profile: data.profile };
}

export async function logoutUser() {
  setAccessToken(null);
  setCachedUserProfile(null);
  return null;
}

export async function getCurrentUserProfile(): Promise<{ account: { $id: string }; profile: UserProfile | null } | null> {
  const token = getAccessToken();
  if (!token) {
    setCachedUserProfile(null);
    return null;
  }
  try {
    const profile = await apiRequest<UserProfile>("/auth/me");
    setCachedUserProfile(profile);
    return { account: { $id: profile.userId }, profile };
  } catch {
    setAccessToken(null);
    setCachedUserProfile(null);
    return null;
  }
}

export async function updateUserProfile(
  _userId: string,
  updates: { fullName?: string; phone?: string; state?: string }
): Promise<UserProfile | null> {
  try {
    const updated = await apiRequest<UserProfile>("/auth/profile", {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
    setCachedUserProfile(updated);
    return updated;
  } catch {
    return null;
  }
}

function normalizeTrip(trip: Trip): Trip {
  return { ...trip, $id: trip.id || trip.$id };
}

function syncTripToLocalStorage(trip: Trip) {
  if (typeof window === "undefined") return;
  try {
    const key = `lessgooo_trips_${trip.userId}`;
    const existing: Trip[] = JSON.parse(localStorage.getItem(key) || "[]");
    const targetId = trip.$id || trip.id;
    const updated = [trip, ...existing.filter((t) => (t.$id || t.id) !== targetId)];
    localStorage.setItem(key, JSON.stringify(updated));
  } catch {}
}

export async function fetchUserTrips(userId: string): Promise<Trip[]> {
  try {
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
      now.getDate()
    ).padStart(2, "0")}`;
    const trips = (await apiRequest<Trip[]>(`/trips?today=${encodeURIComponent(today)}`)).map(
      normalizeTrip
    );
    if (typeof window !== "undefined") {
      localStorage.setItem(`lessgooo_trips_${userId}`, JSON.stringify(trips));
    }
    return trips;
  } catch {
    if (typeof window !== "undefined") {
      try {
        return JSON.parse(localStorage.getItem(`lessgooo_trips_${userId}`) || "[]");
      } catch {}
    }
    return [];
  }
}

export async function createTripInDb(tripData: Omit<Trip, "$id">): Promise<Trip | null> {
  try {
    const created = normalizeTrip(
      await apiRequest<Trip>("/trips", {
        method: "POST",
        body: JSON.stringify(tripData),
      })
    );
    syncTripToLocalStorage(created);
    return created;
  } catch {
    const localTrip: Trip = { $id: "local_" + Date.now(), ...tripData };
    syncTripToLocalStorage(localTrip);
    return localTrip;
  }
}

export async function setTripActiveInDb(tripId: string, userId: string): Promise<void> {
  try {
    await apiRequest<Trip>(`/trips/${tripId}/activate`, { method: "POST" });
  } catch {}

  if (typeof window !== "undefined") {
    const key = `lessgooo_trips_${userId}`;
    try {
      const existing: Trip[] = JSON.parse(localStorage.getItem(key) || "[]");
      const updated = existing.map((t) => {
        if ((t.$id || t.id) === tripId) {
          return { ...t, status: "active" as const, updatedAt: new Date().toISOString() };
        }
        if (t.status === "active") {
          return { ...t, status: "upcoming" as const, updatedAt: new Date().toISOString() };
        }
        return t;
      });
      localStorage.setItem(key, JSON.stringify(updated));
    } catch {}
  }
}

export async function updateTripInDb(
  tripId: string,
  userId: string,
  updates: Partial<Trip>
): Promise<Trip | null> {
  try {
    const updated = normalizeTrip(
      await apiRequest<Trip>(`/trips/${tripId}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      })
    );
    syncTripToLocalStorage(updated);
    return updated;
  } catch {
    if (typeof window !== "undefined") {
      const key = `lessgooo_trips_${userId}`;
      try {
        const existing: Trip[] = JSON.parse(localStorage.getItem(key) || "[]");
        let updatedTrip: Trip | null = null;
        const updated = existing.map((t) => {
          if ((t.$id || t.id) === tripId) {
            updatedTrip = { ...t, ...updates, updatedAt: new Date().toISOString() };
            return updatedTrip;
          }
          return t;
        });
        localStorage.setItem(key, JSON.stringify(updated));
        return updatedTrip;
      } catch {}
    }
    return null;
  }
}

function normalizeExpense(e: ExpenseItem): ExpenseItem {
  return { ...e, $id: e.id || e.$id };
}

export async function fetchUserExpenses(userId: string): Promise<ExpenseItem[]> {
  try {
    const items = (await apiRequest<ExpenseItem[]>("/expenses")).map(normalizeExpense);
    if (typeof window !== "undefined") {
      localStorage.setItem(`lessgooo_expenses_${userId}`, JSON.stringify(items));
    }
    return items;
  } catch {
    if (typeof window !== "undefined") {
      try {
        return JSON.parse(localStorage.getItem(`lessgooo_expenses_${userId}`) || "[]");
      } catch {}
    }
    return [];
  }
}

export async function addExpenseToDb(expense: Omit<ExpenseItem, "$id">): Promise<ExpenseItem> {
  try {
    const saved = normalizeExpense(
      await apiRequest<ExpenseItem>("/expenses", {
        method: "POST",
        body: JSON.stringify(expense),
      })
    );
    if (typeof window !== "undefined") {
      const key = `lessgooo_expenses_${expense.userId}`;
      const existing: ExpenseItem[] = JSON.parse(localStorage.getItem(key) || "[]");
      localStorage.setItem(key, JSON.stringify([saved, ...existing]));
    }
    return saved;
  } catch {
    const localExpense: ExpenseItem = { $id: "exp_" + Date.now(), id: "exp_" + Date.now(), ...expense };
    if (typeof window !== "undefined") {
      const key = `lessgooo_expenses_${expense.userId}`;
      const existing: ExpenseItem[] = JSON.parse(localStorage.getItem(key) || "[]");
      localStorage.setItem(key, JSON.stringify([localExpense, ...existing]));
    }
    return localExpense;
  }
}

export async function syncTransitExpensesInDb(
  userId: string,
  tripId: string,
  approaching: { title: string; amountINR: number },
  departure: { title: string; amountINR: number }
): Promise<ExpenseItem[]> {
  try {
    const items = (
      await apiRequest<ExpenseItem[]>("/expenses/sync-transit", {
        method: "PUT",
        body: JSON.stringify({ tripId, approaching, departure }),
      })
    ).map(normalizeExpense);
    if (typeof window !== "undefined") {
      localStorage.setItem(`lessgooo_expenses_${userId}`, JSON.stringify(items));
    }
    return items;
  } catch {
    return fetchUserExpenses(userId);
  }
}

function normalizePost(p: Post): Post {
  return { ...p, $id: p.id || p.$id };
}

export async function fetchFeedPosts(): Promise<Post[]> {
  try {
    const posts = (await apiRequest<Post[]>("/posts")).map(normalizePost);
    if (typeof window !== "undefined") {
      localStorage.setItem("lessgooo_feed_posts", JSON.stringify(posts));
    }
    return posts;
  } catch {
    if (typeof window !== "undefined") {
      try {
        return JSON.parse(localStorage.getItem("lessgooo_feed_posts") || "[]");
      } catch {}
    }
    return [];
  }
}

export async function createPostInDb(postData: Omit<Post, "$id">): Promise<Post | null> {
  try {
    const created = normalizePost(
      await apiRequest<Post>("/posts", {
        method: "POST",
        body: JSON.stringify({
          title: postData.title,
          content: postData.content,
          category: postData.category,
          tags: postData.tags,
        }),
      })
    );
    if (typeof window !== "undefined") {
      const existing: Post[] = JSON.parse(localStorage.getItem("lessgooo_feed_posts") || "[]");
      localStorage.setItem("lessgooo_feed_posts", JSON.stringify([created, ...existing]));
    }
    return created;
  } catch {
    return null;
  }
}

export async function toggleLikePostInDb(
  postId: string,
  _userId: string,
  currentPost: Post
): Promise<{ likesCount: number; likedBy: string[] }> {
  try {
    const res = await apiRequest<{ likesCount: number; likedBy: string[] }>(`/posts/${postId}/like`, {
      method: "POST",
    });
    if (typeof window !== "undefined") {
      const existing: Post[] = JSON.parse(localStorage.getItem("lessgooo_feed_posts") || "[]");
      const updated = existing.map((p) =>
        (p.$id || p.id) === postId ? { ...p, likesCount: res.likesCount, likedBy: res.likedBy } : p
      );
      localStorage.setItem("lessgooo_feed_posts", JSON.stringify(updated));
    }
    return res;
  } catch {
    return { likesCount: currentPost.likesCount, likedBy: currentPost.likedBy };
  }
}

export async function deletePostFromDb(postId: string, _userId: string): Promise<boolean> {
  try {
    await apiRequest<void>(`/posts/${postId}`, { method: "DELETE" });
    if (typeof window !== "undefined") {
      const existing: Post[] = JSON.parse(localStorage.getItem("lessgooo_feed_posts") || "[]");
      localStorage.setItem(
        "lessgooo_feed_posts",
        JSON.stringify(existing.filter((p) => (p.$id || p.id) !== postId))
      );
    }
    return true;
  } catch {
    return false;
  }
}

export async function generateTripPlan(payload: {
  destination: string;
  from: string;
  startDate: string;
  endDate: string;
  budget: number;
  currency: string;
  category: string;
  specifications: PlanSpecifications;
}) {
  return apiRequest<{
    success: boolean;
    source: string;
    proposedPlan: ProposedPlanDay[];
    estimatedTicketCost: number;
    approachingTransitCost: SingleLegTransitCost;
    departureTransitCost: SingleLegTransitCost;
    estimatedTransitCost: TransitCostBreakdown;
  }>("/trips/generate-plan", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchGuides(city?: string): Promise<GuideItem[]> {
  const qs = city ? `?city=${encodeURIComponent(city)}` : "";
  return apiRequest<GuideItem[]>(`/guides${qs}`);
}
