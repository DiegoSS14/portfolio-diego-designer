"use client";

import { IconMoonStars, IconSunHigh } from "@tabler/icons-react";
import { useEffect, useState } from "react";

type ThemeMode = "dark" | "light";

const THEME_STORAGE_KEY = "portfolio-theme";

function applyThemeToDocument(theme: ThemeMode): void {
  document.documentElement.setAttribute("data-theme", theme);
}

export function ThemeToggleButton() {
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") {
      return "dark";
    }

    const persistedTheme = window.localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
    return persistedTheme ?? "dark";
  });

  useEffect(() => {
    applyThemeToDocument(currentTheme);
  }, [currentTheme]);

  function toggleTheme(): void {
    const nextTheme: ThemeMode = currentTheme === "dark" ? "light" : "dark";
    setCurrentTheme(nextTheme);
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    applyThemeToDocument(nextTheme);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 rounded-full border border-ui-border bg-ui-surface/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-ui-text-muted transition hover:text-ui-text"
      aria-label="Alternar tema escuro e claro"
    >
      {currentTheme === "dark" ? (
        <IconSunHigh size={16} stroke={1.8} aria-hidden />
      ) : (
        <IconMoonStars size={16} stroke={1.8} aria-hidden />
      )}
      {currentTheme === "dark" ? "Tema Claro" : "Tema Escuro"}
    </button>
  );
}
