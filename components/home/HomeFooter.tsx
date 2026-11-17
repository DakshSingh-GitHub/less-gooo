"use client";

import Logo from "@/components/Logo";

export default function HomeFooter() {
  return (
    <footer className="border-t border-[#E7E3DC] dark:border-[#26272D] pt-16 pb-12 px-4 sm:px-6 bg-white dark:bg-[#121316] text-[#71717A] dark:text-[#A1A1AA] text-xs transition-colors">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          {/* Brand Info (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <Logo size="sm" variant="badge" showText={true} textClassName="text-base font-semibold" />
            </div>
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA] leading-relaxed max-w-sm font-light">
              LessGooo is an intelligent adaptive travel companion. We keep your journey synchronized with live ground reality—balancing dynamic dwell times, local transit fares, and verified guide accompaniment.
            </p>
            <div className="text-[11px] font-mono text-[#C84B26] dark:text-[#E05A32]">
              Adaptive Intelligence for the Living Journey
            </div>
          </div>

          {/* Capabilities Links (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#18181B] dark:text-[#F4F1EA] block">
              Capabilities
            </span>
            <ul className="space-y-2.5">
              <li>
                <a href="#adaptive-replanning" className="hover:text-[#C84B26] transition-colors">
                  Adaptive Plan Refresh
                </a>
              </li>
              <li>
                <a href="#traffic-analysis" className="hover:text-[#C84B26] transition-colors">
                  Real-Time Traffic Analysis
                </a>
              </li>
              <li>
                <a href="#fare-budget" className="hover:text-[#C84B26] transition-colors">
                  Auto & Cab Fare Budgets
                </a>
              </li>
              <li>
                <a href="#expense-tracker" className="hover:text-[#C84B26] transition-colors">
                  In-Trip Expense Tracker
                </a>
              </li>
              <li>
                <a href="#guide-allotment" className="hover:text-[#C84B26] transition-colors">
                  Verified Local Guides
                </a>
              </li>
              <li>
                <a href="#senior-accompaniment" className="hover:text-[#C84B26] transition-colors">
                  Senior Accompaniment
                </a>
              </li>
            </ul>
          </div>

          {/* Destinations (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#18181B] dark:text-[#F4F1EA] block">
              Featured Curations
            </span>
            <ul className="space-y-2.5">
              <li>
                <a href="#destinations" className="hover:text-[#C84B26] transition-colors">
                  Varanasi, Uttar Pradesh
                </a>
              </li>
              <li>
                <a href="#destinations" className="hover:text-[#C84B26] transition-colors">
                  Lucknow, Uttar Pradesh
                </a>
              </li>
              <li>
                <a href="#destinations" className="hover:text-[#C84B26] transition-colors">
                  Agra, Uttar Pradesh
                </a>
              </li>
              <li>
                <a href="#destinations" className="hover:text-[#C84B26] transition-colors">
                  Ayodhya & Sarnath, UP
                </a>
              </li>
              <li>
                <a href="#destinations" className="hover:text-[#C84B26] transition-colors">
                  Jaipur, Rajasthan
                </a>
              </li>
              <li>
                <a href="#destinations" className="hover:text-[#C84B26] transition-colors">
                  Munnar & Alleppey, Kerala
                </a>
              </li>
            </ul>
          </div>

          {/* Plans & Navigation (2 cols) */}
          <div className="md:col-span-2 space-y-3">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#18181B] dark:text-[#F4F1EA] block">
              Plans
            </span>
            <ul className="space-y-2.5">
              <li>
                <a href="#plans-section" className="hover:text-[#C84B26] transition-colors">
                  Free Explorer
                </a>
              </li>
              <li>
                <a href="#plans-section" className="hover:text-[#C84B26] transition-colors">
                  Pro Suite
                </a>
              </li>
              <li>
                <a href="/login" className="hover:text-[#C84B26] transition-colors">
                  Sign In
                </a>
              </li>
              <li>
                <a href="/dashboard" className="hover:text-[#C84B26] transition-colors">
                  Dashboard
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#E7E3DC] dark:border-[#26272D] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div>
            © {new Date().getFullYear()} LessGooo. All rights reserved. Made for curious, unhurried travellers.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-[#18181B] dark:hover:text-[#F4F1EA] cursor-pointer">Privacy Policy</span>
            <span className="hover:text-[#18181B] dark:hover:text-[#F4F1EA] cursor-pointer">Terms of Service</span>
            <span className="hover:text-[#18181B] dark:hover:text-[#F4F1EA] cursor-pointer">Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
