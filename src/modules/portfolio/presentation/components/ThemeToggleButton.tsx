"use client";

import { IconSunHigh } from "@tabler/icons-react";
import { useTheme } from "@/shared/theme/ThemeProvider";

export function ThemeToggleButton() {
  const { toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ui-border bg-ui-surface/80 text-ui-text-muted shadow-[0_10px_28px_rgba(0,0,0,0.2)] backdrop-blur-sm transition hover:text-ui-text"
      aria-label="Alternar tema escuro e claro"
    >
      <IconSunHigh size={16} stroke={1.8} aria-hidden />
    </button>
  );
}
