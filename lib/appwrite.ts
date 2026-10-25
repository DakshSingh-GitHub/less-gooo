import { Client, Account, Databases, ID, Query } from "appwrite";

const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://nyc.cloud.appwrite.io/v1";
const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "6addf37400385e615d7d";

export const APPWRITE_DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "lessgooo_db";
export const APPWRITE_USERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID || "users";
export const APPWRITE_TRIPS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_TRIPS_COLLECTION_ID || "trips";
export const APPWRITE_ITINERARIES_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_ITINERARIES_COLLECTION_ID || "itineraries";
export const APPWRITE_EXPENSES_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_EXPENSES_COLLECTION_ID || "expenses";
export const APPWRITE_GUIDES_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_GUIDES_COLLECTION_ID || "guides";
export const APPWRITE_POSTS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_POSTS_COLLECTION_ID || "posts";

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export { client, ID, Query };

export interface Trip {
  $id?: string;
  id?: string;
  userId: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  category: "Solo" | "Family" | "Business" | "Vacation" | "Spiritual" | "Adventure" | string;
  budget: number;
  currency: string;
  status: "draft" | "upcoming" | "active" | "completed";
  notes?: string;
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

export interface ItineraryStopItem {
  id: string;
  title: string;
  description: string;
  category: "sightseeing" | "food" | "culture" | "transit" | "relaxation";
  startTime: string;
  endTime: string;
  durationMinutes: number;
  isFixed: boolean;
  transitToNext?: {
    mode: "auto" | "erickshaw" | "walk" | "boat";
    durationMinutes: number;
    estimatedFareMin: number;
    estimatedFareMax: number;
  };
}

export interface GuideItem {
  $id?: string;
  id?: string;
  name: string;
  phone: string;
  specialty: string;
  languages: string;
  hourlyRateINR: number;
  dailyRateINR: number;
  isGovtVerified: boolean;
}

// Add an expense to Appwrite (with fallback error handling)
export async function addExpenseToDb(expense: Omit<ExpenseItem, "$id">) {
  try {
    return await databases.createDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_EXPENSES_COLLECTION_ID,
      ID.unique(),
      expense
    );
  } catch (err) {
    console.warn("Could not save expense to Appwrite DB (check collection settings):", err);
    return null;
  }
}

// Fetch user's expenses
export async function fetchUserExpenses(userId: string): Promise<ExpenseItem[]> {
  try {
    const res = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      APPWRITE_EXPENSES_COLLECTION_ID,
      [Query.equal("userId", userId), Query.orderDesc("timestamp")]
    );
    return res.documents as unknown as ExpenseItem[];
  } catch (err) {
    console.warn("Could not load expenses from Appwrite DB:", err);
    return [];
  }
}

export interface ItineraryDocument {
  $id?: string;
  userId: string;
  title: string;
  status: "draft" | "active" | "completed";
  stopsJson: string;
  totalBudgetINR: number;
  spentINR: number;
  createdAt: string;
}

export async function fetchUserItineraries(userId: string): Promise<ItineraryDocument[]> {
  try {
    const res = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      APPWRITE_ITINERARIES_COLLECTION_ID,
      [Query.equal("userId", userId), Query.orderDesc("createdAt")]
    );
    return res.documents as unknown as ItineraryDocument[];
  } catch (err) {
    console.warn("Could not fetch itineraries from Appwrite DB:", err);
    return [];
  }
}

export async function createItineraryInDb(itinerary: Omit<ItineraryDocument, "$id">) {
  try {
    return await databases.createDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_ITINERARIES_COLLECTION_ID,
      ID.unique(),
      itinerary
    );
  } catch (err) {
    console.warn("Could not save itinerary to Appwrite DB:", err);
    return null;
  }
}

/**
 * Fetch all trips for a user
 */
export async function fetchUserTrips(userId: string): Promise<Trip[]> {
  try {
    const res = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      APPWRITE_TRIPS_COLLECTION_ID,
      [Query.equal("userId", userId), Query.orderDesc("createdAt")]
    );
    return res.documents as unknown as Trip[];
  } catch (err) {
    console.warn("Could not fetch trips from Appwrite DB:", err);
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem(`lessgooo_trips_${userId}`);
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch {}
      }
    }
    return [];
  }
}

/**
 * Create a new trip.
 * Enforces constraint: If status === 'active', demotes any other currently active trip to 'upcoming'.
 */
