"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { client, getCurrentUserProfile, logoutUser, UserProfile } from "@/lib/appwrite";
import AuthModal from "@/components/AuthModal";

export default function Home() {
  const [activeDropdown, setActiveDropdown] = useState<"features" | "travelers" | "plans" | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // Initialize theme from localStorage or system preference and check user session
  useEffect(() => {
    // Ping Appwrite once on start
    client.ping().then((res) => {
      console.log("Appwrite ping response:", res);
    }).catch((err) => {
      console.log("Appwrite ping response:", err);
    });

    // Check active session
    getCurrentUserProfile().then((res) => {
      if (res?.profile) {
        setCurrentUser(res.profile);
      }
    });

    const savedTheme = localStorage.getItem("lessgooo-theme");
    if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

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

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#18181B] dark:bg-[#121316] dark:text-[#F4F1EA] selection:bg-[#C84B26] selection:text-white transition-colors duration-150">
      {/* TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-50 bg-[#FAF8F5]/90 dark:bg-[#121316]/90 backdrop-blur-md border-b border-[#E7E3DC] dark:border-[#26272D] transition-colors">
        <div ref={navRef} className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Brand Wordmark */}
          <a href="#" className="flex items-center gap-2 group">
            <span className="font-serif text-2xl font-semibold tracking-tight text-[#18181B] dark:text-[#F4F1EA] group-hover:text-[#C84B26] dark:group-hover:text-[#E05A32] transition-colors">
              LessGooo
            </span>
          </a>

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
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === "features" ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {activeDropdown === "features" && (
                <div className="absolute top-full left-0 w-80 mt-2 bg-white dark:bg-[#1A1B20] rounded-2xl shadow-xl border border-[#E7E3DC] dark:border-[#26272D] p-3 space-y-1">
                  <a
                    href="#adaptive-replanning"
                    onClick={() => setActiveDropdown(null)}
                    className="block p-3 rounded-xl hover:bg-[#FAF8F5] dark:hover:bg-[#23242A] transition-colors"
                  >
                    <div className="font-medium text-[#18181B] dark:text-[#F4F1EA] text-sm">Adaptive Plan Refresh</div>
                    <div className="text-xs text-[#71717A] dark:text-[#A1A1AA] mt-0.5 leading-normal">
                      Dynamic recalculation when delays or extended stays occur.
                    </div>
                  </a>
                  <a
                    href="#fare-budget"
                    onClick={() => setActiveDropdown(null)}
                    className="block p-3 rounded-xl hover:bg-[#FAF8F5] dark:hover:bg-[#23242A] transition-colors"
                  >
                    <div className="font-medium text-[#18181B] dark:text-[#F4F1EA] text-sm">Cab & Auto Fare Budget</div>
                    <div className="text-xs text-[#71717A] dark:text-[#A1A1AA] mt-0.5 leading-normal">
                      Estimated transport spending ranges to prevent overpaying.
                    </div>
                  </a>
                  <a
                    href="#expense-tracker"
                    onClick={() => setActiveDropdown(null)}
                    className="block p-3 rounded-xl hover:bg-[#FAF8F5] dark:hover:bg-[#23242A] transition-colors"
                  >
                    <div className="font-medium text-[#18181B] dark:text-[#F4F1EA] text-sm">In-Trip Expense Tracker</div>
                    <div className="text-xs text-[#71717A] dark:text-[#A1A1AA] mt-0.5 leading-normal">
                      Live daily budget tracking and categorized spend breakdowns.
                    </div>
                  </a>
                  <a
                    href="#guide-allotment"
                    onClick={() => setActiveDropdown(null)}
                    className="block p-3 rounded-xl hover:bg-[#FAF8F5] dark:hover:bg-[#23242A] transition-colors"
                  >
                    <div className="font-medium text-[#18181B] dark:text-[#F4F1EA] text-sm">Guide Allotment</div>
                    <div className="text-xs text-[#71717A] dark:text-[#A1A1AA] mt-0.5 leading-normal">
                      Direct hiring of verified local guides for senior accessibility.
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
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === "travelers" ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {activeDropdown === "travelers" && (
                <div className="absolute top-full left-0 w-80 mt-2 bg-white dark:bg-[#1A1B20] rounded-2xl shadow-xl border border-[#E7E3DC] dark:border-[#26272D] p-3 space-y-1">
                  <a
                    href="#travelers-first-time"
                    onClick={() => setActiveDropdown(null)}
                    className="block p-3 rounded-xl hover:bg-[#FAF8F5] dark:hover:bg-[#23242A] transition-colors"
                  >
                    <div className="font-medium text-[#18181B] dark:text-[#F4F1EA] text-sm">First-Time & Solo Travellers</div>
                    <div className="text-xs text-[#71717A] dark:text-[#A1A1AA] mt-0.5 leading-normal">
                      Confidence in unfamiliar destinations with verified routes and fair fares.
                    </div>
                  </a>
                  <a
                    href="#guide-allotment"
                    onClick={() => setActiveDropdown(null)}
                    className="block p-3 rounded-xl hover:bg-[#FAF8F5] dark:hover:bg-[#23242A] transition-colors"
                  >
                    <div className="font-medium text-[#18181B] dark:text-[#F4F1EA] text-sm">Senior Citizens & Families</div>
                    <div className="text-xs text-[#71717A] dark:text-[#A1A1AA] mt-0.5 leading-normal">
                      Eliminate mobile screen hurdles through dedicated human guide booking.
                    </div>
                  </a>
                  <a
                    href="#fare-budget"
                    onClick={() => setActiveDropdown(null)}
                    className="block p-3 rounded-xl hover:bg-[#FAF8F5] dark:hover:bg-[#23242A] transition-colors"
                  >
                    <div className="font-medium text-[#18181B] dark:text-[#F4F1EA] text-sm">Budget-Conscious Explorers</div>
                    <div className="text-xs text-[#71717A] dark:text-[#A1A1AA] mt-0.5 leading-normal">
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
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === "plans" ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {activeDropdown === "plans" && (
                <div className="absolute top-full left-0 w-80 mt-2 bg-white dark:bg-[#1A1B20] rounded-2xl shadow-xl border border-[#E7E3DC] dark:border-[#26272D] p-3 space-y-1">
                  <a
                    href="#plans-section"
                    onClick={() => setActiveDropdown(null)}
                    className="block p-3 rounded-xl hover:bg-[#FAF8F5] dark:hover:bg-[#23242A] transition-colors"
                  >
                    <div className="font-medium text-[#18181B] dark:text-[#F4F1EA] text-sm">Free Explorer</div>
                    <div className="text-xs text-[#71717A] dark:text-[#A1A1AA] mt-0.5 leading-normal">
                      Personalized travel plans and conversational assistance with Flash Lite.
                    </div>
                  </a>
                  <a
                    href="#plans-section"
                    onClick={() => setActiveDropdown(null)}
                    className="block p-3 rounded-xl hover:bg-[#FAF8F5] dark:hover:bg-[#23242A] transition-colors"
                  >
                    <div className="font-medium text-[#18181B] dark:text-[#F4F1EA] text-sm">Pro Suite</div>
                    <div className="text-xs text-[#71717A] dark:text-[#A1A1AA] mt-0.5 leading-normal">
                      Automatic plan refreshes, local transport fare ideas, and priority recommendations.
                    </div>
                  </a>
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Controls: Dark/Light Mode Toggle + Log In (Regular) + Sign Up (Emphasized) */}
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                /* Moon Icon */
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* User Profile or Login/Signup */}
            {currentUser ? (
              <div className="flex items-center gap-3">
                <a
                  href="/dashboard"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#E7E3DC] dark:border-[#26272D] bg-white dark:bg-[#1A1B20] shadow-sm hover:border-[#C84B26] transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-[#C84B26] text-white flex items-center justify-center font-mono text-[11px] font-bold uppercase">
                    {currentUser.fullName ? currentUser.fullName[0] : "T"}
                  </div>
                  <span className="text-xs font-mono font-medium text-[#18181B] dark:text-[#F4F1EA]">
                    @{currentUser.username}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FAF8F5] dark:bg-[#121316] text-[#71717A] dark:text-[#A1A1AA] border border-[#E7E3DC] dark:border-[#26272D] uppercase">
                    {currentUser.tier}
                  </span>
                </a>
                <a
                  href="/dashboard"
                  className="hidden sm:inline-block px-3 py-1.5 rounded-full bg-[#18181B] text-white dark:bg-[#F4F1EA] dark:text-[#121316] text-xs font-mono uppercase font-semibold hover:bg-[#C84B26] dark:hover:bg-[#E05A32] dark:hover:text-white transition-colors"
                >
                  Dashboard
                </a>
                <button
                  onClick={async () => {
                    await logoutUser();
                    setCurrentUser(null);
                  }}
                  className="text-xs font-medium text-[#71717A] hover:text-[#C84B26] dark:text-[#A1A1AA] dark:hover:text-[#E05A32] transition-colors cursor-pointer"
                >
                  Log out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {/* Log In Button (Regular) */}
                <a
                  href="/login"
                  className="hidden sm:inline-block px-3.5 py-2 text-sm font-medium text-[#52525B] hover:text-[#18181B] dark:text-[#A1A1AA] dark:hover:text-[#F4F1EA] transition-colors cursor-pointer"
                >
                  Log in
                </a>

                {/* Sign Up Button (Emphasized) */}
                <a
                  href="/login"
                  className="px-5 py-2.5 rounded-full bg-[#18181B] text-white hover:bg-[#C84B26] dark:bg-[#F4F1EA] dark:text-[#121316] dark:hover:bg-[#E05A32] dark:hover:text-white text-xs font-semibold tracking-wide transition-colors shadow-sm cursor-pointer"
                >
                  Sign up
                </a>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#18181B] dark:text-[#F4F1EA] focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#E7E3DC] dark:border-[#26272D] bg-white dark:bg-[#1A1B20] px-6 py-4 space-y-3">
            <a href="#adaptive-replanning" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-[#18181B] dark:text-[#F4F1EA]">
              Adaptive Plan Refresh
            </a>
            <a href="#fare-budget" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-[#18181B] dark:text-[#F4F1EA]">
              Cab & Auto Fare Budget
            </a>
            <a href="#expense-tracker" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-[#18181B] dark:text-[#F4F1EA]">
              In-Trip Expense Tracker
            </a>
            <a href="#guide-allotment" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-[#18181B] dark:text-[#F4F1EA]">
              Senior Guide Allotment
            </a>
            <a href="#plans-section" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-[#18181B] dark:text-[#F4F1EA]">
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
                  <a
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-1/2 py-2.5 text-center text-xs font-medium text-[#18181B] dark:text-[#F4F1EA] border border-[#E7E3DC] dark:border-[#26272D] rounded-full"
                  >
                    Log in
                  </a>
                  <a
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-1/2 py-2.5 text-center text-xs font-semibold text-white bg-[#18181B] dark:bg-[#F4F1EA] dark:text-[#121316] rounded-full"
                  >
                    Sign up
                  </a>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="pt-20 pb-28 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Editorial Headline & Value Narrative */}
          <div className="lg:col-span-7 space-y-8">
            <span className="text-xs uppercase tracking-widest font-mono text-[#C84B26] dark:text-[#E05A32]">
              Adaptive Travel Intelligence
            </span>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.14] text-[#18181B] dark:text-[#F4F1EA]">
              Travel changes on the ground. Your plan should adapt in real time.
            </h1>

            <p className="text-base sm:text-lg text-[#52525B] dark:text-[#A1A1AA] leading-relaxed max-w-xl font-light">
              LessGooo transforms travel planning into an adaptive journey. When traffic builds or you linger longer at an attraction, your day automatically recalculates. Get realistic transport budgets for cabs and autos, track expenses as you go, and hire verified local guides for elderly companions.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#adaptive-replanning"
                className="px-7 py-3.5 rounded-full bg-[#C84B26] dark:bg-[#E05A32] text-white text-sm font-medium hover:bg-[#B33F1D] dark:hover:bg-[#C84B26] transition-colors"
              >
                Explore Capabilities
              </a>
              <a
                href="#plans-section"
                className="px-7 py-3.5 rounded-full border border-[#D4CEC3] dark:border-[#383A42] bg-white dark:bg-[#1A1B20] text-[#18181B] dark:text-[#F4F1EA] text-sm font-medium hover:bg-[#F3EFEA] dark:hover:bg-[#25272F] transition-colors"
              >
                View Plans
              </a>
            </div>
          </div>

          {/* Right Column: Hero Artwork */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-[#E7E3DC] dark:border-[#26272D] bg-[#FAF8F5] dark:bg-[#1A1B20]">
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src="/hero-illustration.jpg"
                  alt="Atmospheric travel illustration of historic riverfront steps and lanterns at dusk"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION DIVIDER */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="h-px bg-[#E7E3DC] dark:bg-[#26272D]" />
      </div>

      {/* BODY SECTION 1: ADAPTIVE TRAFFIC & DWELL REPLANNING */}
      <section id="adaptive-replanning" className="py-28 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs uppercase tracking-widest font-mono text-[#C84B26] dark:text-[#E05A32]">
              Real-Time Rebalancing
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#18181B] dark:text-[#F4F1EA] leading-snug">
              Stay longer where you love. The schedule updates on its own.
            </h2>
            <p className="text-sm sm:text-base text-[#52525B] dark:text-[#A1A1AA] leading-relaxed font-light">
              Fixed itineraries break whenever spontaneous delays occur or traffic slows down transit. When you spend extra time at any site, LessGooo analyzes the elapsed time and local conditions to automatically generate a refreshed, realistic route without missed reservations or unnecessary rush.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-7 rounded-2xl bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] shadow-sm space-y-3">
              <span className="font-mono text-xs text-[#C84B26] dark:text-[#E05A32] uppercase tracking-wider block">01 / Dwell Detection</span>
              <h3 className="font-serif text-xl text-[#18181B] dark:text-[#F4F1EA]">Unrushed Exploration</h3>
              <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
                Enjoy unexpected street discoveries, cultural exchanges, or prolonged visits without manually restructuring the remainder of your day.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] shadow-sm space-y-3">
              <span className="font-mono text-xs text-[#C84B26] dark:text-[#E05A32] uppercase tracking-wider block">02 / Traffic Analysis</span>
              <h3 className="font-serif text-xl text-[#18181B] dark:text-[#F4F1EA]">Dynamic Restructuring</h3>
              <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
                When ground congestion slows down transfers between points of interest, downstream stops are reordered logically to save transit hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION DIVIDER */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="h-px bg-[#E7E3DC] dark:bg-[#26272D]" />
      </div>

      {/* BODY SECTION 2: CAB & AUTO FARE SPENDING BUDGET */}
      <section id="fare-budget" className="py-28 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs uppercase tracking-widest font-mono text-[#C84B26] dark:text-[#E05A32]">
              Transit Transparency
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#18181B] dark:text-[#F4F1EA] leading-snug">
              Estimated fare ideas for cabs, autos, and local transport.
            </h2>
            <p className="text-sm sm:text-base text-[#52525B] dark:text-[#A1A1AA] leading-relaxed font-light">
              Navigating unfamiliar cities often involves confusing transport fares and tourist markups. Whenever you need a cab, auto-rickshaw, or regional ride, LessGooo supplies a realistic spending budget so you know what is reasonable before stepping in.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-7 rounded-2xl bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] shadow-sm space-y-3">
              <span className="font-mono text-xs text-[#C84B26] dark:text-[#E05A32] uppercase tracking-wider block">Budget Protection</span>
              <h3 className="font-serif text-xl text-[#18181B] dark:text-[#F4F1EA]">Realistic Fare Ideas</h3>
              <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
                Gain upfront insight into fair per-kilometer and route-based estimates across regional transport modes before initiating trips.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] shadow-sm space-y-3">
              <span className="font-mono text-xs text-[#C84B26] dark:text-[#E05A32] uppercase tracking-wider block">Local Mobility</span>
              <h3 className="font-serif text-xl text-[#18181B] dark:text-[#F4F1EA]">Multi-Modal Suggestions</h3>
              <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
                Receive practical advice on whether walking, an auto-rickshaw, a cab, or local ferries best suit your specific route conditions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION DIVIDER */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="h-px bg-[#E7E3DC] dark:bg-[#26272D]" />
      </div>

      {/* BODY SECTION 3: IN-TRIP EXPENSE TRACKER */}
      <section id="expense-tracker" className="py-28 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs uppercase tracking-widest font-mono text-[#C84B26] dark:text-[#E05A32]">
              Budget Discipline
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#18181B] dark:text-[#F4F1EA] leading-snug">
              An effortless expense tracker built directly into the journey.
            </h2>
            <p className="text-sm sm:text-base text-[#52525B] dark:text-[#A1A1AA] leading-relaxed font-light">
              Avoid losing track of daily disbursements, group meal bills, and incidental purchases. Log expenses with quick categorizations, monitor your daily spend pace, and keep your total holiday budget intact without tedious manual sheets.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-7 rounded-2xl bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] shadow-sm space-y-3">
              <span className="font-mono text-xs text-[#C84B26] dark:text-[#E05A32] uppercase tracking-wider block">Spend Tracking</span>
              <h3 className="font-serif text-xl text-[#18181B] dark:text-[#F4F1EA]">Rapid Categorization</h3>
              <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
                Tag expenditures by transport, meals, activities, and local crafts in seconds while keeping momentum on the road.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] shadow-sm space-y-3">
              <span className="font-mono text-xs text-[#C84B26] dark:text-[#E05A32] uppercase tracking-wider block">Daily Limits</span>
              <h3 className="font-serif text-xl text-[#18181B] dark:text-[#F4F1EA]">Remaining Budget Pace</h3>
              <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
                Clear daily indicators show whether you are trending under or over your planned threshold, allowing timely adjustments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION DIVIDER */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="h-px bg-[#E7E3DC] dark:bg-[#26272D]" />
      </div>

      {/* BODY SECTION 4: SENIOR CITIZEN GUIDE ALLOTMENT */}
      <section id="guide-allotment" className="py-28 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs uppercase tracking-widest font-mono text-[#C84B26] dark:text-[#E05A32]">
              Human Accompaniment
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#18181B] dark:text-[#F4F1EA] leading-snug">
              Allotment and hiring of verified local guides for senior citizens.
            </h2>
            <p className="text-sm sm:text-base text-[#52525B] dark:text-[#A1A1AA] leading-relaxed font-light">
              Senior travellers and multi-generational families often encounter difficulties navigating digital screens and dense pedestrian alleys. LessGooo enables easy hiring and direct allotment of vetted local guides who assist with on-ground orientation, pacing, and comfort.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-7 rounded-2xl bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] shadow-sm space-y-3">
              <span className="font-mono text-xs text-[#C84B26] dark:text-[#E05A32] uppercase tracking-wider block">Human Guide Allotment</span>
              <h3 className="font-serif text-xl text-[#18181B] dark:text-[#F4F1EA]">Verified Local Accompaniment</h3>
              <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
                Connect with background-checked local guides who understand accessibility, step-free access routes, and comfortable walking cadences.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] shadow-sm space-y-3">
              <span className="font-mono text-xs text-[#C84B26] dark:text-[#E05A32] uppercase tracking-wider block">Family Peace of Mind</span>
              <h3 className="font-serif text-xl text-[#18181B] dark:text-[#F4F1EA]">Zero Screen Burden</h3>
              <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
                Elderly travellers do not need to decipher complicated interfaces; their assigned guide handles physical coordination directly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION DIVIDER */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="h-px bg-[#E7E3DC] dark:bg-[#26272D]" />
      </div>

      {/* BODY SECTION 5: PLANS SECTION */}
      <section id="plans-section" className="py-28 px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-widest font-mono text-[#C84B26] dark:text-[#E05A32]">
            Plan Options
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#18181B] dark:text-[#F4F1EA]">
            Choose how you travel.
          </h2>
          <p className="text-sm text-[#52525B] dark:text-[#A1A1AA] font-light">
            Flexible choices for casual weekend getaways or fully dynamic multi-day trips.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="p-8 rounded-2xl bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] shadow-sm space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase text-[#71717A] dark:text-[#A1A1AA] tracking-wider block">Base Plan</span>
              <h3 className="font-serif text-2xl text-[#18181B] dark:text-[#F4F1EA]">Free Explorer</h3>
              <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">Ideal for initial route structuring and quick advice</p>
            </div>

            <ul className="space-y-3 text-xs text-[#52525B] dark:text-[#A1A1AA]">
              <li className="flex items-start gap-2.5">
                <span className="text-[#C84B26] dark:text-[#E05A32] font-bold">—</span>
                <span>Personalized trip itineraries built from your interests and duration</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#C84B26] dark:text-[#E05A32] font-bold">—</span>
                <span>AI model chat powered by <strong>Flash Lite</strong> for rapid Q&A and cultural insights</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#C84B26] dark:text-[#E05A32] font-bold">—</span>
                <span>Basic expense tracker to log trip purchases</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#C84B26] dark:text-[#E05A32] font-bold">—</span>
                <span>Browse local guide directories and travel information</span>
              </li>
            </ul>

            <button className="w-full py-3 rounded-full border border-[#D4CEC3] dark:border-[#383A42] text-[#18181B] dark:text-[#F4F1EA] text-xs font-medium hover:bg-[#FAF8F5] dark:hover:bg-[#25272F] transition-colors cursor-pointer">
              Get Started Free
            </button>
          </div>

          {/* Pro Plan */}
          <div className="p-8 rounded-2xl bg-white dark:bg-[#1A1B20] border-2 border-[#18181B] dark:border-[#F4F1EA] shadow-md space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase text-[#C84B26] dark:text-[#E05A32] tracking-wider block">Full Assistance</span>
              <h3 className="font-serif text-2xl text-[#18181B] dark:text-[#F4F1EA]">Pro Suite</h3>
              <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">For travellers who require adaptive on-ground intelligence</p>
            </div>

            <ul className="space-y-3 text-xs text-[#52525B] dark:text-[#A1A1AA]">
              <li className="flex items-start gap-2.5">
                <span className="text-[#C84B26] dark:text-[#E05A32] font-bold">—</span>
                <span><strong>Auto-refresh plans</strong> that dynamically rebuild when traffic or long stays shift your timing</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#C84B26] dark:text-[#E05A32] font-bold">—</span>
                <span><strong>Recommendations & Fare Ideas</strong> for cabs, autos, and local transport</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#C84B26] dark:text-[#E05A32] font-bold">—</span>
                <span>Advanced expense runway with daily spend pace guidance</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#C84B26] dark:text-[#E05A32] font-bold">—</span>
                <span>Priority verified guide allotment and elder accompaniment coordination</span>
              </li>
            </ul>

            <button className="w-full py-3 rounded-full bg-[#18181B] text-white hover:bg-[#C84B26] dark:bg-[#F4F1EA] dark:text-[#121316] dark:hover:bg-[#E05A32] dark:hover:text-white text-xs font-medium transition-colors cursor-pointer">
              Upgrade to Pro
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#E7E3DC] dark:border-[#26272D] py-14 px-6 text-xs text-[#71717A] dark:text-[#A1A1AA]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="font-serif font-semibold text-sm text-[#18181B] dark:text-[#F4F1EA]">LessGooo</span>
            <span>•</span>
            <span>Adaptive Journey Companion</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#adaptive-replanning" className="hover:text-[#18181B] dark:hover:text-[#F4F1EA] transition-colors">Adaptive Replanning</a>
            <a href="#fare-budget" className="hover:text-[#18181B] dark:hover:text-[#F4F1EA] transition-colors">Fare Budget</a>
            <a href="#expense-tracker" className="hover:text-[#18181B] dark:hover:text-[#F4F1EA] transition-colors">Expense Tracker</a>
            <a href="#guide-allotment" className="hover:text-[#18181B] dark:hover:text-[#F4F1EA] transition-colors">Guide Allotment</a>
            <a href="#plans-section" className="hover:text-[#18181B] dark:hover:text-[#F4F1EA] transition-colors">Plans</a>
          </div>

          <div>
            © LessGooo. All rights reserved.
          </div>
        </div>
      </footer>
      {/* AUTH MODAL */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(profile) => {
          setCurrentUser(profile);
          setAuthModalOpen(false);
        }}
      />
    </div>
  );
}
