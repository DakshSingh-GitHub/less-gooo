/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  client,
  getCurrentUserProfile,
  getCachedUserProfile,
  logoutUser,
  UserProfile,
} from "@/lib/appwrite";
import AuthModal from "@/components/AuthModal";
import Logo from "@/components/Logo";

import HeroSection from "@/components/home/HeroSection";
import DestinationShowcase from "@/components/home/DestinationShowcase";
import CapabilitiesShowcase from "@/components/home/CapabilitiesShowcase";
import HowItWorks from "@/components/home/HowItWorks";
import PricingPreview from "@/components/home/PricingPreview";
import HomeFooter from "@/components/home/HomeFooter";
import { getInitialTheme, toggleThemeMode } from "@/lib/theme";

export default function Home() {
  const router = useRouter();
  const [activeDropdown, setActiveDropdown] = useState<"features" | "travelers" | "plans" | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<string>("");
  const navRef = useRef<HTMLDivElement>(null);

  // Initialize theme from localStorage or system preference and check user session
  useEffect(() => {
    // Ping Appwrite once on start
    client.ping().then((res) => {
      console.log("Appwrite ping response:", res);
    }).catch((err) => {
      console.log("Appwrite ping response:", err);
    });

    // 1. Instant User Render from Cache
    const cachedUser = getCachedUserProfile();
    if (cachedUser) {
      setCurrentUser(cachedUser);
    }

    // 2. Background Session Revalidation
    getCurrentUserProfile().then((res) => {
      if (res?.profile) {
        setCurrentUser(res.profile);
      } else {
        setCurrentUser(null);
      }
    });

    const timer = setTimeout(() => {
      const isDark = document.documentElement.classList.contains("dark") || getInitialTheme() === "dark";
      setIsDarkMode(isDark);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => toggleThemeMode(prev));
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle Trip Planning Initiation
  const handleInitiatePlan = (searchData: {
    destination: string;
    startDate: string;
    endDate: string;
    travelers: string;
    preference: string;
  }) => {
    try {
      localStorage.setItem("lessgooo_draft_trip", JSON.stringify(searchData));
    } catch {}

    if (currentUser) {
      router.push("/dashboard?view=new-trip");
    } else {
      setAuthMode("signup");
      setAuthModalOpen(true);
    }
  };

  const handleSelectPlan = (plan: "free" | "pro") => {
    try {
      localStorage.setItem("lessgooo_selected_plan", plan);
    } catch {}

    if (currentUser) {
      router.push("/dashboard");
    } else {
      setAuthMode("signup");
      setAuthModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#18181B] dark:bg-[#121316] dark:text-[#F4F1EA] selection:bg-[#C84B26] selection:text-white transition-colors duration-150 flex flex-col">
      {/* TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-50 bg-[#FAF8F5]/90 dark:bg-[#121316]/90 backdrop-blur-md border-b border-[#E7E3DC] dark:border-[#26272D] transition-colors">
        <div ref={navRef} className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          {/* Brand Wordmark & Sleek Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Logo size="md" variant="badge" showText={true} animated={true} />
          </Link>

          {/* Desktop Navigation — Exactly 3 Parent Dropdowns */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#52525B] dark:text-[#A1A1AA]">
            {/* Parent 1: Features */}
            <div className="relative">
              <button
                onClick={() => setActiveDropdown(activeDropdown === "features" ? null : "features")}
                className="flex items-center gap-1.5 hover:text-[#18181B] dark:hover:text-[#F4F1EA] py-2 transition-colors cursor-pointer"
              >
                <span>Features</span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeDropdown === "features" ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {activeDropdown === "features" && (
                <div className="absolute top-full left-0 w-84 mt-2 bg-white dark:bg-[#1A1B20] rounded-2xl shadow-xl border border-[#E7E3DC] dark:border-[#26272D] p-3 space-y-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <a
                    href="#adaptive-replanning"
                    onClick={() => setActiveDropdown(null)}
                    className="block p-3 rounded-xl hover:bg-[#FAF8F5] dark:hover:bg-[#23242A] transition-colors"
                  >
                    <div className="font-medium text-[#18181B] dark:text-[#F4F1EA] text-sm">Adaptive Plan Refresh</div>
                    <div className="text-xs text-[#71717A] dark:text-[#A1A1AA] mt-0.5 leading-normal font-light">
                      Dynamic recalculation when delays, dwell extensions, or traffic occur.
                    </div>
                  </a>
                  <a
                    href="#traffic-analysis"
                    onClick={() => setActiveDropdown(null)}
                    className="block p-3 rounded-xl hover:bg-[#FAF8F5] dark:hover:bg-[#23242A] transition-colors"
                  >
                    <div className="font-medium text-[#18181B] dark:text-[#F4F1EA] text-sm">Real-Time Traffic Analysis</div>
                    <div className="text-xs text-[#71717A] dark:text-[#A1A1AA] mt-0.5 leading-normal font-light">
                      Micro-routing and bottleneck mitigation through historic alleys.
                    </div>
                  </a>
                  <a
                    href="#fare-budget"
                    onClick={() => setActiveDropdown(null)}
                    className="block p-3 rounded-xl hover:bg-[#FAF8F5] dark:hover:bg-[#23242A] transition-colors"
                  >
                    <div className="font-medium text-[#18181B] dark:text-[#F4F1EA] text-sm">Cab & Auto Fare Budget</div>
                    <div className="text-xs text-[#71717A] dark:text-[#A1A1AA] mt-0.5 leading-normal font-light">
                      Estimated transport spending ranges to prevent tourist overpaying.
                    </div>
                  </a>
                  <a
                    href="#expense-tracker"
                    onClick={() => setActiveDropdown(null)}
                    className="block p-3 rounded-xl hover:bg-[#FAF8F5] dark:hover:bg-[#23242A] transition-colors"
                  >
                    <div className="font-medium text-[#18181B] dark:text-[#F4F1EA] text-sm">In-Trip Expense Tracker</div>
                    <div className="text-xs text-[#71717A] dark:text-[#A1A1AA] mt-0.5 leading-normal font-light">
                      Live daily budget tracking and categorized spend breakdowns.
                    </div>
                  </a>
                  <a
                    href="#guide-allotment"
                    onClick={() => setActiveDropdown(null)}
                    className="block p-3 rounded-xl hover:bg-[#FAF8F5] dark:hover:bg-[#23242A] transition-colors"
                  >
                    <div className="font-medium text-[#18181B] dark:text-[#F4F1EA] text-sm">Guide Allotment</div>
                    <div className="text-xs text-[#71717A] dark:text-[#A1A1AA] mt-0.5 leading-normal font-light">
                      Direct hiring of verified local guides and elder accompaniment.
                    </div>
                  </a>
                </div>
              )}
            </div>

            {/* Parent 2: For Travellers */}
            <div className="relative">
              <button
                onClick={() => setActiveDropdown(activeDropdown === "travelers" ? null : "travelers")}
                className="flex items-center gap-1.5 hover:text-[#18181B] dark:hover:text-[#F4F1EA] py-2 transition-colors cursor-pointer"
              >
                <span>For Travellers</span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeDropdown === "travelers" ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {activeDropdown === "travelers" && (
                <div className="absolute top-full left-0 w-84 mt-2 bg-white dark:bg-[#1A1B20] rounded-2xl shadow-xl border border-[#E7E3DC] dark:border-[#26272D] p-3 space-y-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <a
                    href="#adaptive-replanning"
                    onClick={() => setActiveDropdown(null)}
                    className="block p-3 rounded-xl hover:bg-[#FAF8F5] dark:hover:bg-[#23242A] transition-colors"
                  >
                    <div className="font-medium text-[#18181B] dark:text-[#F4F1EA] text-sm">First-Time & Solo Travellers</div>
                    <div className="text-xs text-[#71717A] dark:text-[#A1A1AA] mt-0.5 leading-normal font-light">
                      Confidence in unfamiliar destinations with verified routes and fair fares.
                    </div>
                  </a>
                  <a
                    href="#senior-accompaniment"
                    onClick={() => setActiveDropdown(null)}
                    className="block p-3 rounded-xl hover:bg-[#FAF8F5] dark:hover:bg-[#23242A] transition-colors"
                  >
                    <div className="font-medium text-[#18181B] dark:text-[#F4F1EA] text-sm">Senior Citizens & Families</div>
                    <div className="text-xs text-[#71717A] dark:text-[#A1A1AA] mt-0.5 leading-normal font-light">
                      Eliminate mobile screen hurdles through dedicated human accompaniment.
                    </div>
                  </a>
                  <a
                    href="#fare-budget"
                    onClick={() => setActiveDropdown(null)}
                    className="block p-3 rounded-xl hover:bg-[#FAF8F5] dark:hover:bg-[#23242A] transition-colors"
                  >
                    <div className="font-medium text-[#18181B] dark:text-[#F4F1EA] text-sm">Budget-Conscious Explorers</div>
                    <div className="text-xs text-[#71717A] dark:text-[#A1A1AA] mt-0.5 leading-normal font-light">
                      Eliminate price gouging and keep daily spending disciplined.
                    </div>
                  </a>
                </div>
              )}
            </div>

            {/* Parent 3: Plans */}
            <div className="relative">
              <button
                onClick={() => setActiveDropdown(activeDropdown === "plans" ? null : "plans")}
                className="flex items-center gap-1.5 hover:text-[#18181B] dark:hover:text-[#F4F1EA] py-2 transition-colors cursor-pointer"
              >
                <span>Plans</span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeDropdown === "plans" ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {activeDropdown === "plans" && (
                <div className="absolute top-full left-0 w-80 mt-2 bg-white dark:bg-[#1A1B20] rounded-2xl shadow-xl border border-[#E7E3DC] dark:border-[#26272D] p-3 space-y-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <a
                    href="#plans-section"
                    onClick={() => setActiveDropdown(null)}
                    className="block p-3 rounded-xl hover:bg-[#FAF8F5] dark:hover:bg-[#23242A] transition-colors"
                  >
                    <div className="font-medium text-[#18181B] dark:text-[#F4F1EA] text-sm">Free Explorer</div>
                    <div className="text-xs text-[#71717A] dark:text-[#A1A1AA] mt-0.5 leading-normal font-light">
                      Personalized travel plans and ambient conversational assistance.
                    </div>
                  </a>
                  <a
                    href="#plans-section"
                    onClick={() => setActiveDropdown(null)}
                    className="block p-3 rounded-xl hover:bg-[#FAF8F5] dark:hover:bg-[#23242A] transition-colors"
                  >
                    <div className="font-medium text-[#18181B] dark:text-[#F4F1EA] text-sm">Pro Suite</div>
                    <div className="text-xs text-[#71717A] dark:text-[#A1A1AA] mt-0.5 leading-normal font-light">
                      Automatic plan refreshes, local transport fare ideas, and priority recommendations.
                    </div>
                  </a>
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              className="p-2.5 rounded-full text-[#52525B] hover:text-[#18181B] dark:text-[#A1A1AA] dark:hover:text-[#F4F1EA] hover:bg-[#F0ECE1] dark:hover:bg-[#1E2026] border border-transparent hover:border-[#E7E3DC] dark:hover:border-[#26272D] transition-colors cursor-pointer"
            >
              {isDarkMode ? (
                /* Sun Icon */
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                /* Moon Icon */
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>

            {/* User Account Dropdown / Auth Buttons */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#E7E3DC] dark:border-[#26272D] bg-white dark:bg-[#1A1B20] shadow-sm hover:border-[#C84B26] transition-colors cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-[#C84B26] text-white flex items-center justify-center font-mono text-[11px] font-bold uppercase">
                    {currentUser.fullName ? currentUser.fullName[0] : "U"}
                  </div>
                  <span className="text-xs font-mono font-medium text-[#18181B] dark:text-[#F4F1EA]">
                    @{currentUser.username}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FAF8F5] dark:bg-[#121316] text-[#71717A] dark:text-[#A1A1AA] border border-[#E7E3DC] dark:border-[#26272D] uppercase">
                    {currentUser.tier}
                  </span>
                  <svg
                    className={`w-3.5 h-3.5 text-[#71717A] transition-transform duration-200 ${
                      userMenuOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#1A1B20] rounded-2xl shadow-xl border border-[#E7E3DC] dark:border-[#26272D] p-1.5 z-50 text-xs font-mono">
                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-3 py-2 rounded-xl text-[#18181B] dark:text-[#F4F1EA] hover:bg-[#FAF8F5] dark:hover:bg-[#25272F] transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/account-info"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-3 py-2 rounded-xl text-[#18181B] dark:text-[#F4F1EA] hover:bg-[#FAF8F5] dark:hover:bg-[#25272F] transition-colors"
                    >
                      Account Info
                    </Link>
                    <div className="my-1 border-t border-[#E7E3DC] dark:border-[#26272D]" />
                    <button
                      onClick={async () => {
                        await logoutUser();
                        setCurrentUser(null);
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setAuthMode("login");
                    setAuthModalOpen(true);
                  }}
                  className="hidden sm:inline-block px-3.5 py-2 text-sm font-medium text-[#52525B] hover:text-[#18181B] dark:text-[#A1A1AA] dark:hover:text-[#F4F1EA] transition-colors cursor-pointer"
                >
                  Log in
                </button>

                <button
                  onClick={() => {
                    setAuthMode("signup");
                    setAuthModalOpen(true);
                  }}
                  className="px-5 py-2.5 rounded-full bg-[#18181B] text-white hover:bg-[#C84B26] dark:bg-[#F4F1EA] dark:text-[#121316] dark:hover:bg-[#E05A32] dark:hover:text-white text-xs font-semibold tracking-wide transition-colors shadow-sm cursor-pointer"
                >
                  Sign up
                </button>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#18181B] dark:text-[#F4F1EA] focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#E7E3DC] dark:border-[#26272D] bg-white dark:bg-[#1A1B20] px-6 py-4 space-y-3">
            <a
              href="#adaptive-replanning"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-[#18181B] dark:text-[#F4F1EA]"
            >
              Adaptive Plan Refresh
            </a>
            <a
              href="#traffic-analysis"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-[#18181B] dark:text-[#F4F1EA]"
            >
              Real-Time Traffic Analysis
            </a>
            <a
              href="#fare-budget"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-[#18181B] dark:text-[#F4F1EA]"
            >
              Cab & Auto Fare Budget
            </a>
            <a
              href="#expense-tracker"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-[#18181B] dark:text-[#F4F1EA]"
            >
              In-Trip Expense Tracker
            </a>
            <a
              href="#guide-allotment"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-[#18181B] dark:text-[#F4F1EA]"
            >
              Senior Guide Allotment
            </a>
            <a
              href="#plans-section"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-[#18181B] dark:text-[#F4F1EA]"
            >
              Free & Pro Plans
            </a>
            <div className="pt-3 border-t border-[#E7E3DC] dark:border-[#26272D] flex items-center justify-between">
              <span className="text-xs font-medium text-[#52525B] dark:text-[#A1A1AA]">Appearance</span>
              <button
                onClick={toggleTheme}
                className="text-xs font-mono px-3 py-1.5 rounded-lg border border-[#E7E3DC] dark:border-[#26272D] text-[#18181B] dark:text-[#F4F1EA]"
              >
                {isDarkMode ? "Light Mode" : "Dark Mode"}
              </button>
            </div>
            <div className="pt-2 flex items-center gap-3">
              {currentUser ? (
                <div className="w-full flex items-center justify-between p-2 rounded-xl bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D]">
                  <span className="text-xs font-mono font-medium text-[#18181B] dark:text-[#F4F1EA]">
                    @{currentUser.username}
                  </span>
                  <button
                    onClick={async () => {
                      await logoutUser();
                      setCurrentUser(null);
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs text-[#C84B26] font-medium"
                  >
                    Log out
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setAuthMode("login");
                      setAuthModalOpen(true);
                    }}
                    className="w-1/2 py-2.5 text-center text-xs font-medium text-[#18181B] dark:text-[#F4F1EA] border border-[#E7E3DC] dark:border-[#26272D] rounded-full"
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setAuthMode("signup");
                      setAuthModalOpen(true);
                    }}
                    className="w-1/2 py-2.5 text-center text-xs font-semibold text-white bg-[#18181B] dark:bg-[#F4F1EA] dark:text-[#121316] rounded-full"
                  >
                    Sign up
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* MAIN HOMEPAGE CONTENT */}
      <main className="flex-1">
        {/* HERO SECTION WITH IMMERSIVE CINEMATIC PHOTOGRAPHY & INTEGRATED TRIP SEARCH */}
        <HeroSection
          onInitiatePlan={handleInitiatePlan}
          selectedDestination={selectedDestination}
        />

        {/* SECTION DIVIDER */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="h-px bg-[#E7E3DC] dark:bg-[#26272D]" />
        </div>

        {/* EDITORIAL DESTINATION DISCOVERY SHOWCASE */}
        <DestinationShowcase
          onSelectDestination={(destName) => {
            setSelectedDestination(destName);
            const searchBox = document.getElementById("trip-search-box");
            if (searchBox) {
              searchBox.scrollIntoView({ behavior: "smooth" });
            }
          }}
        />

        {/* SECTION DIVIDER */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="h-px bg-[#E7E3DC] dark:bg-[#26272D]" />
        </div>

        {/* PRODUCT CAPABILITIES: ADAPTIVE ITINERARIES, TRAFFIC, FARES, EXPENSES, GUIDES, SENIOR CARE */}
        <CapabilitiesShowcase />

        {/* SECTION DIVIDER */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="h-px bg-[#E7E3DC] dark:bg-[#26272D]" />
        </div>

        {/* HOW IT WORKS: 3-STEP EDITORIAL FLOW */}
        <HowItWorks />

        {/* SECTION DIVIDER */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="h-px bg-[#E7E3DC] dark:bg-[#26272D]" />
        </div>

        {/* PRICING PREVIEW: FREE EXPLORER & PRO SUITE */}
        <PricingPreview onSelectPlan={handleSelectPlan} />
      </main>

      {/* REFINED EDITORIAL FOOTER */}
      <HomeFooter />

      {/* AUTH MODAL */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(profile) => {
          setCurrentUser(profile);
          setAuthModalOpen(false);
          // If there was a draft trip saved, navigate directly to dashboard
          if (localStorage.getItem("lessgooo_draft_trip")) {
            router.push("/dashboard?view=new-trip");
          }
        }}
      />
    </div>
  );
}