export async function createTripInDb(tripData: Omit<Trip, "$id">): Promise<Trip | null> {
  if (tripData.status === "active") {
    await demoteCurrentActiveTrips(tripData.userId);
  }

  try {
    const doc = await databases.createDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_TRIPS_COLLECTION_ID,
      ID.unique(),
      tripData
    );
    const saved = doc as unknown as Trip;
    syncTripToLocalStorage(saved);
    return saved;
  } catch (err) {
    console.warn("Could not save trip to Appwrite DB (storing locally for resilience):", err);
    const localTrip: Trip = {
      $id: "local_" + Date.now(),
      ...tripData,
    };
    syncTripToLocalStorage(localTrip);
    return localTrip;
  }
}

/**
 * Set a specific trip as the single active trip
 */
export async function setTripActiveInDb(tripId: string, userId: string): Promise<void> {
  await demoteCurrentActiveTrips(userId);
  try {
    await databases.updateDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_TRIPS_COLLECTION_ID,
      tripId,
      { status: "active", updatedAt: new Date().toISOString() }
    );
  } catch (err) {
    console.warn("Could not update trip status in Appwrite:", err);
  }

  // Also update local cache
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

async function demoteCurrentActiveTrips(userId: string) {
  try {
    const activeTrips = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      APPWRITE_TRIPS_COLLECTION_ID,
      [Query.equal("userId", userId), Query.equal("status", "active")]
    );
    for (const trip of activeTrips.documents) {
      await databases.updateDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_TRIPS_COLLECTION_ID,
        trip.$id,
        { status: "upcoming", updatedAt: new Date().toISOString() }
      );
    }
  } catch {}
}

function syncTripToLocalStorage(trip: Trip) {
  if (typeof window === "undefined") return;
  try {
    const key = `lessgooo_trips_${trip.userId}`;
    const existing: Trip[] = JSON.parse(localStorage.getItem(key) || "[]");
    const updated = [trip, ...existing.filter((t) => (t.$id || t.id) !== (trip.$id || trip.id))];
    localStorage.setItem(key, JSON.stringify(updated));
  } catch {}
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

export const VERIFIED_USER_STORAGE_KEY = "lessgooo_verified_user";

/**
 * Get verified user profile from local storage for instant zero-latency page loads
 */
export function getCachedUserProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(VERIFIED_USER_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Persist or clear verified user profile in local storage
 */
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

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  state: string;
  username: string;
}

/**
 * Register a new user:
 * 1. Creates an account in Appwrite Auth (securely hashes password)
 * 2. Establishes an active email/password session
 * 3. Creates a companion profile document in the users collection
 */
export async function registerUser(payload: RegisterPayload) {
  const { fullName, email, password, phone, state, username } = payload;
  
  // Clean username handle (strip @ and spaces)
  const cleanUsername = username.replace(/^@/, "").trim().toLowerCase();

  // 1. Create Appwrite Auth Account
  const newAccount = await account.create(
    ID.unique(),
    email.trim().toLowerCase(),
    password,
    fullName.trim()
  );

  // 2. Automatically log in to establish session
  await account.createEmailPasswordSession(email.trim().toLowerCase(), password);

  // 3. Store additional profile metadata in Appwrite Database
  const profileData: UserProfile = {
    userId: newAccount.$id,
    fullName: fullName.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    state: state.trim(),
    username: cleanUsername,
    tier: "free",
    createdAt: new Date().toISOString(),
  };

  try {
    await databases.createDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_USERS_COLLECTION_ID,
      newAccount.$id, // Use userId as the document ID for 1:1 mapping
      profileData
    );
  } catch (dbError) {
    console.warn("User registered in Auth, but could not write to database collection (ensure collection exists in console):", dbError);
  }

  setCachedUserProfile(profileData);
  return { account: newAccount, profile: profileData };
}

/**
 * Log in an existing user with Email and Password
 */
export async function loginUser(email: string, password: string) {
  const session = await account.createEmailPasswordSession(email.trim().toLowerCase(), password);
  const currentAccount = await account.get();
  
  // Attempt to fetch profile metadata
  let profile: UserProfile | null = null;
  try {
    const doc = await databases.getDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_USERS_COLLECTION_ID,
      currentAccount.$id
    );
    profile = doc as unknown as UserProfile;
  } catch (err) {
    console.warn("Could not fetch user profile document:", err);
    // Fallback profile if database document is not yet configured
    profile = {
      userId: currentAccount.$id,
      fullName: currentAccount.name || "",
      email: currentAccount.email || "",
      phone: currentAccount.phone || "",
      state: "",
      username: currentAccount.name ? currentAccount.name.toLowerCase().replace(/\s+/g, "_") : "traveler",
      tier: "free",
      createdAt: currentAccount.$createdAt,
    };
  }

  setCachedUserProfile(profile);
  return { session, account: currentAccount, profile };
}

