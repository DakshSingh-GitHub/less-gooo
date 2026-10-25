"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getCurrentUserProfile,
  getCachedUserProfile,
  setCachedUserProfile,
  logoutUser,
  updateUserProfile,
  UserProfile
} from "@/lib/appwrite";

const INDIAN_STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Odisha",
  "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh",
  "Uttarakhand", "West Bengal", "Other"
];

export default function AccountInfoPage() {
  const router = useRouter();
  const [authChecking, setAuthChecking] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Editable Form Fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState("");

  // Status
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("lessgooo-theme");
    if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }

    // Instant Load from Cache
    const cachedUser = getCachedUserProfile();
    if (cachedUser) {
      setUser(cachedUser);
      setFullName(cachedUser.fullName || "");
      setPhone(cachedUser.phone || "");
      setState(cachedUser.state || "Uttar Pradesh");
      setAuthChecking(false);
    }

    // Background Revalidation
    getCurrentUserProfile().then((res) => {
      if (!res?.account || !res.profile) {
        setCachedUserProfile(null);
        router.replace("/login");
        return;
      }
      setUser(res.profile);
      setCachedUserProfile(res.profile);
      setFullName(res.profile.fullName || "");
      setPhone(res.profile.phone || "");
      setState(res.profile.state || "Uttar Pradesh");
      setAuthChecking(false);
    }).catch(() => {
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.userId) return;
    setStatusMessage(null);

    if (!fullName.trim() || !phone.trim()) {
      setStatusMessage({ type: "error", text: "Full Name and Phone Number are required." });
      return;
    }

    setIsSaving(true);
    try {
      const updated = await updateUserProfile(user.userId, {
        fullName: fullName.trim(),
        phone: phone.trim(),
        state: state.trim()
      });

      if (updated) {
        setUser({ ...user, ...updated });
        setStatusMessage({ type: "success", text: "Account details successfully updated." });
      } else {
        throw new Error("Unable to update profile. Please try again.");
      }
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err?.message || "Failed to update profile." });
    } finally {
      setIsSaving(false);
    }
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#121316] text-[#18181B] dark:text-[#F4F1EA] flex flex-col justify-center items-center font-mono text-xs space-y-4">
        <div className="w-8 h-8 rounded-full border-2 border-[#C84B26] border-t-transparent animate-spin" />
        <div className="text-center space-y-1">
          <span className="font-serif text-lg font-medium block">LessGooo</span>
          <span className="text-[#71717A] dark:text-[#A1A1AA]">Loading account information...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#18181B] dark:bg-[#121316] dark:text-[#F4F1EA] selection:bg-[#C84B26] selection:text-white flex flex-col transition-colors duration-150">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 h-16 bg-[#FAF8F5]/90 dark:bg-[#121316]/90 backdrop-blur-md border-b border-[#E7E3DC] dark:border-[#26272D] transition-colors">
        <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-serif text-2xl font-semibold tracking-tight hover:text-[#C84B26] transition-colors">
              LessGooo
            </Link>
            <span className="text-[#A1A1AA] text-sm">/</span>
            <span className="text-xs uppercase tracking-widest font-mono text-[#71717A] dark:text-[#A1A1AA]">
              Account Info
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2.5 rounded-full text-[#52525B] hover:text-[#18181B] dark:text-[#A1A1AA] dark:hover:text-[#F4F1EA] hover:bg-[#F0ECE1] dark:hover:bg-[#1E2026] border border-transparent hover:border-[#E7E3DC] dark:hover:border-[#26272D] transition-colors cursor-pointer"
            >
              {isDarkMode ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* User Account Dropdown (Only this is visible) */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#E7E3DC] dark:border-[#26272D] bg-white dark:bg-[#1A1B20] shadow-sm hover:border-[#C84B26] transition-colors cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-[#C84B26] text-white flex items-center justify-center font-mono text-[11px] font-bold uppercase">
                    {user.fullName ? user.fullName[0] : "U"}
                  </div>
                  <span className="text-xs font-mono font-medium text-[#18181B] dark:text-[#F4F1EA]">
                    @{user.username}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FAF8F5] dark:bg-[#121316] text-[#71717A] dark:text-[#A1A1AA] border border-[#E7E3DC] dark:border-[#26272D] uppercase">
                    {user.tier}
                  </span>
                  <svg
                    className={`w-3.5 h-3.5 text-[#71717A] transition-transform duration-200 ${userDropdownOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#1A1B20] rounded-2xl shadow-xl border border-[#E7E3DC] dark:border-[#26272D] p-1.5 z-50 text-xs font-mono">
                    <Link
                      href="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-3 py-2 rounded-xl text-[#18181B] dark:text-[#F4F1EA] hover:bg-[#FAF8F5] dark:hover:bg-[#25272F] transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/account-info"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-3 py-2 rounded-xl font-semibold text-[#C84B26] dark:text-[#E05A32] bg-[#FAF8F5] dark:bg-[#25272F]"
                    >
                      Account Info
                    </Link>
                    <div className="my-1 border-t border-[#E7E3DC] dark:border-[#26272D]" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-10">
        <div className="bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] rounded-3xl shadow-sm p-8 sm:p-10 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E7E3DC] dark:border-[#26272D]">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C84B26] dark:text-[#E05A32] block">
                Profile Management
              </span>
              <h1 className="font-serif text-3xl text-[#18181B] dark:text-[#F4F1EA]">
                Account Information
              </h1>
              <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] mt-1 font-light">
                Update your contact details and home state. Email and username are locked to safeguard your identity.
              </p>
            </div>

            <Link
              href="/dashboard"
              className="self-start sm:self-auto px-4 py-2 rounded-xl border border-[#E7E3DC] dark:border-[#26272D] text-xs font-mono uppercase text-[#71717A] hover:text-[#18181B] dark:hover:text-[#F4F1EA] transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div className={`p-4 rounded-xl text-xs font-mono flex items-center gap-2 ${
              statusMessage.type === "success"
                ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                : "bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400"
            }`}>
              <span>{statusMessage.type === "success" ? "✓" : "⚠"}</span>
              <span>{statusMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            {/* Read-Only Fields Section */}
            <div className="p-5 rounded-2xl bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D] space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717A] dark:text-[#A1A1AA] block">
                Immutable Identity (Read-Only)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Username */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-mono uppercase text-[#71717A] dark:text-[#A1A1AA]">
                      Username / Handle
                    </label>
                    <span className="text-[10px] font-mono text-[#71717A]">Locked</span>
                  </div>
                  <input
                    type="text"
                    disabled
                    value={`@${user?.username}`}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#E7E3DC] dark:border-[#26272D] bg-black/[0.03] dark:bg-white/[0.03] text-[#71717A] dark:text-[#A1A1AA] text-sm cursor-not-allowed font-mono"
                  />
                </div>

                {/* Email */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-mono uppercase text-[#71717A] dark:text-[#A1A1AA]">
                      Email Address
                    </label>
                    <span className="text-[10px] font-mono text-[#71717A]">Locked</span>
                  </div>
                  <input
                    type="email"
                    disabled
                    value={user?.email}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#E7E3DC] dark:border-[#26272D] bg-black/[0.03] dark:bg-white/[0.03] text-[#71717A] dark:text-[#A1A1AA] text-sm cursor-not-allowed font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Editable Fields Section */}
            <div className="space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#C84B26] dark:text-[#E05A32] block">
                Editable Details
              </span>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-mono uppercase text-[#71717A] dark:text-[#A1A1AA] tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Daksh Singh"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E7E3DC] dark:border-[#26272D] bg-[#FAF8F5] dark:bg-[#121316] text-[#18181B] dark:text-[#F4F1EA] text-sm focus:outline-none focus:border-[#C84B26]"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-mono uppercase text-[#71717A] dark:text-[#A1A1AA] tracking-wider mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E7E3DC] dark:border-[#26272D] bg-[#FAF8F5] dark:bg-[#121316] text-[#18181B] dark:text-[#F4F1EA] text-sm focus:outline-none focus:border-[#C84B26]"
                />
              </div>

              {/* State / Region */}
              <div>
                <label className="block text-xs font-mono uppercase text-[#71717A] dark:text-[#A1A1AA] tracking-wider mb-1">
                  State / Origin Region *
                </label>
                <div className="relative">
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full h-11 px-3.5 pr-9 rounded-xl border border-[#E7E3DC] dark:border-[#26272D] bg-[#FAF8F5] dark:bg-[#121316] text-[#18181B] dark:text-[#F4F1EA] text-sm focus:outline-none focus:border-[#C84B26] appearance-none cursor-pointer"
                  >
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s} className="bg-white dark:bg-[#1A1B20]">
                        {s}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#71717A] dark:text-[#A1A1AA]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t border-[#E7E3DC] dark:border-[#26272D] flex items-center justify-between">
              <span className="text-xs font-mono text-[#71717A] dark:text-[#A1A1AA]">
                Stored in Appwrite <code className="font-mono">users</code> table
              </span>

              <button
                type="submit"
                disabled={isSaving}
                className="px-7 py-3 rounded-xl bg-[#C84B26] hover:bg-[#B33F1D] text-white text-xs font-mono uppercase tracking-wider font-semibold shadow-sm transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
