"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser, loginUser, getCurrentUserProfile } from "@/lib/appwrite";

const INDIAN_STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Odisha",
  "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh",
  "Uttarakhand", "West Bengal", "Other"
];

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Form State
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState("Uttar Pradesh");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // If already logged in, redirect straight to dashboard
  useEffect(() => {
    const savedTheme = localStorage.getItem("lessgooo-theme");
    if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }

    getCurrentUserProfile().then((res) => {
      if (res?.account) {
        router.replace("/dashboard");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      if (mode === "signup") {
        if (!fullName || !username || !email || !phone || !state || !password) {
          throw new Error("Please complete all required fields.");
        }
        if (password.length < 8) {
          throw new Error("Password must be at least 8 characters long.");
        }
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match.");
        }

        await registerUser({
          fullName,
          username,
          email,
          phone,
          state,
          password
        });

        router.push("/dashboard");
      } else {
        if (!email || !password) {
          throw new Error("Please enter your email and password.");
        }
        await loginUser(email, password);
        router.push("/dashboard");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Authentication failed. Please verify credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#18181B] dark:bg-[#121316] dark:text-[#F4F1EA] selection:bg-[#C84B26] selection:text-white flex flex-col justify-between transition-colors duration-150">
      {/* Top Bar */}
      <header className="max-w-6xl w-full mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="font-serif text-2xl font-semibold tracking-tight hover:text-[#C84B26] transition-colors">
          LessGooo
        </Link>

        <div className="flex items-center gap-4">
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

          <Link
            href="/"
            className="text-xs font-mono uppercase text-[#71717A] dark:text-[#A1A1AA] hover:text-[#18181B] dark:hover:text-white"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Main Form Centerpiece */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] rounded-3xl shadow-xl p-8 sm:p-10 space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase tracking-widest font-mono text-[#C84B26] dark:text-[#E05A32]">
              Identity & Access
            </span>
            <h1 className="font-serif text-3xl text-[#18181B] dark:text-[#F4F1EA]">
              {mode === "login" ? "Sign In to LessGooo" : "Create Traveller Profile"}
            </h1>
            <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] font-light">
              {mode === "login"
                ? "Enter your credentials to access your protected dashboard."
                : "Register with Appwrite to unlock your dynamic itineraries and expense tracker."}
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex rounded-full bg-[#FAF8F5] dark:bg-[#121316] p-1 border border-[#E7E3DC] dark:border-[#26272D] text-xs font-medium">
            <button
              type="button"
              onClick={() => { setMode("login"); setErrorMsg(null); }}
              className={`flex-1 py-2 rounded-full transition-all cursor-pointer ${
                mode === "login"
                  ? "bg-white dark:bg-[#26272D] text-[#18181B] dark:text-[#F4F1EA] shadow-sm font-semibold"
                  : "text-[#71717A] dark:text-[#A1A1AA] hover:text-[#18181B] dark:hover:text-[#F4F1EA]"
              }`}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => { setMode("signup"); setErrorMsg(null); }}
              className={`flex-1 py-2 rounded-full transition-all cursor-pointer ${
                mode === "signup"
                  ? "bg-[#C84B26] text-white shadow-sm font-semibold"
                  : "text-[#71717A] dark:text-[#A1A1AA] hover:text-[#18181B] dark:hover:text-[#F4F1EA]"
              }`}
            >
              Sign up
            </button>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <>
                <div>
                  <label className="block text-xs font-mono uppercase text-[#71717A] dark:text-[#A1A1AA] tracking-wider mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Daksh Singh"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E3DC] dark:border-[#26272D] bg-[#FAF8F5] dark:bg-[#121316] text-[#18181B] dark:text-[#F4F1EA] text-sm focus:outline-none focus:border-[#C84B26]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#71717A] dark:text-[#A1A1AA] tracking-wider mb-1">
                    Username / Handle
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-sm text-[#71717A]">@</span>
                    <input
                      type="text"
                      required
                      placeholder="daksh_travels"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-[#E7E3DC] dark:border-[#26272D] bg-[#FAF8F5] dark:bg-[#121316] text-[#18181B] dark:text-[#F4F1EA] text-sm focus:outline-none focus:border-[#C84B26]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#71717A] dark:text-[#A1A1AA] tracking-wider mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E3DC] dark:border-[#26272D] bg-[#FAF8F5] dark:bg-[#121316] text-[#18181B] dark:text-[#F4F1EA] text-sm focus:outline-none focus:border-[#C84B26]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#71717A] dark:text-[#A1A1AA] tracking-wider mb-1">
                    State / Region
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E3DC] dark:border-[#26272D] bg-[#FAF8F5] dark:bg-[#121316] text-[#18181B] dark:text-[#F4F1EA] text-sm focus:outline-none focus:border-[#C84B26]"
                  >
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s} className="bg-white dark:bg-[#1A1B20]">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-mono uppercase text-[#71717A] dark:text-[#A1A1AA] tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E3DC] dark:border-[#26272D] bg-[#FAF8F5] dark:bg-[#121316] text-[#18181B] dark:text-[#F4F1EA] text-sm focus:outline-none focus:border-[#C84B26]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-mono uppercase text-[#71717A] dark:text-[#A1A1AA] tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-[#71717A] hover:text-[#C84B26] transition-colors"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E3DC] dark:border-[#26272D] bg-[#FAF8F5] dark:bg-[#121316] text-[#18181B] dark:text-[#F4F1EA] text-sm focus:outline-none focus:border-[#C84B26]"
              />
            </div>

            {mode === "signup" && (
              <div>
                <label className="block text-xs font-mono uppercase text-[#71717A] dark:text-[#A1A1AA] tracking-wider mb-1">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E3DC] dark:border-[#26272D] bg-[#FAF8F5] dark:bg-[#121316] text-[#18181B] dark:text-[#F4F1EA] text-sm focus:outline-none focus:border-[#C84B26]"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-3 py-3 rounded-xl bg-[#18181B] hover:bg-[#C84B26] dark:bg-[#F4F1EA] dark:hover:bg-[#E05A32] text-white dark:text-[#121316] dark:hover:text-white font-medium text-xs font-mono uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer shadow-md"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : mode === "login" ? (
                "Log In to Dashboard"
              ) : (
                "Register & Enter Dashboard"
              )}
            </button>
          </form>

          <p className="text-center text-[11px] text-[#71717A] dark:text-[#A1A1AA]">
            {mode === "login" ? (
              <>
                New traveller?{" "}
                <button
                  onClick={() => { setMode("signup"); setErrorMsg(null); }}
                  className="text-[#C84B26] hover:underline font-medium"
                >
                  Create account
                </button>
              </>
            ) : (
              <>
                Already registered?{" "}
                <button
                  onClick={() => { setMode("login"); setErrorMsg(null); }}
                  className="text-[#C84B26] hover:underline font-medium"
                >
                  Log in
                </button>
              </>
            )}
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-[#71717A] dark:text-[#A1A1AA] font-mono">
        LessGooo Authentication • Secured via Appwrite
      </footer>
    </div>
  );
}
