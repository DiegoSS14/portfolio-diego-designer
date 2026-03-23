import { cookies } from "next/headers";

import type { AdminSession } from "../../../domain/entities/AdminSession";
import type { SessionStorage } from "../../../domain/services/SessionStorage";
import { decodeSessionCookie, encodeSessionCookie } from "../../utils/sessionCookieCodec";

const SESSION_COOKIE_NAME = "portfolio_admin_session";
const SESSION_DURATION_IN_MS = 1000 * 60 * 60 * 12;

function readSessionSecret(): string {
  const sessionSecret = process.env.AUTH_SESSION_SECRET;

  if (!sessionSecret || sessionSecret.length < 16) {
    throw new Error("AUTH_SESSION_SECRET must be configured with at least 16 characters.");
  }

  return sessionSecret;
}

export class CookieSessionStorage implements SessionStorage {
  async write(session: AdminSession): Promise<void> {
    const sessionSecret = readSessionSecret();
    const cookieStore = await cookies();
    const token = encodeSessionCookie(session, sessionSecret);

    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: Math.floor(SESSION_DURATION_IN_MS / 1000),
    });
  }

  async read(): Promise<AdminSession | null> {
    const sessionSecret = readSessionSecret();
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
      return null;
    }

    return decodeSessionCookie(token, sessionSecret);
  }

  async clear(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
  }
}
