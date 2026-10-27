"use client";

import { useState } from "react";
import { ExpenseItem, Trip } from "@/lib/appwrite";

interface ExpenseManagerViewProps {
  expenses: ExpenseItem[];
  activeTrip: Trip | null;
  onAddExpense: (expense: { title: string; amountINR: number; category: ExpenseItem["category"] }) => Promise<void>;
}

export default function ExpenseManagerView({
  expenses,
  activeTrip,
  onAddExpense,
}: ExpenseManagerViewProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<ExpenseItem["category"]>("transit");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amountINR, 0);
  const budget = activeTrip?.budget || 0;
  const currency = activeTrip?.currency || "INR";
  const remaining = budget > 0 ? budget - totalSpent : 0;
  const percentUsed = budget > 0 ? Math.min(100, Math.round((totalSpent / budget) * 100)) : 0;

  // Category breakdown
  const categoryTotals: Record<string, number> = {};
  expenses.forEach((item) => {
    categoryTotals[item.category] = (categoryTotals[item.category] || 0) + item.amountINR;
  });

  const filteredExpenses = selectedFilter === "all"
    ? expenses
    : expenses.filter((e) => e.category === selectedFilter);

  // If no active trip exists, strictly show "No Active Trips"
  if (!activeTrip || activeTrip.status !== "active") {
    return (
      <div className="space-y-6">
        <div className="pb-4 border-b border-[#E7E3DC] dark:border-[#26272D]">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#C84B26] dark:text-[#E05A32] block">
            Financial Ledger
          </span>
          <h2 className="font-serif text-3xl text-[#18181B] dark:text-[#F4F1EA]">
            Expense Manager
          </h2>
        </div>

        <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#1A1B20] border border-dashed border-[#E7E3DC] dark:border-[#26272D] space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D] flex items-center justify-center mx-auto text-[#71717A]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-2xl text-[#18181B] dark:text-[#F4F1EA]">
              No Active Trips
            </h3>
            <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] max-w-sm mx-auto font-light">
              The Expense Manager requires an ongoing journey to track allocated budget runway, transit fares, and category limits. Please activate a trip from your schedule to start logging expenses.
            </p>
          </div>
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 font-mono text-[11px] font-medium">
            Status: No Active Trips
          </div>
        </div>

        {expenses.length > 0 && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-[#71717A]">
                Historical Expense Records ({expenses.length})
              </span>
              <span className="text-xs font-mono font-semibold text-[#18181B] dark:text-[#F4F1EA]">
                Total: ₹{totalSpent.toLocaleString()}
              </span>
            </div>
            <div className="divide-y divide-[#E7E3DC] dark:divide-[#26272D] bg-white dark:bg-[#1A1B20] rounded-2xl border border-[#E7E3DC] dark:border-[#26272D] overflow-hidden">
              {expenses.slice(0, 5).map((exp, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between font-mono text-xs">
                  <div>
                    <span className="font-medium text-[#18181B] dark:text-[#F4F1EA] block">{exp.title}</span>
                    <span className="text-[10px] text-[#71717A] uppercase">{exp.category} • {exp.timestamp}</span>
                  </div>
                  <span className="font-semibold text-[#C84B26]">₹{exp.amountINR.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (!title.trim() || isNaN(parsed) || parsed <= 0) return;

    setIsSubmitting(true);
    try {
      await onAddExpense({
        title: title.trim(),
        amountINR: parsed,
        category,
      });
      setTitle("");
      setAmount("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7E3DC] dark:border-[#26272D]">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#C84B26] dark:text-[#E05A32] block">
            Financial Ledger
          </span>
          <h2 className="font-serif text-3xl text-[#18181B] dark:text-[#F4F1EA]">
            Expense Manager
          </h2>
          {activeTrip && (
            <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] font-mono mt-0.5">
              Tracking against active trip: <span className="font-semibold">{activeTrip.title}</span>
            </p>
          )}
        </div>

        <div className="flex items-center gap-6 font-mono">
          <div>
            <span className="text-[10px] text-[#71717A] uppercase block">Total Disbursed</span>
            <span className="text-xl font-semibold text-[#18181B] dark:text-[#F4F1EA]">
              {currency} {totalSpent.toLocaleString()}
            </span>
          </div>
          {budget > 0 && (
            <>
              <div className="w-px h-8 bg-[#E7E3DC] dark:border-[#26272D]" />
              <div>
                <span className="text-[10px] text-[#71717A] uppercase block">Trip Runway</span>
                <span className="text-xl font-semibold text-emerald-600 dark:text-emerald-400">
                  {currency} {remaining >= 0 ? remaining.toLocaleString() : 0}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Budget Progress Bar */}
      {budget > 0 && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] shadow-sm space-y-3">
          <div className="flex justify-between items-baseline font-mono text-xs">
            <span className="text-[#71717A]">Budget Allocation Used</span>
            <span className="font-semibold text-[#C84B26]">{percentUsed}% ({currency} {totalSpent} of {currency} {budget})</span>
          </div>
          <div className="w-full h-3 rounded-full bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D] overflow-hidden">
            <div
              className="h-full bg-[#C84B26] dark:bg-[#E05A32] transition-all duration-300"
              style={{ width: `${percentUsed}%` }}
            />
          </div>
        </div>
      )}

      {/* Category Breakdown Chips */}
      {Object.keys(categoryTotals).length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-[#71717A] block">
            Category Breakdown
          </span>
          <div className="flex flex-wrap gap-2">
            {Object.entries(categoryTotals).map(([cat, val]) => (
              <div
                key={cat}
                className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] font-mono text-xs flex items-center gap-2"
              >
                <span className="capitalize text-[#71717A]">{cat}:</span>
                <span className="font-semibold text-[#18181B] dark:text-[#F4F1EA]">
                  {currency} {val.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Form + Table Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Quick Add Expense Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-5 p-7 rounded-2xl bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] shadow-sm space-y-4">
          <span className="text-xs font-mono uppercase text-[#C84B26] tracking-wider block">
            Log New Outlay
          </span>

          <div>
            <label className="block text-xs font-mono text-[#71717A] mb-1">Description *</label>
            <input
              type="text"
              required
              placeholder="e.g. Metro pass / dinner"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-[#E7E3DC] dark:border-[#26272D] bg-[#FAF8F5] dark:bg-[#121316] text-[#18181B] dark:text-[#F4F1EA] text-sm focus:outline-none focus:border-[#C84B26]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#71717A] mb-1">Amount ({currency}) *</label>
            <input
              type="number"
              required
              min="1"
              placeholder="e.g. 250"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-[#E7E3DC] dark:border-[#26272D] bg-[#FAF8F5] dark:bg-[#121316] text-[#18181B] dark:text-[#F4F1EA] text-sm focus:outline-none focus:border-[#C84B26]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#71717A] mb-1">Category</label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full h-11 px-3.5 pr-9 rounded-xl border border-[#E7E3DC] dark:border-[#26272D] bg-[#FAF8F5] dark:bg-[#121316] text-[#18181B] dark:text-[#F4F1EA] text-sm focus:outline-none focus:border-[#C84B26] appearance-none cursor-pointer"
              >
                <option value="transit">Transit & Transport</option>
                <option value="food">Meals & Food</option>
                <option value="temple">Sightseeing & Admissions</option>
                <option value="guide">Guide & Assistance</option>
                <option value="shopping">Shopping & Souvenirs</option>
                <option value="stay">Lodging & Stay</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#71717A] dark:text-[#A1A1AA]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-[#18181B] dark:bg-[#F4F1EA] text-white dark:text-[#121316] font-medium text-xs font-mono uppercase tracking-wider hover:bg-[#C84B26] transition-colors cursor-pointer"
          >
            {isSubmitting ? "Recording..." : "Save Expense"}
          </button>
        </form>

        {/* Expenses List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#71717A] tracking-wider">
              Transaction Records ({filteredExpenses.length})
            </span>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="h-9 pl-3 pr-8 text-xs font-mono rounded-lg border border-[#E7E3DC] dark:border-[#26272D] bg-white dark:bg-[#1A1B20] text-[#18181B] dark:text-[#F4F1EA] appearance-none cursor-pointer focus:outline-none focus:border-[#C84B26]"
              >
                <option value="all">All Categories</option>
                <option value="transit">Transit</option>
                <option value="food">Food</option>
                <option value="temple">Sightseeing</option>
                <option value="guide">Guide</option>
                <option value="shopping">Shopping</option>
                <option value="stay">Stay</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-[#71717A] dark:text-[#A1A1AA]">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {filteredExpenses.length === 0 ? (
            <div className="p-10 text-center rounded-2xl bg-white dark:bg-[#1A1B20] border border-dashed border-[#E7E3DC] dark:border-[#26272D] space-y-2">
              <span className="font-serif text-lg text-[#18181B] dark:text-[#F4F1EA] block">
                No expenses logged yet
              </span>
              <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] max-w-xs mx-auto">
                Log your on-the-ground purchases using the form to track spend pacing.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredExpenses.map((item, idx) => (
                <div
                  key={item.$id || item.id || idx}
                  className="p-4 rounded-xl border border-[#E7E3DC] dark:border-[#26272D] bg-white dark:bg-[#1A1B20] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded uppercase font-semibold bg-[#FAF8F5] dark:bg-[#121316] text-[#C84B26] border border-[#E7E3DC] dark:border-[#26272D]">
                      {item.category}
                    </span>
                    <span className="font-medium text-[#18181B] dark:text-[#F4F1EA]">
                      {item.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 font-mono">
                    <span className="text-[#71717A] text-[11px]">{item.timestamp}</span>
                    <span className="font-semibold text-[#18181B] dark:text-[#F4F1EA]">
                      {currency} {item.amountINR.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
