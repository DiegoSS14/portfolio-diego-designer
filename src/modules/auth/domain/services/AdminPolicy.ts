import type { VerifiedAuthUser } from "./AuthTokenVerifier";

export interface AdminPolicy {
  isAdmin(user: VerifiedAuthUser): boolean;
}
