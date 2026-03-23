import type { AdminPolicy } from "../../../domain/services/AdminPolicy";
import type { VerifiedAuthUser } from "../../../domain/services/AuthTokenVerifier";

function readAllowedAdminUids(): string[] {
  const rawAdminUids = process.env.AUTH_ADMIN_UIDS ?? "";

  return rawAdminUids
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function readAllowedAdminEmails(): string[] {
  const rawAdminEmails = process.env.AUTH_ADMIN_EMAILS ?? "";

  return rawAdminEmails
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

export class EnvironmentAdminPolicy implements AdminPolicy {
  private readonly adminUids = readAllowedAdminUids();
  private readonly adminEmails = readAllowedAdminEmails();

  isAdmin(user: VerifiedAuthUser): boolean {
    if (this.adminUids.length === 0 && this.adminEmails.length === 0) {
      return false;
    }

    const hasUidPermission = this.adminUids.includes(user.uid);
    const normalizedEmail = user.email?.toLowerCase() ?? "";
    const hasEmailPermission = normalizedEmail
      ? this.adminEmails.includes(normalizedEmail)
      : false;

    return hasUidPermission || hasEmailPermission;
  }
}
