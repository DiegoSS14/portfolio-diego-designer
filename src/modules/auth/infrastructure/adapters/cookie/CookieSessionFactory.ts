import type { AdminSession } from "../../../domain/entities/AdminSession";
import type { SessionFactory } from "../../../domain/services/SessionFactory";

const SESSION_DURATION_IN_MS = 1000 * 60 * 60 * 12;

export class CookieSessionFactory implements SessionFactory {
  createForUser(uid: string, email: string | null, isAdmin: boolean): AdminSession {
    const issuedAt = Date.now();

    return {
      uid,
      email,
      isAdmin,
      issuedAt,
      expiresAt: issuedAt + SESSION_DURATION_IN_MS,
    };
  }
}
