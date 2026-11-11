"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import type { UserProfile } from "@/lib/appwrite";

interface LandingNavbarProps {
  darkMode: boolean;
  onToggleTheme: () => void;
  currentUser: UserProfile | null;
  onLogout: () => Promise<void>;
  onOpenAuthModal: (mode: "login" | "signup") => void;
}

type NavMenuKey = "features" | "travellers" | "plans" | "user" | null;

export default function LandingNavbar({
  darkMode,
  onToggleTheme,
  currentUser,
  onLogout,
  onOpenAuthModal,
}: LandingNavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<NavMenuKey>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 36);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setMobileDrawerOpen(false);
      }
    };
    const handlePointerDown = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  const toggleMenu = (key: Exclude<NavMenuKey, null>) => {
    setOpenMenu((prev) => (prev === key ? null : key));
  };

  // Over the nocturnal full-bleed hero (when not scrolled), keep text warm off-white regardless of daylight/nocturnal body mode
  const overHero = !scrolled && !mobileDrawerOpen;
  const topTextClass = overHero
    ? "text-[#F3EEE5]"
    : "text-[var(--atlas-text)]";
  const mutedTopTextClass = overHero
    ? "text-[#C5BEB1] hover:text-[#F3EEE5]"
    : "text-[var(--atlas-text-secondary)] hover:text-[var(--atlas-text)]";

  return (
    <header
      ref={navRef}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled || mobileDrawerOpen
          ? "bg-[var(--atlas-bg)]/92 backdrop-blur-md border-b border-[var(--atlas-border)] shadow-[0_10px_30px_-15px_rgba(0,0,0,0.45)]"
          : "bg-gradient-to-b from-[#0A0D14]/80 via-[#0A0D14]/35 to-transparent border-b border-white/[0.07]"
      }`}
    >
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 h-[72px] flex items-center justify-between gap-4">
        {/* Brand Identity */}
        <Link
          href="/"
          className="inline-flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A26] rounded-sm"
        >
          <Logo variant="badge" size={34} />
          <span className="flex flex-col leading-none">
            <span
              className={`font-display text-[19px] tracking-[-0.02em] font-semibold transition-colors ${topTextClass}`}
            >
              LessGooo
            </span>
            <span className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-[#E5A93C] mt-1">
              Spatial Field Atlas
            </span>
          </span>
        </Link>

        {/* Desktop Editorial Menus */}
        <nav
          aria-label="Primary Editorial Navigation"
          className="hidden md:flex items-center gap-1 lg:gap-2"
        >
          {/* FEATURES MENU */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleMenu("features")}
              aria-expanded={openMenu === "features"}
              aria-haspopup="true"
              className={`px-3.5 py-2 text-[13.5px] tracking-[0.01em] inline-flex items-center gap-1.5 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A26] ${mutedTopTextClass}`}
            >
              <span>Capabilities</span>
              <svg
                className={`w-3 h-3 opacity-70 transition-transform duration-200 ${
                  openMenu === "features" ? "rotate-180 text-[#FF5A26]" : ""
                }`}
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <path d="M2.5 4.5L6 8L9.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {openMenu === "features" && (
              <div
                role="menu"
                className="absolute left-0 top-full mt-2 w-[340px] bg-[var(--atlas-surface)] border border-[var(--atlas-border-brass)] shadow-2xl p-2 z-50"
              >
                <div className="px-3 py-1.5 border-b border-[var(--atlas-border)] flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--atlas-brass)]">
                    Index // Instruments
                  </span>
                  <span className="font-mono text-[10px] text-[var(--atlas-text-muted)]">
                    01—05
                  </span>
                </div>
                {[
                  {
                    num: "01",
                    title: "Varanasi Living Cartography",
                    desc: "Six sacred waypoints, river arcs & field notes",
                    href: "#destination-atlas",
                  },
                  {
                    num: "02",
                    title: "Adaptive Journey Engine",
                    desc: "Absorbs delays while locking fixed rituals",
                    href: "#adaptive-replanning",
                  },
                  {
                    num: "03",
                    title: "Transit Fare Shield",
                    desc: "Local rickshaw, boat & cab rate dispatches",
                    href: "#fare-budget",
                  },
                  {
                    num: "04",
                    title: "Tactile Expense Ledger",
                    desc: "Planned runway vs. real street-level spend",
                    href: "#expense-tracker",
                  },
                  {
                    num: "05",
                    title: "Verified Human Companions",
                    desc: "Kashi heritage scholars & calm senior escorts",
                    href: "#guide-allotment",
                  },
                ].map((item) => (
                  <a
                    key={item.num}
                    role="menuitem"
                    href={item.href}
                    onClick={() => setOpenMenu(null)}
                    className="flex items-start gap-3 px-3 py-2.5 hover:bg-[var(--atlas-surface-elevated)] transition-colors group"
                  >
                    <span className="font-mono text-[10.5px] text-[var(--atlas-ember)] pt-0.5">
                      {item.num}
                    </span>
                    <div>
                      <div className="text-[13.5px] font-medium text-[var(--atlas-text)] group-hover:text-[var(--atlas-ember)] transition-colors">
                        {item.title}
                      </div>
                      <div className="text-[12px] text-[var(--atlas-text-muted)] leading-snug mt-0.5">
                        {item.desc}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* FOR TRAVELLERS MENU */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleMenu("travellers")}
              aria-expanded={openMenu === "travellers"}
              aria-haspopup="true"
              className={`px-3.5 py-2 text-[13.5px] tracking-[0.01em] inline-flex items-center gap-1.5 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A26] ${mutedTopTextClass}`}
            >
              <span>For Travellers</span>
              <svg
                className={`w-3 h-3 opacity-70 transition-transform duration-200 ${
                  openMenu === "travellers" ? "rotate-180 text-[#FF5A26]" : ""
                }`}
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <path d="M2.5 4.5L6 8L9.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {openMenu === "travellers" && (
              <div
                role="menu"
                className="absolute left-0 top-full mt-2 w-[320px] bg-[var(--atlas-surface)] border border-[var(--atlas-border-brass)] shadow-2xl p-2 z-50"
              >
                <div className="px-3 py-1.5 border-b border-[var(--atlas-border)]">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--atlas-brass)]">
                    Wayfarer Profiles
                  </span>
                </div>
                {[
                  {
                    title: "First-Time Visitors to Kashi",
                    desc: "Spatial orientation from Assi Ghat to Sarnath",
                    href: "#travelers-first-time",
                  },
                  {
                    title: "Senior Citizens & Parents",
                    desc: "Step-free ghat access, calm type & verified escorts",
                    href: "#guide-allotment",
                  },
                  {
                    title: "Independent & Solo Explorers",
                    desc: "Upfront local transit corridors & bargaining clarity",
                    href: "#fare-budget",
                  },
                  {
                    title: "Families & Small Collectives",
                    desc: "Shared field budget ledgers & anchored temple slots",
                    href: "#expense-tracker",
                  },
                ].map((item) => (
                  <a
                    key={item.title}
                    role="menuitem"
                    href={item.href}
                    onClick={() => setOpenMenu(null)}
                    className="block px-3 py-2.5 hover:bg-[var(--atlas-surface-elevated)] transition-colors group"
                  >
                    <div className="text-[13.5px] font-medium text-[var(--atlas-text)] group-hover:text-[var(--atlas-ember)] transition-colors">
                      {item.title}
                    </div>
                    <div className="text-[12px] text-[var(--atlas-text-muted)] leading-snug mt-0.5">
                      {item.desc}
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* MEMBERSHIP / PLANS MENU */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleMenu("plans")}
              aria-expanded={openMenu === "plans"}
              aria-haspopup="true"
              className={`px-3.5 py-2 text-[13.5px] tracking-[0.01em] inline-flex items-center gap-1.5 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A26] ${mutedTopTextClass}`}
            >
              <span>Passes</span>
              <svg
                className={`w-3 h-3 opacity-70 transition-transform duration-200 ${
                  openMenu === "plans" ? "rotate-180 text-[#FF5A26]" : ""
                }`}
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <path d="M2.5 4.5L6 8L9.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {openMenu === "plans" && (
              <div
                role="menu"
                className="absolute left-0 top-full mt-2 w-[300px] bg-[var(--atlas-surface)] border border-[var(--atlas-border-brass)] shadow-2xl p-2 z-50"
              >
                <a
                  role="menuitem"
                  href="#plans-section"
                  onClick={() => setOpenMenu(null)}
                  className="block px-3 py-2.5 hover:bg-[var(--atlas-surface-elevated)] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[13.5px] font-medium text-[var(--atlas-text)]">
                      Free Explorer Folio
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--atlas-text-muted)]">
                      ₹0 / Open
                    </span>
                  </div>
                  <p className="text-[12px] text-[var(--atlas-text-muted)] mt-0.5">
                    Spatial routing, Fare Shield & daily field ledger
                  </p>
                </a>
                <div className="ticket-perforation my-1" />
                <a
                  role="menuitem"
                  href="#plans-section"
                  onClick={() => setOpenMenu(null)}
                  className="block px-3 py-2.5 hover:bg-[var(--atlas-surface-elevated)] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[13.5px] font-medium text-[var(--atlas-brass)]">
                      LessGooo+ Brass Pass
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#FF5A26]">
                      Adaptive
                    </span>
                  </div>
                  <p className="text-[12px] text-[var(--atlas-text-muted)] mt-0.5">
                    Live drift recalibration, guide desk & Senior mode
                  </p>
                </a>
              </div>
            )}
          </div>

          <a
            href="#destination-atlas"
            className={`px-3.5 py-2 text-[13.5px] tracking-[0.01em] transition-colors ${mutedTopTextClass}`}
          >
            Varanasi Atlas
          </a>
        </nav>

        {/* Right Controls: Theme Toggle + Auth / User Credential */}
        <div className="flex items-center gap-2.5">
          {/* Theme Switcher */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={
              darkMode
                ? "Switch to Daylight Archival Folio theme"
                : "Switch to Nocturnal Obsidian theme"
            }
            title={darkMode ? "Daylight Archival Mode" : "Nocturnal Obsidian Mode"}
            className={`h-9 px-2.5 inline-flex items-center gap-2 border transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A26] ${
              overHero
                ? "border-white/15 bg-white/[0.04] text-[#F3EEE5] hover:border-[#E5A93C]/50"
                : "border-[var(--atlas-border)] bg-[var(--atlas-surface)] text-[var(--atlas-text-secondary)] hover:text-[var(--atlas-text)] hover:border-[var(--atlas-border-brass)]"
            }`}
          >
            {darkMode ? (
              <>
                <svg className="w-3.5 h-3.5 text-[#E5A93C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
                <span className="hidden xl:inline font-mono text-[10px] uppercase tracking-[0.16em]">
                  Nocturne
                </span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5 text-[#FF5A26]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
                <span className="hidden xl:inline font-mono text-[10px] uppercase tracking-[0.16em]">
                  Vellum
                </span>
              </>
            )}
          </button>

          {currentUser ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleMenu("user")}
                aria-expanded={openMenu === "user"}
                className={`h-9 pl-2.5 pr-3 inline-flex items-center gap-2 border transition-colors cursor-pointer ${
                  overHero
                    ? "border-[#E5A93C]/40 bg-[#171B24]/85 text-[#F3EEE5]"
                    : "border-[var(--atlas-border-brass)] bg-[var(--atlas-surface)] text-[var(--atlas-text)]"
                }`}
              >
                <span className="w-5 h-5 bg-[#FF5A26] text-[#F3EEE5] font-mono text-[11px] font-semibold inline-flex items-center justify-center">
                  {(currentUser.fullName || currentUser.username || "U")
                    .charAt(0)
                    .toUpperCase()}
                </span>
                <span className="font-mono text-[11.5px] tracking-tight max-w-[110px] truncate">
                  @{currentUser.username}
                </span>
              </button>

              {openMenu === "user" && (
                <div className="absolute right-0 top-full mt-2 w-60 bg-[var(--atlas-surface)] border border-[var(--atlas-border-brass)] shadow-2xl p-2 z-50">
                  <div className="px-3 py-2 border-b border-[var(--atlas-border)]">
                    <div className="text-[13px] font-semibold text-[var(--atlas-text)] truncate">
                      {currentUser.fullName || currentUser.username}
                    </div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--atlas-brass)] mt-0.5">
                      {currentUser.tier === "pro"
                        ? "LessGooo+ Passholder"
                        : "Free Explorer Folio"}
                    </div>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setOpenMenu(null)}
                    className="block px-3 py-2 text-[13px] text-[var(--atlas-text)] hover:bg-[var(--atlas-surface-elevated)] transition-colors"
                  >
                    Open Journey Studio →
                  </Link>
                  <Link
                    href="/account-info"
                    onClick={() => setOpenMenu(null)}
                    className="block px-3 py-2 text-[13px] text-[var(--atlas-text-secondary)] hover:bg-[var(--atlas-surface-elevated)] transition-colors"
                  >
                    Traveller Credentials
                  </Link>
                  <div className="ticket-perforation my-1" />
                  <button
                    type="button"
                    onClick={() => {
                      setOpenMenu(null);
                      onLogout();
                    }}
                    className="w-full text-left px-3 py-2 text-[13px] text-[#FF5A26] hover:bg-[var(--atlas-surface-elevated)] transition-colors cursor-pointer"
                  >
                    Sign out of Dispatch
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenAuthModal("login")}
                className={`px-3 py-2 text-[13px] font-medium transition-colors cursor-pointer ${mutedTopTextClass}`}
              >
                Sign in
              </button>
              <Link
                href="/login"
                className="h-9 px-4 bg-[#FF5A26] hover:bg-[#eb4d1b] text-[#F3EEE5] text-[12.5px] font-medium tracking-[0.03em] inline-flex items-center gap-2 transition-colors border border-[#FF5A26]"
              >
                <span>Issue Pass</span>
                <span className="font-mono text-[11px] opacity-85">→</span>
              </Link>
            </div>
          )}

          {/* Mobile Drawer Button */}
          <button
            type="button"
            onClick={() => setMobileDrawerOpen((prev) => !prev)}
            aria-expanded={mobileDrawerOpen}
            aria-label="Toggle navigation menu"
            className={`md:hidden h-9 w-9 inline-flex items-center justify-center border ${
              overHero
                ? "border-white/20 text-[#F3EEE5]"
                : "border-[var(--atlas-border)] text-[var(--atlas-text)]"
            }`}
          >
            {mobileDrawerOpen ? (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
              </svg>
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 7h16M4 12h16M4 17h11" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Sheet */}
      {mobileDrawerOpen && (
        <div className="md:hidden bg-[var(--atlas-surface)] border-b border-[var(--atlas-border-brass)] px-5 py-5 space-y-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--atlas-brass)]">
            Varanasi Field Index
          </div>
          <div className="grid grid-cols-1 gap-2">
            {[
              { label: "01 // Varanasi Living Atlas", href: "#destination-atlas" },
              { label: "02 // Adaptive Journey Engine", href: "#adaptive-replanning" },
              { label: "03 // Transit Fare Shield", href: "#fare-budget" },
              { label: "04 // Tactile Expense Ledger", href: "#expense-tracker" },
              { label: "05 // Human Companions & Senior Mode", href: "#guide-allotment" },
              { label: "06 // Traveller Passes", href: "#plans-section" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileDrawerOpen(false)}
                className="py-2 text-[14px] font-medium text-[var(--atlas-text)] border-b border-[var(--atlas-border)] flex items-center justify-between"
              >
                <span>{link.label}</span>
                <span className="font-mono text-[11px] text-[var(--atlas-ember)]">↘</span>
              </a>
            ))}
          </div>

          {!currentUser ? (
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setMobileDrawerOpen(false);
                  onOpenAuthModal("login");
                }}
                className="flex-1 h-10 border border-[var(--atlas-border-brass)] text-[var(--atlas-text)] text-[13px] font-medium"
              >
                Sign in
              </button>
              <Link
                href="/login"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex-1 h-10 bg-[#FF5A26] text-[#F3EEE5] text-[13px] font-medium inline-flex items-center justify-center"
              >
                Issue Pass →
              </Link>
            </div>
          ) : (
            <div className="pt-2 flex items-center gap-3">
              <Link
                href="/dashboard"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex-1 h-10 bg-[#FF5A26] text-[#F3EEE5] text-[13px] font-medium inline-flex items-center justify-center"
              >
                Open Journey Studio →
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
