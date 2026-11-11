"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import {
  client,
  getCachedUserProfile,
  getCurrentUserProfile,
  logoutUser,
  type UserProfile,
} from "@/lib/appwrite";
import AuthModal from "@/components/AuthModal";
import LandingNavbar from "@/components/landing/LandingNavbar";
import HeroSection from "@/components/landing/HeroSection";
import VaranasiAtlasSection from "@/components/landing/VaranasiAtlasSection";
import AdaptiveTimelineSection from "@/components/landing/AdaptiveTimelineSection";
import FareShieldSection from "@/components/landing/FareShieldSection";
import ExpenseJournalSection from "@/components/landing/ExpenseJournalSection";
import HumanCompanionshipSection from "@/components/landing/HumanCompanionshipSection";
import MembershipPassesSection from "@/components/landing/MembershipPassesSection";
import FinalInvitationFooter from "@/components/landing/FinalInvitationFooter";

const THEME_EVENT = "lessgooo-theme-change";

function subscribeTheme(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener(THEME_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(THEME_EVENT, callback);
  };
}

function getThemeSnapshot(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem("lessgooo-theme") !== "light";
}

function getServerThemeSnapshot(): boolean {
  return true;
}

export default function Home() {
  // Default to Nocturnal Obsidian (#0A0D14) unless user explicitly opted into Daylight Vellum ("light")
  const isDarkMode = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerThemeSnapshot
  );
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [backendStatus, setBackendStatus] = useState<
    "checking" | "connected" | "error"
  >("checking");

  // Synchronize external root HTML class with current theme preference
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    let active = true;

    client
      .ping()
      .then(() => {
        if (active) setBackendStatus("connected");
      })
      .catch(() => {
        if (active) setBackendStatus("error");
      });

    Promise.resolve()
      .then(() => {
        const cachedUser = getCachedUserProfile();
        if (active && cachedUser) {
          setCurrentUser(cachedUser);
        }
        return getCurrentUserProfile();
      })
      .then((res) => {
        if (!active) return;
        if (res?.profile) {
          setCurrentUser(res.profile);
        } else {
          setCurrentUser(null);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const toggleTheme = () => {
    const next = !isDarkMode;
    localStorage.setItem("lessgooo-theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
    window.dispatchEvent(new Event(THEME_EVENT));
  };

  const handleOpenAuthModal = (mode: "login" | "signup") => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
  };

  return (
    <div className="atlas-editorial-root atlas-grain min-h-screen bg-[var(--atlas-bg)] text-[var(--atlas-text)] transition-colors duration-300">
      {/* Skip-to-content accessibility link */}
      <a
        href="#destination-atlas"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#FF5A26] focus:text-[#F3EEE5] focus:font-mono focus:text-xs"
      >
        Skip to Varanasi Living Atlas
      </a>

      {/* Refined Transparent-to-Material Navigation */}
      <LandingNavbar
        darkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAuthModal={handleOpenAuthModal}
      />

      {/* Main Narrative Editorial Sequence (Sections A through H) */}
      <main>
        {/* Section A: Full-Bleed Magazine Cover Hero */}
        <HeroSection
          currentUser={currentUser}
          onOpenAuthModal={handleOpenAuthModal}
        />

        {/* Section B: Varanasi Interactive Cartography */}
        <VaranasiAtlasSection />

        {/* Section C: Adaptive Journey Chronometer */}
        <AdaptiveTimelineSection />

        {/* Section D: Perforated Transit Fare Shield */}
        <FareShieldSection />

        {/* Section E: Tactile Travel Expense Journal */}
        <ExpenseJournalSection />

        {/* Section F: Human Companionship & Senior Companion Care */}
        <HumanCompanionshipSection />

        {/* Section G: Embossed Traveller Credentials & Passes */}
        <MembershipPassesSection
          currentUser={currentUser}
          onOpenAuthModal={handleOpenAuthModal}
        />

        {/* Section H: Atmospheric Nocturnal Closing & Colophon */}
        <FinalInvitationFooter
          currentUser={currentUser}
          backendStatus={backendStatus}
          onOpenAuthModal={handleOpenAuthModal}
        />
      </main>

      {/* Existing Appwrite Authentication Modal */}
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
