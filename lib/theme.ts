export type ThemeMode = "light" | "dark";

export const THEME_STORAGE_KEY = "lessgooo-theme";
export const THEME_STORAGE_KEY_ALT = "lessgooo_theme";

/**
 * Returns current theme from localStorage, DOM class, or system preference
 */
export function getInitialTheme(): ThemeMode {
  if (typeof window === "undefined") return "dark";
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) || localStorage.getItem(THEME_STORAGE_KEY_ALT);
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch {
    return "dark";
  }
}

/**
 * Applies theme immediately to <html> documentElement and persists to localStorage
 */
export function applyTheme(theme: ThemeMode) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
    root.style.colorScheme = "dark";
  } else {
    root.classList.remove("dark");
    root.style.colorScheme = "light";
  }

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    localStorage.setItem(THEME_STORAGE_KEY_ALT, theme);
  } catch {}
}

/**
 * Toggles current theme and returns whether next theme is dark
 */
export function toggleThemeMode(currentIsDark: boolean): boolean {
  const next: ThemeMode = currentIsDark ? "light" : "dark";
  applyTheme(next);
  return next === "dark";
}
