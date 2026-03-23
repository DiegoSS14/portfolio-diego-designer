import type { AdminSession } from "../entities/AdminSession";

export interface SessionFactory {
  createForUser(uid: string, email: string | null, isAdmin: boolean): AdminSession;
}
