"use client";

import { useState } from "react";
import { registerUser, loginUser, UserProfile } from "@/lib/appwrite";

interface AuthModalProps {
  isOpen: boolean;
  initialMode: "login" | "signup";
  onClose: () => void;
  onSuccess: (profile: UserProfile) => void;
}

const INDIAN_STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Odisha",
  "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh",
  "Uttarakhand", "West Bengal", "Other"
];

export default function AuthModal({
  isOpen,
  initialMode,
  onClose,
  onSuccess,
}: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState("Uttar Pradesh");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      if (mode === "signup") {
        if (!fullName || !username || !email || !phone || !state || !password) {
          throw new Error("Please fill in all required fields.");
        }
        if (password.length < 8) {
          throw new Error("Password must be at least 8 characters long.");
        }
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match.");
        }

        const res = await registerUser({
          fullName,
          username,
          email,
          phone,
          state,
          password,
        });

        onSuccess(res.profile);
        onClose();
      } else {
        if (!email || !password) {
          throw new Error("Please enter your email and password.");
        }
        const res = await loginUser(email, password);
        if (res.profile) {
          onSuccess(res.profile);
        }
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
      <div
        className="relative w-full max-w-md bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] rounded-3xl shadow-2xl p-6 sm:p-8 text-[#18181B] dark:text-[#F4F1EA] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-1.5 rounded-full text-[#71717A] hover:text-[#18181B] dark:hover:text-[#F4F1EA] hover:bg-[#FAF8F5] dark:hover:bg-[#25272F] transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1 mb-6">
          <span className="font-serif text-2xl font-semibold tracking-tight">LessGooo</span>
          <h2 className="font-serif text-xl text-[#18181B] dark:text-[#F4F1EA]">
            {mode === "login" ? "Welcome back" : "Create your traveller account"}
          </h2>
          <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
            {mode === "login"
              ? "Access your personalized plans and expense history"
              : "Set up your profile to sync itineraries, fare shields, and guide bookings"}
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex rounded-full bg-[#FAF8F5] dark:bg-[#121316] p-1 border border-[#E7E3DC] dark:border-[#26272D] mb-6 text-xs font-medium">
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

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <>
              {/* Full Name */}
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

              {/* Username / Handle */}
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

              {/* Phone Number */}
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

              {/* State */}
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

          {/* Email */}
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

          {/* Password */}
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

          {/* Confirm Password (Signup only) */}
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 rounded-xl bg-[#18181B] hover:bg-[#C84B26] dark:bg-[#F4F1EA] dark:hover:bg-[#E05A32] text-white dark:text-[#121316] dark:hover:text-white font-medium text-xs font-mono uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer shadow-md"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin" />
                Processing...
              </span>
            ) : mode === "login" ? (
              "Log In to LessGooo"
            ) : (
              "Complete Registration"
            )}
          </button>
        </form>

        {/* Footer Note */}
        <p className="mt-6 text-center text-[11px] text-[#71717A] dark:text-[#A1A1AA]">
          {mode === "login" ? (
            <>
              Don't have an account yet?{" "}
              <button
                onClick={() => { setMode("signup"); setErrorMsg(null); }}
                className="text-[#C84B26] hover:underline font-medium"
              >
                Sign up free
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
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
    </div>
  );
}
