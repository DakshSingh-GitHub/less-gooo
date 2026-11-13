"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { searchCities, CityOption } from "@/lib/cityService";

interface CityAutocompleteInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  inputClassName?: string;
  autoFocus?: boolean;
  name?: string;
  id?: string;
  onSelectCity?: (city: CityOption) => void;
}

export default function CityAutocompleteInput({
  value,
  onChange,
  placeholder = "e.g. Varanasi, Uttar Pradesh",
  required = false,
  className = "",
  inputClassName = "",
  autoFocus = false,
  name,
  id,
  onSelectCity,
}: CityAutocompleteInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const [prevValue, setPrevValue] = useState(value);
  const [options, setOptions] = useState<CityOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Synchronize state when value changes externally (e.g. from GPS detectLocation)
  if (value !== prevValue) {
    setPrevValue(value);
    setQuery(value);
  }

  // Perform search with debounce
  const fetchSuggestions = useCallback(async (text: string) => {
    setIsLoading(true);
    try {
      const results = await searchCities(text);
      setOptions(results);
      setHighlightedIndex(-1);
    } catch {
      setOptions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVal = e.target.value;
    setQuery(nextVal);
    onChange(nextVal);
    setIsOpen(true);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      fetchSuggestions(nextVal);
    }, 150);
  };

  const handleFocus = () => {
    setIsOpen(true);
    fetchSuggestions(query);
  };

  const handleSelectOption = (option: CityOption) => {
    setQuery(option.displayName);
    onChange(option.displayName);
    if (onSelectCity) {
      onSelectCity(option);
    }
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuery("");
    onChange("");
    setIsOpen(true);
    fetchSuggestions("");
    inputRef.current?.focus();
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        setIsOpen(true);
        fetchSuggestions(query);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < options.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : options.length - 1
      );
    } else if (e.key === "Enter") {
      if (highlightedIndex >= 0 && highlightedIndex < options.length) {
        e.preventDefault();
        handleSelectOption(options[highlightedIndex]);
      } else if (options.length > 0 && query.trim().length > 0) {
        // If user hits enter and the first option matches well, pick it
        e.preventDefault();
        handleSelectOption(options[0]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  // Click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          id={id}
          name={name}
          required={required}
          autoFocus={autoFocus}
          autoComplete="off"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          className={`w-full h-11 px-3.5 pr-14 rounded-xl border border-[#E7E3DC] dark:border-[#26272D] bg-[#FAF8F5] dark:bg-[#121316] text-[#18181B] dark:text-[#F4F1EA] text-sm focus:outline-none focus:border-[#C84B26] transition-colors ${inputClassName}`}
        />

        {/* Clear & Status Icons */}
        <div className="absolute right-3 flex items-center gap-1.5 text-[#71717A] dark:text-[#A1A1AA]">
          {isLoading && (
            <svg
              className="animate-spin h-3.5 w-3.5 text-[#C84B26]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}

          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-xs transition-colors cursor-pointer"
              title="Clear input"
            >
              ✕
            </button>
          )}

          <span className="text-xs pointer-events-none select-none">📍</span>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-2xl bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] shadow-xl overflow-hidden max-h-64 overflow-y-auto animate-fadeIn">
          {options.length > 0 ? (
            <ul className="py-1 divide-y divide-[#E7E3DC]/30 dark:divide-[#26272D]/30">
              {options.map((option, idx) => {
                const isSelected = idx === highlightedIndex;
                return (
                  <li
                    key={`${option.name}-${option.state || ""}-${idx}`}
                    onMouseDown={(e) => {
                      e.preventDefault(); // prevents blur before click fires
                      handleSelectOption(option);
                    }}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={`px-3.5 py-2.5 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-[#FAF8F5] dark:bg-[#26272D] text-[#C84B26]"
                        : "hover:bg-[#FAF8F5] dark:hover:bg-[#26272D] text-[#18181B] dark:text-[#F4F1EA]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-sm shrink-0">📍</span>
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">
                          {option.name}
                        </div>
                        <div className="text-[11px] font-mono text-[#71717A] dark:text-[#A1A1AA] truncate">
                          {[option.state, option.country].filter(Boolean).join(", ")}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#C84B26] shrink-0 font-semibold opacity-0 group-hover:opacity-100">
                      Select
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : !isLoading ? (
            <div className="px-4 py-3 text-xs text-[#71717A] dark:text-[#A1A1AA] text-center font-mono">
              {query.trim().length > 0 ? (
                <>No verified city found for &ldquo;{query}&rdquo;. You can still use this custom location.</>
              ) : (
                <>Type a city name to see suggestions</>
              )}
            </div>
          ) : (
            <div className="px-4 py-3 text-xs text-[#71717A] dark:text-[#A1A1AA] text-center font-mono flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-3.5 w-3.5 text-[#C84B26]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Searching verified cities...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
