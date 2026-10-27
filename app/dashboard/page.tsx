"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getCurrentUserProfile,
  getCachedUserProfile,
  setCachedUserProfile,
  logoutUser,
  UserProfile,
  Trip,
  ExpenseItem,
  Post,
  fetchUserTrips,
  setTripActiveInDb,
  fetchUserExpenses,
  addExpenseToDb,
  fetchFeedPosts
} from "@/lib/appwrite";

import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import DashboardSidebar, { SidebarView } from "@/components/dashboard/DashboardSidebar";
import ActiveTripCard from "@/components/dashboard/ActiveTripCard";
import TripCreateForm from "@/components/dashboard/TripCreateForm";
import UpcomingTripsView from "@/components/dashboard/UpcomingTripsView";
import CompletedTripsView from "@/components/dashboard/CompletedTripsView";
import ExpenseManagerView from "@/components/dashboard/ExpenseManagerView";
import DiscoverView from "@/components/dashboard/DiscoverView";
import FeedView from "@/components/dashboard/FeedView";

export default function DashboardPage() {
  const router = useRouter();
  const [authChecking, setAuthChecking] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<SidebarView>("active-trip");

  // Real Data Entities
  const [trips, setTrips] = useState<Trip[]>([]);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Authentication & Initial Data Fetch
  useEffect(() => {
    // Theme setup
    const savedTheme = localStorage.getItem("lessgooo-theme");
    if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }

    // 1. Instant Zero-Latency Load from LocalStorage Cache
    const cachedUser = getCachedUserProfile();
    if (cachedUser) {
      setUser(cachedUser);
      setAuthChecking(false); // Instantly unlock dashboard with zero loading delay!

      // Preload locally cached trips, expenses, and feed posts immediately
      try {
        const cachedTripsRaw = localStorage.getItem(`lessgooo_trips_${cachedUser.userId}`);
        if (cachedTripsRaw) {
          setTrips(JSON.parse(cachedTripsRaw));
        }
        const cachedExpensesRaw = localStorage.getItem(`lessgooo_expenses_${cachedUser.userId}`);
        if (cachedExpensesRaw) {
          setExpenses(JSON.parse(cachedExpensesRaw));
        }
        const cachedPostsRaw = localStorage.getItem("lessgooo_feed_posts");
        if (cachedPostsRaw) {
          setPosts(JSON.parse(cachedPostsRaw));
        }
      } catch {}
    }

    // 2. Background Revalidation (Stale-While-Revalidate)
    getCurrentUserProfile().then(async (res) => {
      if (!res?.account) {
        // Active session is invalid or revoked on server
        setCachedUserProfile(null);
        router.replace("/login");
        return;
      }

      if (res.profile) {
        setUser(res.profile);
        setCachedUserProfile(res.profile);

        // Background sync real trips, expenses, and posts from Appwrite
        const userTrips = await fetchUserTrips(res.profile.userId);
        setTrips(userTrips);

        const userExpenses = await fetchUserExpenses(res.profile.userId);
        setExpenses(userExpenses);

        const feedPosts = await fetchFeedPosts();
        setPosts(feedPosts);
      }
      setAuthChecking(false);
    }).catch((err) => {
      console.warn("Background session revalidation notice:", err);
      // If we don't even have a cached user, redirect to login
      if (!cachedUser) {
        router.replace("/login");
      }
    });
  }, [router]);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("lessgooo-theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("lessgooo-theme", "dark");
      setIsDarkMode(true);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    router.replace("/login");
  };

  // Enforce Single Active Trip Constraint
  // Only one trip can have status === 'active'
  const activeTrip = trips.find((t) => t.status === "active") || null;
  const upcomingTrips = trips.filter((t) => t.status === "upcoming");
  const completedTrips = trips.filter((t) => t.status === "completed");

  // Handle New Trip Created
  const handleTripCreated = (createdTrip: Trip) => {
    if (createdTrip.status === "active") {
      // Demote all other existing active trips
      const updatedTrips = trips.map((t) =>
        t.status === "active" ? { ...t, status: "upcoming" as const } : t
      );
      setTrips([createdTrip, ...updatedTrips]);
      setCurrentView("active-trip");
    } else {
      setTrips([createdTrip, ...trips]);
      setCurrentView("upcoming-trips");
    }
  };

  // Handle Set Trip Active (Promote upcoming or completed trip to active)
  const handleSetTripActive = async (tripId: string) => {
    if (!user?.userId) return;

    await setTripActiveInDb(tripId, user.userId);

    const updated = trips.map((t) => {
      if ((t.$id || t.id) === tripId) {
        return { ...t, status: "active" as const, updatedAt: new Date().toISOString() };
      }
      if (t.status === "active") {
        return { ...t, status: "upcoming" as const, updatedAt: new Date().toISOString() };
      }
      return t;
    });

    setTrips(updated);
    setCurrentView("active-trip");
  };

  // Handle Complete Trip with Date Override
  const handleCompleteTrip = async (tripId: string, overrideEndDate?: string) => {
    const today = new Date().toISOString().split("T")[0];
    const finalEndDate = overrideEndDate || today;

    if (user?.userId) {
      const { updateTripInDb } = await import("@/lib/appwrite");
      await updateTripInDb(tripId, user.userId, {
        status: "completed",
        endDate: finalEndDate,
      });
    }

    const updated = trips.map((t) =>
      (t.$id || t.id) === tripId
        ? {
            ...t,
            status: "completed" as const,
            endDate: finalEndDate,
            updatedAt: new Date().toISOString(),
          }
        : t
    );
    setTrips(updated);
    // Transition user directly to Completed Trips view so they see the completed trip immediately!
    setCurrentView("completed-trips");
  };

  // Handle Update Trip (Settings, Plan Specifications, Proposed Plan)
  const handleUpdateTrip = (updatedTrip: Trip) => {
    setTrips((prev) =>
      prev.map((t) => ((t.$id || t.id) === (updatedTrip.$id || updatedTrip.id) ? updatedTrip : t))
    );
  };

  // Handle Add Expense
  const handleAddExpense = async (data: { title: string; amountINR: number; category: ExpenseItem["category"] }) => {
    if (!user?.userId) return;

    const newEntry: ExpenseItem = {
      userId: user.userId,
      tripId: activeTrip?.$id || activeTrip?.id,
      title: data.title,
      amountINR: data.amountINR,
      category: data.category,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setExpenses([newEntry, ...expenses]);
    await addExpenseToDb(newEntry);
  };

  // Handle Sync Transit Expenses (Inbound & Outbound Non-Stacking In-Place Update)
  const handleSyncTransitExpenses = async (
    approaching: { title: string; amountINR: number },
    departure: { title: string; amountINR: number }
  ) => {
    if (!user?.userId || !activeTrip) return;
    const tripId = activeTrip.$id || activeTrip.id || "";
    const { syncTransitExpensesInDb } = await import("@/lib/appwrite");
    const updatedExpenses = await syncTransitExpensesInDb(
      user.userId,
      tripId,
      approaching,
      departure
    );
    setExpenses(updatedExpenses);
  };

  // Handle Post Created
  const handlePostCreated = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  // Handle Post Updated (Likes, etc.)
  const handlePostUpdated = (updatedPost: Post) => {
    setPosts((prev) =>
      prev.map((p) => ((p.$id || p.id) === (updatedPost.$id || updatedPost.id) ? updatedPost : p))
    );
  };

  // Handle Post Deleted (Owner only)
  const handlePostDeleted = (postId: string) => {
    setPosts((prev) => prev.filter((p) => (p.$id || p.id) !== postId));
  };

  // Dynamic Breadcrumb Label
  const getBreadcrumbLabel = () => {
    switch (currentView) {
      case "active-trip":
        return activeTrip ? activeTrip.title : "Active Trip";
      case "upcoming-trips":
        return `Upcoming Trips (${upcomingTrips.length})`;
      case "completed-trips":
        return `Completed Trips (${completedTrips.length})`;
      case "new-trip":
        return "New Trip Plan";
      case "expenses":
        return "Expense Manager";
      case "feed":
        return "Community Feed";
      case "discover":
        return "Discover & Guides";
      case "settings":
        return "Account Settings";
      default:
        return "Overview";
    }
  };

  // Accessible Loading Skeleton
  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#121316] text-[#18181B] dark:text-[#F4F1EA] flex flex-col justify-center items-center font-mono text-xs space-y-4">
        <div className="w-8 h-8 rounded-full border-2 border-[#C84B26] border-t-transparent animate-spin" />
        <div className="text-center space-y-1">
          <span className="font-serif text-lg font-medium block">LessGooo</span>
          <span className="text-[#71717A] dark:text-[#A1A1AA]">Verifying traveller credentials...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#18181B] dark:bg-[#121316] dark:text-[#F4F1EA] selection:bg-[#C84B26] selection:text-white transition-colors duration-150">
      {/* 1. TOP NAVBAR (Fixed at viewport top) */}
      <DashboardNavbar
        user={user}
        breadcrumb={getBreadcrumbLabel()}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        onLogout={handleLogout}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* 2. SPLIT-VIEW MAIN SCREEN (Below Navbar) */}
      <div className="pt-16 flex min-h-[calc(100vh-4rem)]">
        {/* Left Section: Fixed / Collapsible Sidebar */}
        <DashboardSidebar
          currentView={currentView}
          onSelectView={setCurrentView}
          activeTrip={activeTrip}
          upcomingTripsCount={upcomingTrips.length}
          completedTripsCount={completedTrips.length}
          isOpen={sidebarOpen}
          onCloseMobile={() => setSidebarOpen(false)}
        />

        {/* Right Section: Dynamic Main Content Workspace */}
        <main className="flex-1 md:pl-72 p-6 sm:p-10 max-w-7xl mx-auto w-full transition-all">
          {/* Dynamic Workspace Views */}
          {currentView === "active-trip" && (
            <div className="space-y-6">
              <ActiveTripCard
                trip={activeTrip}
                onNewTripClick={() => setCurrentView("new-trip")}
                onCompleteTrip={handleCompleteTrip}
                onLogExpenseClick={() => setCurrentView("expenses")}
                onUpdateTrip={handleUpdateTrip}
                onAddExpenseAuto={handleAddExpense}
                onSyncTransitExpenses={handleSyncTransitExpenses}
              />
            </div>
          )}

          {currentView === "new-trip" && (
            <div className="space-y-6">
              <TripCreateForm
                userId={user?.userId || ""}
                onTripCreated={handleTripCreated}
                onCancel={() => setCurrentView("active-trip")}
              />
            </div>
          )}

          {currentView === "upcoming-trips" && (
            <div className="space-y-6">
              <UpcomingTripsView
                trips={trips}
                onSetTripActive={handleSetTripActive}
                onNewTripClick={() => setCurrentView("new-trip")}
              />
            </div>
          )}

          {currentView === "completed-trips" && (
            <div className="space-y-6">
              <CompletedTripsView
                trips={trips}
                onSetTripActive={handleSetTripActive}
                onNewTripClick={() => setCurrentView("new-trip")}
              />
            </div>
          )}

          {currentView === "expenses" && (
            <div className="space-y-6">
              <ExpenseManagerView
                expenses={expenses}
                activeTrip={activeTrip}
                onAddExpense={handleAddExpense}
              />
            </div>
          )}

          {currentView === "feed" && user && (
            <div className="space-y-6">
              <FeedView
                user={user}
                posts={posts}
                isLoading={postsLoading}
                onPostCreated={handlePostCreated}
                onPostUpdated={handlePostUpdated}
                onPostDeleted={handlePostDeleted}
              />
            </div>
          )}

          {currentView === "discover" && (
            <div className="space-y-6">
              <DiscoverView />
            </div>
          )}

          {currentView === "settings" && (
            <div className="max-w-2xl bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] rounded-3xl p-8 space-y-6 shadow-sm">
              <div className="pb-4 border-b border-[#E7E3DC] dark:border-[#26272D]">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#C84B26] block">
                  Settings & Preferences
                </span>
                <h2 className="font-serif text-2xl text-[#18181B] dark:text-[#F4F1EA]">
                  Traveller Profile
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-3.5 rounded-xl border border-[#E7E3DC] dark:border-[#26272D] bg-[#FAF8F5] dark:bg-[#121316]">
                  <span className="text-[#71717A] uppercase text-[10px] block">Full Name</span>
                  <span className="font-medium text-[#18181B] dark:text-[#F4F1EA]">{user?.fullName}</span>
                </div>
                <div className="p-3.5 rounded-xl border border-[#E7E3DC] dark:border-[#26272D] bg-[#FAF8F5] dark:bg-[#121316]">
                  <span className="text-[#71717A] uppercase text-[10px] block">Username</span>
                  <span className="font-medium text-[#18181B] dark:text-[#F4F1EA]">@{user?.username}</span>
                </div>
                <div className="p-3.5 rounded-xl border border-[#E7E3DC] dark:border-[#26272D] bg-[#FAF8F5] dark:bg-[#121316]">
                  <span className="text-[#71717A] uppercase text-[10px] block">Email</span>
                  <span className="font-medium text-[#18181B] dark:text-[#F4F1EA]">{user?.email}</span>
                </div>
                <div className="p-3.5 rounded-xl border border-[#E7E3DC] dark:border-[#26272D] bg-[#FAF8F5] dark:bg-[#121316]">
                  <span className="text-[#71717A] uppercase text-[10px] block">Phone</span>
                  <span className="font-medium text-[#18181B] dark:text-[#F4F1EA]">{user?.phone}</span>
                </div>
                <div className="p-3.5 rounded-xl border border-[#E7E3DC] dark:border-[#26272D] bg-[#FAF8F5] dark:bg-[#121316]">
                  <span className="text-[#71717A] uppercase text-[10px] block">Origin State</span>
                  <span className="font-medium text-[#18181B] dark:text-[#F4F1EA]">{user?.state}</span>
                </div>
                <div className="p-3.5 rounded-xl border border-[#E7E3DC] dark:border-[#26272D] bg-[#FAF8F5] dark:bg-[#121316]">
                  <span className="text-[#71717A] uppercase text-[10px] block">Subscription Tier</span>
                  <span className="font-semibold text-[#C84B26] uppercase">{user?.tier || "free"} Edition</span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E7E3DC] dark:border-[#26272D] flex items-center justify-between">
                <span className="text-xs text-[#71717A] font-mono">Appwrite Session Active</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-xl border border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/10 text-xs font-mono uppercase font-semibold transition-colors"
                >
                  Log Out
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