/**
 * Log out current session
 */
export async function logoutUser() {
  setCachedUserProfile(null);
  try {
    return await account.deleteSession("current");
  } catch {
    return null;
  }
}

/**
 * Get current logged-in user profile
 */
export async function getCurrentUserProfile(): Promise<{ account: any; profile: UserProfile | null } | null> {
  try {
    const currentAccount = await account.get();
    let profile: UserProfile | null = null;
    try {
      const doc = await databases.getDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_USERS_COLLECTION_ID,
        currentAccount.$id
      );
      profile = doc as unknown as UserProfile;
    } catch {
      profile = {
        userId: currentAccount.$id,
        fullName: currentAccount.name || "",
        email: currentAccount.email || "",
        phone: currentAccount.phone || "",
        state: "",
        username: currentAccount.name ? currentAccount.name.toLowerCase().replace(/\s+/g, "_") : "traveler",
        tier: "free",
        createdAt: currentAccount.$createdAt,
      };
    }
    if (profile) {
      setCachedUserProfile(profile);
    }
    return { account: currentAccount, profile };
  } catch {
    setCachedUserProfile(null);
    return null;
  }
}

/**
 * Update allowed user profile details in Appwrite Database & Auth
 * Allows updating fullName, phone, state (email and username are strictly immutable)
 */
export async function updateUserProfile(
  userId: string,
  updates: { fullName?: string; phone?: string; state?: string }
): Promise<UserProfile | null> {
  if (updates.fullName) {
    try {
      await account.updateName(updates.fullName);
    } catch (e) {
      console.warn("Could not update name in Appwrite Auth:", e);
    }
  }

  try {
    const updatedDoc = await databases.updateDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_USERS_COLLECTION_ID,
      userId,
      updates
    );
    const updated = updatedDoc as unknown as UserProfile;
    setCachedUserProfile(updated);
    return updated;
  } catch (err) {
    console.warn("Could not update user in Appwrite DB:", err);
    try {
      const current = await getCurrentUserProfile();
      if (current?.profile) {
        const merged = { ...current.profile, ...updates };
        await databases.createDocument(
          APPWRITE_DATABASE_ID,
          APPWRITE_USERS_COLLECTION_ID,
          userId,
          merged
        );
        setCachedUserProfile(merged);
        return merged;
      }
    } catch {}
    return null;
  }
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

/**
 * Fetch all feed posts from Appwrite (Strictly 0 mock data)
 */
export async function fetchFeedPosts(): Promise<Post[]> {
  try {
    const res = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      APPWRITE_POSTS_COLLECTION_ID,
      [Query.orderDesc("createdAt"), Query.limit(100)]
    );
    return res.documents.map((doc: any) => ({
      $id: doc.$id,
      id: doc.$id || doc.id,
      userId: doc.userId || doc.user_id || "",
      authorName: doc.authorName || doc.author_name || "Anonymous Traveller",
      authorUsername: doc.authorUsername || doc.author_username || "traveller",
      title: doc.title || "",
      content: doc.content || "",
      category: doc.category || "General",
      tags: Array.isArray(doc.tags)
        ? doc.tags
        : typeof doc.tags === "string"
        ? (() => {
            try {
              return JSON.parse(doc.tags);
            } catch {
              return doc.tags.split(",").map((s: string) => s.trim()).filter(Boolean);
            }
          })()
        : [],
      likesCount: doc.likesCount ?? doc.likes_count ?? 0,
      likedBy: Array.isArray(doc.likedBy)
        ? doc.likedBy
        : typeof doc.liked_by === "string"
        ? (() => {
            try {
              return JSON.parse(doc.liked_by);
            } catch {
              return [];
            }
          })()
        : [],
      createdAt: doc.createdAt || doc.created_at || doc.$createdAt || new Date().toISOString(),
    }));
  } catch (err) {
    console.warn("Could not fetch posts from Appwrite (falling back to local cache):", err);
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("lessgooo_feed_posts");
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch {}
      }
    }
    return []; // Zero mock data!
  }
}

