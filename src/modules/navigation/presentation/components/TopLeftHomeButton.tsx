"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconHome } from "@tabler/icons-react";

export function TopLeftHomeButton() {
  const pathname = usePathname();

  const shouldShowButton = pathname === "/admin/projects";

  if (!shouldShowButton) {
    return null;
  }

  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 rounded-2xl border border-ui-border bg-ui-surface/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-ui-text shadow-[0_10px_28px_rgba(0,0,0,0.2)] backdrop-blur-sm transition hover:text-ui-text-muted"
      aria-label="Voltar para o inicio"
      title="Voltar para o inicio"
    >
      <IconHome size={14} stroke={1.8} aria-hidden />
      Voltar para o inicio
    </Link>
  );
}