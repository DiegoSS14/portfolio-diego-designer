import type { AdminSession } from "../entities/AdminSession";

export interface SessionStorage {
  write(session: AdminSession): Promise<void>;
  read(): Promise<AdminSession | null>;
  clear(): Promise<void>;
}
