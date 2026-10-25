"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { UserProfile } from "@/lib/appwrite";

interface DashboardNavbarProps {
  user: UserProfile | null;
  breadcrumb: string;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onLogout: () => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export default function DashboardNavbar({
  user,
  breadcrumb,
  isDarkMode,
  onToggleTheme,
  onLogout,
  sidebarOpen,
  onToggleSidebar,
}: DashboardNavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#FAF8F5]/90 dark:bg-[#121316]/90 backdrop-blur-md border-b border-[#E7E3DC] dark:border-[#26272D] transition-colors">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between">
        {/* Left: Brand Logo + Toggle Button + Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
            className="md:hidden p-2 rounded-lg text-[#71717A] hover:text-[#18181B] dark:hover:text-[#F4F1EA] hover:bg-black/5 dark:hover:bg-white/5"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={sidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>

          <Link href="/" className="font-serif text-xl sm:text-2xl font-semibold tracking-tight text-[#18181B] dark:text-[#F4F1EA] hover:text-[#C84B26] dark:hover:text-[#E05A32] transition-colors">
            LessGooo
          </Link>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#71717A] dark:text-[#A1A1AA] pl-3 border-l border-[#E7E3DC] dark:border-[#26272D]">
            <span>App</span>
            <span>&gt;</span>
            <span>Dashboard</span>
            <span>&gt;</span>
            <span className="font-semibold text-[#18181B] dark:text-[#F4F1EA]">{breadcrumb}</span>
          </div>
        </div>

        {/* Right: Theme Toggle + Only User Account Button */}
        <div className="flex items-center gap-3">
          {/* Interactive Dark/Light Mode Toggle */}
          <button
            onClick={onToggleTheme}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
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
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
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
                  className={`w-3.5 h-3.5 text-[#71717A] transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#1A1B20] rounded-2xl shadow-xl border border-[#E7E3DC] dark:border-[#26272D] p-1.5 z-50 text-xs font-mono">
                  <Link
                    href="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-3 py-2 rounded-xl text-[#18181B] dark:text-[#F4F1EA] hover:bg-[#FAF8F5] dark:hover:bg-[#25272F] transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/account-info"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-3 py-2 rounded-xl text-[#18181B] dark:text-[#F4F1EA] hover:bg-[#FAF8F5] dark:hover:bg-[#25272F] transition-colors"
                  >
                    Account Info
                  </Link>
                  <div className="my-1 border-t border-[#E7E3DC] dark:border-[#26272D]" />
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onLogout();
                    }}
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
  );
}
