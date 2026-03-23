"use client";

import Link from "next/link";
import { IconLayoutDashboard, IconPencilCog } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface SessionResponse {
  authenticated: boolean;
}

export function AuthAccessButton() {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    void fetch("/api/auth/session", { cache: "no-store" })
      .then(async (response) => {
        if (!isMounted) {
          return;
        }

        if (!response.ok) {
          setIsAuthenticated(false);
          return;
        }

        const payload = (await response.json()) as SessionResponse;
        setIsAuthenticated(Boolean(payload.authenticated));
      })
      .catch(() => {
        if (isMounted) {
          setIsAuthenticated(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (pathname === "/login") {
    return null;
  }

  const href = isAuthenticated ? "/admin/projects" : "/login";

  return (
    <Link
      href={href}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ui-border bg-ui-surface/80 text-ui-text-muted shadow-[0_10px_28px_rgba(0,0,0,0.2)] backdrop-blur-sm transition hover:text-ui-text"
      aria-label={isAuthenticated ? "Abrir painel administrativo" : "Ir para o login"}
      title={isAuthenticated ? "Painel" : "Login"}
    >
      {isAuthenticated ? <IconLayoutDashboard size={16} stroke={1.8} /> : <IconPencilCog size={16} stroke={1.8} />}
    </Link>
  );
}