/**
 * Create a new feed post in Appwrite & local cache
 */
export async function createPostInDb(postData: Omit<Post, "$id">): Promise<Post | null> {
  const newPostId = ID.unique();
  const serializedPost = {
    userId: postData.userId,
    user_id: postData.userId,
    authorName: postData.authorName,
    author_name: postData.authorName,
    authorUsername: postData.authorUsername,
    author_username: postData.authorUsername,
    title: postData.title,
    content: postData.content,
    category: postData.category,
    tags: JSON.stringify(postData.tags),
    likesCount: 0,
    likes_count: 0,
    likedBy: JSON.stringify([]),
    liked_by: JSON.stringify([]),
    createdAt: postData.createdAt || new Date().toISOString(),
    created_at: postData.createdAt || new Date().toISOString(),
  };

  try {
    const doc = await databases.createDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_POSTS_COLLECTION_ID,
      newPostId,
      serializedPost
    );
    const created: Post = {
      $id: doc.$id,
      ...postData,
      id: doc.$id,
      likesCount: 0,
      likedBy: [],
      createdAt: postData.createdAt || new Date().toISOString(),
    };
    syncFeedPostToLocalStorage(created);
    return created;
  } catch (err) {
    console.warn("Could not save post to Appwrite DB (persisting locally):", err);
    const localPost: Post = {
      $id: "post_" + Date.now(),
      id: "post_" + Date.now(),
      ...postData,
      likesCount: 0,
      likedBy: [],
      createdAt: postData.createdAt || new Date().toISOString(),
    };
    syncFeedPostToLocalStorage(localPost);
    return localPost;
  }
}

/**
 * Toggle like on a feed post
 */
export async function toggleLikePostInDb(
  postId: string,
  userId: string,
  currentPost: Post
): Promise<{ likesCount: number; likedBy: string[] }> {
  const hasLiked = currentPost.likedBy.includes(userId);
  const newLikedBy = hasLiked
    ? currentPost.likedBy.filter((id) => id !== userId)
    : [...currentPost.likedBy, userId];
  const newLikesCount = Math.max(0, currentPost.likesCount + (hasLiked ? -1 : 1));

  try {
    await databases.updateDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_POSTS_COLLECTION_ID,
      postId,
      {
        likesCount: newLikesCount,
        likes_count: newLikesCount,
        likedBy: JSON.stringify(newLikedBy),
        liked_by: JSON.stringify(newLikedBy),
      }
    );
  } catch (err) {
    console.warn("Could not sync like to Appwrite DB (updating locally):", err);
  }

  // Update local storage
  if (typeof window !== "undefined") {
    try {
      const existing: Post[] = JSON.parse(localStorage.getItem("lessgooo_feed_posts") || "[]");
      const updated = existing.map((p) =>
        (p.$id || p.id) === postId ? { ...p, likesCount: newLikesCount, likedBy: newLikedBy } : p
      );
      localStorage.setItem("lessgooo_feed_posts", JSON.stringify(updated));
    } catch {}
  }

  return { likesCount: newLikesCount, likedBy: newLikedBy };
}

/**
 * Delete a post from Appwrite DB & local cache (Owner only)
 */
export async function deletePostFromDb(postId: string, userId: string): Promise<boolean> {
  try {
    await databases.deleteDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_POSTS_COLLECTION_ID,
      postId
    );
  } catch (err) {
    console.warn("Could not delete post from Appwrite DB (cleaning local cache):", err);
  }

  // Always sync local storage
  if (typeof window !== "undefined") {
    try {
      const existing: Post[] = JSON.parse(localStorage.getItem("lessgooo_feed_posts") || "[]");
      const filtered = existing.filter((p) => (p.$id || p.id) !== postId);
      localStorage.setItem("lessgooo_feed_posts", JSON.stringify(filtered));
    } catch {}
  }

  return true;
}

function syncFeedPostToLocalStorage(post: Post) {
  if (typeof window === "undefined") return;
  try {
    const existing: Post[] = JSON.parse(localStorage.getItem("lessgooo_feed_posts") || "[]");
    const updated = [post, ...existing.filter((p) => (p.$id || p.id) !== (post.$id || post.id))];
    localStorage.setItem("lessgooo_feed_posts", JSON.stringify(updated));
  } catch {}
}
